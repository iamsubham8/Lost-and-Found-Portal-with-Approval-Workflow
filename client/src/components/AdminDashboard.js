import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function AdminDashboard() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  useEffect(() => {
    fetchItems();
    fetchNotifications();
  }, []);

  const fetchItems = async () => {
    try {
      const response = await axios.get('/api/admin/items');
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const fetchNotifications = async () => {
    try {
      const response = await axios.get('/api/notifications');
      setNotifications(response.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const handleApprove = async (itemId) => {
    try {
      await axios.put(`/api/admin/items/${itemId}/approve`, { approved_by: 'admin' });
      toast.success('Item approved successfully!');
      fetchItems();
      fetchNotifications();
    } catch (error) {
      console.error('Error approving item:', error);
      toast.error('Failed to approve item');
    }
  };

  const handleReject = async (itemId) => {
    const reason = prompt('Please provide a reason for rejection:');
    if (reason === null) return; // User cancelled
    
    try {
      await axios.put(`/api/admin/items/${itemId}/reject`, { reason });
      toast.success('Item rejected successfully!');
      fetchItems();
      fetchNotifications();
    } catch (error) {
      console.error('Error rejecting item:', error);
      toast.error('Failed to reject item');
    }
  };

  const handleUnclaim = async (itemId) => {
    if (!window.confirm('Are you sure you want to unclaim this item? It will become available for claiming again.')) {
      return;
    }
    
    try {
      await axios.put(`/api/admin/items/${itemId}/unclaim`);
      toast.success('Item unclaimed successfully!');
      fetchItems();
      fetchNotifications();
    } catch (error) {
      console.error('Error unclaiming item:', error);
      toast.error('Failed to unclaim item');
    }
  };

  const filteredItems = items.filter(item => {
    if (filter === 'all') return true;
    return item.status === filter;
  });

  const stats = {
    total: items.length,
    pending: items.filter(item => item.status === 'pending_approval').length,
    approved: items.filter(item => item.status === 'approved').length,
    claimed: items.filter(item => item.status === 'claimed').length,
    rejected: items.filter(item => item.status === 'rejected').length
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h3>Loading dashboard...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="admin-panel">
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2>Admin Dashboard</h2>
            <button 
              className="btn btn-secondary"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              Notifications ({notifications.length})
            </button>
          </div>

          {/* Statistics */}
          <div className="dashboard-stats">
            <div className="stat-card">
              <div className="stat-number">{stats.total}</div>
              <div className="stat-label">Total Items</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.pending}</div>
              <div className="stat-label">Pending Approval</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.approved}</div>
              <div className="stat-label">Approved</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.claimed}</div>
              <div className="stat-label">Claimed</div>
            </div>
            <div className="stat-card">
              <div className="stat-number">{stats.rejected}</div>
              <div className="stat-label">Rejected</div>
            </div>
          </div>

          {/* Notifications Panel */}
          {showNotifications && (
            <div className="card" style={{ marginBottom: '2rem' }}>
              <h3>Recent Notifications</h3>
              {notifications.length === 0 ? (
                <p style={{ color: '#666', fontStyle: 'italic' }}>No notifications yet</p>
              ) : (
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {notifications.slice(-10).reverse().map(notification => (
                    <div 
                      key={notification.id}
                      className="alert"
                      style={{
                        backgroundColor: notification.type === 'success' ? '#d4edda' : 
                                       notification.type === 'warning' ? '#fff3cd' : '#d1ecf1',
                        color: notification.type === 'success' ? '#155724' :
                               notification.type === 'warning' ? '#856404' : '#0c5460',
                        marginBottom: '0.5rem',
                        padding: '0.75rem',
                        fontSize: '0.9rem'
                      }}
                    >
                      <strong>{new Date(notification.timestamp).toLocaleString()}</strong><br/>
                      {notification.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Filter */}
          <div className="form-group" style={{ maxWidth: '300px', marginBottom: '2rem' }}>
            <label htmlFor="status-filter">Filter by Status</label>
            <select
              id="status-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Items</option>
              <option value="pending_approval">Pending Approval</option>
              <option value="approved">Approved</option>
              <option value="claimed">Claimed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Items List */}
          <div className="grid grid-2">
            {filteredItems.length === 0 ? (
              <div className="card">
                <div className="empty-state">
                  <h3>No items found</h3>
                  <p>No items match the current filter criteria.</p>
                </div>
              </div>
            ) : (
              filteredItems.map(item => (
                <AdminItemCard 
                  key={item.id} 
                  item={item} 
                  onApprove={() => handleApprove(item.id)}
                  onReject={() => handleReject(item.id)}
                  onUnclaim={() => handleUnclaim(item.id)}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function AdminItemCard({ item, onApprove, onReject, onUnclaim }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending_approval': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'claimed': return 'status-claimed';
      case 'rejected': return 'status-rejected';
      default: return '';
    }
  };

  const getStatusText = (status) => {
    return status.replace('_', ' ').toUpperCase();
  };

  return (
    <div className="card item-card">
      {item.image_url && (
        <img 
          src={`http://localhost:5000${item.image_url}`} 
          alt={item.title}
          className="item-image"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      )}

      <div className="item-meta">
        <span className={`status ${getStatusClass(item.status)}`}>
          {getStatusText(item.status)}
        </span>
        <span>{new Date(item.created_at).toLocaleDateString()}</span>
      </div>

      <h3>{item.title}</h3>
      <p className="item-description">{item.description}</p>

      <div style={{ marginBottom: '1rem', fontSize: '0.9rem', color: '#666' }}>
        <p><strong>Category:</strong> {item.category}</p>
        <p><strong>Found at:</strong> {item.location_found}</p>
        <p><strong>Found on:</strong> {new Date(item.date_found).toLocaleDateString()}</p>
        <p><strong>Contact:</strong> {item.contact_info}</p>
        {item.approved_at && (
          <p><strong>Approved:</strong> {new Date(item.approved_at).toLocaleDateString()}</p>
        )}
        {item.claimed_by && (
          <div style={{ backgroundColor: '#d1ecf1', padding: '0.5rem', borderRadius: '5px', marginTop: '0.5rem' }}>
            <p><strong>Claimed by:</strong> {item.claimed_by}</p>
            <p><strong>Claimant Contact:</strong> {item.claimant_contact}</p>
            <p><strong>Claimed on:</strong> {new Date(item.claimed_date).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {item.status === 'pending_approval' && (
        <div className="actions">
          <button className="btn btn-success btn-small" onClick={onApprove}>
            Approve
          </button>
          <button className="btn btn-danger btn-small" onClick={onReject}>
            Reject
          </button>
        </div>
      )}

      {item.status === 'approved' && (
        <div style={{ padding: '0.5rem', backgroundColor: '#d4edda', borderRadius: '5px', fontSize: '0.9rem' }}>
          ✓ This item is public and can be claimed by users
        </div>
      )}

      {item.status === 'claimed' && (
        <div>
          <div style={{ padding: '0.5rem', backgroundColor: '#d1ecf1', borderRadius: '5px', fontSize: '0.9rem', marginBottom: '1rem' }}>
            🎉 This item has been successfully claimed!
          </div>
          <div className="actions">
            <button className="btn btn-warning btn-small" onClick={onUnclaim}>
              Unclaim Item
            </button>
          </div>
        </div>
      )}

      {item.status === 'rejected' && (
        <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '5px', fontSize: '0.9rem' }}>
          ❌ This item was rejected and is not public
        </div>
      )}
    </div>
  );
}

export default AdminDashboard;

