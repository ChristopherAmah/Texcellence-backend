import { Router } from 'express';
import { create, scan } from '../controllers/interaction.controller.js';
import { validate } from '../middleware/validate.js';
import { createInteractionValidator } from '../validators/interaction.validator.js';

const router = Router();
router.get('/scan/:attendeeId', scan);
router.post('/', validate(createInteractionValidator), create);
export default router;