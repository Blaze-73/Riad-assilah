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
    nameFr: 'Chambre Tassili',
    nameAr: 'غرفة تاسيلي',
    description: 'Spacious room overlooking the interior patio, decorated with zellige tiles and authentic Berber fabrics. Carved cedar ceiling and traditional marble floor.',
    descriptionFr: 'Chambre spacieuse avec vue sur le patio intérieur, décorée de zelliges et de tissus berbères authentiques. Plafond en cèdre sculpté et sol en marbre traditionnel.',
    descriptionAr: 'غرفة واسعة تطل على الفناء الداخلي، مزينة بالزليج والأنسجة البربرية الأصيلة. سقف من الأرز المنحوت وأرضية من الرخام التقليدي.',
    bedType: 'Queen Bed',
    capacity: 2,
    pricePerNight: 650,
    images: ['https://images.unsplash.com/photo-1590496794008-383c8070b257?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Breakfast', 'Safe'],
    amenitiesFr: ['Climatisation', 'Wi-Fi', 'Salle de bain privée', 'Petit-déjeuner', 'Coffre-fort'],
    amenitiesAr: ['تكييف', 'واي فاي', 'حمام خاص', 'فطور', 'خزينة']
  },
  {
    name: 'Atlantic Suite',
    nameFr: 'Suite Atlantique',
    nameAr: 'جناح الأطلسي',
    description: "Corner suite with stunning views of the Atlantic Ocean. King-size bed, marble bathroom, and private terrace with Berber furniture.",
    descriptionFr: "Suite d'angle avec vue imprenable sur l'océan Atlantique. Lit king-size, salle de bain en marbre et terrasse privée avec mobilier berbère.",
    descriptionAr: 'جناح زاوية مع إطلالة رائعة على المحيط الأطلسي. سرير كبير، حمام رخامي وتراس خاص مع أثاث بربري.',
    bedType: 'King Bed',
    capacity: 3,
    pricePerNight: 950,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Minibar', 'Private terrace', 'Bathtub', 'Breakfast'],
    amenitiesFr: ['Climatisation', 'Wi-Fi', 'Minibar', 'Terrasse privée', 'Baignoire', 'Petit-déjeuner'],
    amenitiesAr: ['تكييف', 'واي فاي', 'ميني بار', 'تراس خاص', 'حوض استحمام', 'فطور']
  },
  {
    name: 'Berber Room',
    nameFr: 'Chambre Berbère',
    nameAr: 'غرفة بربرية',
    description: 'Intimate room in warm ochre and earth tones. Hand-woven Berber rugs, wool tapestries, and carved cedar ceiling.',
    descriptionFr: "Chambre intime aux couleurs chaudes d'ocre et de terre. Tapis berbères tissés à la main, tentures en laine et plafond en cèdre sculpté.",
    descriptionAr: 'غرفة حميمية بألوان دافئة من المغرة والتراب. سجاد بربري منسوج يدوياً، ستائر صوفية وسقف من الأرز المنحوت.',
    bedType: 'Double Bed',
    capacity: 2,
    pricePerNight: 550,
    images: ['https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Private bathroom', 'Breakfast'],
    amenitiesFr: ['Climatisation', 'Wi-Fi', 'Salle de bain privée', 'Petit-déjeuner'],
    amenitiesAr: ['تكييف', 'واي فاي', 'حمام خاص', 'فطور']
  },
  {
    name: 'Sunset Room',
    nameFr: 'Chambre du Coucher de Soleil',
    nameAr: 'غرفة الغروب',
    description: 'Watch golden sunsets over the medina from your private terrace. Romantic room with premium bedding and intimate sitting areas.',
    descriptionFr: 'Admirez les couchers de soleil dorés sur la médina depuis votre terrasse privée. Chambre romantique avec literie haut de gamme et coins salon intimes.',
    descriptionAr: 'شاهد غروب الشمس الذهبي فوق المدينة المنورة من تراسك الخاص. غرفة رومانسية مع فراش فاخر ومناطق جلوس حميمية.',
    bedType: 'Queen Bed',
    capacity: 2,
    pricePerNight: 750,
    images: ['https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Private terrace', 'Breakfast', 'Minibar'],
    amenitiesFr: ['Climatisation', 'Wi-Fi', 'Terrasse privée', 'Petit-déjeuner', 'Minibar'],
    amenitiesAr: ['تكييف', 'واي فاي', 'تراس خاص', 'فطور', 'ميني بار']
  },
  {
    name: 'Family Suite',
    nameFr: 'Suite Familiale',
    nameAr: 'جناح عائلي',
    description: 'Perfect for families, two connecting rooms with a shared bathroom and a small living room. Overlooks the patio with fountain.',
    descriptionFr: 'Parfaite pour les familles, deux chambres communicantes avec salle de bain partagée et un petit salon. Donne sur le patio avec fontaine.',
    descriptionAr: 'مثالي للعائلات، غرفتان متصلتان مع حمام مشترك وغرفة معيشة صغيرة. يطل على الفناء مع النافورة.',
    bedType: '2 Queen Beds',
    capacity: 4,
    pricePerNight: 1200,
    images: ['https://images.unsplash.com/photo-1590496794008-383c8070b257?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Living area', 'Breakfast', 'Mineral water'],
    amenitiesFr: ['Climatisation', 'Wi-Fi', 'Coin salon', 'Petit-déjeuner', 'Eau minérale'],
    amenitiesAr: ['تكييف', 'واي فاي', 'منطقة معيشة', 'فطور', 'مياه معدنية']
  },
  {
    name: 'Patio Room',
    nameFr: 'Chambre du Patio',
    nameAr: 'غرفة الفناء',
    description: 'Ground floor with direct access to the Andalusian patio and fountain. Cool and peaceful atmosphere, ideal for relaxing after a day in the medina.',
    descriptionFr: "Rez-de-chaussée avec accès direct au patio andalou et à la fontaine. Ambiance fraîche et paisible, idéale pour se détendre après une journée dans la médina.",
    descriptionAr: 'طابق أرضي مع وصول مباشر إلى الفناء الأندلسي والنافورة. أجواء منعشة وهادئة، مثالية للاسترخاء بعد يوم في المدينة.',
    bedType: 'Queen Bed',
    capacity: 2,
    pricePerNight: 600,
    images: ['https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'],
    amenities: ['Air conditioning', 'Wi-Fi', 'Patio access', 'Breakfast', 'Safe'],
    amenitiesFr: ['Climatisation', 'Wi-Fi', 'Accès patio', 'Petit-déjeuner', 'Coffre-fort'],
    amenitiesAr: ['تكييف', 'واي فاي', 'وصول إلى الفناء', 'فطور', 'خزينة']
  }
];

const testimonials = [
  { guestName: 'Sophie Laurent', country: 'FR', rating: 5, text: 'An unforgettable stay! The riad is magnificent, the food delicious, and the welcome warm. The room was superb and breakfast on the terrace is pure bliss. We will return without hesitation.', textFr: 'Un séjour inoubliable ! Le riad est magnifique, la nourriture délicieuse et l\'accueil chaleureux. La chambre était superbe et le petit-déjeuner sur la terrasse est un pur bonheur. Nous reviendrons sans hésiter.', textAr: 'إقامة لا تنسى! الرياض رائع، الطعام لذيذ والترحيب حار. الغرفة كانت رائعة والفطور على التراس كان سعادة محضة. سنعود بدون تردد.' },
  { guestName: 'James Wilson', country: 'GB', rating: 5, text: 'Absolutely stunning riad. The attention to detail in the decor is incredible. The staff made us feel like family. The cooking class was a highlight of our trip to Morocco.', textFr: 'Riad absolument magnifique. L\'attention aux détails dans la décoration est incroyable. Le personnel nous a fait sentir comme en famille. Le cours de cuisine était un moment fort de notre voyage au Maroc.', textAr: 'رياض جميل بشكل مذهل. الاهتمام بالتفاصيل في الديكور لا يصدق. جعلنا الموظفون نشعر وكأننا عائلة. كان درس الطبخ من أبرز محطات رحلتنا إلى المغرب.' },
  { guestName: 'Marie Dupont', country: 'FR', rating: 4, text: 'A true haven of peace in the heart of the medina. The rooms are superb and the location is perfect for exploring Asilah on foot.', textFr: 'Un véritable havre de paix au cœur de la médina. Les chambres sont superbes et l\'emplacement est parfait pour explorer Asilah à pied.', textAr: 'ملاذ حقيقي للسلام في قلب المدينة. الغرف رائعة والموقع مثالي لاستكشاف أصيلة سيراً على الأقدام.' },
  { guestName: 'Hans Mueller', country: 'DE', rating: 5, text: 'Perfect location, beautiful rooms, and the most hospitable hosts. The rooftop terrace with sea view is breathtaking. We extended our stay twice!', textFr: 'Emplacement parfait, belles chambres et des hôtes très accueillants. La terrasse sur le toit avec vue sur la mer est à couper le souffle. Nous avons prolongé notre séjour deux fois !', textAr: 'موقع مثالي، غرف جميلة وأكثر المضيفين كرماً. التراس على السطح مع إطلالة على البحر يخطف الأنفاس. قمنا بتمديد إقامتنا مرتين!' },
  { guestName: 'Aisha Al-Farsi', country: 'AE', rating: 4, text: 'أجواء رائعة وضيافة ممتازة. الرياض جميل جداً والأسعار معقولة. الموقع ممتاز في قلب المدينة.', textFr: 'Ambiance merveilleuse et hospitalité excellente. Le riad est très beau et les prix sont raisonnables. L\'emplacement est excellent au cœur de la médina.', textAr: 'أجواء رائعة وضيافة ممتازة. الرياض جميل جداً والأسعار معقولة. الموقع ممتاز في قلب المدينة.' },
  { guestName: 'Emma & Tom', country: 'AU', rating: 5, text: 'We fell in love with Asilah and this riad made our stay perfect. The hammam experience was truly authentic. Already planning our return trip.', textFr: 'Nous sommes tombés amoureux d\'Asilah et ce riad a rendu notre séjour parfait. L\'expérience du hammam était vraiment authentique. Nous planifions déjà notre retour.', textAr: 'وقعنا في حب أصيلة وهذا الرياض جعل إقامتنا مثالية. تجربة الحمام كانت أصيلة حقاً. نخطط بالفعل لرحلة العودة.' },
  { guestName: 'Pierre Lefevre', country: 'CA', rating: 5, text: 'The authentic charm of a Moroccan riad with all the modern comforts. Fatima and Ahmed are exceptional hosts.', textFr: 'Le charme authentique d\'un riad marocain avec tout le confort moderne. Fatima et Ahmed sont des hôtes exceptionnels.', textAr: 'السحر الأصيل للرياض المغربي مع كل وسائل الراحة الحديثة. فاطمة وأحمد مضيفان استثنائيان.' },
  { guestName: 'Sarah & David', country: 'US', rating: 5, text: 'The most beautiful riad we\'ve ever stayed in. Every corner is Instagram-worthy. The staff went above and beyond for our anniversary.', textFr: 'Le plus beau riad où nous ayons jamais séjourné. Chaque coin est digne d\'Instagram. Le personnel s\'est surpassé pour notre anniversaire.', textAr: 'أجمل رياض أقمنا فيه على الإطلاق. كل زاوية تستحق التصوير. الموظفون بذلوا قصارى جهدهم بمناسبة ذكرى زواجنا.' }
];

const galleryImages = [
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Interior patio with fountain', captionFr: 'Patio intérieur avec fontaine', captionAr: 'فناء داخلي مع نافورة', order: 1 },
  { url: 'https://images.unsplash.com/photo-1590496794008-383c8070b257?w=800', caption: 'Traditional Moroccan decoration', captionFr: 'Décoration marocaine traditionnelle', captionAr: 'ديكور مغربي تقليدي', order: 2 },
  { url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800', caption: 'Riad courtyard', captionFr: 'Cour du riad', captionAr: 'فناء الرياض', order: 3 },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', caption: 'Blue and white alleys of Asilah', captionFr: "Ruelles bleues et blanches d'Asilah", captionAr: 'أزقة أصيلة الزرقاء والبيضاء', order: 4 },
  { url: 'https://images.unsplash.com/photo-1590496794008-383c8070b257?w=800', caption: 'Traditional Moroccan zellige', captionFr: 'Zellige traditionnel marocain', captionAr: 'الزليج المغربي التقليدي', order: 5 },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Panoramic rooftop with sea view', captionFr: 'Terrasse panoramique avec vue mer', captionAr: 'تراس بانورامي مع إطلالة بحرية', order: 6 },
  { url: 'https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=800', caption: 'Asilah at night', captionFr: 'Asilah la nuit', captionAr: 'أصيلة ليلاً', order: 7 },
  { url: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800', caption: 'Atlantic coast from the medina', captionFr: "Côte atlantique depuis la médina", captionAr: 'الساحل الأطلسي من المدينة', order: 8 },
  { url: 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800', caption: 'Moroccan breakfast on the terrace', captionFr: 'Petit-déjeuner marocain sur la terrasse', captionAr: 'فطور مغربي على التراس', order: 9 }
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

  // Rooms - skip if already have data (don't wipe existing)
  const roomCount = await Room.countDocuments();
  if (roomCount === 0) {
    await Room.insertMany(rooms);
    console.log(`✓ ${rooms.length} rooms inserted`);
  } else {
    console.log(`→ ${roomCount} rooms already exist, skipping`);
  }

  // Testimonials
  const testimonialCount = await Testimonial.countDocuments();
  if (testimonialCount === 0) {
    await Testimonial.insertMany(testimonials);
    console.log(`✓ ${testimonials.length} testimonials inserted`);
  } else {
    console.log(`→ ${testimonialCount} testimonials already exist, skipping`);
  }

  // Gallery
  const galleryCount = await GalleryImage.countDocuments();
  if (galleryCount === 0) {
    await GalleryImage.insertMany(galleryImages);
    console.log(`✓ ${galleryImages.length} gallery images inserted`);
  } else {
    console.log(`→ ${galleryCount} gallery images already exist, skipping`);
  }

  await mongoose.disconnect();
  console.log('\n✓ All seed data loaded!');
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
