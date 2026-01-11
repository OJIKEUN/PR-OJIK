import { useState, useEffect } from 'react';
import { getAdminPackages, deletePackage, getAdminLocations } from './adminApi';
import PackageForm from './PackageForm';
import './AdminTable.css';

const Packages = () => {
  const [packages, setPackages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPackage, setEditingPackage] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pkgRes, locRes] = await Promise.all([
        getAdminPackages(),
        getAdminLocations()
      ]);
      setPackages(pkgRes.data || []);
      setLocations(locRes.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Apakah Anda yakin ingin menghapus paket ini?')) return;
    try {
      await deletePackage(id);
      setPackages(packages.filter(p => p.id !== id));
    } catch (error) {
      alert('Gagal menghapus paket');
    }
  };

  const handleEdit = (pkg) => {
    setEditingPackage(pkg);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingPackage(null);
  };

  const handleFormSuccess = () => {
    handleFormClose();
    fetchData();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) return <div className="loading">Memuat paket...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Paket</h1>
          <p>Kelola paket glamping Anda</p>
        </div>
        <button className="btn-primary" onClick={() => setShowForm(true)}>
          + Tambah Paket
        </button>
      </div>

      {packages.length === 0 ? (
        <div className="empty-state">
          <span>🏕️</span>
          <h3>Belum ada paket</h3>
          <p>Buat paket glamping pertama Anda</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Paket</th>
                <th>Lokasi</th>
                <th>Harga/Malam</th>
                <th>Kapasitas</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {packages.map((pkg) => (
                <tr key={pkg.id}>
                  <td>
                    <div className="item-info">
                      <strong>{pkg.name}</strong>
                      <span>{pkg.short_description?.substring(0, 50)}...</span>
                    </div>
                  </td>
                  <td>{pkg.location?.name || '-'}</td>
                  <td>{formatPrice(pkg.price_per_night)}</td>
                  <td>{pkg.capacity} tamu</td>
                  <td>
                    <span className={`badge ${pkg.is_active ? 'active' : 'inactive'}`}>
                      {pkg.is_active ? 'Aktif' : 'Tidak Aktif'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-edit" onClick={() => handleEdit(pkg)}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDelete(pkg.id)}>Hapus</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <PackageForm
          pkg={editingPackage}
          locations={locations}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default Packages;
