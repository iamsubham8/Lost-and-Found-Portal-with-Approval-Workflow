import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminLogin({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await axios.post('/api/admin/login', credentials);
      
      if (response.data.message === 'Login successful') {
        toast.success('Login successful!');
        onLogin();
        navigate('/admin');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Invalid credentials. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container">
      <div className="admin-panel">
        <div className="login-form">
          <div className="card">
            <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
              Admin Login
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={credentials.username}
                  onChange={handleChange}
                  required
                  placeholder="Enter username"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={credentials.password}
                  onChange={handleChange}
                  required
                  placeholder="Enter password"
                />
              </div>

              <button 
                type="submit" 
                className="btn"
                disabled={isLoading}
                style={{ width: '100%' }}
              >
                {isLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f8f9fa' }}>
              <h4>Demo Credentials</h4>
              <p><strong>Username:</strong> admin</p>
              <p><strong>Password:</strong> admin123</p>
              <small style={{ color: '#666' }}>
                These are demo credentials for testing purposes.
              </small>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;


