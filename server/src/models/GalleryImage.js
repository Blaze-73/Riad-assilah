import mongoose from 'mongoose';

const GalleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: String,
  order: { type: Number, default: 0 }
});

export default mongoose.model('GalleryImage', GalleryImageSchema);
