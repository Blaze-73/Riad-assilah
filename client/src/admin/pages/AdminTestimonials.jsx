import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../../services/api.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

export default function AdminTestimonials() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [testimonials, setTestimonials] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ guestName: '', country: '', rating: 5, text: '', textFr: '', textAr: '', isVisible: true });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchAll = () => api.get('/testimonials/all', { headers }).then(res => setTestimonials(res.data));
  useEffect(() => { fetchAll() }, []);

  const openNew = () => {
    setEditing(null);
    setForm({ guestName: '', country: '', rating: 5, text: '', textFr: '', textAr: '', isVisible: true });
    setShowForm(true);
  };

  const openEdit = (tm) => {
    setEditing(tm._id);
    setForm({ guestName: tm.guestName, country: tm.country || '', rating: tm.rating, text: tm.text, textFr: tm.textFr || '', textAr: tm.textAr || '', isVisible: tm.isVisible !== false });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await api.put(`/testimonials/${editing}`, form, { headers });
    } else {
      await api.post('/testimonials', form, { headers });
    }
    setShowForm(false);
    setEditing(null);
    setForm({ guestName: '', country: '', rating: 5, text: '', textFr: '', textAr: '', isVisible: true });
    fetchAll();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/testimonials/${deleteTarget}`, { headers });
    setDeleteTarget(null);
    fetchAll();
  };

  return (
    <div>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete testimonial"
        message="Are you sure you want to delete this testimonial?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-ocean mb-4">{t('admin_testimonials')}</h1>
        <button onClick={openNew} className="w-full sm:w-auto px-4 py-2.5 bg-ocean text-white rounded-xl text-sm font-medium hover:bg-ocean/90 transition-colors flex items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {t('admin_testimonials_add')}
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto" onClick={() => setShowForm(false)}>
          <form onSubmit={handleSubmit} onClick={e => e.stopPropagation()} className="bg-warmwhite rounded-2xl shadow-2xl w-full max-w-lg p-6 mt-16 md:mt-0">
            <h2 className="font-serif text-xl text-ocean mb-6">{editing ? 'Edit testimonial' : t('admin_testimonials_add')}</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="tm-name" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Name</label>
                <input id="tm-name" value={form.guestName} onChange={e => setForm({...form, guestName: e.target.value})} required className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
              </div>
              <div>
                <label htmlFor="tm-country" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Country code (FR, GB, DE...)</label>
                <input id="tm-country" value={form.country} onChange={e => setForm({...form, country: e.target.value})} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
              </div>
              <div>
                <label htmlFor="tm-rating" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Rating</label>
                <select id="tm-rating" value={form.rating} onChange={e => setForm({...form, rating: Number(e.target.value)})} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30">
                  {[5, 4, 3, 2, 1].map(r => <option key={r} value={r}>{r} stars</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="tm-text" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Text (EN)</label>
                <textarea id="tm-text" value={form.text} onChange={e => setForm({...form, text: e.target.value})} rows={4} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Text (FR)</label>
                  <textarea value={form.textFr} onChange={e => setForm({...form, textFr: e.target.value})} rows={4} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Text (AR)</label>
                  <textarea value={form.textAr} onChange={e => setForm({...form, textAr: e.target.value})} rows={4} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none" />
                </div>
              </div>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isVisible} onChange={e => setForm({...form, isVisible: e.target.checked})} className="w-4 h-4 rounded border-ocean/20 text-ocean focus:ring-ocean/30" />
                <span className="text-sm text-ocean/70">Visible on site</span>
              </label>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="submit" className="px-5 py-2.5 bg-ocean text-white rounded-xl text-sm font-medium hover:bg-ocean/90 transition-colors">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 text-ocean/60 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-4">
        {testimonials.map(tm => (
          <div key={tm._id} className={`bg-white p-5 rounded-xl shadow-sm border ${tm.isVisible === false ? 'border-red-200 bg-red-50/30' : 'border-ocean/5'}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-ocean text-sm">{tm.guestName}</p>
                {tm.isVisible === false && <span className="text-[10px] bg-red-100 text-red-600 px-1.5 py-0.5 rounded-full">Hidden</span>}
              </div>
              <div className="flex gap-1">
                <button onClick={() => openEdit(tm)} className="p-1.5 text-ocean/40 hover:text-ocean hover:bg-ocean/5 rounded-lg transition-colors" aria-label={`Edit`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button onClick={() => setDeleteTarget(tm._id)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" aria-label={`Delete testimonial from ${tm.guestName}`}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="flex mb-2">
              {Array.from({ length: 5 }, (_, j) => (
                <svg key={j} className={`w-3.5 h-3.5 ${j < tm.rating ? 'text-gold' : 'text-gray-200'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-ocean/70 leading-relaxed">{tm.text}</p>
          </div>
        ))}
        {testimonials.length === 0 && (
          <div className="md:col-span-2 bg-white rounded-xl p-8 text-center border border-ocean/5">
            <p className="text-ocean/40">No testimonials at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
