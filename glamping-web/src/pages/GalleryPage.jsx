import { useState, useEffect } from 'react';
import { getGalleries } from '../services/api';
import './GalleryPage.css';

const GalleryPage = () => {
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    fetchGalleries();
  }, []);

  const fetchGalleries = async () => {
    try {
      const response = await getGalleries();
      setGalleries(response.data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gallery-page">
      <div className="page-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1><span className="highlight">Galeri</span> Kami</h1>
          <p>Momen-momen indah dari pengalaman tak terlupakan tamu kami</p>
        </div>
      </div>

      <section className="gallery-content">
        <div className="container">
          {loading ? (
            <div className="gallery-grid">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="gallery-item skeleton"></div>
              ))}
            </div>
          ) : galleries.length === 0 ? (
            <div className="no-results">
              <span className="icon">📷</span>
              <h3>Belum ada foto</h3>
              <p>Kembali lagi nanti untuk momen glamping yang menakjubkan!</p>
            </div>
          ) : (
            <div className="gallery-grid">
              {galleries.map((item, index) => (
                <div
                  key={item.id}
                  className="gallery-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedImage(item)}
                >
                  <img
                    src={item.image || `https://picsum.photos/400/400?random=${index + 20}`}
                    alt={item.caption}
                    onError={(e) => {
                      e.target.src = `https://picsum.photos/400/400?random=${index + 20}`;
                    }}
                  />
                  <div className="gallery-overlay">
                    <p>{item.caption}</p>
                    {item.guest_name && <span>— {item.guest_name}</span>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {selectedImage && (
        <div className="lightbox" onClick={() => setSelectedImage(null)}>
          <button className="close-btn" onClick={() => setSelectedImage(null)}>×</button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage.image || `https://picsum.photos/800/600?random=99`}
              alt={selectedImage.caption}
              onError={(e) => { e.target.src = `https://picsum.photos/800/600?random=99`; }}
            />
            <div className="lightbox-caption">
              <p>{selectedImage.caption}</p>
              {selectedImage.guest_name && <span>— {selectedImage.guest_name}</span>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
