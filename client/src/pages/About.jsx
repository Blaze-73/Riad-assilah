import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  return (
    <div className="pt-28 pb-24">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          className="grid md:grid-cols-2 gap-16 items-center"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="font-serif text-4xl md:text-6xl text-ocean mb-8 leading-tight">{t('about_title')}</h1>
            <p className="text-ocean/70 leading-relaxed mb-6 text-lg">{t('about_body')}</p>
            <p className="text-ocean/60 leading-relaxed mb-8">{t('about_body2')}</p>
            <div className="flex items-center gap-4 p-4 bg-warmwhite rounded-xl">
              <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center text-terracotta font-serif text-2xl">
                FB
              </div>
              <div>
                <p className="font-semibold text-ocean">Fatima & Ahmed Benali</p>
                <p className="text-sm text-ocean/50">Your hosts</p>
              </div>
            </div>
          </div>
          <div className="space-y-6">
            <motion.img
              src="https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800"
              alt="Riad interior"
              loading="lazy"
              className="rounded-2xl w-full h-96 object-cover"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            />
            <div className="grid grid-cols-2 gap-6">
              <motion.img
                src="https://images.unsplash.com/photo-1590496794008-383c8070b257?w=400"
                alt="Traditional decor"
                loading="lazy"
                className="rounded-2xl h-48 w-full object-cover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              />
              <motion.img
                src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=400"
                alt="Asilah streets"
                loading="lazy"
                className="rounded-2xl h-48 w-full object-cover"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.5 }}
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
