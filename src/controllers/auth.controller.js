import * as authService from '../services/auth.service.js';
const sendAuthResponse = (res, statusCode, message, data) => res.status(statusCode).json({ success: true, message, data });
export const registerAdmin = async (req, res) => sendAuthResponse(res, 201, 'Admin account registered successfully.', await authService.registerAdmin(req.body));
export const login = async (req, res) => sendAuthResponse(res, 200, 'Login successful.', await authService.loginUser(req.body));
export const me = async (req, res) => sendAuthResponse(res, 200, 'Authenticated user retrieved.', { user: req.user.toSafeObject() });
