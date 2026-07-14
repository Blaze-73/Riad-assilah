import mongoose from 'mongoose';

const TestimonialSchema = new mongoose.Schema({
  guestName: String,
  country: String,
  rating: { type: Number, min: 1, max: 5 },
  text: String,
  textFr: String,
  textAr: String,
  isVisible: { type: Boolean, default: true }
});

export default mongoose.model('Testimonial', TestimonialSchema);
