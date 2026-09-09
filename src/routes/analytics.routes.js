import { Router } from 'express';
import { executive } from '../controllers/analytics.controller.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';

const router = Router();
router.use(authenticate, authorize(ROLES.ADMIN, ROLES.CWG_STAFF));
router.get('/executive', executive);
export default router;