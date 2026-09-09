import { Router } from 'express';
import { list } from '../controllers/activity.controller.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
router.get('/', authenticate, authorize(ROLES.ADMIN, ROLES.CWG_STAFF), list);
export default router;