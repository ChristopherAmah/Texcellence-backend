import mongoose from 'mongoose';

const leadSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  leadId: { type: String, required: true, unique: true, index: true },
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendee', required: true, index: true },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor', required: true, index: true },
  leadScore: { type: Number, required: true, min: 0, max: 100 },
  leadGrade: { type: String, enum: ['HOT', 'WARM', 'NURTURE', 'LOW_PRIORITY'], required: true },
  interest: [String],
  buyingTimeline: { type: String, enum: ['RESEARCHING', '6_12_MONTHS', '3_6_MONTHS', '0_3_MONTHS'], required: true },
  decisionAuthority: { type: String, enum: ['DECISION_MAKER', 'INFLUENCER', 'USER'], required: true },
  budgetKnown: Boolean,
  followUpRequired: Boolean,
  preferredFollowUp: { type: String, enum: ['MEETING', 'CALL', 'EMAIL', 'SEND_INFORMATION'] },
  status: { type: String, enum: ['NEW', 'CONTACTED', 'QUALIFIED', 'CONVERTED', 'LOST'], default: 'NEW' },
  notes: { type: String, trim: true, maxlength: 1000 },
}, { timestamps: true });

export default mongoose.model('Lead', leadSchema);