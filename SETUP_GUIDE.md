# Installation and Setup Guide

## Quick Start Guide

Follow these steps to get the application running:

### Step 1: Backend Setup

1. Open terminal and navigate to the backend folder:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Make sure MongoDB is running on your system:
   - If using local MongoDB: `mongod` should be running
   - The default connection is: `mongodb://localhost:27017/certificate-verification`
   - To use MongoDB Atlas instead, update the MONGODB_URI in `.env`

4. Start the backend server:
```bash
npm run dev
```

You should see: `Server is running on port 5000`

### Step 2: Frontend Setup

1. Open a NEW terminal window and navigate to the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The app will automatically open in your browser at `http://localhost:3000`

## Testing the Application

### Create a Certificate
1. Go to "Create Certificate" page
2. Enter:
   - Recipient Name: "John Doe"
   - Event Name: "JavaScript Workshop"
   - Date: (Select any date)
3. Click "Create Certificate"
4. You'll see the certificate ID and QR code
5. Download the QR code for reference

### View Dashboard
1. Go to "Dashboard"
2. You should see the certificate you just created in the table
3. Click "Refresh" to reload the list

### Verify Certificate
1. Go to "Verify Certificate"
2. Enter the Certificate ID from the dashboard (e.g., CERT-1234567890-ABC123)
3. Click "Verify"
4. You'll see the certificate details if it's valid

## Troubleshooting

### Backend Issues:

**MongoDB Connection Error:**
- Make sure MongoDB is installed and running
- Check the connection string in `.env`
- Try using MongoDB Atlas (cloud): Update MONGODB_URI in backend/.env

**Port 5000 Already in Use:**
- Change the PORT in backend/.env to another number (e.g., 5001)
- Update the frontend API_URL accordingly

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Frontend Issues:

**Cannot connect to backend:**
- Make sure backend is running on port 5000
- Check REACT_APP_API_URL in frontend/.env matches your backend URL
- Check browser console for CORS errors

**Port 3000 Already in Use:**
```bash
# The app will ask if you want to use another port. Select 'y'
# Or kill the process:
npx kill-port 3000
npm start
```

## API Testing

You can test the APIs using Postman or curl:

### Create Certificate
```bash
curl -X POST http://localhost:5000/api/certificates/create \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "eventName": "Test Event",
    "date": "2024-01-15"
  }'
```

### Verify Certificate
```bash
curl http://localhost:5000/api/certificates/verify/CERT-YOUR-ID-HERE
```

### Get Certificate
```bash
curl http://localhost:5000/api/certificates/CERT-YOUR-ID-HERE
```

### Get All Certificates
```bash
curl http://localhost:5000/api/certificates
```

## File Structure Overview

```
┌─ backend/              (Express + MongoDB)
│  ├─ server.js          Main entry point
│  ├─ config/            Configuration files
│  ├─ models/            Database models
│  ├─ controllers/       Business logic
│  ├─ routes/            API endpoints
│  └─ utils/             Helper functions
│
└─ frontend/             (React + React Router)
   ├─ src/
   │  ├─ index.js        React entry point
   │  ├─ App.js          Main component & routing
   │  ├─ pages/          Page components
   │  ├─ components/     Reusable components
   │  └─ services/       API service (Axios)
```

## Next Steps

- Explore the code in both backend/ and frontend/ directories
- Add more features like bulk certificate upload
- Implement user authentication
- Deploy to cloud platforms (Heroku, Vercel, etc.)

## Support

For issues or questions, check:
1. The README.md file
2. Console error messages
3. Network tab in browser DevTools
4. Backend console logs

Happy coding! 🚀
