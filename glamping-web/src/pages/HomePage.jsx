import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedPackages, getFeaturedGalleries } from '../services/api';
import './HomePage.css';

const HomePage = () => {
  const [packages, setPackages] = useState([]);
  const [galleries, setGalleries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCardIndex, setActiveCardIndex] = useState(0);
  const hoverTimeoutRef = useRef(null);
  
  // Typing animation state
  const [displayText, setDisplayText] = useState('');
  const fullText = 'Nikmati Alam';
  
  // Parallax scroll state
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [packagesRes, galleriesRes] = await Promise.all([
          getFeaturedPackages(),
          getFeaturedGalleries(),
        ]);
        setPackages(packagesRes.data || []);
        setGalleries(galleriesRes.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Typing effect
  useEffect(() => {
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setDisplayText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 100);
    return () => clearInterval(typingInterval);
  }, []);

  // Parallax scroll effect
  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Debounced hover handler to reduce sensitivity
  const handleCardHover = (index) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }
    hoverTimeoutRef.current = setTimeout(() => {
      setActiveCardIndex(index);
    }, 200);
  };

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-bg" style={{ transform: `translateY(${scrollY * 0.5}px)` }}>
          <div className="hero-overlay"></div>
          <div className="floating-elements">
            <span className="float-element">🌲</span>
            <span className="float-element">🌙</span>
            <span className="float-element">⭐</span>
            <span className="float-element">🏕️</span>
          </div>
        </div>
        <div className="hero-content" style={{ transform: `translateY(${scrollY * 0.2}px)` }}>
          <span className="hero-badge" data-aos="fade-down">✨ Pengalaman Glamping Premium</span>
          <h1 data-aos="fade-up" data-aos-delay="200">
            <span className="highlight typing-text">{displayText}<span className="cursor">|</span></span>
            <br />
            Dengan Kemewahan
          </h1>
          <p>
            Temukan harmoni sempurna antara petualangan alam dan kenyamanan premium. 
            Momen tak terlupakan menanti di lokasi terindah Indonesia.
          </p>
          <div className="hero-buttons">
            <Link to="/packages" className="btn btn-primary">
              Jelajahi Paket
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
            <Link to="/gallery" className="btn btn-outline">
              Lihat Galeri
            </Link>
          </div>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">500+</span>
              <span className="stat-label">Tamu Puas</span>
            </div>
            <div className="stat">
              <span className="stat-number">4.9</span>
              <span className="stat-label">Rating</span>
            </div>
            <div className="stat">
              <span className="stat-number">2</span>
              <span className="stat-label">Lokasi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Packages */}
      <section className="section packages-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-badge">Paket Kami</span>
            <h2>Pilih Pengalaman <span className="highlight">Glamping</span> Terbaik</h2>
            <p>Akomodasi pilihan untuk liburan impian Anda</p>
          </div>

          {loading ? (
            <div className="loading-grid">
              {[1, 2, 3].map((i) => (
                <div key={i} className="package-card skeleton"></div>
              ))}
            </div>
          ) : (
            <div className="fan-out-container">
              <div className="fan-out-wrapper">
                {packages.slice(0, 5).map((pkg, index) => {
                  // Calculate position relative to active card
                  const relativePos = index - activeCardIndex;
                  const isActive = index === activeCardIndex;
                  
                  return (
                    <Link 
                      to={`/packages/${pkg.slug}`} 
                      key={pkg.id} 
                      className={`fan-out-card ${isActive ? 'active-card' : ''}`}
                      style={{ 
                        '--relative-pos': relativePos,
                        '--abs-pos': Math.abs(relativePos),
                        zIndex: isActive ? 10 : 5 - Math.abs(relativePos)
                      }}
                      onMouseEnter={() => handleCardHover(index)}
                    >
                      <div className="package-image">
                        <img 
                          src={pkg.images?.[0] || `https://picsum.photos/400/300?random=${pkg.id}`} 
                          alt={pkg.name}
                          onError={(e) => {
                            e.target.src = `https://picsum.photos/400/300?random=${pkg.id}`;
                          }}
                        />
                        <div className="package-badge">
                          <span>{isActive ? '⭐ Populer' : '✨'}</span>
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
                        <div className="package-meta">
                          <span className="price">
                            {formatPrice(pkg.price_per_night)}
                          </span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          <div className="section-cta">
            <Link to="/packages" className="btn btn-primary">
              Lihat Semua Paket
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section features-section">
        <div className="container">
          <div className="section-header" data-aos="fade-up">
            <span className="section-badge">Mengapa Memilih Kami</span>
            <h2>Pengalaman <span className="highlight">GlampyCamp</span></h2>
          </div>

          <div className="features-grid">
            <div className="feature-card" data-aos="fade-up" data-aos-delay="0">
              <div className="feature-icon">🏕️</div>
              <h3>Tenda Premium</h3>
              <p>Akomodasi mewah dengan fasilitas modern dan desain menakjubkan</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="100">
              <div className="feature-icon">🌄</div>
              <h3>Lokasi Indah</h3>
              <p>Tempat terpilih dengan pemandangan memukau dan alam yang asri</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="200">
              <div className="feature-icon">🍽️</div>
              <h3>Kuliner Lezat</h3>
              <p>Hidangan lezat dengan bahan-bahan segar berkualitas</p>
            </div>
            <div className="feature-card" data-aos="fade-up" data-aos-delay="300">
              <div className="feature-icon">🌟</div>
              <h3>Melihat Bintang</h3>
              <p>Langit cerah untuk pengalaman malam yang ajaib</p>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Preview */}
      {galleries.length > 0 && (
        <section className="section gallery-section">
          <div className="container">
            <div className="section-header" data-aos="fade-up">
              <span className="section-badge">Galeri</span>
              <h2>Momen dari <span className="highlight">Tamu Kami</span></h2>
            </div>

            {/* Infinite Marquee */}
            <div className="marquee-container" data-aos="fade-up" data-aos-delay="200">
              <div className="marquee-track">
                {[...galleries, ...galleries].map((item, index) => (
                  <div key={`${item.id}-${index}`} className="marquee-item">
                    <img 
                      src={item.image || `https://picsum.photos/300/300?random=${index}`} 
                      alt={item.caption}
                      onError={(e) => {
                        e.target.src = `https://picsum.photos/300/300?random=${index}`;
                      }}
                    />
                    <div className="marquee-overlay">
                      <p>{item.caption}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="section-cta">
              <Link to="/gallery" className="btn btn-outline">
                Lihat Galeri Lengkap
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-bg"></div>
        <div className="container">
          <div className="cta-content" data-aos="zoom-in">
            <h2>Siap untuk <span className="highlight">Petualangan?</span></h2>
            <p>Booking pengalaman glamping Anda hari ini dan ciptakan kenangan seumur hidup</p>
            <Link to="/packages" className="btn btn-primary btn-large">
              Booking Sekarang
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M5 12h14M12 5l7 7-7 7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
