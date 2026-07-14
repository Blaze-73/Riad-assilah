import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../../services/api.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

const today = () => new Date().toISOString().slice(0, 10);

export default function AdminDashboard() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [inquiries, setInquiries] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmAction, setConfirmAction] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      api.get('/inquiries', { headers }).then(r => setInquiries(r.data)).catch(() => {}),
      api.get('/bookings', { headers }).then(r => setBookings(r.data)).catch(() => {}),
      api.get('/rooms').then(r => setRooms(r.data)).catch(() => {})
    ]).finally(() => setLoading(false));
  }, []);

  const updateStatus = async (id, status, type) => {
    await api.patch(`/${type}/${id}`, { status }, { headers });
    setConfirmAction(null);
    const [inqRes, bkRes] = await Promise.all([
      api.get('/inquiries', { headers }),
      api.get('/bookings', { headers })
    ]);
    setInquiries(inqRes.data);
    setBookings(bkRes.data);
  };

  const todayStr = today();
  const todayCheckIns = bookings.filter(b => b.checkIn === todayStr);
  const todayCheckOuts = bookings.filter(b => b.checkOut === todayStr);

  const pendingInquiries = inquiries.filter(i => i.status === 'pending').length;
  const pendingBookings = bookings.filter(b => b.status === 'new').length;
  const confirmedInquiries = inquiries.filter(i => i.status === 'confirmed').length;
  const confirmedBookings = bookings.filter(b => b.status === 'confirmed').length;

  const occupiedByRange = rooms.filter(r =>
    (r.unavailableRanges || []).some(range => todayStr >= range.start && todayStr <= range.end)
  ).length;
  const occupiedByBooking = new Set(
    bookings.filter(b => b.status === 'confirmed' && b.checkIn <= todayStr && b.checkOut >= todayStr).map(b => b.roomName)
  ).size;
  const occupiedCount = occupiedByRange + occupiedByBooking;

  const stats = [
    { label: 'Total inquiries', value: inquiries.length, color: 'from-ocean to-ocean/80', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
    { label: 'Pending', value: pendingInquiries + pendingBookings, color: 'from-yellow-500 to-yellow-400', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Confirmed', value: confirmedInquiries + confirmedBookings, color: 'from-green-500 to-green-400', icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z' },
    { label: 'Bookings', value: bookings.length, color: 'from-terracotta to-terracotta/80', icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
    { label: 'Occupied rooms', value: occupiedCount, color: 'from-red-500 to-red-400', icon: 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z' },
  ];

  return (
    <div className="pt-2">
      <ConfirmDialog
        open={!!confirmAction}
        title="Change status"
        message={`Change this booking to "${confirmAction?.status}"?`}
        confirmLabel="Confirm"
        variant="primary"
        onConfirm={() => updateStatus(confirmAction.id, confirmAction.status, confirmAction.type)}
        onCancel={() => setConfirmAction(null)}
      />

      <h1 className="font-serif text-2xl md:text-3xl text-ocean mb-1">{t('admin_dashboard_title')}</h1>
      <p className="text-ocean/50 text-sm mb-6">{t('admin_dashboard_welcome')}</p>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {stats.map(stat => (
          <div key={stat.label} className={`rounded-xl p-4 bg-gradient-to-br ${stat.color} shadow-sm text-warmwhite`}>
            <svg className="w-5 h-5 mb-3 text-warmwhite/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={stat.icon} />
            </svg>
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="text-xs text-warmwhite/70 mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Today's activity */}
      {(todayCheckIns.length > 0 || todayCheckOuts.length > 0) && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {todayCheckIns.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-ocean/5">
              <h2 className="text-sm font-semibold text-ocean mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full" />
                Check-ins today ({todayCheckIns.length})
              </h2>
              <div className="space-y-2">
                {todayCheckIns.map(b => (
                  <div key={b._id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ocean">{b.guestName}</span>
                    <span className="text-ocean/50">{b.roomName || '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {todayCheckOuts.length > 0 && (
            <div className="bg-white rounded-xl p-4 shadow-sm border border-ocean/5">
              <h2 className="text-sm font-semibold text-ocean mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-red-400 rounded-full" />
                Check-outs today ({todayCheckOuts.length})
              </h2>
              <div className="space-y-2">
                {todayCheckOuts.map(b => (
                  <div key={b._id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-ocean">{b.guestName}</span>
                    <span className="text-ocean/50">{b.roomName || '-'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Occupied rooms */}
      {occupiedCount > 0 && (
        <div className="mb-8">
          <h2 className="font-semibold text-lg text-ocean mb-4">Occupied / unavailable rooms today</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.filter(b => b.status === 'confirmed' && b.checkIn <= todayStr && b.checkOut >= todayStr).map(b => (
              <div key={b._id} className="bg-white rounded-xl p-4 shadow-sm border border-green-200 border-l-4 border-l-green-500">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-ocean text-sm">{b.roomName || 'Room'}</h3>
                   <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Booked</span>
                </div>
                <p className="text-xs text-ocean/60">{b.guestName}</p>
                <p className="text-xs text-ocean/40">{b.checkIn} → {b.checkOut}</p>
              </div>
            ))}
            {rooms.filter(r => (r.unavailableRanges || []).some(range => todayStr >= range.start && todayStr <= range.end)).map(room => (
              <div key={room._id} className="bg-white rounded-xl p-4 shadow-sm border border-red-200 border-l-4 border-l-red-500">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-medium text-ocean text-sm">{room.name}</h3>
                  <span className="text-xs text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Unavailable</span>
                </div>
                {room.unavailableRanges.filter(r => todayStr >= r.start && todayStr <= r.end).map(r => (
                  <p key={r._id} className="text-xs text-ocean/40">{r.start} → {r.end}{r.note ? ` (${r.note})` : ''}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bookings */}
      <h2 className="font-semibold text-lg text-ocean mb-4">Recent bookings</h2>
      {loading ? (
        <div className="h-20 bg-white rounded-xl animate-pulse border border-ocean/5 mb-8" />
      ) : bookings.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-ocean/5 mb-8">
          <p className="text-ocean/40">No reservations at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-ocean/5 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ocean text-warmwhite">
                  <th scope="col" className="px-4 py-3 text-left font-medium">Client</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium hidden sm:table-cell">Room</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium hidden md:table-cell">Check-in</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium hidden md:table-cell">Check-out</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">Status</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean/5">
                {bookings.slice(0, 10).map(b => (
                  <tr key={b._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3">
                      <span className="font-medium text-ocean block">{b.guestName}</span>
                      <span className="text-ocean/40 text-xs">{b.email}</span>
                    </td>
                    <td className="px-4 py-3 text-ocean/60 hidden sm:table-cell">{b.roomName || '-'}</td>
                    <td className="px-4 py-3 text-ocean/60 hidden md:table-cell">{b.checkIn ? new Date(b.checkIn).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 text-ocean/60 hidden md:table-cell">{b.checkOut ? new Date(b.checkOut).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        b.status === 'confirmed' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                        b.status === 'cancelled' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' :
                        b.status === 'new' ? 'bg-blue-50 text-blue-700 ring-1 ring-blue-200' :
                        'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          b.status === 'confirmed' ? 'bg-green-500' :
                          b.status === 'cancelled' ? 'bg-red-500' :
                          b.status === 'new' ? 'bg-blue-500' :
                          'bg-yellow-500'
                        }`} />
                        {b.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1.5 justify-end">
                        {b.status !== 'confirmed' && (
                          <button onClick={() => setConfirmAction({ id: b._id, status: 'confirmed', type: 'bookings' })}
                            className="px-2.5 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                            Confirm
                          </button>
                        )}
                        {b.status !== 'cancelled' && (
                          <button onClick={() => setConfirmAction({ id: b._id, status: 'cancelled', type: 'bookings' })}
                            className="px-2.5 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Inquiries */}
      <h2 className="font-semibold text-lg text-ocean mb-4">{t('admin_inquiries')}</h2>
      {loading ? (
        <div className="h-20 bg-white rounded-xl animate-pulse border border-ocean/5" />
      ) : inquiries.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-ocean/5">
          <p className="text-ocean/40">No booking requests at the moment.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-ocean/5 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-ocean text-warmwhite">
                  <th scope="col" className="px-4 py-3 text-left font-medium">{t('contact_name')}</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium hidden md:table-cell">{t('contact_email')}</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium hidden sm:table-cell">{t('contact_checkin')}</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium hidden sm:table-cell">{t('contact_checkout')}</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium hidden lg:table-cell">{t('contact_guests')}</th>
                  <th scope="col" className="px-4 py-3 text-left font-medium">{t('admin_inquiries_status')}</th>
                  <th scope="col" className="px-4 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ocean/5">
                {inquiries.map(inq => (
                  <tr key={inq._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-ocean">{inq.guestName}</td>
                    <td className="px-4 py-3 text-ocean/60 hidden md:table-cell">{inq.email}</td>
                    <td className="px-4 py-3 text-ocean/60 hidden sm:table-cell">{inq.checkIn ? new Date(inq.checkIn).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 text-ocean/60 hidden sm:table-cell">{inq.checkOut ? new Date(inq.checkOut).toLocaleDateString() : '-'}</td>
                    <td className="px-4 py-3 text-ocean/60 hidden lg:table-cell">{inq.guests || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                        inq.status === 'confirmed' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                        inq.status === 'cancelled' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' :
                        'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-200'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          inq.status === 'confirmed' ? 'bg-green-500' :
                          inq.status === 'cancelled' ? 'bg-red-500' :
                          'bg-yellow-500'
                        }`} />
                        {inq.status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex gap-1.5 justify-end">
                        {inq.status !== 'confirmed' && (
                          <button onClick={() => setConfirmAction({ id: inq._id, status: 'confirmed', type: 'inquiries' })}
                            className="px-2.5 py-1.5 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors"
                            aria-label={`Confirm booking for ${inq.guestName}`}>
                            {t('admin_inquiries_confirmed')}
                          </button>
                        )}
                        {inq.status !== 'cancelled' && (
                          <button onClick={() => setConfirmAction({ id: inq._id, status: 'cancelled', type: 'inquiries' })}
                            className="px-2.5 py-1.5 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors"
                            aria-label={`Cancel booking for ${inq.guestName}`}>
                            {t('admin_inquiries_cancelled')}
                          </button>
                        )}
                        {inq.status !== 'pending' && (
                          <button onClick={() => setConfirmAction({ id: inq._id, status: 'pending', type: 'inquiries' })}
                            className="px-2.5 py-1.5 bg-yellow-50 text-yellow-700 rounded-lg text-xs font-medium hover:bg-yellow-100 transition-colors"
                            aria-label={`Set booking back to pending for ${inq.guestName}`}>
                            {t('admin_inquiries_pending')}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
