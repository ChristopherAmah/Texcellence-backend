const statuses = ['DRAFT', 'REGISTRATION_OPEN', 'LIVE', 'COMPLETED'];
const textFields = { name: 160, venue: 240 };
const isValidDate = (value) => typeof value === 'string' && !Number.isNaN(Date.parse(value));
const validateFields = (body, partial = false) => {
  for (const [field, maximum] of Object.entries(textFields)) if (!partial || field in body) { if (typeof body[field] !== 'string' || !body[field].trim()) return { valid: false, field, message: `${field} is required.` }; if (body[field].trim().length > maximum) return { valid: false, field, message: `${field} is too long.` }; }
  if ((!partial || 'year' in body) && (!Number.isInteger(body.year) || body.year < 2000 || body.year > 2100)) return { valid: false, field: 'year', message: 'year must be between 2000 and 2100.' };
  if ((!partial || 'startDate' in body) && !isValidDate(body.startDate)) return { valid: false, field: 'startDate', message: 'startDate and start time are required.' };
  if ('endDate' in body && body.endDate !== null && body.endDate !== '' && !isValidDate(body.endDate)) return { valid: false, field: 'endDate', message: 'endDate and end time must be a valid ISO date.' };
  if (body.startDate && body.endDate && new Date(body.endDate) < new Date(body.startDate)) return { valid: false, field: 'endDate', message: 'endDate cannot be before startDate.' };
  if ('status' in body && !statuses.includes(body.status)) return { valid: false, field: 'status', message: 'status is invalid.' };
  return { valid: true };
};
export const createEventValidator = (body) => validateFields(body);
export const updateEventValidator = (body) => Object.keys(body).length ? validateFields(body, true) : { valid: false, field: 'body', message: 'At least one field is required.' };
