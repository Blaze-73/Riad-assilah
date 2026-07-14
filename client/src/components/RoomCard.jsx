import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RoomDetail from './RoomDetail.jsx';

export default function RoomCard({ room, index = 0 }) {
  const { t } = useTranslation();
  const [detailOpen, setDetailOpen] = useState(false);

  return (
    <>
      <motion.div
        className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-500 cursor-pointer"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-50px' }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        onClick={() => setDetailOpen(true)}
        role="button"
        tabIndex={0}
        aria-label={`View details for ${room.name}`}
        onKeyDown={(e) => { if (e.key === 'Enter') setDetailOpen(true); }}
      >
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={room.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600'}
            alt={room.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-ocean/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          {room.pricePerNight && (
            <div className="absolute top-4 right-4 bg-terracotta text-white text-xs font-medium px-3 py-1 rounded-full">
              {room.pricePerNight} MAD
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
            <span className="px-6 py-2 bg-warmwhite text-ocean rounded-full text-sm font-medium">
              View details
            </span>
          </div>
        </div>
        <div className="p-5">
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
        </div>
      </motion.div>

      {detailOpen && <RoomDetail room={room} onClose={() => setDetailOpen(false)} />}
    </>
  );
}
