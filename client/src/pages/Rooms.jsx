import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import RoomCard from '../components/RoomCard.jsx';
import api from '../services/api.js';

export default function Rooms() {
  const { t } = useTranslation();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    api.get('/rooms')
      .then(res => setRooms(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-4xl md:text-6xl text-ocean mb-4">{t('rooms_title')}</h1>
        <p className="text-ocean/60 max-w-xl mx-auto leading-relaxed">{t('rooms_description')}</p>
        {error && (
          <p className="text-xs text-red-400 mt-2">
            ⚡ API unavailable — could not load data from the database
          </p>
        )}
        {!error && rooms.length === 0 && !loading && (
          <p className="text-xs text-ocean/40 mt-2">
            Database connected — no rooms at the moment
          </p>
        )}
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm animate-pulse">
              <div className="h-64 bg-gray-100" />
              <div className="p-5 space-y-3">
                <div className="h-5 bg-gray-100 rounded w-3/4" />
                <div className="h-3 bg-gray-100 rounded w-1/2" />
                <div className="h-3 bg-gray-100 rounded w-full" />
              </div>
            </div>
          ))}
        </div>
      ) : rooms.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ocean/40 text-lg">{error ? 'Unable to load rooms.' : 'No rooms available at the moment.'}</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.map((room, i) => <RoomCard key={room._id} room={room} index={i} />)}
        </div>
      )}
    </div>
  );
}
