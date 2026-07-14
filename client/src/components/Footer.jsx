import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from './LanguageSwitcher.jsx';

export default function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="bg-ocean text-warmwhite">
      <div className="max-w-7xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="md:col-span-2">
          <h3 className="font-serif text-3xl mb-4 text-warmwhite">Riad Asilah</h3>
          <p className="text-sm text-warmwhite/70 leading-relaxed max-w-md">
            {t('about_body')}
          </p>
          <div className="flex gap-4 mt-6">
            <a href="tel:+212539123456" className="text-warmwhite/60 hover:text-gold transition-colors" aria-label="Phone">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </a>
            <a href="https://wa.me/212612345678" target="_blank" rel="noopener noreferrer" className="text-warmwhite/60 hover:text-gold transition-colors" aria-label="WhatsApp">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.52 3.48A11.91 11.91 0 0012.04 0C5.5 0 .12 5.38 .12 11.92c0 2.1.55 4.16 1.6 5.97L0 24l6.27-1.64a11.92 11.92 0 005.77 1.48h.01c6.55 0 11.93-5.38 11.93-11.93 0-3.19-1.25-6.19-3.46-8.42zM12.04 21.56h-.01a9.65 9.65 0 01-4.91-1.34l-.35-.21-3.73.98 1-3.63-.23-.37a9.65 9.65 0 1118.26 5.62c0 5.31-4.33 9.65-9.93 9.65z" />
              </svg>
            </a>
            <a href="mailto:riad.asilah@example.com" className="text-warmwhite/60 hover:text-gold transition-colors" aria-label="Email">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-warmwhite">{t('footer_explore')}</h4>
          <ul className="space-y-3 text-sm">
            {[
              { to: '/about', label: 'nav_about' },
              { to: '/rooms', label: 'nav_rooms' },
              { to: '/gallery', label: 'nav_gallery' },
              { to: '/experience', label: 'nav_experience' },
              { to: '/testimonials', label: 'nav_testimonials' },
              { to: '/contact', label: 'nav_contact' }
            ].map(item => (
              <li key={item.to}>
                <Link to={item.to} className="text-warmwhite/60 hover:text-gold transition-colors">
                  {t(item.label)}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-warmwhite">{t('footer_language')}</h4>
          <LanguageSwitcher />
          <div className="mt-6">
            <p className="text-xs text-warmwhite/50 mb-2">{t('footer_address')}</p>
            <a
              href="https://goo.gl/maps/example"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2 bg-terracotta/20 text-terracotta hover:bg-terracotta hover:text-warmwhite rounded-lg text-sm font-medium transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('contact_map')}
            </a>
          </div>
        </div>
      </div>

      <div className="text-center text-xs py-6 border-t border-warmwhite/10 text-warmwhite/40 relative">
        <div className="flex items-center justify-center gap-2">
          &copy; {new Date().getFullYear()} Riad Asilah. {t('site_title')}
        </div>
      </div>
    </footer>
  );
}
