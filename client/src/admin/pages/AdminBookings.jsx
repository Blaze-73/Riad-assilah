import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../../services/api.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

export default function AdminBookings() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [confirmAction, setConfirmAction] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchBookings = () => api.get('/bookings', { headers }).then(res => setBookings(res.data));
  useEffect(() => { fetchBookings() }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/bookings/${id}`, { status }, { headers });
    setConfirmAction(null);
    fetchBookings();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/bookings/${deleteTarget}`, { headers });
    setDeleteTarget(null);
    fetchBookings();
  };

  return (
    <div>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete booking"
        message="Are you sure you want to delete this booking?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
      <ConfirmDialog
        open={!!confirmAction}
        title="Change status"
        message={`Change this booking to "${confirmAction?.status}"?`}
        confirmLabel="Confirm"
        variant="primary"
        onConfirm={() => updateStatus(confirmAction.id, confirmAction.status)}
        onCancel={() => setConfirmAction(null)}
      />

      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-ocean mb-1">{t('admin_bookings')}</h1>
        <p className="text-ocean/50 text-sm">{bookings.length} booking(s)</p>
      </div>

      <div className="space-y-3">
        {bookings.map(b => (
          <div key={b._id} className="bg-white p-5 rounded-xl shadow-sm border border-ocean/5">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="font-semibold text-ocean">{b.guestName}</h3>
                  <span className="text-xs bg-terracotta/10 text-terracotta px-2 py-0.5 rounded-full">{b.roomName}</span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                    b.status === 'confirmed' ? 'bg-green-50 text-green-700 ring-1 ring-green-200' :
                    b.status === 'cancelled' ? 'bg-red-50 text-red-700 ring-1 ring-red-200' :
                    'bg-blue-50 text-blue-700 ring-1 ring-blue-200'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1 ${
                      b.status === 'confirmed' ? 'bg-green-500' :
                      b.status === 'cancelled' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`} />
                    {b.status}
                  </span>
                </div>
                <div className="text-xs text-ocean/50 space-y-0.5">
                  <p>Email: {b.email} &middot; Phone: {b.phone}</p>
                  {b.checkIn && <p>Check-in: {b.checkIn} &middot; Check-out: {b.checkOut} &middot; {b.guests} guests</p>}
                  {b.message && <p className="text-ocean/40 italic mt-1">"{b.message}"</p>}
                </div>
                <p className="text-[10px] text-ocean/30 mt-1">{new Date(b.createdAt).toLocaleString()}</p>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                <div className="flex gap-1">
                  {b.status !== 'confirmed' && (
                    <button onClick={() => setConfirmAction({ id: b._id, status: 'confirmed' })}
                      className="px-2 py-1 bg-green-50 text-green-700 rounded-lg text-xs font-medium hover:bg-green-100 transition-colors">
                      Confirm
                    </button>
                  )}
                  {b.status !== 'cancelled' && (
                    <button onClick={() => setConfirmAction({ id: b._id, status: 'cancelled' })}
                      className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
                <button onClick={() => setDeleteTarget(b._id)}
                  className="p-1 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors self-end"
                  aria-label="Delete">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {bookings.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center border border-ocean/5">
            <p className="text-ocean/40">No reservations at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
