import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import RoomCard from '../components/RoomCard.jsx';
import api from '../services/api.js';

const fadeUp = {
  initial: { opacity: 0, y: 40 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 }
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.5 }
  })
};

const heroWords = {
  en: ['Welcome', 'to', 'our', 'riad', 'hidden', 'in', 'Asilah'],
  fr: ['Bienvenue', 'dans', 'notre', 'riad', 'caché', 'dans', 'la', 'médina', "d'Asilah"]
};

const countryFlags = {
  FR: '🇫🇷', GB: '🇬🇧', DE: '🇩🇪', AE: '🇦🇪', AU: '🇦🇺', US: '🇺🇸', CA: '🇨🇦', ES: '🇪🇸', IT: '🇮🇹'
};

export default function Home() {
  const { t, i18n } = useTranslation();
  const { scrollYProgress } = useScroll();
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.05]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0.6]);

  const [rooms, setRooms] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    const lang = i18n.language?.startsWith('ar') ? 'ar' : i18n.language?.startsWith('fr') ? 'fr' : 'en';
    api.get(`/rooms?lang=${lang}`).then(r => setRooms(r.data)).catch(() => {});
    api.get(`/gallery?lang=${lang}`).then(r => setGallery(r.data)).catch(() => {});
    api.get(`/testimonials?lang=${lang}`).then(r => setTestimonials(r.data)).catch(() => {});
  }, [i18n.language]);

  const showRooms = rooms.length > 0;
  const showGallery = gallery.length > 0;
  const showTestimonials = testimonials.length > 0;

  return (
    <>
      {/* ─── HERO ─── */}
      <motion.section
        className="relative h-screen flex items-center justify-center overflow-hidden"
        style={{ scale: heroScale, opacity: heroOpacity }}
      >
        <div className="absolute inset-0 bg-ocean" />
        <div
          className="absolute inset-0 bg-cover bg-center opacity-60"
          style={{ backgroundImage: "url('/images/hero.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ocean/40 via-transparent to-ocean/70" />

        <div className="relative z-10 text-center px-4 max-w-5xl">
          <motion.h1
            className="font-serif text-5xl md:text-7xl lg:text-8xl text-warmwhite mb-6 leading-tight"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            {(i18n.language?.startsWith('ar') ? (
              <motion.span
                custom={0}
                variants={staggerItem}
                initial="hidden"
                animate="visible"
              >
                {t('site_title')}
              </motion.span>
            ) : (
              (heroWords[i18n.language?.startsWith('fr') ? 'fr' : 'en']).map((word, i) => (
                <motion.span
                  key={i}
                  className="inline-block mr-[0.25em]"
                  custom={i}
                  variants={staggerItem}
                  initial="hidden"
                  animate="visible"
                >
                  {word}
                </motion.span>
              ))
            ))}
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-warmwhite/80 mb-10 max-w-2xl mx-auto font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
          >
            {t('hero_subtitle')}
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.6 }}
          >
            <Link to="/rooms" className="px-8 py-3 bg-terracotta text-white rounded-full text-sm font-medium hover:bg-gold transition-colors tracking-wide">
              {t('nav_rooms')}
            </Link>
            <Link to="/contact" className="px-8 py-3 border border-warmwhite/40 text-warmwhite rounded-full text-sm font-medium hover:bg-warmwhite/10 transition-colors tracking-wide">
              {t('nav_contact')}
            </Link>
          </motion.div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.6 }}
        >
          <motion.svg
            className="w-6 h-6 text-warmwhite/60"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </motion.svg>
        </motion.div>
      </motion.section>

      {/* ─── ABOUT ─── */}
      <section className="py-24 px-4 max-w-7xl mx-auto">
        <motion.div className="grid md:grid-cols-2 gap-16 items-center" {...fadeUp}>
          <div>
            <h2 className="font-serif text-4xl md:text-5xl text-ocean mb-6 leading-tight">{t('about_title')}</h2>
            <p className="text-ocean/70 leading-relaxed mb-6">{t('about_body')}</p>
            <Link to="/about" className="inline-flex items-center gap-2 text-terracotta font-medium hover:text-gold transition-colors group">
              {t('nav_about')} <span className="inline-block transition-transform group-hover:translate-x-1">&rarr;</span>
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=500" alt="Riad" loading="lazy" className="rounded-2xl h-72 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=500" alt="Asilah" loading="lazy" className="rounded-2xl h-40 w-full object-cover" />
            </div>
            <div className="space-y-4 pt-8">
              <img src="https://images.unsplash.com/photo-1590496794008-383c8070b257?w=500" alt="Decor" loading="lazy" className="rounded-2xl h-48 w-full object-cover" />
              <img src="https://images.unsplash.com/photo-1590073242678-70ee3fc28e8e?w=500" alt="Courtyard" loading="lazy" className="rounded-2xl h-64 w-full object-cover" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── EXPERIENCES ─── */}
      <section className="py-24 bg-gradient-to-br from-[#eef4f8]/40 to-[#f5f9fc]/40">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="font-serif text-4xl md:text-5xl text-ocean mb-4">{t('experience_title')}</h2>
            <p className="text-ocean/60 max-w-xl mx-auto">{t('rooms_description')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { key: 'medina', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
              { key: 'beach', icon: 'M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z' },
              { key: 'food', icon: 'M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4' },
              { key: 'sunset', icon: 'M21 12a9 9 0 11-18 0 9 9 0 0118 0z M12 8v4l3 3 M17.65 6.35a7.99 7.99 0 010 11.3 M6.35 6.35a7.99 7.99 0 000 11.3' }
            ].map((item, i) => (
              <motion.div
                key={item.key}
                className="group bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="w-12 h-12 bg-terracotta/10 rounded-xl flex items-center justify-center mb-5 group-hover:bg-terracotta/20 transition-colors">
                  <svg className="w-6 h-6 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d={item.icon} />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-ocean mb-3">{t(`experience_${item.key}_title`)}</h3>
                <p className="text-sm text-ocean/60 leading-relaxed">{t(`experience_${item.key}_desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ROOMS ─── */}
      {showRooms && (
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="font-serif text-4xl md:text-5xl text-ocean mb-4">{t('rooms_title')}</h2>
            <p className="text-ocean/60 max-w-xl mx-auto">{t('rooms_description')}</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.slice(0, 6).map((room, i) => (
              <RoomCard key={room._id} room={room} index={i} />
            ))}
          </div>
          <motion.div className="text-center mt-12" {...fadeUp}>
            <Link to="/rooms" className="inline-flex items-center gap-2 px-8 py-3 border border-ocean/20 text-ocean rounded-full text-sm font-medium hover:bg-ocean/5 transition-colors">
              {t('nav_rooms')} <span>&rarr;</span>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ─── GALLERY ─── */}
      {showGallery && (
        <section className="py-24 bg-gradient-to-br from-[#eef4f8]/40 to-[#f5f9fc]/40">
          <div className="max-w-7xl mx-auto px-4">
            <motion.div className="text-center mb-16" {...fadeUp}>
              <h2 className="font-serif text-4xl md:text-5xl text-ocean mb-4">{t('gallery_title')}</h2>
              <p className="text-ocean/60 max-w-xl mx-auto">{t('gallery_description')}</p>
            </motion.div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {gallery.slice(0, 6).map((img, i) => (
                <motion.div
                  key={img._id || i}
                  className="overflow-hidden rounded-2xl"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-50px' }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <img
                    src={img.url}
                    alt={img.caption || ''}
                    loading="lazy"
                    className="w-full h-48 md:h-64 object-cover hover:scale-105 transition-transform duration-500"
                  />
                </motion.div>
              ))}
            </div>
            <motion.div className="text-center mt-12" {...fadeUp}>
              <Link to="/gallery" className="inline-flex items-center gap-2 px-8 py-3 border border-ocean/20 text-ocean rounded-full text-sm font-medium hover:bg-ocean/5 transition-colors">
                {t('nav_gallery')} <span>&rarr;</span>
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      {/* ─── TESTIMONIALS ─── */}
      {showTestimonials && (
        <section className="py-24 px-4 max-w-7xl mx-auto">
          <motion.div className="text-center mb-16" {...fadeUp}>
            <h2 className="font-serif text-4xl md:text-5xl text-ocean mb-4">{t('testimonials_title')}</h2>
            <p className="text-ocean/60 max-w-xl mx-auto">{t('testimonials_subtitle')}</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-6">
            {testimonials.slice(0, 3).map((item, i) => (
              <motion.div
                key={item._id}
                className="bg-white p-6 rounded-2xl shadow-sm border border-ocean/5"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-ocean/10 rounded-full flex items-center justify-center text-lg">
                    {countryFlags[item.country] || '🌍'}
                  </div>
                  <p className="font-semibold text-ocean text-sm">{item.guestName}</p>
                </div>
                <div className="flex mb-3">
                  {Array.from({ length: 5 }, (_, j) => (
                    <svg key={j} className={`w-3.5 h-3.5 ${j < item.rating ? 'text-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-ocean/70 leading-relaxed">"{item.text}"</p>
              </motion.div>
            ))}
          </div>
          <motion.div className="text-center mt-12" {...fadeUp}>
            <Link to="/testimonials" className="inline-flex items-center gap-2 px-8 py-3 border border-ocean/20 text-ocean rounded-full text-sm font-medium hover:bg-ocean/5 transition-colors">
              {t('nav_testimonials')} <span>&rarr;</span>
            </Link>
          </motion.div>
        </section>
      )}

      {/* ─── CTA ─── */}
      <section className="py-24 px-4 bg-ocean text-warmwhite">
        <motion.div
          className="max-w-3xl mx-auto text-center"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-serif text-3xl md:text-4xl mb-4">{t('contact_title')}</h2>
          <p className="text-warmwhite/60 mb-8 max-w-lg mx-auto">{t('contact_subtitle')}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/contact" className="px-8 py-3 bg-terracotta text-white rounded-full text-sm font-medium hover:bg-gold transition-colors">
              {t('nav_contact')}
            </Link>
            <a href="https://wa.me/212612345678?text=Hello%2C%20I%20would%20like%20to%20book." target="_blank" rel="noopener noreferrer" className="px-8 py-3 border border-warmwhite/30 text-warmwhite rounded-full text-sm font-medium hover:bg-warmwhite/10 transition-colors">
              {t('rooms_book')}
            </a>
          </div>
        </motion.div>
      </section>
    </>
  );
}
