import Attendee from '../models/Attendee.js';
import Event from '../models/Event.js';
import Interaction from '../models/Interaction.js';
import Lead from '../models/Lead.js';
import Sponsor from '../models/Sponsor.js';
import { calculateLeadScore } from './leadScoring.service.js';

const permittedAttendee = (attendee) => ({ attendeeId: attendee.attendeeId, firstName: attendee.firstName, lastName: attendee.lastName, jobTitle: attendee.jobTitle, company: attendee.company, industry: attendee.industry, companySize: attendee.companySize, email: attendee.leadSharingConsent ? attendee.email : null, phone: attendee.leadSharingConsent ? attendee.phone : null, leadSharingConsent: attendee.leadSharingConsent });
const createLeadId = async (year) => `LD${String(year).slice(-2)}-${String((await Lead.countDocuments()) + 1).padStart(6, '0')}`;

export const resolveAttendee = async (attendeeId) => {
  const attendee = await Attendee.findOne({ attendeeId }).lean();
  if (!attendee) { const error = new Error('Attendee QR code was not found.'); error.statusCode = 404; throw error; }
  return permittedAttendee(attendee);
};

export const createInteraction = async (attributes) => {
  const attendee = await Attendee.findOne({ attendeeId: attributes.attendeeId }).lean();
  const sponsor = await Sponsor.findOne({ sponsorId: attributes.sponsorId }).lean();
  if (!attendee) { const error = new Error('Attendee QR code was not found.'); error.statusCode = 404; throw error; }
  if (!sponsor) { const error = new Error('Sponsor ID was not found.'); error.statusCode = 404; throw error; }
  if (String(attendee.eventId) !== String(sponsor.eventId)) { const error = new Error('This sponsor is not assigned to the attendee event.'); error.statusCode = 403; throw error; }
  if (!attendee.consent) { const error = new Error('This attendee has not consented to event interactions.'); error.statusCode = 403; throw error; }
  const score = calculateLeadScore(attributes);
  const interaction = await Interaction.create({ eventId: attendee.eventId, attendeeId: attendee._id, sponsorId: sponsor._id, interestLevel: attributes.interestLevel, nextAction: attributes.nextAction, productTopic: attributes.productTopic, notes: attributes.notes, leadQuality: score.grade === 'HOT' ? 'HOT' : score.grade === 'WARM' ? 'WARM' : 'COLD', engagementPoints: score.breakdown.engagement, });
  let lead = null;
  if (attributes.qualifyAsLead) lead = await Lead.create({ eventId: attendee.eventId, leadId: await createLeadId((await Event.findById(attendee.eventId).select('year').lean()).year), attendeeId: attendee._id, sponsorId: sponsor._id, leadScore: score.score, leadGrade: score.grade, interest: attributes.productTopic ? [attributes.productTopic] : [], buyingTimeline: attributes.purchaseIntent, decisionAuthority: attributes.decisionAuthority, budgetKnown: attributes.budgetKnown, followUpRequired: attributes.followUpRequired, preferredFollowUp: attributes.nextAction === 'NONE' ? undefined : attributes.nextAction, notes: attributes.notes });
  return { interaction, lead, score };
};