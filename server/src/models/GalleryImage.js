import mongoose from 'mongoose';

const GalleryImageSchema = new mongoose.Schema({
  url: { type: String, required: true },
  caption: String,
  captionFr: String,
  captionAr: String,
  order: { type: Number, default: 0 }
});

export default mongoose.model('GalleryImage', GalleryImageSchema);
