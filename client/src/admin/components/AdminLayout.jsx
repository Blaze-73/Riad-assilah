import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';
import Footer from '../../components/Footer.jsx';

const navItems = [
  { to: '/admin', label: 'admin_dashboard_title', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { to: '/admin/rooms', label: 'admin_rooms', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
  { to: '/admin/bookings', label: 'admin_bookings', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
  { to: '/admin/testimonials', label: 'admin_testimonials', icon: 'M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z' },
  { to: '/admin/gallery', label: 'admin_gallery', icon: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' }
];

export default function AdminLayout() {
  const { t } = useTranslation();
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
    setShowLogoutConfirm(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e2edf5] via-[#eef4f8] to-[#f5f9fc]">
      <ConfirmDialog
        open={showLogoutConfirm}
        title="Logout"
        message="Are you sure you want to log out?"
        confirmLabel="Logout"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutConfirm(false)}
      />

      {/* Mobile sidebar toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="md:hidden fixed top-20 right-4 z-50 w-10 h-10 bg-ocean text-warmwhite rounded-xl shadow-lg flex items-center justify-center hover:bg-ocean/90 transition-colors"
        aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={mobileOpen}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/40 z-30"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0 fixed top-0 md:top-20 left-0 z-40 w-64 bg-ocean text-warmwhite p-6 flex flex-col shadow-xl transition-transform duration-300 h-full md:h-[calc(100vh-80px)]`}
        aria-label="Admin navigation"
      >
        <Link to="/" className="font-serif text-2xl mb-8 block hover:text-gold transition-colors">
          {t('site_title')}
        </Link>
        <nav className="flex-1 space-y-1 overflow-y-auto" role="navigation">
          {navItems.map(item => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                location.pathname === item.to
                  ? 'bg-warmwhite/15 text-gold'
                  : 'text-warmwhite/70 hover:bg-warmwhite/10 hover:text-warmwhite'
              }`}
              aria-current={location.pathname === item.to ? 'page' : undefined}
            >
              <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={item.icon} />
              </svg>
              {t(item.label)}
            </Link>
          ))}
        </nav>
        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium text-warmwhite/70 hover:bg-red-500/20 hover:text-red-300 transition-all mt-4"
          aria-label="Logout"
        >
          <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          {t('admin_logout')}
        </button>
      </aside>

      {/* Main content + footer */}
      <div className="md:ml-64 flex flex-col min-h-screen">
        <main className="pt-24 p-4 md:p-8 flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
