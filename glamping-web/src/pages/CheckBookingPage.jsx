import { useState } from 'react';
import { checkReservation } from '../services/api';
import './CheckBookingPage.css';

const CheckBookingPage = () => {
  const [bookingCode, setBookingCode] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setResult(null);
    setLoading(true);

    try {
      const response = await checkReservation(bookingCode, email);
      if (response.success) {
        setResult(response.data);
      } else {
        setError(response.message || 'Booking tidak ditemukan');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mengecek booking');
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

  const getStatusBadge = (status) => {
    const styles = {
      pending: { bg: '#fef3c7', color: '#d97706', label: 'Menunggu' },
      confirmed: { bg: '#d1fae5', color: '#059669', label: 'Dikonfirmasi' },
      cancelled: { bg: '#fee2e2', color: '#dc2626', label: 'Dibatalkan' },
      completed: { bg: '#dbeafe', color: '#2563eb', label: 'Selesai' },
    };
    const style = styles[status] || styles.pending;
    return (
      <span className="status-badge" style={{ background: style.bg, color: style.color }}>
        {style.label}
      </span>
    );
  };

  return (
    <div className="check-booking-page">
      <div className="page-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Cek <span className="highlight">Booking</span></h1>
          <p>Masukkan kode booking dan email untuk melihat reservasi Anda</p>
        </div>
      </div>

      <section className="check-content">
        <div className="container">
          <div className="check-card">
            {!result ? (
              <form onSubmit={handleSubmit} className="check-form">
                {error && <div className="error-message">{error}</div>}
                <div className="form-group">
                  <label>Kode Booking</label>
                  <input
                    type="text"
                    required
                    value={bookingCode}
                    onChange={(e) => setBookingCode(e.target.value.toUpperCase())}
                    placeholder="e.g. GC-ABCD1234"
                  />
                </div>
                <div className="form-group">
                  <label>Alamat Email</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                  />
                </div>
                <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
                  {loading ? 'Memeriksa...' : 'Cek Booking'}
                </button>
              </form>
            ) : (
              <div className="booking-result">
                <div className="result-header">
                  <h2>Booking Ditemukan!</h2>
                  {getStatusBadge(result.status)}
                </div>
                
                <div className="result-details">
                  <div className="detail-section">
                    <h4>Informasi Booking</h4>
                    <div className="detail-row">
                      <span>Kode Booking</span>
                      <strong className="booking-code">{result.booking_code}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Paket</span>
                      <strong>{result.package?.name}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Lokasi</span>
                      <strong>{result.package?.location?.name}</strong>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Detail Menginap</h4>
                    <div className="detail-row">
                      <span>Check-in</span>
                      <strong>{new Date(result.check_in_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Check-out</span>
                      <strong>{new Date(result.check_out_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Jumlah Tamu</span>
                      <strong>{result.guests_count} tamu</strong>
                    </div>
                  </div>

                  <div className="detail-section">
                    <h4>Informasi Tamu</h4>
                    <div className="detail-row">
                      <span>Nama</span>
                      <strong>{result.guest_name}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Email</span>
                      <strong>{result.guest_email}</strong>
                    </div>
                    <div className="detail-row">
                      <span>Telepon</span>
                      <strong>{result.guest_phone}</strong>
                    </div>
                  </div>

                  <div className="total-section">
                    <span>Total Pembayaran</span>
                    <strong>{formatPrice(result.total_price)}</strong>
                  </div>

                  {result.status === 'pending' && (
                    <div className="payment-info">
                      <h4>💳 Instruksi Pembayaran</h4>
                      <p>Silakan selesaikan pembayaran untuk mengkonfirmasi booking Anda.</p>
                      <div className="bank-info">
                        <p><strong>Bank BCA</strong></p>
                        <p>Rekening: 1234567890</p>
                        <p>Atas Nama: PT GlampyCamp Indonesia</p>
                      </div>
                      <p className="note">Setelah pembayaran, silakan hubungi WhatsApp kami untuk konfirmasi.</p>
                    </div>
                  )}
                </div>

                <button 
                  className="btn btn-outline btn-full"
                  onClick={() => { setResult(null); setBookingCode(''); setEmail(''); }}
                >
                  Cek Booking Lain
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CheckBookingPage;
