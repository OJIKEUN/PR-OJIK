import { useState, useEffect } from 'react';
import { getAdminReservations, updateReservationStatus } from './adminApi';
import './AdminTable.css';

const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', search: '' });

  useEffect(() => {
    fetchReservations();
  }, [filter.status]);

  const fetchReservations = async () => {
    try {
      const params = {};
      if (filter.status) params.status = filter.status;
      if (filter.search) params.search = filter.search;
      const response = await getAdminReservations(params);
      setReservations(response.data?.data || response.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await updateReservationStatus(id, status);
      fetchReservations();
    } catch (error) {
      alert('Gagal memperbarui status');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  if (loading) return <div className="loading">Memuat reservasi...</div>;

  return (
    <div className="admin-page">
      <div className="page-header">
        <div>
          <h1>Reservasi</h1>
          <p>Kelola reservasi tamu</p>
        </div>
      </div>

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Cari berdasarkan kode, nama, email..."
          value={filter.search}
          onChange={(e) => setFilter({ ...filter, search: e.target.value })}
          onKeyDown={(e) => e.key === 'Enter' && fetchReservations()}
        />
        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">Semua Status</option>
          <option value="pending">Menunggu</option>
          <option value="confirmed">Dikonfirmasi</option>
          <option value="completed">Selesai</option>
          <option value="cancelled">Dibatalkan</option>
        </select>
      </div>

      {reservations.length === 0 ? (
        <div className="empty-state">
          <span>📅</span>
          <h3>Belum ada reservasi</h3>
          <p>Reservasi akan muncul di sini</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Kode Booking</th>
                <th>Tamu</th>
                <th>Paket</th>
                <th>Tanggal</th>
                <th>Total</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((res) => (
                <tr key={res.id}>
                  <td><code>{res.booking_code}</code></td>
                  <td>
                    <div className="item-info">
                      <strong>{res.guest_name}</strong>
                      <span>{res.guest_email}</span>
                    </div>
                  </td>
                  <td>{res.package?.name || '-'}</td>
                  <td>
                    <div className="item-info">
                      <span>{formatDate(res.check_in_date)}</span>
                      <span>→ {formatDate(res.check_out_date)}</span>
                    </div>
                  </td>
                  <td>{formatPrice(res.total_price)}</td>
                  <td><span className={`badge ${res.status}`}>{res.status}</span></td>
                  <td>
                    <select
                      value={res.status}
                      onChange={(e) => handleStatusChange(res.id, e.target.value)}
                      className="status-select"
                    >
                      <option value="pending">Menunggu</option>
                      <option value="confirmed">Dikonfirmasi</option>
                      <option value="completed">Selesai</option>
                      <option value="cancelled">Dibatalkan</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <style>{`
        .status-select {
          padding: 0.5rem;
          border: 1px solid #e5e7eb;
          border-radius: 6px;
          font-size: 0.85rem;
        }
        code {
          background: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-family: monospace;
        }
      `}</style>
    </div>
  );
};

export default Reservations;
