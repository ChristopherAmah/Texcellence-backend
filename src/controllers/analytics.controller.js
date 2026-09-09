import * as analyticsService from '../services/analytics.service.js';

export const executive = async (req, res) => res.json({ success: true, message: 'Executive analytics retrieved successfully.', data: await analyticsService.getExecutiveAnalytics() });