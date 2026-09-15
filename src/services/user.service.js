import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { recordActivity } from './activity.service.js';

const manageableRoles = ['ADMIN', 'SUPERADMIN'];

export const listUsers = async ({ page = 1, limit = 50, role } = {}) => {
  // The users directory only manages control room accounts, not attendees or sponsor staff.
  const query = role && manageableRoles.includes(role) ? { role } : { role: { $in: manageableRoles } };
  const safeLimit = Math.min(Math.max(Number(limit) || 50, 1), 100);
  const safePage = Math.max(Number(page) || 1, 1);
  const [users, total] = await Promise.all([User.find(query).sort({ createdAt: -1 }).skip((safePage - 1) * safeLimit).limit(safeLimit).lean(), User.countDocuments(query)]);
  return { users: users.map(({ passwordHash, ...user }) => user), pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.ceil(total / safeLimit) } };
};

export const createAdminUser = async ({ firstName, lastName, email, password, role }, actor) => {
  const normalizedEmail = email.toLowerCase().trim();
  const superadminCount = await User.countDocuments({ role: 'SUPERADMIN' });
  if (actor.role !== 'SUPERADMIN') {
    // Bootstrap exception: an admin may create the very first superadmin when none exists yet.
    const bootstrapAllowed = role === 'SUPERADMIN' && superadminCount === 0;
    if (!bootstrapAllowed) { const error = new Error('Only superadmins can create admin or superadmin accounts.'); error.statusCode = 403; throw error; }
  }
  if (await User.exists({ email: normalizedEmail })) { const error = new Error('An account with this email already exists.'); error.statusCode = 409; throw error; }
  const user = await User.create({ firstName, lastName, email: normalizedEmail, passwordHash: await bcrypt.hash(password, 12), role });
  await recordActivity({ type: 'USER_CREATED', title: `New ${role.toLowerCase()} created`, description: `${actor.firstName} ${actor.lastName} created ${role.toLowerCase()} account for ${firstName} ${lastName}.`, actor, entity: user, metadata: { email: normalizedEmail, role } });
  return user.toSafeObject();
};

export const deleteUser = async (userId, actor) => {
  if (actor.role !== 'SUPERADMIN') { const error = new Error('Only superadmins can delete accounts.'); error.statusCode = 403; throw error; }
  const target = await User.findById(userId);
  if (!target) { const error = new Error('User not found.'); error.statusCode = 404; throw error; }
  if (target._id.equals(actor._id)) { const error = new Error('You cannot delete your own account.'); error.statusCode = 400; throw error; }
  if (target.role === 'SUPERADMIN' && (await User.countDocuments({ role: 'SUPERADMIN' })) <= 1) { const error = new Error('At least one superadmin account must remain.'); error.statusCode = 400; throw error; }
  await target.deleteOne();
  await recordActivity({ type: 'USER_DELETED', title: `${target.role.toLowerCase()} account deleted`, description: `${actor.firstName} ${actor.lastName} deleted the ${target.role.toLowerCase()} account for ${target.firstName} ${target.lastName}.`, actor, metadata: { email: target.email, role: target.role } });
};

export const updateUserRole = async (userId, role, actor) => {
  if (actor.role !== 'SUPERADMIN') { const error = new Error('Only superadmins can change account roles.'); error.statusCode = 403; throw error; }
  const target = await User.findById(userId);
  if (!target) { const error = new Error('User not found.'); error.statusCode = 404; throw error; }
  if (target.role === role) return target.toSafeObject();
  if (target.role === 'SUPERADMIN' && role !== 'SUPERADMIN' && (await User.countDocuments({ role: 'SUPERADMIN' })) <= 1) { const error = new Error('At least one superadmin account must remain.'); error.statusCode = 400; throw error; }
  const previousRole = target.role;
  target.role = role;
  await target.save();
  await recordActivity({ type: 'USER_ROLE_CHANGED', title: 'Account role changed', description: `${actor.firstName} ${actor.lastName} changed ${target.firstName} ${target.lastName} from ${previousRole.toLowerCase()} to ${role.toLowerCase()}.`, actor, entity: target, metadata: { email: target.email, previousRole, role } });
  return target.toSafeObject();
};
