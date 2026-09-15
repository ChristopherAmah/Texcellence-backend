import * as userService from '../services/user.service.js';

export const list = async (req, res) => res.json({ success: true, message: 'Users retrieved successfully.', data: await userService.listUsers(req.query) });
export const create = async (req, res) => res.status(201).json({ success: true, message: 'User created successfully.', data: { user: await userService.createAdminUser(req.body, req.user) } });
