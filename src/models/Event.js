import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({ name: { type: String, required: true, trim: true, maxlength: 160 }, year: { type: Number, required: true, min: 2000, max: 2100 }, startDate: { type: Date, required: true }, endDate: { type: Date }, venue: { type: String, required: true, trim: true, maxlength: 240 }, status: { type: String, enum: ['DRAFT', 'REGISTRATION_OPEN', 'LIVE', 'COMPLETED'], default: 'DRAFT' } }, { timestamps: true });
eventSchema.index({ year: 1, status: 1 });
export default mongoose.model('Event', eventSchema);
