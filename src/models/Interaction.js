import mongoose from 'mongoose';

const interactionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendee', required: true, index: true },
  sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor', required: true, index: true },
  timestamp: { type: Date, default: Date.now },
  interactionType: { type: String, enum: ['BOOTH_VISIT', 'PRODUCT_DEMO', 'QR_SCAN', 'SPONSORED_SESSION', 'WORKSHOP', 'SURVEY', 'MEETING', 'NETWORKING_INTRODUCTION', 'COMPETITION_GAME', 'CONTENT_DOWNLOAD', 'OTHER'], default: 'QR_SCAN' },
  productTopic: { type: String, trim: true, maxlength: 160 },
  seniority: { type: String, enum: ['EXECUTIVE', 'SENIOR', 'MID', 'OTHER'] },
  companyFit: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'] },
  purchaseIntent: { type: String, enum: ['0_3_MONTHS', '3_6_MONTHS', '6_12_MONTHS', 'RESEARCHING'] },
  decisionAuthority: { type: String, enum: ['DECISION_MAKER', 'INFLUENCER', 'USER'] },
  leadQuality: { type: String, enum: ['COLD', 'WARM', 'HOT'], default: 'COLD' },
  interestLevel: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], required: true },
  nextAction: { type: String, enum: ['MEETING', 'SEND_INFORMATION', 'CALL', 'EMAIL', 'NONE'], required: true },
  notes: { type: String, trim: true, maxlength: 1000 },
  engagementPoints: { type: Number, min: 0, max: 100, required: true },
}, { timestamps: true });

export default mongoose.model('Interaction', interactionSchema);