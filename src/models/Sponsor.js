import mongoose from 'mongoose';

const sponsorSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  sponsorId: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true, trim: true, maxlength: 160 },
  package: { type: String, enum: ['GOLD', 'PLATINUM', 'OTHER'], default: 'OTHER' },
  targetAudience: { industries: [String], jobTitles: [String], companySizes: [String] },
  boothNumber: { type: String, trim: true, maxlength: 40 },
  status: { type: String, enum: ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED'], default: 'PENDING' },
}, { timestamps: true });

sponsorSchema.index({ eventId: 1, name: 1 }, { unique: true });
export default mongoose.model('Sponsor', sponsorSchema);