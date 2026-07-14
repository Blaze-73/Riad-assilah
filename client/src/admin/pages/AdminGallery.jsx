import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../../services/api.js';
import ConfirmDialog from '../../components/ConfirmDialog.jsx';

export default function AdminGallery() {
  const { t } = useTranslation();
  const { token } = useAuth();
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [caption, setCaption] = useState('');
  const [file, setFile] = useState(null);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchImages = () => api.get('/gallery').then(res => setImages(res.data));
  useEffect(() => { fetchImages() }, []);

  const handleFileSelect = (e) => {
    const f = e.target.files[0];
    if (f) { setFile(f); setShowUpload(true); }
  };

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    formData.append('caption', caption);
    try {
      await api.post('/gallery/upload', formData, { headers });
      setShowUpload(false);
      setCaption('');
      setFile(null);
      fetchImages();
    } catch {
      alert("Image upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await api.delete(`/gallery/${deleteTarget}`, { headers });
    setDeleteTarget(null);
    fetchImages();
  };

  return (
    <div>
      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete image"
        message="Are you sure you want to delete this image from the gallery?"
        confirmLabel="Delete"
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <div className="mb-6">
        <h1 className="font-serif text-2xl md:text-3xl text-ocean mb-4">{t('admin_gallery')}</h1>
        <label className="w-full sm:w-auto inline-flex px-4 py-2.5 bg-ocean text-white rounded-xl text-sm font-medium cursor-pointer hover:bg-ocean/90 transition-colors items-center justify-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
          {t('admin_gallery_upload')}
          <input type="file" accept="image/*" onChange={handleFileSelect} className="hidden" />
        </label>
      </div>

      {showUpload && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" onClick={() => setShowUpload(false)}>
          <div onClick={e => e.stopPropagation()} className="bg-warmwhite rounded-2xl shadow-2xl w-full max-w-md p-6">
            <h2 className="font-serif text-xl text-ocean mb-4">Add image</h2>
            {file && (
              <div className="mb-4">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-48 object-cover rounded-xl" />
              </div>
            )}
            <div className="mb-4">
              <label htmlFor="gallery-caption" className="block text-xs text-ocean/50 uppercase tracking-wider mb-1">Caption</label>
              <input
                id="gallery-caption"
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="E.g. Interior patio"
                className="w-full px-3.5 py-2.5 bg-white border border-ocean/10 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-terracotta/30"
              />
            </div>
            <div className="flex gap-3">
              <button onClick={handleUpload} disabled={uploading} className="px-5 py-2.5 bg-ocean text-white rounded-xl text-sm font-medium hover:bg-ocean/90 transition-colors disabled:opacity-50">
                {uploading ? 'Upload...' : 'Upload'}
              </button>
              <button onClick={() => { setShowUpload(false); setFile(null); setCaption(''); }} className="px-5 py-2.5 bg-gray-100 text-ocean/60 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {images.length === 0 ? (
        <div className="bg-white rounded-xl p-12 text-center border border-ocean/5">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <p className="text-ocean/40">No images at the moment.</p>
          <p className="text-xs text-ocean/30 mt-1">Click "Add photos" to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.map(img => (
            <div key={img._id} className="group relative bg-white rounded-xl overflow-hidden border border-ocean/5">
              <img src={img.url} alt={img.caption || ''} loading="lazy" className="w-full aspect-square object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                {img.caption && <p className="text-warmwhite text-xs mb-2">{img.caption}</p>}
                <button
                  onClick={() => setDeleteTarget(img._id)}
                  className="self-end p-2 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 transition-colors"
                  aria-label="Delete image"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
