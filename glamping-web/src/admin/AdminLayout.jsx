import { useState, useEffect } from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { adminLogout, getMe } from './adminApi';
import './AdminLayout.css';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    const storedUser = localStorage.getItem('admin_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    // Verify token
    getMe().catch(() => {
      navigate('/admin/login');
    });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await adminLogout();
    } catch (e) {
      console.error(e);
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    navigate('/admin/login');
  };

  const menuItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/packages', label: 'Paket', icon: '🏕️' },
    { path: '/admin/locations', label: 'Lokasi', icon: '📍' },
    { path: '/admin/galleries', label: 'Galeri', icon: '🖼️' },
    { path: '/admin/reservations', label: 'Reservasi', icon: '📅' },
    { path: '/admin/pages', label: 'Halaman', icon: '📄' },
    { path: '/admin/settings', label: 'Pengaturan', icon: '⚙️' },
  ];

  return (
    <div className={`admin-layout ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <span className="logo">🏕️</span>
          <span className="brand">GlampyCamp</span>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <a href="/" target="_blank" className="nav-item">
            <span className="nav-icon">🌐</span>
            <span className="nav-label">Lihat Website</span>
          </a>
        </div>
      </aside>

      <div className="admin-main">
        <header className="admin-header">
          <button className="toggle-sidebar" onClick={() => setSidebarOpen(!sidebarOpen)}>
            ☰
          </button>
          <div className="header-right">
            <span className="user-name">{user?.name || 'Admin'}</span>
            <button onClick={handleLogout} className="btn-logout">
              Keluar
            </button>
          </div>
        </header>

        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
