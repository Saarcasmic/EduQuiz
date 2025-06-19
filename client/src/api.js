import axios from 'axios';

// Get the backend URL from environment variables
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

// Create axios instance with base URL
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
