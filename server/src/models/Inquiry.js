import mongoose from 'mongoose';

const InquirySchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  email: { type: String, required: true },
  checkIn: Date,
  checkOut: Date,
  guests: Number,
  message: String,
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Inquiry', InquirySchema);
