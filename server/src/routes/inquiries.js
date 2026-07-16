import express from 'express';
import Inquiry from '../models/Inquiry.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

// public submit
router.post('/', async (req, res) => {
  try {
    const { checkIn, checkOut } = req.body;
    const today = new Date().toISOString().slice(0, 10);
    if (checkIn && checkIn < today) {
      return res.status(400).json({ error: "Check-in date cannot be in the past." });
    }
    if (checkIn && checkOut && checkOut <= checkIn) {
      return res.status(400).json({ error: 'Check-out must be after check-in.' });
    }
    const inquiry = await Inquiry.create(req.body);
    const { sendInquiryNotification } = await import('../utils/mailer.js');
    sendInquiryNotification(inquiry);
    res.status(201).json(inquiry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// admin list, status update, delete
router.get('/', verifyJWT, async (req, res) => res.json(await Inquiry.find().sort({ createdAt: -1 })));
router.patch('/:id', verifyJWT, async (req, res) => {
  const updated = await Inquiry.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
  res.json(updated);
});
router.delete('/:id', verifyJWT, async (req, res) => {
  await Inquiry.findByIdAndDelete(req.params.id);
  res.status(204).end();
});

export default router;
