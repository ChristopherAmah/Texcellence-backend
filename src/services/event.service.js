import Event from '../models/Event.js';

export const listEvents = async ({ page = 1, limit = 20, status, year }) => {
  const query = {};
  if (status) query.status = status;
  if (year) query.year = Number(year);
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const [events, total] = await Promise.all([Event.find(query).sort({ startDate: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(), Event.countDocuments(query)]);
  return { events, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
};

export const getEvent = async (eventId) => { const event = await Event.findById(eventId).lean(); if (!event) { const error = new Error('Event not found.'); error.statusCode = 404; throw error; } return event; };
export const createEvent = async (attributes) => Event.create(attributes);
export const updateEvent = async (eventId, attributes) => { const event = await Event.findByIdAndUpdate(eventId, attributes, { new: true, runValidators: true }); if (!event) { const error = new Error('Event not found.'); error.statusCode = 404; throw error; } return event; };
