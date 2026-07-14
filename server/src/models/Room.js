import mongoose from 'mongoose';

const UnavailableRangeSchema = new mongoose.Schema({
  start: { type: String, required: true },
  end: { type: String, required: true },
  note: String
}, { _id: true });

const RoomSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  bedType: String,
  capacity: Number,
  pricePerNight: Number,
  images: [String],
  amenities: [String],
  isAvailable: { type: Boolean, default: true },
  unavailableRanges: [UnavailableRangeSchema]
});

export default mongoose.model('Room', RoomSchema);
