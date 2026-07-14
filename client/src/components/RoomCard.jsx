import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RoomDetail from './RoomDetail.jsx';
import ImageCarousel from './ImageCarousel.jsx';

const placeholder = 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600';
const images = (room) => room.images?.length ? room.images : [placeholder];

export default function RoomCard({ room, index = 0 }) {
  const { t } = useTranslation();
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <motion.div
        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
      >
        <div className="relative aspect-[4/3]">
          {room.images?.length > 1 ? (
            <ImageCarousel
              images={room.images}
              alt={room.name}
              className="h-full"
              thumbnail
            />
          ) : (
            <img
              src={room.images?.[0] || placeholder}
              alt={room.name}
              loading="lazy"
              className="w-full h-full object-cover"
            />
          )}
          {room.pricePerNight && (
            <div className="absolute top-3 right-3 z-10 bg-terracotta text-white text-xs font-medium px-3 py-1 rounded-full">
              {room.pricePerNight} MAD
            </div>
          )}
          <button
            onClick={() => setDetailOpen(true)}
            className="absolute inset-0 z-10 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-500 bg-ocean/0 hover:bg-ocean/30"
            aria-label={`View details for ${room.name}`}
          >
            <span className="px-6 py-2 bg-warmwhite text-ocean rounded-full text-sm font-medium translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              View details
            </span>
          </button>
        </div>
        <button
          onClick={() => setDetailOpen(true)}
          className="w-full text-left p-5 cursor-pointer"
        >
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-serif text-xl text-ocean">{room.name}</h3>
          </div>
          <p className="text-xs text-ocean/50 uppercase tracking-wider mb-2">
            {room.bedType} &middot; {room.capacity} {t('rooms_capacity')}
          </p>
          <p className="text-sm text-ocean/70 leading-relaxed line-clamp-2">{room.description}</p>
          {room.amenities?.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {room.amenities.slice(0, 3).map(a => (
                <span key={a} className="text-xs bg-warmwhite text-ocean/60 px-2 py-0.5 rounded-full">{a}</span>
              ))}
            </div>
          )}
        </button>
      </motion.div>

      {detailOpen && <RoomDetail room={room} onClose={() => setDetailOpen(false)} />}
    </>
  );
}
