import { Router } from 'express';
import { create, list } from '../controllers/sponsor.controller.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createSponsorValidator } from '../validators/sponsor.validator.js';

const router = Router();
router.use(authenticate, authorize(ROLES.ADMIN, ROLES.CWG_STAFF));
router.get('/', list);
router.post('/', validate(createSponsorValidator), create);
export default router;