import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import path from 'path';
import { fileURLToPath } from 'url';
import routes from './routes/index.js';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.resolve(__dirname, '../public/uploads')));
app.use('/api', routes);

const PORT = process.env.PORT || 4000;

async function start() {
  const uri = process.env.MONGODB_URI;
  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log('Connected to MongoDB');
    } catch (err) {
      console.error('MongoDB connection error:', err.message);
      console.log('Starting server without database...');
    }
  } else {
    console.log('MONGODB_URI not set — starting server without database');
  }
  app.listen(PORT, () => console.log('Server listening on port ' + PORT));
}

start();

export default app;
