import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';
import api from '../services/api.js';

const masonryHeights = [280, 340, 260, 320, 300, 260, 340, 280, 300];

export default function Gallery() {
  const { t, i18n } = useTranslation();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : 'en';
    api.get(`/gallery?lang=${lang}`)
      .then(res => setImages(res.data.map(i => ({ src: i.url, caption: i.caption, _id: i._id }))))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [i18n.language]);

  const openLightbox = useCallback((i) => {
    setIndex(i);
    setOpen(true);
  }, []);

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-4xl md:text-6xl text-ocean mb-4">{t('gallery_title')}</h1>
        <p className="text-ocean/60 max-w-xl mx-auto">{t('gallery_description')}</p>
        {error && <p className="text-xs text-red-400 mt-2">⚡ API unavailable</p>}
      </motion.div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-gray-100 rounded-2xl animate-pulse" style={{ height: masonryHeights[i] }} />
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-ocean/40 text-lg">No images at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
          {images.map((img, i) => (
            <motion.button
              key={img._id || i}
              onClick={() => openLightbox(i)}
              className="group relative overflow-hidden rounded-2xl cursor-pointer"
              style={{ height: masonryHeights[i % masonryHeights.length] }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
            >
              <img
                src={img.src}
                alt={img.caption || ''}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-ocean/0 group-hover:bg-ocean/50 transition-all duration-500 rounded-2xl" />
              {img.caption && (
                <div className="absolute inset-0 flex items-end p-5 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <span className="text-warmwhite text-sm font-medium">{img.caption}</span>
                </div>
              )}
            </motion.button>
          ))}
        </div>
      )}

      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={index}
        slides={images.map(i => ({ src: i.src, alt: i.caption }))}
      />
    </div>
  );
}
