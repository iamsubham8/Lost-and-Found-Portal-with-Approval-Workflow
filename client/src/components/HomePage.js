import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="container">
      <div className="card" style={{ textAlign: 'center', marginTop: '2rem' }}>
        <h2>Welcome to Lost & Found Portal</h2>
        <p style={{ marginBottom: '2rem', fontSize: '1.1rem', color: '#666' }}>
          A community-driven platform to help reunite people with their lost items.
          Submit found items or browse through approved listings to find what you've lost.
        </p>
        
        <div className="grid grid-2" style={{ marginTop: '2rem' }}>
          <div className="card">
            <h3>📝 Report a Found Item</h3>
            <p>Found something? Report it here and our moderators will review it before making it public.</p>
            <Link to="/submit" className="btn" style={{ marginTop: '1rem' }}>
              Submit Item
            </Link>
          </div>
          
          <div className="card">
            <h3>🔍 Browse Lost Items</h3>
            <p>Looking for something you lost? Browse through approved listings of found items.</p>
            <Link to="/items" className="btn" style={{ marginTop: '1rem' }}>
              View Items
            </Link>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f8f9fa' }}>
          <h3>How It Works</h3>
          <div className="grid grid-3" style={{ marginTop: '1rem' }}>
            <div>
              <h4>1. Submit</h4>
              <p>Report a found item with details and photos</p>
            </div>
            <div>
              <h4>2. Review</h4>
              <p>Our moderators review and approve submissions</p>
            </div>
            <div>
              <h4>3. Claim</h4>
              <p>Owners can claim items and get reunited</p>
            </div>
          </div>
        </div>

        <div className="card" style={{ marginTop: '2rem' }}>
          <h3>Recent Activity</h3>
          <p style={{ color: '#666' }}>
            Items are reviewed and approved by our community moderators to ensure quality and accuracy.
            Once approved, items become visible to the public and can be claimed by their rightful owners.
          </p>
        </div>
      </div>
    </div>
  );
}

export default HomePage;


