import mongoose from 'mongoose';
import { ROLES, roleValues } from '../constants/roles.js';

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true, trim: true, maxlength: 80 }, lastName: { type: String, required: true, trim: true, maxlength: 80 },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, maxlength: 254 }, passwordHash: { type: String, required: true, select: false },
  role: { type: String, enum: roleValues, default: ROLES.ATTENDEE }, sponsorId: { type: mongoose.Schema.Types.ObjectId, ref: 'Sponsor' }, attendeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Attendee' }, isActive: { type: Boolean, default: true },
}, { timestamps: true });
userSchema.methods.toSafeObject = function toSafeObject() { return { id: this._id.toString(), firstName: this.firstName, lastName: this.lastName, email: this.email, role: this.role, sponsorId: this.sponsorId, attendeeId: this.attendeeId, isActive: this.isActive }; };
export default mongoose.model('User', userSchema);
