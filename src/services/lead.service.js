import Lead from '../models/Lead.js';

export const listLeads = async ({ page = 1, limit = 100 } = {}) => {
  const safeLimit = Math.min(Math.max(Number(limit) || 100, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const [leads, total] = await Promise.all([
    Lead.find().populate('attendeeId', 'attendeeId firstName lastName company').populate('sponsorId', 'sponsorId name').populate('eventId', 'name year').sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(),
    Lead.countDocuments(),
  ]);
  return { leads, pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
};