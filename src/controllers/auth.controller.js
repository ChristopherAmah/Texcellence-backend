import * as authService from '../services/auth.service.js';
const sendAuthResponse = (res, statusCode, message, data) => res.status(statusCode).json({ success: true, message, data });
export const register = async (req, res) => sendAuthResponse(res, 201, 'User registered successfully.', await authService.registerUser(req.body));
export const login = async (req, res) => sendAuthResponse(res, 200, 'Login successful.', await authService.loginUser(req.body));
export const me = async (req, res) => sendAuthResponse(res, 200, 'Authenticated user retrieved.', { user: req.user.toSafeObject() });
