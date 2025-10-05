import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function ItemsList() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [claimModal, setClaimModal] = useState(null);
  const [claimData, setClaimData] = useState({ claimant_name: '', claimant_contact: '' });
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const adminStatus = localStorage.getItem('isAdmin');
    if (adminStatus === 'true') {
      setIsAdmin(true);
    }
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      // If admin, fetch all items including claimed ones
      const endpoint = isAdmin ? '/api/admin/items' : '/api/items';
      const response = await axios.get(endpoint);
      setItems(response.data);
    } catch (error) {
      console.error('Error fetching items:', error);
      toast.error('Failed to load items');
    } finally {
      setLoading(false);
    }
  };

  const handleClaim = async () => {
    if (!claimData.claimant_name || !claimData.claimant_contact) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await axios.put(`/api/items/${claimModal.id}/claim`, claimData);
      toast.success('Item claimed successfully! The finder will contact you.');
      setClaimModal(null);
      setClaimData({ claimant_name: '', claimant_contact: '' });
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error('Error claiming item:', error);
      toast.error('Failed to claim item. Please try again.');
    }
  };

  const handleUnclaim = async (itemId) => {
    if (!isAdmin) {
      toast.error('Only administrators can unclaim items');
      return;
    }

    if (!window.confirm('Are you sure you want to unclaim this item? It will become available for claiming again.')) {
      return;
    }

    try {
      await axios.put(`/api/admin/items/${itemId}/unclaim`);
      toast.success('Item unclaimed successfully!');
      fetchItems(); // Refresh the list
    } catch (error) {
      console.error('Error unclaiming item:', error);
      toast.error('Failed to unclaim item. Please try again.');
    }
  };

  const filteredItems = items.filter(item => {
    // Category filtering
    const categoryMatches = filter === 'all' || item.category === filter;
    
    // Status filtering (for admin)
    const statusMatches = isAdmin ? 
      (filter === 'all' || item.status === filter || item.category === filter) :
      item.status === 'approved';
    
    // Search filtering
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location_found.toLowerCase().includes(searchTerm.toLowerCase());
    
    // If not admin, only show approved items
    if (!isAdmin) {
      return categoryMatches && matchesSearch && item.status === 'approved';
    }
    
    // If admin, check if filter is a status or category
    const isStatusFilter = ['pending_approval', 'approved', 'claimed', 'rejected'].includes(filter);
    const isCategoryFilter = !isStatusFilter && filter !== 'all';
    
    if (isStatusFilter) {
      return item.status === filter && matchesSearch;
    } else if (isCategoryFilter) {
      return item.category === filter && matchesSearch;
    } else {
      return matchesSearch; // Show all when filter is 'all'
    }
  });

  const categories = [...new Set(items.map(item => item.category))];

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <h3>Loading items...</h3>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
        <div className="card">
          <h2>{isAdmin ? 'Manage All Items' : 'Browse Found Items'}</h2>
          <p style={{ marginBottom: '2rem', color: '#666' }}>
            {isAdmin 
              ? 'Manage all items including pending, approved, and claimed items. You can approve, reject, or unclaim items.'
              : 'Browse through approved found items. If you see something that belongs to you, you can claim it.'
            }
          </p>

        {/* Search and Filter */}
        <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
          <div className="form-group">
            <label htmlFor="search">Search Items</label>
            <input
              type="text"
              id="search"
              placeholder="Search by title, description, or location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="category-filter">Filter by Category</label>
            <select
              id="category-filter"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filter for Admin */}
        {isAdmin && (
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
        )}

        {/* Results count */}
        <p style={{ marginBottom: '1rem', color: '#666' }}>
          Showing {filteredItems.length} of {items.length} items
        </p>
      </div>

      {/* Items Grid */}
      {filteredItems.length === 0 ? (
        <div className="card">
          <div className="empty-state">
            <h3>No items found</h3>
            <p>Try adjusting your search criteria or check back later for new items.</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-2">
          {filteredItems.map(item => (
            <ItemCard 
              key={item.id} 
              item={item} 
              isAdmin={isAdmin}
              onClaim={() => setClaimModal(item)}
              onUnclaim={() => handleUnclaim(item.id)}
            />
          ))}
        </div>
      )}

      {/* Claim Modal */}
      {claimModal && (
        <div className="modal">
          <div className="modal-content">
            <div className="modal-header">
              <h3 className="modal-title">Claim Item</h3>
              <button 
                className="close-btn" 
                onClick={() => {
                  setClaimModal(null);
                  setClaimData({ claimant_name: '', claimant_contact: '' });
                }}
              >
                ×
              </button>
            </div>
            
            <div className="card" style={{ marginBottom: '1rem' }}>
              <h4>{claimModal.title}</h4>
              <p><strong>Category:</strong> {claimModal.category}</p>
              <p><strong>Found at:</strong> {claimModal.location_found}</p>
              <p><strong>Found on:</strong> {new Date(claimModal.date_found).toLocaleDateString()}</p>
            </div>

            <div className="form-group">
              <label htmlFor="claimant_name">Your Name *</label>
              <input
                type="text"
                id="claimant_name"
                value={claimData.claimant_name}
                onChange={(e) => setClaimData({...claimData, claimant_name: e.target.value})}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="claimant_contact">Contact Information *</label>
              <input
                type="text"
                id="claimant_contact"
                value={claimData.claimant_contact}
                onChange={(e) => setClaimData({...claimData, claimant_contact: e.target.value})}
                placeholder="Phone number or email address"
                required
              />
            </div>

            <div className="alert alert-success">
              <strong>Note:</strong> Once you claim this item, the person who found it will be notified and will contact you directly to arrange pickup.
            </div>

            <div className="actions">
              <button 
                className="btn btn-secondary"
                onClick={() => {
                  setClaimModal(null);
                  setClaimData({ claimant_name: '', claimant_contact: '' });
                }}
              >
                Cancel
              </button>
              <button className="btn btn-success" onClick={handleClaim}>
                Claim Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ItemCard({ item, isAdmin, onClaim, onUnclaim }) {
  const getStatusClass = (status) => {
    switch (status) {
      case 'pending_approval': return 'status-pending';
      case 'approved': return 'status-approved';
      case 'claimed': return 'status-claimed';
      case 'rejected': return 'status-rejected';
      default: return 'status-approved';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending_approval': return 'Pending Approval';
      case 'approved': return 'Approved';
      case 'claimed': return 'Claimed';
      case 'rejected': return 'Rejected';
      default: return 'Approved';
    }
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
        {isAdmin && (
          <p><strong>Contact:</strong> {item.contact_info}</p>
        )}
        {item.claimed_by && (
          <div style={{ backgroundColor: '#d1ecf1', padding: '0.5rem', borderRadius: '5px', marginTop: '0.5rem' }}>
            <p><strong>Claimed by:</strong> {item.claimed_by}</p>
            <p><strong>Claimant Contact:</strong> {item.claimant_contact}</p>
            <p><strong>Claimed on:</strong> {new Date(item.claimed_date).toLocaleDateString()}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      {item.status === 'approved' && (
        <button className="btn btn-success" onClick={onClaim}>
          Claim This Item
        </button>
      )}

      {item.status === 'claimed' && isAdmin && (
        <div className="actions">
          <button className="btn btn-warning" onClick={onUnclaim}>
            Unclaim Item
          </button>
        </div>
      )}

      {item.status === 'pending_approval' && isAdmin && (
        <div style={{ padding: '0.5rem', backgroundColor: '#fff3cd', borderRadius: '5px', fontSize: '0.9rem' }}>
          ⏳ This item is pending approval by moderators
        </div>
      )}

      {item.status === 'rejected' && isAdmin && (
        <div style={{ padding: '0.5rem', backgroundColor: '#f8d7da', borderRadius: '5px', fontSize: '0.9rem' }}>
          ❌ This item was rejected and is not public
        </div>
      )}
    </div>
  );
}

export default ItemsList;

