# Quick Setup Guide

## 🚀 Getting Started

### Prerequisites
- Node.js (version 14 or higher)
- npm (comes with Node.js)

### Installation & Setup

1. **Install Dependencies**
   ```bash
   npm run install-all
   ```

2. **Start the Application**
   
   **Windows:**
   ```bash
   start.bat
   ```
   
   **Mac/Linux:**
   ```bash
   ./start.sh
   ```
   
   **Or manually:**
   ```bash
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - Admin Login: admin / admin123

## 📋 Features Overview

### For Users
- ✅ Submit found items with photos
- ✅ Browse approved lost items
- ✅ Claim items you've lost
- ✅ Search and filter items

### For Moderators
- ✅ Review pending submissions
- ✅ Approve or reject items
- ✅ Monitor claimed items
- ✅ View system notifications
- ✅ Dashboard with statistics

## 🔧 Workflow

1. **Submit Item** → User reports a found item
2. **Review** → Moderator reviews the submission
3. **Approve** → Item becomes public
4. **Claim** → Owner claims the item
5. **Notify** → System notifies all parties

## 📁 Project Structure

```
lost-found-portal/
├── client/          # React frontend
├── server/          # Express backend
├── package.json     # Root dependencies
├── start.bat        # Windows startup script
├── start.sh         # Unix startup script
└── README.md        # Full documentation
```

## 🐛 Troubleshooting

### Common Issues

1. **Port already in use**
   - Change ports in server/.env and client/package.json

2. **Database errors**
   - Delete lostfound.db and restart server

3. **Upload issues**
   - Ensure server/uploads/ directory exists

### Reset Everything
```bash
# Delete database and restart
rm server/lostfound.db
npm run dev
```

## 🔐 Default Credentials

- **Username:** admin
- **Password:** admin123

## 📞 Support

Check the full README.md for detailed documentation and API reference.



