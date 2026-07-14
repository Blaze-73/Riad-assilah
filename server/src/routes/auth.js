import express from 'express';
import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import { verifyJWT } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const admin = await Admin.findOne({ email });
  if (!admin || !admin.checkPassword(password))
    return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  res.json({ token });
});

router.get('/me', verifyJWT, (req, res) => res.json({ id: req.adminId }));

export default router;
