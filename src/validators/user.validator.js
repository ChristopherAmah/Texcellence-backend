import { ROLES } from '../constants/roles.js';

const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
const requiredText = (body, field, maxLength) => typeof body[field] !== 'string' || !body[field].trim() ? `${field} is required.` : body[field].trim().length > maxLength ? `${field} is too long.` : null;
const creatableRoles = [ROLES.SUPERADMIN, ROLES.ADMIN];

export const createAdminUserValidator = (body) => {
  for (const [field, maxLength] of [['firstName', 80], ['lastName', 80]]) { const message = requiredText(body, field, maxLength); if (message) return { valid: false, field, message }; }
  if (!isEmail(body.email)) return { valid: false, field: 'email', message: 'A valid email is required.' };
  if (typeof body.password !== 'string' || body.password.length < 12) return { valid: false, field: 'password', message: 'Password must be at least 12 characters.' };
  if (!creatableRoles.includes(body.role)) return { valid: false, field: 'role', message: 'role must be ADMIN or SUPERADMIN.' };
  return { valid: true };
};

export const updateUserRoleValidator = (body) => !creatableRoles.includes(body.role) ? { valid: false, field: 'role', message: 'role must be ADMIN or SUPERADMIN.' } : { valid: true };
