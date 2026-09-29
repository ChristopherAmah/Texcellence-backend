import { Router } from 'express';
import { changePassword, login, me, registerAdmin } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { adminRegisterValidator, changePasswordValidator, loginValidator } from '../validators/auth.validator.js';

const router = Router();
router.post('/admin/register', validate(adminRegisterValidator), registerAdmin);
router.post('/login', validate(loginValidator), login);
router.get('/me', authenticate, me);
router.patch('/change-password', authenticate, validate(changePasswordValidator), changePassword);
export default router;
