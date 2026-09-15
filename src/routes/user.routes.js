import { Router } from 'express';
import { create, list, remove, updateRole } from '../controllers/user.controller.js';
import { ROLES } from '../constants/roles.js';
import { authenticate } from '../middleware/authenticate.js';
import { authorize } from '../middleware/authorize.js';
import { validate } from '../middleware/validate.js';
import { createAdminUserValidator, updateUserRoleValidator } from '../validators/user.validator.js';

const router = Router();
router.use(authenticate, authorize(ROLES.SUPERADMIN, ROLES.ADMIN));
router.get('/', list);
router.post('/', validate(createAdminUserValidator), create);
router.patch('/:userId/role', authorize(ROLES.SUPERADMIN), validate(updateUserRoleValidator), updateRole);
router.delete('/:userId', authorize(ROLES.SUPERADMIN), remove);
export default router;
