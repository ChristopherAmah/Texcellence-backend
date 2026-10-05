const isEmail = (value) => /^\S+@\S+\.\S+$/.test(value);
export const loginValidator = (body) => !isEmail(body.email) ? { valid: false, field: 'email', message: 'A valid email is required.' } : typeof body.password !== 'string' || !body.password ? { valid: false, field: 'password', message: 'Password is required.' } : { valid: true };
export const changePasswordValidator = (body) => {
  if (typeof body.currentPassword !== 'string' || !body.currentPassword) return { valid: false, field: 'currentPassword', message: 'Current password is required.' };
  if (typeof body.newPassword !== 'string' || body.newPassword.length < 12) return { valid: false, field: 'newPassword', message: 'New password must be at least 12 characters.' };
  return { valid: true };
};
