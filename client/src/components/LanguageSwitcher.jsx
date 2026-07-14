import { useTranslation } from 'react-i18next';

export default function LanguageSwitcher({ transparent }) {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'fr', label: 'FR' },
    { code: 'en', label: 'EN' },
    { code: 'ar', label: 'AR' }
  ];

  return (
    <div className="flex items-center gap-1">
      {languages.map((lang, i) => (
        <div key={lang.code} className="flex items-center">
          <button
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`text-xs font-medium px-2 py-1 rounded transition-all ${
              i18n.language?.startsWith(lang.code)
                ? transparent
                  ? 'bg-warmwhite/20 text-warmwhite'
                  : 'bg-ocean text-warmwhite'
                : transparent
                  ? 'text-warmwhite/60 hover:text-warmwhite'
                  : 'text-ocean/50 hover:text-ocean'
            }`}
          >
            {lang.label}
          </button>
          {i < languages.length - 1 && (
            <span className={`mx-1 ${transparent ? 'text-warmwhite/30' : 'text-ocean/20'}`}>|</span>
          )}
        </div>
      ))}
    </div>
  );
}
