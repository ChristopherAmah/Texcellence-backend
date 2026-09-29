import { randomInt } from 'node:crypto';
import mongoose from 'mongoose';
import Attendee from '../models/Attendee.js';
import Event from '../models/Event.js';
import { recordActivity } from './activity.service.js';
import { sendAttendeeConfirmationEmail } from './email.service.js';
import { validateImportedAttendee } from '../validators/attendee.validator.js';

const importableFields = ['firstName', 'lastName', 'email', 'phone', 'jobTitle', 'company', 'industry', 'companySize', 'country', 'city', 'attendeeType', 'consent', 'leadSharingConsent'];

const createAttendeeId = async (year) => {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const attendeeId = `TXC${String(year).slice(-2)}-${String(randomInt(1, 1_000_000)).padStart(6, '0')}`;
    if (!(await Attendee.exists({ attendeeId }))) return attendeeId;
  }
  const error = new Error('Unable to generate a unique attendee ID.');
  error.statusCode = 503;
  throw error;
};

export const createAttendee = async (user, attributes) => {
  if (user.attendeeId) {
    const error = new Error('This account already has an attendee profile.');
    error.statusCode = 409;
    throw error;
  }
  const event = await Event.findOne({ name: /^te(?:ch)?xcellence$/i, status: { $in: ['REGISTRATION_OPEN', 'LIVE'] } }).sort({ startDate: 1 }).lean();
  if (!event) {
    const error = new Error('TEXCELLENCE registration is not currently open.');
    error.statusCode = 400;
    throw error;
  }
  const attendeeId = await createAttendeeId(event.year);
  const attendee = await Attendee.create({
    ...attributes,
    eventId: event._id,
    email: user.email,
    attendeeId,
    qrCodeValue: attendeeId,
  });
  user.attendeeId = attendee._id;
  await user.save();
  await recordActivity({ type: 'ATTENDEE_REGISTERED', title: 'Attendee registered', description: `${attendee.firstName} ${attendee.lastName} registered for ${event.name}.`, actor: user, entity: attendee, metadata: { attendeeId: attendee.attendeeId, eventName: event.name } });
  return { ...attendee.toSafeObject({ includePrivate: true }), qrCodeValue: attendee.qrCodeValue };
};

export const getOwnAttendee = async (user) => {
  if (!user.attendeeId) {
    const error = new Error('No attendee profile exists for this account.');
    error.statusCode = 404;
    throw error;
  }
  const attendee = await Attendee.findById(user.attendeeId).select('+qrCodeValue');
  if (!attendee) {
    const error = new Error('Attendee profile not found.');
    error.statusCode = 404;
    throw error;
  }
  return { ...attendee.toSafeObject({ includePrivate: true }), qrCodeValue: attendee.qrCodeValue };
};

export const listAttendees = async ({ page = 1, limit = 20, eventId }) => {
  const query = eventId ? { eventId } : {};
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const [attendees, total] = await Promise.all([
    Attendee.find(query).populate('eventId', 'name year status').sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
    Attendee.countDocuments(query),
  ]);
  return { attendees, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
};

export const getAttendee = async (attendeeId) => {
  const attendee = await Attendee.findOne({ attendeeId }).select('+qrCodeValue').populate('eventId', 'name year status').lean();
  if (!attendee) {
    const error = new Error('Attendee not found.');
    error.statusCode = 404;
    throw error;
  }
  return attendee;
};

export const registerAttendee = async (attributes) => {
  const event = await Event.findOne({ name: /^te(?:ch)?xcellence$/i, status: { $in: ['REGISTRATION_OPEN', 'LIVE'] } }).sort({ startDate: 1 });
  if (!event) {
    const error = new Error('TEXCELLENCE registration is not currently open.');
    error.statusCode = 400;
    throw error;
  }
  const email = attributes.email.toLowerCase().trim();
  const attendeeId = await createAttendeeId(event.year);
  let attendee;
  try {
    attendee = await Attendee.create({ ...attributes, email, eventId: event._id, attendeeId, qrCodeValue: attendeeId });
  } catch (error) {
    if (error.code === 11000 && error.keyPattern?.eventId && error.keyPattern?.email) {
      error.statusCode = 409;
      error.message = 'This email is already registered for the event.';
    }
    throw error;
  }
  await recordActivity({ type: 'ATTENDEE_REGISTERED', title: 'Attendee registered', description: `${attendee.firstName} ${attendee.lastName} registered for ${event.name}.`, entity: attendee, metadata: { attendeeId: attendee.attendeeId, eventName: event.name } });
  sendAttendeeConfirmationEmail({ attendee, event }).catch(() => {});
  return { ...attendee.toSafeObject({ includePrivate: true }), qrCodeValue: attendee.qrCodeValue };
};

export const importAttendees = async (actor, { eventId, attendees }) => {
  if (!mongoose.isValidObjectId(eventId)) {
    const error = new Error('The selected event is not valid.');
    error.statusCode = 422;
    throw error;
  }
  const event = await Event.findById(eventId);
  if (!event) {
    const error = new Error('The selected event was not found.');
    error.statusCode = 404;
    throw error;
  }

  const existingEmails = new Set((await Attendee.find({ eventId: event._id }, 'email').lean()).map(({ email }) => email));
  const seenEmails = new Set();
  const imported = [];
  const errors = [];

  for (let index = 0; index < attendees.length; index += 1) {
    const source = attendees[index] || {};
    const rowNumber = Number(source.rowNumber) || index + 2;
    const attributes = Object.fromEntries(importableFields
      .filter((field) => source[field] !== undefined && source[field] !== null && source[field] !== '')
      .map((field) => [field, typeof source[field] === 'string' ? source[field].trim() : source[field]]));
    attributes.email = typeof attributes.email === 'string' ? attributes.email.toLowerCase() : attributes.email;
    attributes.attendeeType = typeof attributes.attendeeType === 'string' ? attributes.attendeeType.toUpperCase().replace(/[\s-]+/g, '_') : attributes.attendeeType;

    const validation = validateImportedAttendee(attributes);
    if (!validation.valid) {
      errors.push({ rowNumber, email: attributes.email || '', field: validation.field, message: validation.message });
      continue;
    }
    if (existingEmails.has(attributes.email) || seenEmails.has(attributes.email)) {
      errors.push({ rowNumber, email: attributes.email, field: 'email', message: 'This email is already registered for the event.' });
      continue;
    }

    try {
      const attendeeId = await createAttendeeId(event.year);
      const attendee = await Attendee.create({ ...attributes, eventId: event._id, attendeeId, qrCodeValue: attendeeId });
      seenEmails.add(attributes.email);
      imported.push({ rowNumber, attendeeId, firstName: attendee.firstName, lastName: attendee.lastName, email: attendee.email });
      sendAttendeeConfirmationEmail({ attendee, event }).catch(() => {});
    } catch (error) {
      errors.push({ rowNumber, email: attributes.email, message: error.code === 11000 ? 'This email is already registered for the event.' : error.message });
    }
  }

  if (imported.length) {
    await recordActivity({
      type: 'ATTENDEE_REGISTERED',
      title: 'Attendees imported',
      description: `${actor.firstName} ${actor.lastName} imported ${imported.length} attendee${imported.length === 1 ? '' : 's'} for ${event.name}.`,
      actor,
      metadata: { eventId: event._id, eventName: event.name, imported: imported.length, rejected: errors.length },
    });
  }

  return { imported, errors, summary: { total: attendees.length, imported: imported.length, rejected: errors.length } };
};
