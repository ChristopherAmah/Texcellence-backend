import { Router } from 'express';
import { login, me, register } from '../controllers/auth.controller.js';
import { authenticate } from '../middleware/authenticate.js';
import { validate } from '../middleware/validate.js';
import { loginValidator, registerValidator } from '../validators/auth.validator.js';

const router = Router();
router.post('/register', validate(registerValidator), register);
router.post('/login', validate(loginValidator), login);
router.get('/me', authenticate, me);
export default router;
