import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import api from '../services/api.js';

export default function Contact() {
  const { t } = useTranslation();
  const { register, handleSubmit, reset, watch, formState: { errors } } = useForm();
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const todayStr = useMemo(() => new Date().toISOString().slice(0, 10), []);
  const checkIn = watch('checkIn');

  const onSubmit = async (data) => {
    if (data.checkIn && data.checkIn < todayStr) {
      setError("Check-in date cannot be in the past.");
      return;
    }
    if (data.checkIn && data.checkOut && data.checkOut <= data.checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }
    setLoading(true);
    setError(false);
    try {
      await api.post('/inquiries', data);
      setSubmitted(true);
      reset();
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-28 pb-24 px-4 max-w-7xl mx-auto">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="font-serif text-4xl md:text-6xl text-ocean mb-4">{t('contact_title')}</h1>
        <p className="text-ocean/60 max-w-xl mx-auto">{t('contact_subtitle')}</p>
      </motion.div>

      <div className="grid md:grid-cols-5 gap-12 max-w-5xl mx-auto">
        <motion.div
          className="md:col-span-3"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          {submitted ? (
            <div className="bg-green-50 border border-green-200 text-green-700 p-8 rounded-2xl text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-lg font-medium">{t('contact_success')}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="grid grid-cols-2 gap-5">
                <div>
                  <input
                    {...register('guestName', { required: true })}
                    placeholder={t('contact_name')}
                    className="w-full px-4 py-3.5 bg-white border border-ocean/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all text-sm"
                  />
                  {errors.guestName && <p className="text-red-400 text-xs mt-1">Required</p>}
                </div>
                <div>
                  <input
                    {...register('email', { required: true, pattern: /^\S+@\S+$/i })}
                    placeholder={t('contact_email')}
                    type="email"
                    className="w-full px-4 py-3.5 bg-white border border-ocean/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all text-sm"
                  />
                  {errors.email && <p className="text-red-400 text-xs mt-1">Required</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-5">
                <input
                  {...register('checkIn')}
                  placeholder={t('contact_checkin')}
                  type="date"
                  min={todayStr}
                  className="w-full px-4 py-3.5 bg-white border border-ocean/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all text-sm"
                />
                <input
                  {...register('checkOut')}
                  placeholder={t('contact_checkout')}
                  type="date"
                  min={checkIn || todayStr}
                  className="w-full px-4 py-3.5 bg-white border border-ocean/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all text-sm"
                />
              </div>
              <div>
                <input
                  {...register('guests')}
                  placeholder={t('contact_guests')}
                  type="number"
                  min="1"
                  className="w-full px-4 py-3.5 bg-white border border-ocean/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all text-sm"
                />
              </div>
              <textarea
                {...register('message')}
                placeholder={t('contact_message')}
                rows={4}
                className="w-full px-4 py-3.5 bg-white border border-ocean/10 rounded-xl focus:outline-none focus:ring-2 focus:ring-terracotta/30 focus:border-terracotta transition-all text-sm resize-none"
              />
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3.5 bg-terracotta text-white rounded-xl font-medium hover:bg-gold transition-colors disabled:opacity-50 tracking-wide"
              >
                {loading ? 'Sending...' : t('contact_submit')}
              </button>
              {error && <p className="text-red-400 text-sm text-center">{t('contact_error')}</p>}
            </form>
          )}
        </motion.div>

        <motion.div
          className="md:col-span-2 space-y-6"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-ocean/5">
            <h3 className="font-serif text-xl text-ocean mb-6">{t('nav_contact')}</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-ocean/70 text-sm">
                <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <span dir="ltr">+212 621-010978</span>
              </div>
              <div className="flex items-center gap-4 text-ocean/70 text-sm">
                <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <span>riad.asilah@example.com</span>
              </div>
              <div className="flex items-start gap-4 text-ocean/70 text-sm">
                <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center shrink-0 mt-0.5">
                  <svg className="w-5 h-5 text-terracotta" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <span>{t('footer_address')}</span>
              </div>
            </div>
          </div>

          <a
            href="https://wa.me/212621010978?text=Hi%21%20I%20would%20like%20to%20book%20a%20room."
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-3 w-full px-6 py-3.5 bg-green-500 text-white rounded-xl font-medium hover:bg-green-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M20.52 3.48A11.91 11.91 0 0012.04 0C5.5 0 .12 5.38 .12 11.92c0 2.1.55 4.16 1.6 5.97L0 24l6.27-1.64a11.92 11.92 0 005.77 1.48h.01c6.55 0 11.93-5.38 11.93-11.93 0-3.19-1.25-6.19-3.46-8.42zM12.04 21.56h-.01a9.65 9.65 0 01-4.91-1.34l-.35-.21-3.73.98 1-3.63-.23-.37a9.65 9.65 0 1118.26 5.62c0 5.31-4.33 9.65-9.93 9.65z" />
            </svg>
            {t('rooms_book')}
          </a>
        </motion.div>
      </div>
    </div>
  );
}
