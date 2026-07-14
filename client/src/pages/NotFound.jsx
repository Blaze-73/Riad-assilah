import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="pt-24 pb-20 px-4 min-h-[60vh] flex items-center justify-center">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-6xl text-ocean mb-4">404</h1>
        <h2 className="font-serif text-3xl text-ocean mb-4">{t('notfound_title')}</h2>
        <p className="text-ocean/70 mb-8 max-w-md mx-auto">{t('notfound_message')}</p>
        <Link
          to="/"
          className="inline-block px-6 py-3 bg-terracotta text-white rounded-md font-medium hover:bg-gold transition-colors"
        >
          {t('notfound_back')}
        </Link>
      </motion.div>
    </div>
  );
}
