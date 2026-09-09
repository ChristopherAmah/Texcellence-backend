import { Router } from 'express';
import { create, getById, list, update } from '../controllers/event.controller.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createEventValidator, updateEventValidator } from '../validators/event.validator.js';

const router = Router();
router.use(authenticate);
router.get('/', list);
router.get('/:eventId', getById);
router.post('/', authorize(ROLES.ADMIN, ROLES.CWG_STAFF), validate(createEventValidator), create);
router.patch('/:eventId', authorize(ROLES.ADMIN, ROLES.CWG_STAFF), validate(updateEventValidator), update);
export default router;
