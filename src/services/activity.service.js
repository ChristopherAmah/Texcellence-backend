import Activity from '../models/Activity.js';

export const recordActivity = async ({ type, title, description, actor, actorName, actorRole, entity, metadata }) => Activity.create({
  type,
  title,
  description,
  actorId: actor?._id,
  actorName: actorName || (actor ? `${actor.firstName} ${actor.lastName}`.trim() : 'System'),
  actorRole: actorRole || actor?.role || 'SYSTEM',
  entityId: entity?._id,
  entityType: entity?.constructor?.modelName || entity?.entityType,
  metadata,
});

export const listActivities = async ({ limit = 30 } = {}) => Activity.find().sort({ createdAt: -1 }).limit(Math.min(Math.max(Number(limit) || 30, 1), 100)).lean();