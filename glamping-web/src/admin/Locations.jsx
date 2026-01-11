import { useState, useEffect } from 'react';
import { getAdminLocations, deleteLocation, createLocation, updateLocation } from './adminApi';
import './AdminTable.css';
import './Modal.css';

const Locations = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingLocation, setEditingLocation] = useState(null);
  const [formData, setFormData] = useState({
    name: '', address: '', description: '', map_embed_url: '', image: null, is_active: true
  });
  const [imagePreview, setImagePreview] = useState('');
  const [dragActive, setDragActive] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await getAdminLocations();
      setLocations(response.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (loc) => {
    setEditingLocation(loc);
    setFormData({
      name: loc.name || '',
      address: loc.address || '',
      description: loc.description || '',
      map_embed_url: loc.map_embed_url || '',
      map_embed_url: loc.map_embed_url || '',
      image: null, // Keep existing unless changed
      is_active: loc.is_active ?? true
    });
    setImagePreview(loc.image || '');
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin?')) return;
    try {
      await deleteLocation(id);
      setLocations(locations.filter(l => l.id !== id));
    } catch (error) {
      alert(error.response?.data?.message || 'Gagal menghapus');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('address', formData.address || '');
      data.append('description', formData.description || '');
      data.append('map_embed_url', formData.map_embed_url || '');
      if (formData.image instanceof File) {
        data.append('image', formData.image);
      }
      data.append('is_active', formData.is_active ? '1' : '0');

      if (editingLocation) {
        data.append('_method', 'PUT');
        await updateLocation(editingLocation.id, data);
      } else {
        await createLocation(data);
      }
      setShowForm(false);
      setEditingLocation(null);
      fetchLocations();
    } catch (error) {
      alert('Gagal menyimpan');
    } finally {
      setSaving(false);
    }
  };

  const openNewForm = () => {
    setEditingLocation(null);
    setFormData({ name: '', address: '', description: '', map_embed_url: '', image: null, is_active: true });
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
        <div>
          <h1>Lokasi</h1>
          <p>Kelola lokasi glamping</p>
        </div>
        <button className="btn-primary" onClick={openNewForm}>+ Tambah Lokasi</button>
      </div>

      {locations.length === 0 ? (
        <div className="empty-state">
          <span>📍</span>
          <h3>Belum ada lokasi</h3>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nama</th>
                <th>Alamat</th>
                <th>Paket</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {locations.map((loc) => (
                <tr key={loc.id}>
                  <td><strong>{loc.name}</strong></td>
                  <td>{loc.address || '-'}</td>
                  <td>{loc.packages_count || 0}</td>
                  <td><span className={`badge ${loc.is_active ? 'active' : 'inactive'}`}>{loc.is_active ? 'Aktif' : 'Tidak Aktif'}</span></td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(loc)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(loc.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingLocation ? 'Edit Lokasi' : 'Tambah Lokasi'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nama *</label>
                <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="form-group">
                <label>Deskripsi</label>
                <textarea rows="3" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="form-group">
                <label>URL Embed Peta</label>
                <input type="text" value={formData.map_embed_url} onChange={e => setFormData({...formData, map_embed_url: e.target.value})} placeholder="Google Maps embed URL" />
              </div>
              <div className="form-group">
                <label>Gambar</label>
                <div 
                  className={`drop-zone ${dragActive ? 'active' : ''}`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('loc-file-input').click()}
                >
                  <input 
                    id="loc-file-input" 
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
              <div className="form-group checkbox">
                <label><input type="checkbox" checked={formData.is_active} onChange={e => setFormData({...formData, is_active: e.target.checked})} /> Aktif</label>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowForm(false)}>Batal</button>
                <button type="submit" className="btn-primary" disabled={saving}>{saving ? 'Menyimpan...' : 'Simpan'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Locations;
