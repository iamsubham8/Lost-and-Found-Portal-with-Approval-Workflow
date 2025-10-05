import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Components
import HomePage from './components/HomePage';
import SubmitForm from './components/SubmitForm';
import ItemsList from './components/ItemsList';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import Footer from './components/Footer';

function App() {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if admin is logged in (simple check)
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = () => {
    setIsAdmin(true);
    localStorage.setItem('isAdmin', 'true');
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('isAdmin');
  };

  return (
    <Router>
      <div className="App">
        <Header isAdmin={isAdmin} onLogout={handleAdminLogout} />
        <Navigation isAdmin={isAdmin} />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/submit" element={<SubmitForm />} />
            <Route path="/items" element={<ItemsList />} />
            <Route 
              path="/admin/login" 
              element={<AdminLogin onLogin={handleAdminLogin} />} 
            />
            <Route 
              path="/admin" 
              element={
                isAdmin ? <AdminDashboard /> : <AdminLogin onLogin={handleAdminLogin} />
              } 
            />
          </Routes>
        </main>
        <Footer />
        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </Router>
  );
}

function Header({ isAdmin, onLogout }) {
  return (
    <header className="header">
      <div className="container">
        <h1>🔍 Lost & Found Portal</h1>
        <p>Find and report lost items in your community</p>
        {isAdmin && (
          <div style={{ marginTop: '1rem' }}>
            <span style={{ marginRight: '1rem' }}>Admin Mode</span>
            <button className="btn btn-secondary btn-small" onClick={onLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

function Navigation({ isAdmin }) {
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="container">
        <ul className="nav-list">
          <li className="nav-item">
            <Link 
              to="/" 
              className={location.pathname === '/' ? 'active' : ''}
            >
              Home
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/submit" 
              className={location.pathname === '/submit' ? 'active' : ''}
            >
              Report Item
            </Link>
          </li>
          <li className="nav-item">
            <Link 
              to="/items" 
              className={location.pathname === '/items' ? 'active' : ''}
            >
              Browse Items
            </Link>
          </li>
          {isAdmin ? (
            <li className="nav-item">
              <Link 
                to="/admin" 
                className={location.pathname === '/admin' ? 'active' : ''}
              >
                Admin Dashboard
              </Link>
            </li>
          ) : (
            <li className="nav-item">
              <Link 
                to="/admin/login" 
                className={location.pathname === '/admin/login' ? 'active' : ''}
              >
                Admin Login
              </Link>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
}

export default App;
