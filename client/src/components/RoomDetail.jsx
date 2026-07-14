import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import BookingForm from './BookingForm.jsx';

export default function RoomDetail({ room, onClose }) {
  const { t } = useTranslation();
  const [showBooking, setShowBooking] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    modalRef.current?.focus();
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={room.name}
    >
      <motion.div
        ref={modalRef}
        tabIndex={-1}
        className="bg-warmwhite rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        onClick={e => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {!showBooking ? (
          <>
            <div className="relative">
              <img
                src={room.images?.[0] || 'https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800'}
                alt={room.name}
                className="w-full h-64 md:h-80 object-cover rounded-t-2xl"
              />
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 bg-warmwhite/90 rounded-full shadow-lg hover:bg-warmwhite transition-colors"
                aria-label="Close"
              >
                <svg className="w-5 h-5 text-ocean" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              {room.pricePerNight && (
                <div className="absolute top-4 left-4 bg-terracotta text-white px-3 py-1 rounded-full text-sm font-medium">
                  {room.pricePerNight} MAD / {t('rooms_per_night')}
                </div>
              )}
            </div>

            <div className="p-6 md:p-8">
              <h2 className="font-serif text-3xl text-ocean mb-2">{room.name}</h2>
              <p className="text-sm text-ocean/50 uppercase tracking-wider mb-4">
                {room.bedType} &middot; {room.capacity} {t('rooms_capacity')}
              </p>
              <p className="text-ocean/70 leading-relaxed mb-6">{room.description}</p>

              {room.amenities?.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-ocean mb-3">{t('rooms_amenities')}</h3>
                  <div className="flex flex-wrap gap-2">
                    {room.amenities.map(a => (
                      <span key={a} className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-ocean/10 rounded-full text-xs text-ocean/70">
                        <svg className="w-3.5 h-3.5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {a}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {room.images?.length > 1 && (
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-ocean mb-3">Gallery</h3>
                  <div className="grid grid-cols-3 gap-2">
                    {room.images.slice(1).map((img, i) => (
                      <img key={i} src={img} alt="" className="w-full h-20 object-cover rounded-lg" />
                    ))}
                  </div>
                </div>
              )}

              <button
                onClick={() => setShowBooking(true)}
                className="inline-flex items-center justify-center gap-2 w-full px-6 py-3 bg-terracotta text-white rounded-xl font-medium hover:bg-gold transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {t('rooms_book')}
              </button>
            </div>
          </>
        ) : (
          <BookingForm room={room} onClose={() => setShowBooking(false)} />
        )}
      </motion.div>
    </div>
  );
}
