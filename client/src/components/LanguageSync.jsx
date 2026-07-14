import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

export default function LanguageSync() {
  const { i18n } = useTranslation();

  useEffect(() => {
    const lang = i18n.language || 'fr';
    const dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [i18n.language]);

  return null;
}
