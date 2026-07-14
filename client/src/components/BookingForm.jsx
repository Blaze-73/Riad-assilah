import { useState, useEffect, useMemo } from 'react';
import api from '../services/api.js';

const ADMIN_PHONE = '212621010978';
const today = () => new Date().toISOString().slice(0, 10);

export default function BookingForm({ room, onClose }) {
  const [form, setForm] = useState({
    guestName: '',
    email: '',
    phone: '',
    checkIn: '',
    checkOut: '',
    guests: 1,
    message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);

  const todayStr = useMemo(today, []);
  const minCheckOut = form.checkIn || todayStr;

  useEffect(() => {
    if (!form.checkIn || !form.checkOut) { setAvailable(null); return; }
    setChecking(true);
    const t = setTimeout(async () => {
      try {
        const res = await api.get(`/rooms/${room._id}/availability?start=${form.checkIn}&end=${form.checkOut}`);
        setAvailable(res.data.available);
      } catch { setAvailable(null); }
      setChecking(false);
    }, 400);
    return () => clearTimeout(t);
  }, [form.checkIn, form.checkOut, room._id]);

  useEffect(() => {
    if (form.checkOut && form.checkIn && form.checkOut <= form.checkIn) {
      setForm(prev => ({ ...prev, checkOut: '' }));
    }
  }, [form.checkIn]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (available === false) return;
    if (form.checkIn < todayStr) {
      setError("Check-in date cannot be in the past.");
      return;
    }
    if (form.checkOut <= form.checkIn) {
      setError('Check-out must be after check-in.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const days = Math.ceil((new Date(form.checkOut) - new Date(form.checkIn)) / (1000 * 60 * 60 * 24));
      const text = encodeURIComponent(
        `Hi! I'd like to book ${room.name}.\n\nFrom ${form.checkIn} to ${form.checkOut} (${days} night${days > 1 ? 's' : ''})\nGuests: ${form.guests}\n\nName: ${form.guestName}\nPhone: ${form.phone}${form.message ? `\n\nMessage: ${form.message}` : ''}`
      );
      window.open(`https://wa.me/${ADMIN_PHONE}?text=${text}`, '_blank');
      await api.post('/bookings', { ...form, roomName: room.name });
      setDone(true);
    } catch {
      setError('Error sending. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-xl text-ocean mb-2">Booking sent!</h3>
         <p className="text-ocean/60 text-sm mb-6">We will contact you shortly to confirm your reservation.</p>
        <button onClick={onClose} className="px-6 py-2 bg-ocean text-white rounded-xl text-sm font-medium hover:bg-ocean/90 transition-colors">Close</button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-6 md:p-8 space-y-4">
      <h3 className="font-serif text-xl text-ocean mb-2">Book {room.name}</h3>
      {error && <p className="text-red-500 text-sm">{error}</p>}
      {available === false && (
        <p className="text-red-500 text-sm bg-red-50 px-3 py-2 rounded-lg">This room is not available for the selected dates. Please choose different dates.</p>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Full name</label>
          <input name="guestName" value={form.guestName} onChange={handleChange} required className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Email</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Phone</label>
          <input name="phone" type="tel" value={form.phone} onChange={handleChange} required className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
        </div>
        <div className="col-span-2 sm:col-span-1">
          <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Guests</label>
          <input name="guests" type="number" min="1" value={form.guests} onChange={handleChange} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
        </div>
        <div>
          <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">
            Check-in
            {checking && <span className="text-ocean/30 ml-1">checking...</span>}
          </label>
          <input name="checkIn" type="date" value={form.checkIn} onChange={handleChange} min={todayStr} required className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
        </div>
        <div>
          <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">
            Check-out
            {available === true && <span className="text-green-500 ml-1">✓</span>}
            {available === false && <span className="text-red-500 ml-1">✗</span>}
          </label>
          <input name="checkOut" type="date" value={form.checkOut} onChange={handleChange} min={minCheckOut} required className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30" />
        </div>
      </div>
      <div>
        <label className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Message (optional)</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={3} className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30 resize-none" />
      </div>
      <div className="flex gap-3 pt-2">
        <button type="submit" disabled={submitting || (form.checkIn && form.checkOut && available === false)} className="flex-1 px-5 py-2.5 bg-terracotta text-white rounded-xl text-sm font-medium hover:bg-gold transition-colors disabled:opacity-50">
          {submitting ? 'Sending...' : 'Send booking'}
        </button>
        <button type="button" onClick={onClose} className="px-5 py-2.5 bg-gray-100 text-ocean/60 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
          Cancel
        </button>
      </div>
    </form>
  );
}
