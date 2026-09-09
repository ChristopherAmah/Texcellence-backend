const values = {
  seniority: ['EXECUTIVE', 'SENIOR', 'MID', 'OTHER'], companyFit: ['HIGH', 'MEDIUM', 'LOW'], engagement: ['HIGH', 'MEDIUM', 'LOW'], purchaseIntent: ['0_3_MONTHS', '3_6_MONTHS', '6_12_MONTHS', 'RESEARCHING'], decisionAuthority: ['DECISION_MAKER', 'INFLUENCER', 'USER'], interestLevel: ['LOW', 'MEDIUM', 'HIGH'], nextAction: ['MEETING', 'SEND_INFORMATION', 'CALL', 'EMAIL', 'NONE'],
};
export const createInteractionValidator = (body) => {
  for (const field of ['attendeeId', 'sponsorId', 'interestLevel', 'nextAction', ...Object.keys(values).slice(0, 5)]) { if (typeof body[field] !== 'string' || !body[field].trim()) return { valid: false, field, message: `${field} is required.` }; if (values[field] && !values[field].includes(body[field])) return { valid: false, field, message: `${field} is invalid.` }; }
  if (body.budgetKnown !== undefined && typeof body.budgetKnown !== 'boolean') return { valid: false, field: 'budgetKnown', message: 'budgetKnown must be boolean.' };
  if (body.followUpRequired !== undefined && typeof body.followUpRequired !== 'boolean') return { valid: false, field: 'followUpRequired', message: 'followUpRequired must be boolean.' };
  return { valid: true };
};