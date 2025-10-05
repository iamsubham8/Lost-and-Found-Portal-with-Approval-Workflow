import React from 'react';

function Footer() {
  return (
    <footer style={{
      background: '#333',
      color: 'white',
      padding: '2rem 0',
      marginTop: '4rem',
      textAlign: 'center'
    }}>
      <div className="container">
        <div className="grid grid-3" style={{ marginBottom: '2rem' }}>
          <div>
            <h4>Lost & Found Portal</h4>
            <p>A community-driven platform to help reunite people with their lost items.</p>
          </div>
          <div>
            <h4>Quick Links</h4>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              <li><a href="/" style={{ color: '#ccc', textDecoration: 'none' }}>Home</a></li>
              <li><a href="/submit" style={{ color: '#ccc', textDecoration: 'none' }}>Report Item</a></li>
              <li><a href="/items" style={{ color: '#ccc', textDecoration: 'none' }}>Browse Items</a></li>
            </ul>
          </div>
          <div>
            <h4>Admin</h4>
            <p>For moderators and administrators</p>
            <a href="/admin/login" style={{ color: '#667eea', textDecoration: 'none' }}>Admin Login</a>
          </div>
        </div>
        <div style={{ 
          borderTop: '1px solid #555', 
          paddingTop: '1rem', 
          color: '#ccc',
          fontSize: '0.9rem'
        }}>
          <p>&copy; 2025 Lost & Found Portal. Built with React and Node.js.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;


