import express from 'express';
import GalleryImage from '../models/GalleryImage.js';
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

router.get('/', async (req, res) => {
  try {
    res.json(await GalleryImage.find().sort('order'));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/upload', verifyJWT, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Aucune image fournie.' });
    }

    const filename = `${path.parse(req.file.filename).name}-opt.jpg`;
    const outputPath = path.join(uploadDir, filename);
    await sharp(req.file.path)
      .resize(1200, undefined, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality: 85 })
      .toFile(outputPath);

    fs.unlink(req.file.path, () => {});
    const url = `/uploads/${filename}`;
    const img = await GalleryImage.create({ url, caption: req.body.caption });
    res.status(201).json(img);
  } catch (err) {
    console.error('Gallery upload error:', err);
    if (req.file) fs.unlink(req.file.path, () => {});
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', verifyJWT, async (req, res) => {
  try {
    const img = await GalleryImage.findByIdAndDelete(req.params.id);
    if (img) {
      const filePath = path.join(uploadDir, path.basename(img.url));
      fs.unlink(filePath, () => {});
    }
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
