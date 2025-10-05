const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
// require('dotenv').config(); // Commented out since no .env file is needed for basic functionality

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Initialize SQLite Database
const db = new sqlite3.Database('lostfound.db', (err) => {
  if (err) {
    console.error('Error opening database:', err.message);
  } else {
    console.log('Connected to SQLite database');
    initializeDatabase();
  }
});

// Initialize database tables
function initializeDatabase() {
  db.serialize(() => {
    // Create items table
    db.run(`
      CREATE TABLE IF NOT EXISTS items (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT NOT NULL,
        category TEXT NOT NULL,
        location_found TEXT NOT NULL,
        date_found TEXT NOT NULL,
        contact_info TEXT NOT NULL,
        image_url TEXT,
        status TEXT DEFAULT 'pending_approval',
        claimed_by TEXT,
        claimant_contact TEXT,
        claimed_date TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        approved_at DATETIME,
        approved_by TEXT
      )
    `);

    // Create moderators table
    db.run(`
      CREATE TABLE IF NOT EXISTS moderators (
        id TEXT PRIMARY KEY,
        username TEXT UNIQUE NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default moderator
    db.get("SELECT * FROM moderators WHERE username = 'admin'", (err, row) => {
      if (!row) {
        db.run(`
          INSERT INTO moderators (id, username, email, password) 
          VALUES (?, ?, ?, ?)
        `, [uuidv4(), 'admin', 'admin@lostfound.com', 'admin123']);
        console.log('Default moderator created: admin/admin123');
      }
    });
  });
}

// Notification system (simulated)
const notifications = [];

function addNotification(message, type = 'info') {
  const notification = {
    id: uuidv4(),
    message,
    type,
    timestamp: new Date().toISOString()
  };
  notifications.push(notification);
  console.log(`[NOTIFICATION ${type.toUpperCase()}]: ${message}`);
  return notification;
}

// API Routes

// Get all items (public - only approved items)
app.get('/api/items', (req, res) => {
  db.all(`
    SELECT id, title, description, category, location_found, date_found, 
           contact_info, image_url, status, created_at
    FROM items 
    WHERE status = 'approved' 
    ORDER BY created_at DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get all items for moderator (including pending)
app.get('/api/admin/items', (req, res) => {
  db.all(`
    SELECT * FROM items 
    ORDER BY created_at DESC
  `, (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(rows);
  });
});

// Get single item
app.get('/api/items/:id', (req, res) => {
  const { id } = req.params;
  db.get(`
    SELECT * FROM items WHERE id = ?
  `, [id], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    if (!row) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }
    res.json(row);
  });
});

// Submit new item
app.post('/api/items', upload.single('image'), (req, res) => {
  const {
    title,
    description,
    category,
    location_found,
    date_found,
    contact_info
  } = req.body;

  const image_url = req.file ? `/uploads/${req.file.filename}` : null;
  const id = uuidv4();

  db.run(`
    INSERT INTO items (id, title, description, category, location_found, 
                      date_found, contact_info, image_url)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [id, title, description, category, location_found, date_found, contact_info, image_url], 
  function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    addNotification(`New item submitted: "${title}" - awaiting approval`, 'info');
    res.status(201).json({ 
      id, 
      message: 'Item submitted successfully and is pending approval' 
    });
  });
});

// Approve item
app.put('/api/admin/items/:id/approve', (req, res) => {
  const { id } = req.params;
  const { approved_by = 'admin' } = req.body;

  db.run(`
    UPDATE items 
    SET status = 'approved', approved_at = CURRENT_TIMESTAMP, approved_by = ?
    WHERE id = ?
  `, [approved_by, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // Get item details for notification
    db.get("SELECT title FROM items WHERE id = ?", [id], (err, row) => {
      if (row) {
        addNotification(`Item approved: "${row.title}" is now public`, 'success');
      }
    });

    res.json({ message: 'Item approved successfully' });
  });
});

// Reject item
app.put('/api/admin/items/:id/reject', (req, res) => {
  const { id } = req.params;
  const { reason = 'No reason provided' } = req.body;

  db.run(`
    UPDATE items 
    SET status = 'rejected'
    WHERE id = ?
  `, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found' });
      return;
    }

    // Get item details for notification
    db.get("SELECT title FROM items WHERE id = ?", [id], (err, row) => {
      if (row) {
        addNotification(`Item rejected: "${row.title}" - Reason: ${reason}`, 'warning');
      }
    });

    res.json({ message: 'Item rejected successfully' });
  });
});

// Claim item
app.put('/api/items/:id/claim', (req, res) => {
  const { id } = req.params;
  const { claimant_name, claimant_contact } = req.body;

  if (!claimant_name || !claimant_contact) {
    res.status(400).json({ error: 'Claimant name and contact are required' });
    return;
  }

  db.run(`
    UPDATE items 
    SET status = 'claimed', claimed_by = ?, claimant_contact = ?, claimed_date = CURRENT_TIMESTAMP
    WHERE id = ? AND status = 'approved'
  `, [claimant_name, claimant_contact, id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found or not available for claiming' });
      return;
    }

    // Get item details for notification
    db.get("SELECT title, contact_info FROM items WHERE id = ?", [id], (err, row) => {
      if (row) {
        addNotification(`Item claimed: "${row.title}" by ${claimant_name}`, 'success');
        addNotification(`Contact claimant: ${claimant_contact} | Original reporter: ${row.contact_info}`, 'info');
      }
    });

    res.json({ message: 'Item claimed successfully' });
  });
});

// Unclaim item (reset to approved status)
app.put('/api/admin/items/:id/unclaim', (req, res) => {
  const { id } = req.params;

  db.run(`
    UPDATE items 
    SET status = 'approved', claimed_by = NULL, claimant_contact = NULL, claimed_date = NULL
    WHERE id = ? AND status = 'claimed'
  `, [id], function(err) {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (this.changes === 0) {
      res.status(404).json({ error: 'Item not found or not claimed' });
      return;
    }

    // Get item details for notification
    db.get("SELECT title FROM items WHERE id = ?", [id], (err, row) => {
      if (row) {
        addNotification(`Item unclaimed: "${row.title}" is now available for claiming again`, 'info');
      }
    });

    res.json({ message: 'Item unclaimed successfully' });
  });
});

// Get notifications
app.get('/api/notifications', (req, res) => {
  res.json(notifications.slice(-50)); // Return last 50 notifications
});

// Admin login (simple authentication)
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  
  db.get(`
    SELECT * FROM moderators WHERE username = ? AND password = ?
  `, [username, password], (err, row) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    
    if (!row) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }
    
    res.json({ 
      message: 'Login successful',
      user: { id: row.id, username: row.username, email: row.email }
    });
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
  }
  res.status(500).json({ error: error.message });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Admin panel: http://localhost:${PORT}/admin`);
  console.log(`API endpoints: http://localhost:${PORT}/api`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Database connection closed.');
    process.exit(0);
  });
});

