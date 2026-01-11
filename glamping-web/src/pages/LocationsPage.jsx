import { useState, useEffect } from 'react';
import { getLocations } from '../services/api';
import { Link } from 'react-router-dom';
import './LocationsPage.css';

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      const response = await getLocations();
      setLocations(response.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="locations-page">
      <div className="page-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1><span className="highlight">Lokasi</span> Kami</h1>
          <p>Temukan destinasi glamping menakjubkan kami</p>
        </div>
      </div>

      <section className="locations-content">
        <div className="container">
          {loading ? (
            <div className="locations-grid">
              {[1, 2].map((i) => (
                <div key={i} className="location-card skeleton"></div>
              ))}
            </div>
          ) : locations.length === 0 ? (
            <div className="no-results">
              <span className="icon">📍</span>
              <h3>Belum ada lokasi</h3>
              <p>Kembali lagi untuk destinasi menakjubkan!</p>
            </div>
          ) : (
            <div className="locations-grid">
              {locations.map((location, index) => (
                <div key={location.id} className="location-card" style={{ animationDelay: `${index * 0.2}s` }}>
                  <div className="location-image">
                    <img
                      src={location.image || `https://picsum.photos/600/400?random=${location.id + 50}`}
                      alt={location.name}
                      onError={(e) => { e.target.src = `https://picsum.photos/600/400?random=${location.id + 50}`; }}
                    />
                    <div className="location-badge">{location.packages?.length || 0} Paket</div>
                  </div>
                  <div className="location-content">
                    <h2>{location.name}</h2>
                    <div className="location-address">
                      <svg viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                      </svg>
                      {location.address}
                    </div>
                    <p>{location.description}</p>
                    
                    {location.map_embed_url && (
                      <div className="location-map">
                        <iframe
                          src={location.map_embed_url}
                          width="100%"
                          height="250"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        ></iframe>
                      </div>
                    )}

                    <Link to={`/packages?location=${location.id}`} className="btn btn-primary">
                      Lihat Paket di Lokasi Ini
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default LocationsPage;
