const requiredText = (body, field, maxLength) => {
  if (typeof body[field] !== 'string' || !body[field].trim()) return `${field} is required.`;
  if (body[field].trim().length > maxLength) return `${field} is too long.`;
  return null;
};

export const createAttendeeValidator = (body) => {
  for (const [field, maxLength] of [['firstName', 80], ['lastName', 80]]) {
    const message = requiredText(body, field, maxLength);
    if (message) return { valid: false, field, message };
  }
  if (body.phone !== undefined && typeof body.phone !== 'string') return { valid: false, field: 'phone', message: 'Phone must be text.' };
  if (body.consent !== undefined && typeof body.consent !== 'boolean') return { valid: false, field: 'consent', message: 'Consent must be boolean.' };
  if (body.leadSharingConsent !== undefined && typeof body.leadSharingConsent !== 'boolean') return { valid: false, field: 'leadSharingConsent', message: 'Lead sharing consent must be boolean.' };
  return { valid: true };
};