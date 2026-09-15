import { ROLES } from '../constants/roles.js';

// Superadmins bypass per-route role checks and always have access.
export const authorize = (...roles) => (req, res, next) => (req.user.role === ROLES.SUPERADMIN || roles.includes(req.user.role)) ? next() : res.status(403).json({ success: false, message: 'You do not have permission for this action.' });
