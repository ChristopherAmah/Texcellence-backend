import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  type: { type: String, enum: ['ATTENDEE_REGISTERED', 'EVENT_CREATED', 'EVENT_UPDATED', 'SPONSOR_CREATED', 'SPONSOR_DELETED', 'INTERACTION_RECORDED', 'LEAD_CREATED'], required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  description: { type: String, required: true, trim: true, maxlength: 400 },
  actorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  actorName: { type: String, required: true, trim: true, maxlength: 160 },
  actorRole: { type: String, trim: true, maxlength: 40 },
  entityId: { type: mongoose.Schema.Types.ObjectId },
  entityType: { type: String, trim: true, maxlength: 40 },
  metadata: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

activitySchema.index({ createdAt: -1 });
export default mongoose.model('Activity', activitySchema);