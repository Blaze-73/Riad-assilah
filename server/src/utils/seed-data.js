import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import Admin from '../models/Admin.js';
import Room from '../models/Room.js';
import Testimonial from '../models/Testimonial.js';
import GalleryImage from '../models/GalleryImage.js';
import bcrypt from 'bcrypt';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const rooms = [
  {
    name: 'Tassili Room',
    description: 'Spacious room overlooking the interior patio, decorated with zellige tiles and authentic Berber fabrics. Carved cedar ceiling and traditional marble floor.',
    bedType: 'Queen Bed',
    capacity: 2,
    pricePerNight: 650,
    images: ['https://images.unsplash.com/photo-1590496794008-383c8070b257?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Breakfast', 'Safe']
  },
  {
    name: 'Atlantic Suite',
    description: "Corner suite with stunning views of the Atlantic Ocean. King-size bed, marble bathroom, and private terrace with Berber furniture.",
    bedType: 'King Bed',
    capacity: 3,
    pricePerNight: 950,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Minibar', 'Private terrace', 'Bathtub', 'Breakfast']
  },
  {
    name: 'Berber Room',
    description: 'Intimate room in warm ochre and earth tones. Hand-woven Berber rugs, wool tapestries, and carved cedar ceiling.',
    bedType: 'Double Bed',
    capacity: 2,
    pricePerNight: 550,
    images: ['https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Breakfast']
  },
  {
    name: 'Sunset Room',
    description: 'Watch golden sunsets over the medina from your private terrace. Romantic room with premium bedding and intimate sitting areas.',
    bedType: 'Queen Bed',
    capacity: 2,
    pricePerNight: 750,
    images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Private terrace', 'Breakfast', 'Minibar']
  },
  {
    name: 'Family Suite',
    description: 'Perfect for families, two connecting rooms with a shared bathroom and a small living room. Overlooks the patio with fountain.',
    bedType: '2 Queen Beds',
    capacity: 4,
    pricePerNight: 1200,
    images: ['https://images.unsplash.com/photo-1590496794008-383c8070b257?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Living area', 'Breakfast', 'Mineral water']
  },
  {
    name: 'Patio Room',
    description: 'Ground floor with direct access to the Andalusian patio and fountain. Cool and peaceful atmosphere, ideal for relaxing after a day in the medina.',
    bedType: 'Queen Bed',
    capacity: 2,
    pricePerNight: 600,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Patio access', 'Breakfast', 'Safe']
  }
];

const testimonials = [
  { guestName: 'Sophie Laurent', country: 'FR', rating: 5, text: 'An unforgettable stay! The riad is magnificent, the food delicious, and the welcome warm. The room was superb and breakfast on the terrace is pure bliss. We will return without hesitation.' },
  { guestName: 'James Wilson', country: 'GB', rating: 5, text: 'Absolutely stunning riad. The attention to detail in the decor is incredible. The staff made us feel like family. The cooking class was a highlight of our trip to Morocco.' },
  { guestName: 'Marie Dupont', country: 'FR', rating: 4, text: 'A true haven of peace in the heart of the medina. The rooms are superb and the location is perfect for exploring Asilah on foot.' },
  { guestName: 'Hans Mueller', country: 'DE', rating: 5, text: 'Perfect location, beautiful rooms, and the most hospitable hosts. The rooftop terrace with sea view is breathtaking. We extended our stay twice!' },
  { guestName: 'Aisha Al-Farsi', country: 'AE', rating: 4, text: 'أجواء رائعة وضيافة ممتازة. الرياض جميل جداً والأسعار معقولة. الموقع ممتاز في قلب المدينة.' },
  { guestName: 'Emma & Tom', country: 'AU', rating: 5, text: 'We fell in love with Asilah and this riad made our stay perfect. The hammam experience was truly authentic. Already planning our return trip.' },
  { guestName: 'Pierre Lefevre', country: 'CA', rating: 5, text: 'The authentic charm of a Moroccan riad with all the modern comforts. Fatima and Ahmed are exceptional hosts.' },
  { guestName: 'Sarah & David', country: 'US', rating: 5, text: 'The most beautiful riad we\'ve ever stayed in. Every corner is Instagram-worthy. The staff went above and beyond for our anniversary.' }
];

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Interior patio with fountain', order: 1 },
  { url: 'https://images.unsplash.com/photo-1590496794008-383c8070b257?w=800', caption: 'Traditional Moroccan decoration', order: 2 },
  { url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800', caption: 'Riad courtyard', order: 3 },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', caption: 'Blue and white alleys of Asilah', order: 4 },
  { url: 'https://images.unsplash.com/photo-1590496794008-383c8070b257?w=800', caption: 'Traditional Moroccan zellige', order: 5 },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Panoramic rooftop with sea view', order: 6 },
  { url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800', caption: 'Asilah at night', order: 7 },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', caption: 'Atlantic coast from the medina', order: 8 },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Moroccan breakfast on the terrace', order: 9 }
];

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set in .env');
    process.exit(1);
  }

  console.log('Connecting to MongoDB...');
  await mongoose.connect(uri);
  console.log('Connected!\n');

  // Admin
  const existingAdmin = await Admin.findOne({ email: 'admin@riadasilah.com' });
  if (!existingAdmin) {
    const passwordHash = bcrypt.hashSync('admin123', 10);
    await Admin.create({ email: 'admin@riadasilah.com', passwordHash });
    console.log('✓ Admin created: admin@riadasilah.com / admin123');
  } else {
    console.log('→ Admin already exists');
  }

  // Rooms
  await Room.deleteMany({});
  await Room.insertMany(rooms);
  console.log(`✓ ${rooms.length} rooms inserted`);

  // Testimonials
  await Testimonial.deleteMany({});
  await Testimonial.insertMany(testimonials);
  console.log(`✓ ${testimonials.length} testimonials inserted`);

  // Gallery
  await GalleryImage.deleteMany({});
  await GalleryImage.insertMany(galleryImages);
  console.log(`✓ ${galleryImages.length} gallery images inserted`);

  await mongoose.disconnect();
  console.log('\n✓ All seed data loaded!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
