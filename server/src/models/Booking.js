import mongoose from 'mongoose';

const BookingSchema = new mongoose.Schema({
  guestName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  roomName: String,
  checkIn: String,
  checkOut: String,
  guests: Number,
  message: String,
  status: { type: String, default: 'new' }
}, { timestamps: true });

export default mongoose.model('Booking', BookingSchema);
