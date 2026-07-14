import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../../services/api.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

const emptyForm = { name: '', nameFr: '', nameAr: '', description: '', descriptionFr: '', descriptionAr: '', bedType: '', capacity: '', pricePerNight: '', amenities: '', amenitiesFr: '', amenitiesAr: '' };

export default function AdminRooms() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [imageList, setImageList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [availRoom, setAvailRoom] = useState(null);
  const [availForm, setAvailForm] = useState({ start: '', end: '', note: '' });

  const headers = { Authorization: `Bearer ${token}` };

  const fetchRooms = () => api.get('/rooms').then(res => setRooms(res.data));
  useEffect(() => { fetchRooms() }, []);

  const openNew = () => {
    setEditing(null);
    setForm(emptyForm);
    setImageList([]);
    setShowForm(true);
  };

  const openEdit = (room) => {
    setEditing(room._id);
    setForm({
      ...room,
      amenities: (room.amenities || []).join(', '),
      amenitiesFr: (room.amenitiesFr || []).join(', '),
      amenitiesAr: (room.amenitiesAr || []).join(', '),
      capacity: room.capacity || '',
      pricePerNight: room.pricePerNight || '',
    });
    setImageList(room.images || []);
    setShowForm(true);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    const fd = new FormData();
    files.forEach(f => fd.append('images', f));
    try {
      const { data } = await api.post('/rooms/upload', fd, { headers });
      setImageList(prev => [...prev, ...data.map(d => d.url)]);
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
    e.target.value = '';
  };

  const removeImage = (url) => setImageList(prev => prev.filter(u => u !== url));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      name: form.name,
      nameFr: form.nameFr || undefined,
      nameAr: form.nameAr || undefined,
      description: form.description,
      descriptionFr: form.descriptionFr || undefined,
      descriptionAr: form.descriptionAr || undefined,
      bedType: form.bedType,
      capacity: Number(form.capacity),
      pricePerNight: Number(form.pricePerNight),
      amenities: form.amenities.split(',').map(a => a.trim()).filter(Boolean),
      amenitiesFr: form.amenitiesFr ? form.amenitiesFr.split(',').map(a => a.trim()).filter(Boolean) : undefined,
      amenitiesAr: form.amenitiesAr ? form.amenitiesAr.split(',').map(a => a.trim()).filter(Boolean) : undefined,
      images: imageList
    };
    if (editing) {
      await api.put(`/rooms/${editing}`, payload, { headers });
    } else {
      await api.post('/rooms', payload, { headers });
    }
    setShowForm(false);
    fetchRooms();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/rooms/${deleteTarget}`, { headers });
    setDeleteTarget(null);
    fetchRooms();
  };

  const addUnavailable = async () => {
    if (!availRoom || !availForm.start || !availForm.end) return;
    await api.patch(`/rooms/${availRoom._id}/availability`, availForm, { headers });
    setAvailForm({ start: '', end: '', note: '' });
    fetchRooms();
  };

  const removeUnavailable = async (roomId, rangeId) => {
    await api.delete(`/rooms/${roomId}/availability/${rangeId}`, { headers });
    fetchRooms();
  };

  return (
    <div>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete room"
        message="This action cannot be undone. Are you sure you want to delete this room?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-ocean mb-4">{t('admin_rooms')}</h1>
        <button
          onClick={openNew}
          className="w-full sm:w-auto px-4 py-2.5 bg-ocean text-white rounded-xl text-sm font-medium hover:bg-ocean/90 transition-colors flex items-center justify-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {t('admin_rooms_add')}
        </button>
      </div>

      {/* Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
          onClick={() => setShowForm(false)}
        >
          <form
            onSubmit={handleSubmit}
            onClick={e => e.stopPropagation()}
            className="bg-warmwhite rounded-2xl shadow-2xl w-full max-w-lg p-6 mt-16 md:mt-0"
          >
            <h2 className="font-serif text-xl text-ocean mb-6">{editing ? t('admin_rooms_edit') : t('admin_rooms_add')}</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-3">
                  <label htmlFor="room-name" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Name (EN)</label>
                  <input id="room-name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                </div>
                <div>
                  <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Name (FR)</label>
                  <input value={form.nameFr} onChange={e => setForm({...form, nameFr: e.target.value})} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                </div>
                <div>
                  <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Name (AR)</label>
                  <input value={form.nameAr} onChange={e => setForm({...form, nameAr: e.target.value})} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                </div>
              </div>
              <div>
                <label htmlFor="room-desc" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Description (EN)</label>
                <textarea id="room-desc" value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={3} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Description (FR)</label>
                  <textarea value={form.descriptionFr} onChange={e => setForm({...form, descriptionFr: e.target.value})} rows={3} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none" />
                </div>
                <div>
                  <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Description (AR)</label>
                  <textarea value={form.descriptionAr} onChange={e => setForm({...form, descriptionAr: e.target.value})} rows={3} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label htmlFor="room-bed" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Bed</label>
                  <input id="room-bed" value={form.bedType} onChange={e => setForm({...form, bedType: e.target.value})} className="w-full px-3 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                </div>
                <div>
                  <label htmlFor="room-cap" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Capacity</label>
                  <input id="room-cap" value={form.capacity} onChange={e => setForm({...form, capacity: e.target.value})} type="number" min="1" className="w-full px-3 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                </div>
                <div>
                  <label htmlFor="room-price" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Price/night</label>
                  <input id="room-price" value={form.pricePerNight} onChange={e => setForm({...form, pricePerNight: e.target.value})} type="number" min="0" className="w-full px-3 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                </div>
              </div>
              <div>
                <label htmlFor="room-amenities" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Amenities (EN, comma separated)</label>
                <input id="room-amenities" value={form.amenities} onChange={e => setForm({...form, amenities: e.target.value})} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Amenities (FR, comma separated)</label>
                  <input value={form.amenitiesFr} onChange={e => setForm({...form, amenitiesFr: e.target.value})} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                </div>
                <div>
                  <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Amenities (AR, comma separated)</label>
                  <input value={form.amenitiesAr} onChange={e => setForm({...form, amenitiesAr: e.target.value})} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
                </div>
              </div>
              <div>
                <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Images</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {imageList.map(url => (
                    <div key={url} className="relative w-16 h-16 rounded-lg overflow-hidden border border-ocean/10 group">
                      <img src={url} alt="" className="w-full h-full object-cover" />
                      <button type="button" onClick={() => removeImage(url)} className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity" aria-label="Remove image">
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                  <label className={`w-16 h-16 flex items-center justify-center rounded-lg border-2 border-dashed border-ocean/20 cursor-pointer hover:border-ocean/40 transition-colors ${uploading ? 'opacity-50 pointer-events-none' : ''}`}>
                    {uploading ? (
                      <svg className="w-5 h-5 text-ocean/40 animate-spin" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5 text-ocean/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                    )}
                    <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                  </label>
                </div>
                <p className="text-xs text-ocean/30">Click to add images. Each image is automatically resized.</p>
              </div>
            </div>
            <div className="flex gap-3 mt-8">
              <button type="submit" className="px-5 py-2.5 bg-ocean text-white rounded-xl text-sm font-medium hover:bg-ocean/90 transition-colors">Save</button>
              <button type="button" onClick={() => setShowForm(false)} className="px-5 py-2.5 bg-gray-100 text-ocean/60 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Room list */}
      <div className="grid gap-4">
        {rooms.map(room => (
          <div key={room._id} className="bg-white rounded-xl shadow-sm border border-ocean/5 overflow-hidden">
            <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {room.images?.[0] && (
                <img src={room.images[0]} alt={room.name} className="w-full sm:w-20 h-32 sm:h-20 rounded-lg object-cover shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-ocean truncate">{room.name}</h3>
                <p className="text-xs text-ocean/50 mt-0.5">{room.bedType} &middot; {room.capacity} guests &middot; {room.pricePerNight} MAD/night</p>
                <div className="flex flex-wrap gap-1 mt-2">
                  {room.amenities?.slice(0, 3).map(a => (
                    <span key={a} className="text-xs bg-warmwhite text-ocean/50 px-2 py-0.5 rounded-full">{a}</span>
                  ))}
                  {(room.unavailableRanges?.length || 0) > 0 && (
                    <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{room.unavailableRanges.length} unavailable period(s)</span>
                  )}
                </div>
              </div>
              <div className="flex gap-2 shrink-0 w-full sm:w-auto">
                <button onClick={() => { setAvailRoom(availRoom?._id === room._id ? null : room); setAvailForm({ start: '', end: '', note: '' })}} className={`flex-1 sm:flex-none px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${availRoom?._id === room._id ? 'bg-terracotta text-white' : 'bg-ocean/10 text-ocean hover:bg-ocean/20'}`}>
                  Availability
                </button>
                <button onClick={() => openEdit(room)} className="flex-1 sm:flex-none px-3 py-1.5 bg-gold/20 text-gold-dark rounded-lg text-xs font-medium hover:bg-gold/30 transition-colors">
                  {t('admin_rooms_edit')}
                </button>
                <button onClick={() => setDeleteTarget(room._id)} className="flex-1 sm:flex-none px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium hover:bg-red-100 transition-colors">
                  {t('admin_rooms_delete')}
                </button>
              </div>
            </div>

            {/* Availability section */}
            {availRoom?._id === room._id && (
              <div className="border-t border-ocean/5 bg-gray-50/50 p-4">
                <h4 className="text-sm font-medium text-ocean mb-3">Unavailable periods</h4>
                {(room.unavailableRanges || []).length > 0 ? (
                  <div className="space-y-2 mb-3">
                    {room.unavailableRanges.map(r => (
                      <div key={r._id} className="flex items-center justify-between bg-white rounded-lg px-3 py-2 border border-ocean/5 text-xs">
                        <span className="text-ocean/70">{r.start} → {r.end} {r.note && <span className="text-ocean/40 italic">({r.note})</span>}</span>
                        <button onClick={() => removeUnavailable(room._id, r._id)} className="text-red-400 hover:text-red-600 ml-2">
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-ocean/40 mb-3">No blocked periods.</p>
                )}
                <div className="flex flex-col sm:flex-row gap-2 items-end">
                  <div>
                    <label className="block text-[10px] text-ocean/50 uppercase mb-0.5">Start</label>
                    <input type="date" value={availForm.start} onChange={e => setAvailForm({...availForm, start: e.target.value})} className="px-2.5 py-1.5 bg-white border border-ocean/10 rounded-lg text-xs" />
                  </div>
                  <div>
                    <label className="block text-[10px] text-ocean/50 uppercase mb-0.5">End</label>
                    <input type="date" value={availForm.end} onChange={e => setAvailForm({...availForm, end: e.target.value})} min={availForm.start || ''} className="px-2.5 py-1.5 bg-white border border-ocean/10 rounded-lg text-xs" />
                  </div>
                  <div className="flex-1">
                    <label className="block text-[10px] text-ocean/50 uppercase mb-0.5">Note</label>
                    <input type="text" value={availForm.note} onChange={e => setAvailForm({...availForm, note: e.target.value})} placeholder="Optional" className="w-full px-2.5 py-1.5 bg-white border border-ocean/10 rounded-lg text-xs" />
                  </div>
                  <button onClick={addUnavailable} disabled={!availForm.start || !availForm.end} className="shrink-0 px-3 py-1.5 bg-red-500 text-white rounded-lg text-xs font-medium hover:bg-red-600 transition-colors disabled:opacity-40">
                    Block
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        {rooms.length === 0 && (
          <div className="bg-white rounded-xl p-8 text-center border border-ocean/5">
            <p className="text-ocean/40">No rooms at the moment.</p>
          </div>
        )}
      </div>
    </div>
  );
}
