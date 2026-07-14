import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import api from '../services/api.js';

const countryFlags = {
  FR: '🇫🇷', GB: '🇬🇧', DE: '🇩🇪', AE: '🇦🇪', AU: '🇦🇺', US: '🇺🇸', CA: '🇨🇦', ES: '🇪🇸', IT: '🇮🇹', NL: '🇳🇱', BE: '🇧🇪', CH: '🇨🇭'
};

export default function Testimonials() {
  const { t, i18n } = useTranslation();
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : 'en';
    api.get(`/testimonials?lang=${lang}`)
      .then(res => setTestimonials(res.data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-4xl md:text-6xl text-ocean mb-4">{t('testimonials_title')}</h1>
        <p className="text-ocean/60 max-w-xl mx-auto">{t('testimonials_subtitle')}</p>
        {error && (
          <p className="text-xs text-red-400 mt-2">⚡ API unavailable</p>
        )}
      </motion.div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-2xl animate-pulse border border-ocean/5">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-gray-100 rounded-full" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-100 rounded w-24" />
                  <div className="h-2 bg-gray-100 rounded w-16" />
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-gray-100 rounded w-full" />
                <div className="h-3 bg-gray-100 rounded w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : testimonials.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ocean/40 text-lg">No testimonials at the moment.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((item, i) => (
            <motion.div
              key={item._id}
              className="bg-white p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 border border-ocean/5"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center text-lg">
                  {countryFlags[item.country] || '🌍'}
                </div>
                <div>
                  <p className="font-semibold text-ocean text-sm">{item.guestName}</p>
                  <div className="flex">
                    {Array.from({ length: 5 }, (_, j) => (
                      <svg key={j} className={`w-3.5 h-3.5 ${j < item.rating ? 'text-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
              <p className="text-ocean/70 text-sm leading-relaxed">"{item.text}"</p>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
