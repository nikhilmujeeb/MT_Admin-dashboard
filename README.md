# MT_Admin-dashboard

## Features
- Admin authentication with JWT
- Agent creation and management
- CSV/XLSX file upload and distribution
- Equal distribution of leads among 5 agents

## Setup Instructions

### Backend
1. Navigate to backend directory: `cd backend`
2. Install dependencies: `npm install`
3. Create `.env` file with:
  PORT=5000
  MONGO_URI=mongodb://localhost:27017/mern_app
  JWT_SECRET=your_jwt_secret
  ADMIN_REGISTRATION_ENABLED=true
4. Start MongoDB service
5. Run server: `npm run dev`

### Frontend
1. Navigate to frontend directory: `cd frontend`
2. Install dependencies: `npm install`
3. Start application: `npm start`
4. Open http://localhost:3000 in your browser

## Usage
1. Create an admin account (signup)
2. Login with admin credentials
3. Create at least 5 agents
4. Upload a CSV file with columns: FirstName, Phone, Notes
5. View distributed leads in the agent list

### Video Demonstration Link -https://drive.google.com/file/d/1tDORVpIBlxx71js6AvpJzhwtanI6J9MC/view?usp=drive_link
