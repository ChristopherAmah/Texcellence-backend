import Attendee from '../models/Attendee.js';
import Event from '../models/Event.js';
import Sponsor from '../models/Sponsor.js';
import Interaction from '../models/Interaction.js';
import Lead from '../models/Lead.js';
import Activity from '../models/Activity.js';

const CACHE_TTL_MS = 15_000;
let cachedAnalytics = null;
let cachedAt = 0;

export const getExecutiveAnalytics = async () => {
  if (cachedAnalytics && Date.now() - cachedAt < CACHE_TTL_MS) return cachedAnalytics;
  const [attendees, sponsors, events, interactions, qualifiedLeads, hotLeads, activities] = await Promise.all([
    Attendee.countDocuments(),
    Sponsor.countDocuments(),
    Event.countDocuments(),
    Interaction.countDocuments(),
    Lead.countDocuments({ leadGrade: { $ne: 'LOW_PRIORITY' } }),
    Lead.countDocuments({ leadGrade: 'HOT' }),
    Activity.find().sort({ createdAt: -1 }).limit(8).lean(),
  ]);
  cachedAnalytics = {
    metrics: {
      attendees,
      sponsors,
      interactions,
      qualifiedLeads,
      hotLeads,
      meetings: 0,
      opportunities: 0,
      pipeline: 0,
      closedRevenue: 0,
    },
    events,
    activities,
  };
  cachedAt = Date.now();
  return cachedAnalytics;
};