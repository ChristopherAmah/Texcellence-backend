import * as attendeeService from '../services/attendee.service.js';

export const create = async (req, res) => res.status(201).json({ success: true, message: 'Attendee registered successfully.', data: { attendee: await attendeeService.createAttendee(req.user, req.body) } });
export const me = async (req, res) => res.json({ success: true, message: 'Attendee profile retrieved successfully.', data: { attendee: await attendeeService.getOwnAttendee(req.user) } });
export const list = async (req, res) => res.json({ success: true, message: 'Attendees retrieved successfully.', data: await attendeeService.listAttendees(req.query) });
export const getById = async (req, res) => res.json({ success: true, message: 'Attendee retrieved successfully.', data: { attendee: await attendeeService.getAttendee(req.params.attendeeId) } });