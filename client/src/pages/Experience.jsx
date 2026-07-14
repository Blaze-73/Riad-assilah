import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const experiences = [
  {
    key: 'medina',
    image: 'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
    color: 'from-ocean/80'
  },
  {
    key: 'beach',
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
    color: 'from-ocean/60'
  },
  {
    key: 'hammam',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbec6d?w=800',
    color: 'from-terracotta/60'
  },
  {
    key: 'cooking',
    image: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=800',
    color: 'from-gold/60'
  }
];

export default function Experience() {
  const { t } = useTranslation();

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-20"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-4xl md:text-6xl text-ocean mb-4">{t('experience_title')}</h1>
      </motion.div>

      <div className="space-y-24">
        {experiences.map((exp, i) => (
          <motion.div
            key={exp.key}
            className={`grid md:grid-cols-2 gap-12 md:gap-20 items-center`}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.6 }}
          >
            <div className={`${i % 2 === 1 ? 'md:order-2' : ''}`}>
              <div className="relative">
                <img
                  src={exp.image}
                  alt={t(`experience_${exp.key}_title`)}
                  loading="lazy"
                  className="w-full h-80 object-cover rounded-2xl shadow-lg"
                />
                <div className={`absolute -bottom-4 -right-4 w-24 h-24 rounded-2xl bg-gradient-to-br ${exp.color} opacity-20 -z-10`} />
              </div>
            </div>
            <div className={i % 2 === 1 ? 'md:order-1' : ''}>
              <span className="text-terracotta text-sm font-medium uppercase tracking-widest">
                {String(i + 1).padStart(2, '0')}
              </span>
              <h2 className="font-serif text-3xl md:text-4xl text-ocean mt-3 mb-6 leading-tight">
                {t(`experience_${exp.key}_title`)}
              </h2>
              <p className="text-ocean/70 leading-relaxed text-lg">{t(`experience_${exp.key}_desc`)}</p>
              <div className={`w-16 h-0.5 mt-8 ${i % 2 === 0 ? 'bg-terracotta' : 'bg-gold'}`} />
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
