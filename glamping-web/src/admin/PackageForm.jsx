import { useState } from 'react';
import { createPackage, updatePackage } from './adminApi';
import './Modal.css';

const PackageForm = ({ pkg, locations, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: pkg?.name || '',
    location_id: pkg?.location_id || '',
    short_description: pkg?.short_description || '',
    description: pkg?.description || '',
    price_per_night: pkg?.price_per_night || '',
    capacity: pkg?.capacity || 2,
    facilities: pkg?.facilities?.join(', ') || '',
    images: pkg?.images?.join('\n') || '',
    is_active: pkg?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = {
      ...formData,
      price_per_night: parseFloat(formData.price_per_night),
      capacity: parseInt(formData.capacity),
      facilities: formData.facilities.split(',').map(f => f.trim()).filter(f => f),
      images: formData.images.split('\n').map(i => i.trim()).filter(i => i),
    };

    try {
      if (pkg) {
        await updatePackage(pkg.id, data);
      } else {
        await createPackage(data);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal menyimpan paket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>{pkg ? 'Edit Paket' : 'Tambah Paket'}</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {error && <div className="error-alert">{error}</div>}

          <div className="form-row">
            <div className="form-group">
              <label>Nama Paket *</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Lokasi *</label>
              <select
                value={formData.location_id}
                onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                required
              >
                <option value="">Pilih lokasi</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>{loc.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Deskripsi Singkat</label>
            <input
              type="text"
              value={formData.short_description}
              onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
              placeholder="Deskripsi singkat untuk daftar"
            />
          </div>

          <div className="form-group">
            <label>Deskripsi Lengkap</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Harga per Malam (IDR) *</label>
              <input
                type="number"
                value={formData.price_per_night}
                onChange={(e) => setFormData({ ...formData, price_per_night: e.target.value })}
                required
                min="0"
              />
            </div>
            <div className="form-group">
              <label>Kapasitas (tamu) *</label>
              <input
                type="number"
                value={formData.capacity}
                onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                required
                min="1"
              />
            </div>
          </div>

          <div className="form-group">
            <label>Fasilitas (pisahkan dengan koma)</label>
            <input
              type="text"
              value={formData.facilities}
              onChange={(e) => setFormData({ ...formData, facilities: e.target.value })}
              placeholder="AC, WiFi, Kamar Mandi, ..."
            />
          </div>

          <div className="form-group">
            <label>URL Gambar (satu per baris)</label>
            <textarea
              value={formData.images}
              onChange={(e) => setFormData({ ...formData, images: e.target.value })}
              rows="3"
              placeholder="https://example.com/image1.jpg"
            />
          </div>

          <div className="form-group checkbox">
            <label>
              <input
                type="checkbox"
                checked={formData.is_active}
                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              />
              Aktif (terlihat di website)
            </label>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Batal
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Menyimpan...' : (pkg ? 'Update' : 'Simpan')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PackageForm;
