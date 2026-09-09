import Attendee from '../models/Attendee.js';
import Event from '../models/Event.js';
import Sponsor from '../models/Sponsor.js';

export const getExecutiveAnalytics = async () => {
  const [attendees, sponsors, events] = await Promise.all([
    Attendee.countDocuments(),
    Sponsor.countDocuments(),
    Event.countDocuments(),
  ]);
  return {
    metrics: {
      attendees,
      sponsors,
      interactions: 0,
      qualifiedLeads: 0,
      hotLeads: 0,
      meetings: 0,
      opportunities: 0,
      pipeline: 0,
      closedRevenue: 0,
    },
    events,
  };
};