import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPackages, getLocations } from '../services/api';
import './PackagesPage.css';

const PackagesPage = () => {
  const [packages, setPackages] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [packagesRes, locationsRes] = await Promise.all([
        getPackages(),
        getLocations(),
      ]);
      setPackages(packagesRes.data || []);
      setLocations(locationsRes.data || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPackages = packages.filter((pkg) => {
    const matchesLocation = !selectedLocation || pkg.location_id === parseInt(selectedLocation);
    const matchesSearch = !searchQuery || 
      pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      pkg.short_description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesSearch;
  });

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="packages-page">
      <div className="page-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>Paket <span className="highlight">Glamping</span></h1>
          <p>Pilih dari koleksi pengalaman glamping premium kami</p>
        </div>
      </div>

      <section className="packages-content">
        <div className="container">
          <div className="filters-bar">
            <div className="search-box">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <circle cx="11" cy="11" r="8" strokeWidth="2"/>
                <path d="M21 21l-4.35-4.35" strokeWidth="2" strokeLinecap="round"/>
              </svg>
              <input
                type="text"
                placeholder="Cari paket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="filter-select">
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
              >
                <option value="">Semua Lokasi</option>
                {locations.map((loc) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {loading ? (
            <div className="packages-grid">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="package-card skeleton"></div>
              ))}
            </div>
          ) : filteredPackages.length === 0 ? (
            <div className="no-results">
              <span className="icon">🏕️</span>
              <h3>Paket tidak ditemukan</h3>
              <p>Coba ubah pencarian atau filter Anda</p>
            </div>
          ) : (
            <div className="packages-grid">
              {filteredPackages.map((pkg, index) => (
                <Link
                  to={`/packages/${pkg.slug}`}
                  key={pkg.id}
                  className="package-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="package-image">
                    <img
                      src={pkg.images?.[0] || `https://picsum.photos/400/300?random=${pkg.id}`}
                      alt={pkg.name}
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/400/300?random=${pkg.id}`;
                      }}
                    />
                    <div className="package-overlay">
                      <span className="view-btn">Lihat Detail →</span>
                    </div>
                  </div>
                  <div className="package-content">
                    <div className="package-location">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {pkg.location?.name || 'Lokasi Premium'}
                    </div>
                    <h3>{pkg.name}</h3>
                    <p>{pkg.short_description}</p>
                    <div className="package-facilities">
                      {(pkg.facilities || []).slice(0, 3).map((facility, i) => (
                        <span key={i} className="facility-tag">{facility}</span>
                      ))}
                      {(pkg.facilities || []).length > 3 && (
                        <span className="facility-more">+{pkg.facilities.length - 3} lagi</span>
                      )}
                    </div>
                    <div className="package-meta">
                      <span className="capacity">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                          <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                        </svg>
                        {pkg.capacity} Tamu
                      </span>
                      <span className="price">
                        {formatPrice(pkg.price_per_night)}
                        <small>/malam</small>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default PackagesPage;
