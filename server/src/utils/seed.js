import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/Admin.js';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

async function seed() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    console.log('Make sure server/.env has: MONGODB_URI=mongodb://localhost:27017/riad');
    process.exit(1);
  }

  console.log('Connecting to:', uri.replace(/\/\/.*@/, '//<credentials>@'));
  await mongoose.connect(uri);
  console.log('Connected to MongoDB');

  const existing = await Admin.findOne({ email: 'admin@riadasilah.com' });
  if (existing) {
    console.log('Admin already exists');
    await mongoose.disconnect();
    return;
  }

  const passwordHash = bcrypt.hashSync('admin123', 10);
  await Admin.create({ email: 'admin@riadasilah.com', passwordHash });
  console.log('Admin created: admin@riadasilah.com / admin123');

  await mongoose.disconnect();
  console.log('Done');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
