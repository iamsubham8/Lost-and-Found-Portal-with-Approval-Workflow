# Lost & Found Portal

A comprehensive web application for managing lost and found items with an approval workflow system. Built with Node.js/Express backend and React frontend.

## Features

- **Item Submission**: Users can submit found items with photos and detailed descriptions
- **Approval Workflow**: Moderators review and approve/reject submissions
- **Public Listing**: Approved items are visible to the public for claiming
- **Claim System**: Users can claim items they've lost
- **Admin Dashboard**: Complete moderation interface with statistics
- **Notification System**: Real-time notifications for all actions


## Tech Stack

### Backend
- Node.js with Express.js
- SQLite database
- Multer for file uploads


### Frontend
- React with React Router
- Axios for API calls
- React Toastify for notifications
- Responsive CSS with modern design


   This will start:
   - Backend server on http://localhost:5000
   - React frontend on http://localhost:3000


## Usage

### For Regular Users

1. **Submit a Found Item**
   - Navigate to "Report Item"
   - Fill in the form with item details
   - Upload a photo (optional)
   - Submit for moderator review

2. **Browse Found Items**
   - Go to "Browse Items"
   - Search and filter items
   - Claim items you've lost

### For Moderators

1. **Admin Access**
   - Go to "Admin Login"
   - Use credentials: `admin` / `admin123`
   - Access the admin dashboard

2. **Moderate Items**
   - View all submitted items
   - Approve or reject submissions
   - Monitor claimed items
   - View system notifications

## API Endpoints

### Moderators Table
- `id` - Unique identifier
- `username` - Login username
- `email` - Email address
- `password` - Login password
- `created_at` - Account creation timestamp

## Workflow States

1. **Pending Approval**: Newly submitted items awaiting review
2. **Approved**: Items approved by moderators and visible to public
3. **Claimed**: Items claimed by their owners
4. **Rejected**: Items rejected by moderators

## File Structure

lost-found-portal/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── App.js         # Main app component
│   │   ├── index.js       # Entry point
│   │   └── index.css      # Global styles
│   └── package.json
├── server/                # Express backend
│   ├── uploads/           # File upload directory
│   ├── index.js          # Server entry point
│   ├── package.json
│   └── .env              # Environment variables
├── package.json          # Root package.json
└── README.md
```