import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import GalleryPage from './pages/GalleryPage';
import LocationsPage from './pages/LocationsPage';
import CheckBookingPage from './pages/CheckBookingPage';
import StaticPage from './pages/StaticPage';

// Admin
import AdminLogin from './admin/AdminLogin';
import AdminLayout from './admin/AdminLayout';
import Dashboard from './admin/Dashboard';
import Packages from './admin/Packages';
import Locations from './admin/Locations';
import Galleries from './admin/Galleries';
import Reservations from './admin/Reservations';
import Pages from './admin/Pages';
import Settings from './admin/Settings';

import './index.css';

function App() {
  return (
    <Router>
      <Routes>
        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="packages" element={<Packages />} />
          <Route path="locations" element={<Locations />} />
          <Route path="galleries" element={<Galleries />} />
          <Route path="reservations" element={<Reservations />} />
          <Route path="pages" element={<Pages />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Public Routes */}
        <Route
          path="/*"
          element={
            <div className="app">
              <Navbar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/packages" element={<PackagesPage />} />
                  <Route path="/packages/:slug" element={<PackageDetailPage />} />
                  <Route path="/gallery" element={<GalleryPage />} />
                  <Route path="/locations" element={<LocationsPage />} />
                  <Route path="/check-booking" element={<CheckBookingPage />} />
                  <Route path="/terms" element={<StaticPage />} />
                  <Route path="/policy" element={<StaticPage />} />
                  <Route path="/:slug" element={<StaticPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

