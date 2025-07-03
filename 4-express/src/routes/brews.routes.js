import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { BrewsService } from '../services/brews.service.js';
import { BrewsController } from '../controllers/brews.controller.js';

const router = Router();
const service = new BrewsService();
const controller = new BrewsController(service);

const postLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 10,
  handler: (req, res) => {
    res.status(429).json({ message: 'Too many requests, please try again later.' });
  },
});

router.get('/', (req, res) => controller.getAll(req, res));
router.get('/:id', (req, res) => controller.getById(req, res));
router.post('/', postLimiter, (req, res) => controller.create(req, res));
router.put('/:id', (req, res) => controller.update(req, res));
router.delete('/:id', (req, res) => controller.delete(req, res));

export default router;
