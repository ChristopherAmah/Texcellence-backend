const packages = ['GOLD', 'PLATINUM', 'OTHER'];
const statuses = ['PENDING', 'CONFIRMED', 'ACTIVE', 'COMPLETED'];
const requiredText = (body, field, maxLength) => typeof body[field] !== 'string' || !body[field].trim() ? `${field} is required.` : body[field].trim().length > maxLength ? `${field} is too long.` : null;

export const createSponsorValidator = (body) => {
  for (const [field, maxLength] of [['eventId', 40], ['name', 160]]) { const message = requiredText(body, field, maxLength); if (message) return { valid: false, field, message }; }
  if (!packages.includes(body.package)) return { valid: false, field: 'package', message: 'package is invalid.' };
  if (body.status !== undefined && !statuses.includes(body.status)) return { valid: false, field: 'status', message: 'status is invalid.' };
  return { valid: true };
};