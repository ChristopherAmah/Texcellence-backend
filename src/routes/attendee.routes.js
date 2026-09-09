import { Router } from 'express';
import { create, getById, list, me } from '../controllers/attendee.controller.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createAttendeeValidator } from '../validators/attendee.validator.js';

const router = Router();
router.use(authenticate);
router.post('/', authorize(ROLES.ATTENDEE), validate(createAttendeeValidator), create);
router.get('/me', authorize(ROLES.ATTENDEE), me);
router.get('/', authorize(ROLES.ADMIN, ROLES.CWG_STAFF), list);
router.get('/:attendeeId', authorize(ROLES.ADMIN, ROLES.CWG_STAFF), getById);
export default router;