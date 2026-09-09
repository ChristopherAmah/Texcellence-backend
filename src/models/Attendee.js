import mongoose from 'mongoose';

const attendeeSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true, index: true },
  attendeeId: { type: String, required: true, unique: true, index: true },
  firstName: { type: String, required: true, trim: true, maxlength: 80 },
  lastName: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, lowercase: true, trim: true, maxlength: 254 },
  phone: { type: String, trim: true, maxlength: 40 },
  jobTitle: { type: String, trim: true, maxlength: 120 },
  company: { type: String, trim: true, maxlength: 160 },
  industry: { type: String, trim: true, maxlength: 120 },
  companySize: { type: String, trim: true, maxlength: 40 },
  country: { type: String, trim: true, maxlength: 100 },
  city: { type: String, trim: true, maxlength: 100 },
  attendeeType: { type: String, enum: ['CLIENT', 'PROSPECT', 'PARTNER', 'SPONSOR', 'MEDIA', 'GOVERNMENT', 'INVESTOR', 'SPEAKER', 'VIP', 'CWG_STAFF', 'OTHER'], default: 'OTHER' },
  registrationDate: { type: Date, default: Date.now },
  attendanceStatus: { type: String, enum: ['REGISTERED', 'ATTENDED', 'NO_SHOW'], default: 'REGISTERED' },
  checkInTime: Date,
  qrCodeValue: { type: String, required: true, unique: true, select: false },
  consent: { type: Boolean, default: true },
  leadSharingConsent: { type: Boolean, default: false },
}, { timestamps: true });

attendeeSchema.methods.toSafeObject = function toSafeObject({ includePrivate = false } = {}) {
  const attendee = this.toObject();
  delete attendee.qrCodeValue;
  if (!includePrivate) {
    delete attendee.consent;
    delete attendee.leadSharingConsent;
  }
  return { ...attendee, id: attendee._id.toString() };
};

export default mongoose.model('Attendee', attendeeSchema);