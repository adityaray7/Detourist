const API_URL = process.env.NODE_ENV === 'production'
  ? 'https://your-backend-app.onrender.com' // TODO: Replace with your backend's deployed URL
  : 'http://localhost:3001';

export default API_URL;
