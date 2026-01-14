import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { getPageBySlug } from '../services/api';
import './StaticPage.css';

const StaticPage = () => {
  const { slug: paramSlug } = useParams();
  const location = useLocation();
  
  // Get slug from params or extract from pathname
  const slug = paramSlug || location.pathname.replace('/', '');
  
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const response = await getPageBySlug(slug);
      if (response.success) {
        setPage(response.data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="static-page">
        <div className="page-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <div className="skeleton-title"></div>
          </div>
        </div>
        <div className="page-content">
          <div className="container">
            <div className="skeleton-content"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!page) {
    return (
      <div className="static-page">
        <div className="page-hero">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Halaman Tidak Ditemukan</h1>
          </div>
        </div>
        <div className="page-content">
          <div className="container">
            <p>Halaman yang Anda cari tidak tersedia.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="static-page">
      <div className="page-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1>{page.title}</h1>
        </div>
      </div>

      <section className="page-content">
        <div className="container">
          <div 
            className="content-body"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
        </div>
      </section>
    </div>
  );
};

export default StaticPage;
