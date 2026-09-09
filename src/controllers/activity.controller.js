import { listActivities } from '../services/activity.service.js';

export const list = async (req, res) => res.json({ success: true, message: 'Activity feed retrieved successfully.', data: { activities: await listActivities(req.query) } });