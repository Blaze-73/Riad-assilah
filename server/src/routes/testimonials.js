import express from 'express';
import Testimonial from '../models/Testimonial.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

router.get('/', async (req, res) => res.json(await Testimonial.find({ isVisible: true })));
router.get('/all', verifyJWT, async (req, res) => res.json(await Testimonial.find()));
router.post('/', verifyJWT, async (req, res) => res.status(201).json(await Testimonial.create(req.body)));
router.put('/:id', verifyJWT, async (req, res) => res.json(await Testimonial.findByIdAndUpdate(req.params.id, req.body, { new: true })));
router.delete('/:id', verifyJWT, async (req, res) => {
  await Testimonial.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
