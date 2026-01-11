import { useState, useEffect } from 'react';
import { getAdminGalleries, deleteGallery, createGallery, updateGallery } from './adminApi';
import './AdminTable.css';
import './Modal.css';

const Galleries = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [editing, setEditing] = useState(null);
  const [formData, setFormData] = useState({
    image: null, caption: '', guest_name: '', is_featured: false, sort_order: 0
  });
  const [imagePreview, setImagePreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const response = await getAdminGalleries();
      setGalleries(response.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleEdit = (item) => {
    setEditing(item);
    setFormData({
      image: null, // Keep existing image if null
      caption: item.caption || '',
      guest_name: item.guest_name || '',
      is_featured: item.is_featured ?? false,
      sort_order: item.sort_order || 0
    });
    setImagePreview(item.image || '');
    setShowForm(true);
  };

  const confirmDelete = (item) => {
    setDeleteTarget(item);
    setShowDeleteConfirm(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setShowDeleteConfirm(false);
    
    try {
      await deleteGallery(deleteTarget.id);
      setGalleries(galleries.filter(g => g.id !== deleteTarget.id));
      alert('Foto berhasil dihapus');
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Gagal menghapus foto');
    } finally {
      setDeletingId(null);
      setDeleteTarget(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }
      data.append('caption', formData.caption);
      data.append('guest_name', formData.guest_name);
      data.append('is_featured', formData.is_featured ? '1' : '0');
      data.append('sort_order', formData.sort_order);

      if (editing) {
        data.append('_method', 'PUT');
        await updateGallery(editing.id, data);
      } else {
        await createGallery(data);
      }
      setShowForm(false);
      setEditing(null);
      fetchData();
      alert('Berhasil menyimpan foto');
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || 'Gagal menyimpan foto. Silakan coba lagi.');
    } finally { setSaving(false); }
  };

  const openNew = () => {
    setEditing(null);
    setFormData({ image: null, caption: '', guest_name: '', is_featured: false, sort_order: 0 });
    setImagePreview('');
    setShowForm(true);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    setFormData({ ...formData, image: file });
    setImagePreview(URL.createObjectURL(file));
  };

  if (loading) return <div className="loading">Memuat...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div><h1>Galeri</h1><p>Kelola foto & testimoni</p></div>
        <button className="btn-primary" onClick={openNew}>+ Tambah Foto</button>
      </div>

      {galleries.length === 0 ? (
        <div className="empty-state"><span>🖼️</span><h3>Belum ada foto</h3></div>
      ) : (
        <div className="gallery-grid">
          {galleries.map((item) => (
            <div key={item.id} className="gallery-card">
              <img 
                src={item.image || `https://picsum.photos/200?random=${item.id}`} 
                alt={item.caption}
                onError={(e) => { e.target.src = `https://picsum.photos/200?random=${item.id}`; }}
              />
              <div className="gallery-info">
                <p>{item.caption || 'Tanpa keterangan'}</p>
                {item.guest_name && <span>— {item.guest_name}</span>}
                {item.is_featured && <span className="badge active">Unggulan</span>}
              </div>
              <div className="gallery-actions">
                <button className="btn-edit" onClick={() => handleEdit(item)}>Edit</button>
                <button 
                  className="btn-delete" 
                  onClick={() => confirmDelete(item)}
                  disabled={deletingId === item.id}
                >
                  {deletingId === item.id ? '...' : 'Hapus'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Foto' : 'Tambah Foto'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Foto *</label>
                <div 
                  className={`drop-zone ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-input').click()}
                >
                  <input 
                    id="file-input" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleChange} 
                    style={{ display: 'none' }} 
                  />
                  {imagePreview ? (
                    <div className="img-preview-container">
                      <img src={imagePreview} alt="Preview" className="img-preview" />
                      <span className="change-text">Klik atau drop untuk mengganti</span>
                    </div>
                  ) : (
                    <div className="upload-placeholder">
                      <span className="upload-icon">☁️</span>
                      <p>Drag & Drop gambar di sini atau <strong>Pilih File</strong></p>
                    </div>
                  )}
                </div>
              </div>
              <div className="form-group">
                <label>Caption</label>
                <input type="text" value={formData.caption} onChange={e => setFormData({...formData, caption: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Guest Name</label>
                <input type="text" value={formData.guest_name} onChange={e => setFormData({...formData, guest_name: e.target.value})} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Sort Order</label>
                  <input type="number" value={formData.sort_order} onChange={e => setFormData({...formData, sort_order: parseInt(e.target.value)})} />
                </div>
                <div className="form-group checkbox">
                  <label><input type="checkbox" checked={formData.is_featured} onChange={e => setFormData({...formData, is_featured: e.target.checked})} /> Unggulan</label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal delete-modal" onClick={e => e.stopPropagation()}>
            <div className="delete-icon">
              <span>🗑️</span>
            </div>
            <div className="modal-header center-header">
              <h2>Hapus Foto?</h2>
            </div>
            <div className="modal-content center-content">
              <p>Apakah Anda yakin ingin menghapus foto ini secara permanen? Tindakan ini tidak dapat dibatalkan.</p>
              {deleteTarget && (
                <div className="delete-preview card-preview">
                  <img src={deleteTarget.image} alt="preview" />
                  <div className="preview-info">
                    <strong>{deleteTarget.caption || 'Tanpa Judul'}</strong>
                    <span>{deleteTarget.guest_name}</span>
                  </div>
                </div>
              )}
            </div>
            <div className="modal-actions center-actions">
              <button className="btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Batal</button>
              <button className="btn-delete-confirm" onClick={handleDelete}>Ya, Hapus</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .delete-modal {
          max-width: 400px !important;
          padding-top: 2rem;
        }
        .delete-icon {
          width: 60px;
          height: 60px;
          background: #fee2e2;
          color: #dc2626;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2rem;
          margin: 0 auto 1rem;
        }
        .center-header {
          justify-content: center;
          padding: 0 1.5rem 0.5rem;
          border: none;
        }
        .center-header h2 {
          font-size: 1.5rem;
          color: #111827;
        }
        .center-content {
          text-align: center;
          padding: 0 1.5rem 1.5rem;
          color: #6b7280;
        }
        .center-content p {
          margin-bottom: 1.5rem;
          line-height: 1.5;
        }
        .card-preview {
          background: #f9fafb;
          border-radius: 12px;
          padding: 0.75rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          text-align: left;
          border: 1px solid #e5e7eb;
        }
        .card-preview img {
          width: 50px;
          height: 50px;
          border-radius: 8px;
          object-fit: cover;
        }
        .preview-info {
          display: flex;
          flex-direction: column;
        }
        .preview-info strong {
          color: #374151;
          font-size: 0.95rem;
        }
        .preview-info span {
          font-size: 0.8rem;
          color: #9ca3af;
        }
        .center-actions {
          justify-content: stretch;
          padding: 1.5rem;
          gap: 0.75rem;
          background: #f9fafb;
          border-top: 1px solid #e5e7eb;
          display: grid;
          grid-template-columns: 1fr 1fr;
        }
        .btn-delete-confirm {
          background: #dc2626;
          color: white;
          border: none;
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: background 0.2s;
        }
        .btn-delete-confirm:hover {
          background: #b91c1c;
        }
        .btn-secondary {
          padding: 0.75rem;
          border-radius: 8px;
          font-weight: 600;
        }
        .drop-zone {
          border: 2px dashed #cbd5e1;
          border-radius: 8px;
          padding: 1rem;
          text-align: center;
          cursor: pointer;
          transition: all 0.2s ease;
          background: #f8fafc;
          min-height: 150px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .drop-zone.active {
          border-color: #10b981;
          background: #ecfdf5;
        }
        .upload-placeholder {
          color: #64748b;
        }
        .upload-icon {
          font-size: 2rem;
          display: block;
          margin-bottom: 0.5rem;
        }
        .img-preview-container {
          position: relative;
          width: 100%;
          height: 200px;
        }
        .img-preview {
          width: 100%;
          height: 100%;
          object-fit: contain;
          border-radius: 4px;
        }
        .change-text {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0,0,0,0.6);
          color: white;
          padding: 0.5rem;
          font-size: 0.8rem;
          opacity: 0;
          transition: opacity 0.2s;
        }
        .img-preview-container:hover .change-text {
          opacity: 1;
        }
        .gallery-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem; }
        .gallery-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.05); }
        .gallery-card img { width: 100%; height: 180px; object-fit: cover; }
        .gallery-info { padding: 1rem; }
        .gallery-info p { margin: 0 0 0.5rem; color: #374151; }
        .gallery-info span { font-size: 0.85rem; color: #6b7280; }
        .gallery-actions { padding: 0 1rem 1rem; display: flex; gap: 0.5rem; }
      `}</style>
    </div>
  );
};

export default Galleries;
