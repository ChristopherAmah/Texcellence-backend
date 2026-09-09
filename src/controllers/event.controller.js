import * as eventService from '../services/event.service.js';
export const create = async (req, res) => res.status(201).json({ success: true, message: 'Event created successfully.', data: { event: await eventService.createEvent(req.body, req.user) } });
export const list = async (req, res) => res.json({ success: true, message: 'Events retrieved successfully.', data: await eventService.listEvents(req.query) });
export const getById = async (req, res) => res.json({ success: true, message: 'Event retrieved successfully.', data: { event: await eventService.getEvent(req.params.eventId) } });
export const update = async (req, res) => res.json({ success: true, message: 'Event updated successfully.', data: { event: await eventService.updateEvent(req.params.eventId, req.body) } });
