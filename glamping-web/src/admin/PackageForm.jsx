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
    is_active: pkg?.is_active ?? true,
  });
  
  // Image handling - support both existing URLs and new files
  const [existingImages, setExistingImages] = useState(pkg?.images || []);
  const [newImageFiles, setNewImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleFiles = (files) => {
    const imageFiles = files.filter(file => file.type.startsWith('image/'));
    setNewImageFiles(prev => [...prev, ...imageFiles]);
    
    // Create previews
    imageFiles.forEach(file => {
      const previewUrl = URL.createObjectURL(file);
      setImagePreviews(prev => [...prev, previewUrl]);
    });
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index) => {
    setNewImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = new FormData();
      data.append('name', formData.name);
      data.append('location_id', formData.location_id);
      data.append('short_description', formData.short_description || '');
      data.append('description', formData.description || '');
      data.append('price_per_night', formData.price_per_night);
      data.append('capacity', formData.capacity);
      data.append('is_active', formData.is_active ? '1' : '0');
      
      // Facilities as JSON
      const facilitiesArray = formData.facilities.split(',').map(f => f.trim()).filter(f => f);
      data.append('facilities', JSON.stringify(facilitiesArray));
      
      // Existing images (URLs to keep)
      data.append('existing_images', JSON.stringify(existingImages));
      
      // New image files
      newImageFiles.forEach((file, index) => {
        data.append(`new_images[${index}]`, file);
      });

      if (pkg) {
        data.append('_method', 'PUT');
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
      <div className="modal modal-large" onClick={(e) => e.stopPropagation()}>
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

          {/* Drag and Drop Image Upload */}
          <div className="form-group">
            <label>Gambar Paket</label>
            <div 
              className={`drop-zone multi-image ${dragActive ? 'active' : ''}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => document.getElementById('pkg-file-input').click()}
            >
              <input 
                id="pkg-file-input" 
                type="file" 
                accept="image/*" 
                multiple
                onChange={handleFileInput} 
                style={{ display: 'none' }} 
              />
              <div className="upload-placeholder">
                <span className="upload-icon">📷</span>
                <p>Drag & Drop gambar di sini atau <strong>Pilih File</strong></p>
                <span className="upload-hint">Dapat mengunggah beberapa gambar sekaligus</span>
              </div>
            </div>
            
            {/* Image Preview Gallery */}
            {(existingImages.length > 0 || imagePreviews.length > 0) && (
              <div className="image-gallery">
                {/* Existing Images */}
                {existingImages.map((img, index) => (
                  <div key={`existing-${index}`} className="gallery-thumb">
                    <img src={img} alt={`Gambar ${index + 1}`} />
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={() => removeExistingImage(index)}
                    >×</button>
                  </div>
                ))}
                {/* New Image Previews */}
                {imagePreviews.map((preview, index) => (
                  <div key={`new-${index}`} className="gallery-thumb new">
                    <img src={preview} alt={`Gambar baru ${index + 1}`} />
                    <span className="new-badge">Baru</span>
                    <button 
                      type="button" 
                      className="remove-image" 
                      onClick={() => removeNewImage(index)}
                    >×</button>
                  </div>
                ))}
              </div>
            )}
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
