import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getDashboard } from './adminApi';
import './Dashboard.css';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const response = await getDashboard();
      if (response.success) {
        setData(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (loading) {
    return <div className="loading">Memuat dashboard...</div>;
  }

  const stats = data?.stats || {};

  return (
    <div className="dashboard">
      <h1>Dashboard</h1>
      <p className="subtitle">Selamat datang kembali! Inilah yang terjadi hari ini.</p>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon blue">📦</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total_packages || 0}</span>
            <span className="stat-label">Total Paket</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">📅</div>
          <div className="stat-info">
            <span className="stat-value">{stats.total_reservations || 0}</span>
            <span className="stat-label">Total Reservasi</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon yellow">⏳</div>
          <div className="stat-info">
            <span className="stat-value">{stats.pending_reservations || 0}</span>
            <span className="stat-label">Menunggu</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon purple">💰</div>
          <div className="stat-info">
            <span className="stat-value">{formatPrice(stats.this_month_revenue || 0)}</span>
            <span className="stat-label">Pendapatan Bulan Ini</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Reservasi Terbaru</h3>
          {data?.recent_reservations?.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Kode</th>
                  <th>Tamu</th>
                  <th>Paket</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_reservations.map((res) => (
                  <tr key={res.id}>
                    <td><code>{res.booking_code}</code></td>
                    <td>{res.guest_name}</td>
                    <td>{res.package?.name}</td>
                    <td><span className={`badge ${res.status}`}>
                      {res.status === 'pending' ? 'Menunggu' :
                       res.status === 'confirmed' ? 'Dikonfirmasi' :
                       res.status === 'cancelled' ? 'Dibatalkan' :
                       res.status === 'completed' ? 'Selesai' : res.status}
                    </span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="no-data">Belum ada reservasi</p>
          )}
          <Link to="/admin/reservations" className="card-link">Lihat Semua Reservasi →</Link>
        </div>

        <div className="dashboard-card">
          <h3>Check-in Mendatang</h3>
          {data?.upcoming_checkins?.length > 0 ? (
            <ul className="checkin-list">
              {data.upcoming_checkins.map((res) => (
                <li key={res.id}>
                  <div className="checkin-info">
                    <strong>{res.guest_name}</strong>
                    <span>{res.package?.name}</span>
                  </div>
                  <span className="checkin-date">
                    {new Date(res.check_in_date).toLocaleDateString('id-ID', { 
                      day: 'numeric', month: 'short' 
                    })}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="no-data">Tidak ada check-in mendatang</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
