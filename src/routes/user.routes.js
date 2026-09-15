import { Router } from 'express';
import { create, list } from '../controllers/user.controller.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createAdminUserValidator } from '../validators/user.validator.js';

const router = Router();
router.use(authenticate, authorize(ROLES.SUPERADMIN, ROLES.ADMIN));
router.get('/', list);
router.post('/', authorize(ROLES.SUPERADMIN), validate(createAdminUserValidator), create);
export default router;
