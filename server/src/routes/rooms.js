import express from 'express';
import Room from '../models/Room.js';
import Booking from '../models/Booking.js';
import { verifyJWT } from '../middleware/auth.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const uploadDir = path.resolve(__dirname, '../../public/uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

const upload = multer({ storage });
const router = express.Router();

router.get('/', async (req, res) => res.json(await Room.find()));

router.post('/upload', verifyJWT, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'Aucune image fournie.' });
    const filename = `${path.parse(req.file.filename).name}-opt.jpg`;
    const outputPath = path.join(uploadDir, filename);
    await sharp(req.file.path)
      .resize(1200, undefined, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(outputPath);
    fs.unlink(req.file.path, () => {});
    res.json({ url: `/uploads/${filename}` });
  } catch (err) {
    console.error('Room image upload error:', err);
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: err.message });
  }
});

router.post('/', verifyJWT, async (req, res) => res.status(201).json(await Room.create(req.body)));

router.put('/:id', verifyJWT, async (req, res) => {
  const prev = await Room.findById(req.params.id);
  const updated = await Room.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (prev?.images) {
    const removed = prev.images.filter(u => !updated.images?.includes(u));
    removed.forEach(img => {
      const filePath = path.join(uploadDir, path.basename(img));
      fs.unlink(filePath, () => {});
    });
  }
  res.json(updated);
});

router.delete('/:id', verifyJWT, async (req, res) => {
  const room = await Room.findByIdAndDelete(req.params.id);
  if (room?.images) {
    room.images.forEach(img => {
      const filePath = path.join(uploadDir, path.basename(img));
      fs.unlink(filePath, () => {});
    });
  }
  res.status(204).end();
});

router.get('/:id/availability', async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const { start, end } = req.query;
  if (start && end) {
    const blockedByRange = (room.unavailableRanges || []).some(r =>
      new Date(start) < new Date(r.end) && new Date(end) > new Date(r.start)
    );
    const confirmedBookings = await Booking.find({
      roomName: room.name,
      status: 'confirmed',
      checkIn: { $lt: end },
      checkOut: { $gt: start }
    });
    return res.json({ available: !blockedByRange && confirmedBookings.length === 0 });
  }
  res.json({ unavailableRanges: room.unavailableRanges || [] });
});

router.patch('/:id/availability', verifyJWT, async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  const { start, end, note } = req.body;
  const range = { start, end, note: note || '' };
  room.unavailableRanges.push(range);
  await room.save();
  res.json(room);
});

router.delete('/:id/availability/:rangeId', verifyJWT, async (req, res) => {
  const room = await Room.findById(req.params.id);
  if (!room) return res.status(404).json({ error: 'Room not found' });
  room.unavailableRanges.pull({ _id: req.params.rangeId });
  await room.save();
  res.json(room);
});

export default router;
