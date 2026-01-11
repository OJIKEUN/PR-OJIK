import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPackageBySlug, getPackageAvailability, createReservation } from '../services/api';
import './PackageDetailPage.css';

const PackageDetailPage = () => {
  const { slug } = useParams();
  const [pkg, setPkg] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookedDates, setBookedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDates, setSelectedDates] = useState({ checkIn: null, checkOut: null });
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [bookingData, setBookingData] = useState({
    guest_name: '',
    guest_email: '',
    guest_phone: '',
    guests_count: 1,
    notes: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPackage();
  }, [slug]);

  const fetchPackage = async () => {
    try {
      const response = await getPackageBySlug(slug);
      if (response.success) {
        setPkg(response.data);
        fetchAvailability(response.data.id);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDateLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const fetchAvailability = async (packageId) => {
    try {
      const startDate = new Date();
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 3);
      const response = await getPackageAvailability(
        packageId,
        formatDateLocal(startDate),
        formatDateLocal(endDate)
      );
      if (response.success) {
        setBookedDates(response.data.booked_dates || []);
      }
    } catch (error) {
      console.error('Error fetching availability:', error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const isDateBooked = (date) => {
    const dateStr = formatDateLocal(date);
    return bookedDates.some((d) => d.date === dateStr);
  };

  const isPastDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date) => {
    if (isPastDate(date) || isDateBooked(date)) return;

    if (!selectedDates.checkIn || (selectedDates.checkIn && selectedDates.checkOut)) {
      setSelectedDates({ checkIn: date, checkOut: null });
    } else if (date > selectedDates.checkIn) {
      // Check if any date in range is booked
      let hasBookedDate = false;
      const current = new Date(selectedDates.checkIn);
      while (current <= date) {
        if (isDateBooked(current)) {
          hasBookedDate = true;
          break;
        }
        current.setDate(current.getDate() + 1);
      }
      if (!hasBookedDate) {
        setSelectedDates({ ...selectedDates, checkOut: date });
      }
    } else {
      setSelectedDates({ checkIn: date, checkOut: null });
    }
  };

  const isInRange = (date) => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return false;
    return date >= selectedDates.checkIn && date <= selectedDates.checkOut;
  };

  const renderCalendar = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const dayNames = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];

    // Empty cells for days before first day
    for (let i = 0; i < firstDay.getDay(); i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    // Days of the month
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const date = new Date(year, month, day);
      const isBooked = isDateBooked(date);
      const isPast = isPastDate(date);
      const isSelected = selectedDates.checkIn?.toDateString() === date.toDateString() ||
                         selectedDates.checkOut?.toDateString() === date.toDateString();
      const inRange = isInRange(date);

      days.push(
        <div
          key={day}
          className={`calendar-day ${isBooked ? 'booked' : ''} ${isPast ? 'past' : ''} ${isSelected ? 'selected' : ''} ${inRange ? 'in-range' : ''}`}
          onClick={() => handleDateClick(date)}
        >
          {day}
        </div>
      );
    }

    return (
      <div className="calendar">
        <div className="calendar-header">
          <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>&lt;</button>
          <span>{currentMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>&gt;</button>
        </div>
        <div className="calendar-days-header">
          {dayNames.map((name) => (
            <div key={name} className="day-name">{name}</div>
          ))}
        </div>
        <div className="calendar-days">{days}</div>
        <div className="calendar-legend">
          <span><span className="dot available"></span> Tersedia</span>
          <span><span className="dot booked"></span> Terpesan</span>
          <span><span className="dot selected"></span> Dipilih</span>
        </div>
      </div>
    );
  };

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    const diff = selectedDates.checkOut - selectedDates.checkIn;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  const calculateTotal = () => {
    return calculateNights() * (pkg?.price_per_night || 0);
  };

  const formatDateForAPI = (date) => {
    // Format as YYYY-MM-DD without timezone conversion
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleSubmitBooking = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await createReservation({
        package_id: pkg.id,
        check_in_date: formatDateForAPI(selectedDates.checkIn),
        check_out_date: formatDateForAPI(selectedDates.checkOut),
        ...bookingData,
      });

      if (response.success) {
        setBookingResult(response.data);
      } else {
        // Show detailed validation errors if available
        if (response.errors) {
          const errorMessages = Object.values(response.errors).flat().join(', ');
          setError(errorMessages || response.message);
        } else {
          setError(response.message || 'Booking gagal');
        }
      }
    } catch (err) {
      // Show detailed validation errors from API response
      const errorData = err.response?.data;
      if (errorData?.errors) {
        const errorMessages = Object.values(errorData.errors).flat().join(', ');
        setError(errorMessages);
      } else {
        setError(errorData?.message || 'Gagal membuat booking');
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="package-detail-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Memuat detail paket...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="package-detail-page">
        <div className="error-container">
          <h2>Paket tidak ditemukan</h2>
          <Link to="/packages" className="btn btn-primary">Kembali ke Paket</Link>
        </div>
      </div>
    );
  }

  if (bookingResult) {
    return (
      <div className="package-detail-page">
        <div className="booking-success">
          <div className="success-icon">✓</div>
          <h2>Booking Berhasil!</h2>
          <p>Booking Anda telah berhasil dibuat.</p>
          <div className="booking-details-card">
            <div className="detail-row">
              <span>Kode Booking:</span>
              <strong className="booking-code">{bookingResult.booking_code}</strong>
            </div>
            <div className="detail-row">
              <span>Paket:</span>
              <strong>{pkg.name}</strong>
            </div>
            <div className="detail-row">
              <span>Check-in:</span>
              <strong>{new Date(bookingResult.check_in_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </div>
            <div className="detail-row">
              <span>Check-out:</span>
              <strong>{new Date(bookingResult.check_out_date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</strong>
            </div>
            <div className="detail-row total">
              <span>Total:</span>
              <strong>{formatPrice(bookingResult.total_price)}</strong>
            </div>
          </div>
          <p className="note">Simpan kode booking Anda. Anda dapat menggunakannya untuk mengecek status booking.</p>
          <div className="action-buttons">
            <Link to="/check-booking" className="btn btn-primary">Cek Status Booking</Link>
            <Link to="/" className="btn btn-outline">Kembali ke Beranda</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="package-detail-page">
      <div className="page-hero small">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <Link to="/packages" className="back-link">← Kembali ke Paket</Link>
          <h1>{pkg.name}</h1>
          <div className="hero-location">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
            </svg>
            {pkg.location?.name}
          </div>
        </div>
      </div>

      <div className="package-content-wrapper">
        <div className="container">
          <div className="package-layout">
            <div className="package-main">
              <div className="package-gallery">
                <div className="main-image">
                  <img
                    src={pkg.images?.[0] || `https://picsum.photos/800/500?random=${pkg.id}`}
                    alt={pkg.name}
                    onError={(e) => { e.target.src = `https://picsum.photos/800/500?random=${pkg.id}`; }}
                  />
                </div>
                {pkg.images?.length > 1 && (
                  <div className="thumbnail-row">
                    {pkg.images.slice(1, 4).map((img, i) => (
                      <div key={i} className="thumbnail">
                        <img 
                          src={img || `https://picsum.photos/200/150?random=${pkg.id + i}`} 
                          alt={`${pkg.name} ${i + 2}`}
                          onError={(e) => { e.target.src = `https://picsum.photos/200/150?random=${pkg.id + i}`; }}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <section className="detail-section">
                <h2>Tentang Paket Ini</h2>
                <p>{pkg.description}</p>
              </section>

              <section className="detail-section">
                <h2>Fasilitas</h2>
                <div className="facilities-grid">
                  {(pkg.facilities || []).map((facility, i) => (
                    <div key={i} className="facility-item">
                      <span className="facility-icon">✓</span>
                      {facility}
                    </div>
                  ))}
                </div>
              </section>

              <section className="detail-section">
                <h2>Kalender Ketersediaan</h2>
                {renderCalendar()}
              </section>
            </div>

            <div className="package-sidebar">
              <div className="booking-card">
                <div className="price-display">
                  <span className="price">{formatPrice(pkg.price_per_night)}</span>
                  <span className="per-night">/ malam</span>
                </div>

                <div className="capacity-info">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                  Maksimal {pkg.capacity} tamu
                </div>

                <div className="selected-dates">
                  <div className="date-box">
                    <label>Check-in</label>
                    <span>{selectedDates.checkIn ? selectedDates.checkIn.toLocaleDateString('id-ID') : 'Pilih tanggal'}</span>
                  </div>
                  <div className="date-box">
                    <label>Check-out</label>
                    <span>{selectedDates.checkOut ? selectedDates.checkOut.toLocaleDateString('id-ID') : 'Pilih tanggal'}</span>
                  </div>
                </div>

                {selectedDates.checkIn && selectedDates.checkOut && (
                  <div className="booking-summary">
                    <div className="summary-row">
                      <span>{formatPrice(pkg.price_per_night)} × {calculateNights()} malam</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                    <div className="summary-total">
                      <span>Total</span>
                      <span>{formatPrice(calculateTotal())}</span>
                    </div>
                  </div>
                )}

                {!showBookingForm ? (
                  <button
                    className="btn btn-primary btn-full"
                    disabled={!selectedDates.checkIn || !selectedDates.checkOut}
                    onClick={() => setShowBookingForm(true)}
                  >
                    {selectedDates.checkIn && selectedDates.checkOut ? 'Booking Sekarang' : 'Pilih Tanggal Dulu'}
                  </button>
                ) : (
                  <form className="booking-form" onSubmit={handleSubmitBooking}>
                    {error && <div className="error-message">{error}</div>}
                    <div className="form-group">
                      <label>Nama Lengkap</label>
                      <input
                        type="text"
                        required
                        value={bookingData.guest_name}
                        onChange={(e) => setBookingData({ ...bookingData, guest_name: e.target.value })}
                        placeholder="Masukkan nama lengkap"
                      />
                    </div>
                    <div className="form-group">
                      <label>Email</label>
                      <input
                        type="email"
                        required
                        value={bookingData.guest_email}
                        onChange={(e) => setBookingData({ ...bookingData, guest_email: e.target.value })}
                        placeholder="Masukkan email Anda"
                      />
                    </div>
                    <div className="form-group">
                      <label>Telepon</label>
                      <input
                        type="tel"
                        required
                        value={bookingData.guest_phone}
                        onChange={(e) => setBookingData({ ...bookingData, guest_phone: e.target.value })}
                        placeholder="Masukkan nomor telepon"
                      />
                    </div>
                    <div className="form-group">
                      <label>Jumlah Tamu</label>
                      <select
                        value={bookingData.guests_count}
                        onChange={(e) => setBookingData({ ...bookingData, guests_count: parseInt(e.target.value) })}
                      >
                        {[...Array(pkg.capacity)].map((_, i) => (
                          <option key={i + 1} value={i + 1}>{i + 1} Tamu</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Catatan (Opsional)</label>
                      <textarea
                        value={bookingData.notes}
                        onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                        placeholder="Ada permintaan khusus?"
                        rows="3"
                      ></textarea>
                    </div>
                    <button type="submit" className="btn btn-primary btn-full" disabled={submitting}>
                      {submitting ? 'Memproses...' : 'Konfirmasi Booking'}
                    </button>
                    <button type="button" className="btn btn-outline btn-full" onClick={() => setShowBookingForm(false)}>
                      Batal
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PackageDetailPage;
