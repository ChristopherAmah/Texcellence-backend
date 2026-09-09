import Sponsor from '../models/Sponsor.js';
import Event from '../models/Event.js';

const createSponsorId = async (year) => {
  const prefix = `SP${String(year).slice(-2)}`;
  const count = await Sponsor.countDocuments({ sponsorId: new RegExp(`^${prefix}-`) });
  return `${prefix}-${String(count + 1).padStart(4, '0')}`;
};

export const createSponsor = async (attributes) => {
  const event = await Event.findById(attributes.eventId).lean();
  if (!event) { const error = new Error('Event not found.'); error.statusCode = 404; throw error; }
  try { return await Sponsor.create({ ...attributes, sponsorId: await createSponsorId(event.year) }); } catch (error) {
    if (error.code === 11000) { error.statusCode = 409; error.message = 'A sponsor with this name already exists for this event.'; }
    throw error;
  }
};

export const listSponsors = async ({ page = 1, limit = 20, eventId } = {}) => {
  const query = eventId ? { eventId } : {};
  const safeLimit = Math.min(Math.max(Number(limit) || 20, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const [sponsors, total] = await Promise.all([Sponsor.find(query).populate('eventId', 'name year status').sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(), Sponsor.countDocuments(query)]);
  return { sponsors, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
};