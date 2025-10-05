import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

function SubmitForm() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location_found: '',
    date_found: '',
    contact_info: ''
  });
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    'Electronics',
    'Clothing & Accessories',
    'Books & Documents',
    'Jewelry & Watches',
    'Keys & ID Cards',
    'Bags & Backpacks',
    'Sports Equipment',
    'Toys & Games',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });
    if (image) {
      submitData.append('image', image);
    }

    try {
      const response = await axios.post('/api/items', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      toast.success('Item submitted successfully! It will be reviewed by moderators.');
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: '',
        location_found: '',
        date_found: '',
        contact_info: ''
      });
      setImage(null);
      document.getElementById('image').value = '';

    } catch (error) {
      console.error('Error submitting item:', error);
      toast.error('Failed to submit item. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: '600px', margin: '2rem auto' }}>
        <h2>Report a Found Item</h2>
        <p style={{ marginBottom: '2rem', color: '#666' }}>
          Please provide as much detail as possible. Your submission will be reviewed by moderators before being made public.
        </p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="title">Item Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Brief description of the item"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Detailed Description *</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              placeholder="Describe the item in detail - color, brand, condition, any identifying marks, etc."
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category *</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              <option value="">Select a category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="location_found">Location Found *</label>
            <input
              type="text"
              id="location_found"
              name="location_found"
              value={formData.location_found}
              onChange={handleChange}
              required
              placeholder="Where did you find this item?"
            />
          </div>

          <div className="form-group">
            <label htmlFor="date_found">Date Found *</label>
            <input
              type="date"
              id="date_found"
              name="date_found"
              value={formData.date_found}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contact_info">Your Contact Information *</label>
            <input
              type="text"
              id="contact_info"
              name="contact_info"
              value={formData.contact_info}
              onChange={handleChange}
              required
              placeholder="Phone number or email address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="image">Photo (Optional)</label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              accept="image/*"
            />
            <small style={{ color: '#666', display: 'block', marginTop: '0.5rem' }}>
              Upload a photo to help identify the item. Maximum file size: 5MB
            </small>
          </div>

          <button 
            type="submit" 
            className="btn"
            disabled={isSubmitting}
            style={{ width: '100%' }}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Item'}
          </button>
        </form>

        <div className="card" style={{ marginTop: '2rem', backgroundColor: '#f8f9fa' }}>
          <h4>What happens next?</h4>
          <ul style={{ marginTop: '1rem', paddingLeft: '1.5rem' }}>
            <li>Your submission will be reviewed by our moderators</li>
            <li>Once approved, it will become visible to the public</li>
            <li>If someone claims the item, you'll be contacted</li>
            <li>You can always update your contact information</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SubmitForm;


