import express from 'express';
import Inquiry from '../models/Inquiry.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// public submit
router.post('/', async (req, res) => {
  const inquiry = await Inquiry.create(req.body);
  const { sendInquiryNotification } = await import('../utils/mailer.js');
  sendInquiryNotification(inquiry);
  res.status(201).json(inquiry);
});

// admin list, status update, delete
router.get('/', verifyJWT, async (req, res) => res.json(await Inquiry.find()));
router.patch('/:id', verifyJWT, async (req, res) => {
  const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(updated);
});
router.delete('/:id', verifyJWT, async (req, res) => {
  await Inquiry.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
