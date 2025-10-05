# Lost & Found Portal

A comprehensive web application for managing lost and found items with an approval workflow system. Built with Node.js/Express backend and React frontend.

## Features

- **Item Submission**: Users can submit found items with photos and detailed descriptions
- **Approval Workflow**: Moderators review and approve/reject submissions
- **Public Listing**: Approved items are visible to the public for claiming
- **Claim System**: Users can claim items they've lost
- **Admin Dashboard**: Complete moderation interface with statistics
- **Notification System**: Real-time notifications for all actions
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

### Backend
- Node.js with Express.js
- SQLite database
- Multer for file uploads
- CORS for cross-origin requests
- UUID for unique identifiers

### Frontend
- React with React Router
- Axios for API calls
- React Toastify for notifications
- Responsive CSS with modern design

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd lost-found-portal
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start the development servers**
   ```bash
   npm run dev
   ```

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

### Public Endpoints
- `GET /api/items` - Get approved items
- `GET /api/items/:id` - Get specific item
- `POST /api/items` - Submit new item
- `PUT /api/items/:id/claim` - Claim an item

### Admin Endpoints
- `GET /api/admin/items` - Get all items (including pending)
- `PUT /api/admin/items/:id/approve` - Approve item
- `PUT /api/admin/items/:id/reject` - Reject item
- `POST /api/admin/login` - Admin login
- `GET /api/notifications` - Get system notifications

## Database Schema

### Items Table
- `id` - Unique identifier
- `title` - Item title
- `description` - Detailed description
- `category` - Item category
- `location_found` - Where it was found
- `date_found` - When it was found
- `contact_info` - Reporter's contact
- `image_url` - Photo URL
- `status` - pending_approval/approved/claimed/rejected
- `claimed_by` - Claimant name
- `claimant_contact` - Claimant contact
- `claimed_date` - When it was claimed
- `created_at` - Submission timestamp
- `approved_at` - Approval timestamp
- `approved_by` - Moderator who approved

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

```
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

## Development

### Running Individual Services

- **Backend only**: `npm run server`
- **Frontend only**: `npm run client`
- **Both**: `npm run dev`

### Building for Production

```bash
npm run build
```

## Security Notes

- The current implementation uses simple password authentication for demo purposes
- In production, implement proper authentication with JWT tokens
- Add input validation and sanitization
- Implement rate limiting
- Use HTTPS in production
- Store files in a secure cloud storage service

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details



