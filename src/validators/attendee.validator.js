const requiredText = (body, field, maxLength) => {
  if (typeof body[field] !== 'string' || !body[field].trim()) return `${field} is required.`;
  if (body[field].trim().length > maxLength) return `${field} is too long.`;
  return null;
};
const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);

export const attendeeTypes = ['CLIENT', 'PROSPECT', 'PARTNER', 'SPONSOR', 'MEDIA', 'GOVERNMENT', 'INVESTOR', 'SPEAKER', 'VIP', 'CWG_STAFF', 'OTHER'];

export const createAttendeeValidator = (body) => {
  for (const [field, maxLength] of [['firstName', 80], ['lastName', 80]]) {
    const message = requiredText(body, field, maxLength);
    if (message) return { valid: false, field, message };
  }
  if (!isEmail(body.email)) return { valid: false, field: 'email', message: 'A valid email is required.' };
  if (body.phone !== undefined && typeof body.phone !== 'string') return { valid: false, field: 'phone', message: 'Phone must be text.' };
  if (body.consent !== undefined && typeof body.consent !== 'boolean') return { valid: false, field: 'consent', message: 'Consent must be boolean.' };
  if (body.leadSharingConsent !== undefined && typeof body.leadSharingConsent !== 'boolean') return { valid: false, field: 'leadSharingConsent', message: 'Lead sharing consent must be boolean.' };
  return { valid: true };
};

export const importAttendeesValidator = (body) => {
  if (typeof body.eventId !== 'string' || !body.eventId.trim()) return { valid: false, field: 'eventId', message: 'An event is required.' };
  if (!Array.isArray(body.attendees) || body.attendees.length === 0) return { valid: false, field: 'attendees', message: 'Add at least one attendee.' };
  if (body.attendees.length > 500) return { valid: false, field: 'attendees', message: 'A maximum of 500 attendees can be imported at once.' };
  return { valid: true };
};

export const validateImportedAttendee = (body) => {
  const baseResult = createAttendeeValidator(body);
  if (!baseResult.valid) return baseResult;
  if (body.attendeeType !== undefined && !attendeeTypes.includes(body.attendeeType)) return { valid: false, field: 'attendeeType', message: 'Attendee type is not valid.' };

  for (const [field, maxLength] of [['phone', 40], ['jobTitle', 120], ['company', 160], ['industry', 120], ['companySize', 40], ['country', 100], ['city', 100]]) {
    if (body[field] !== undefined && (typeof body[field] !== 'string' || body[field].length > maxLength)) return { valid: false, field, message: `${field} is too long.` };
  }
  return { valid: true };
};
