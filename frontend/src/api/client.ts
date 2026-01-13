import axios from 'axios';

const client = axios.create({
  // Use relative path to leverage Vite proxy in dev and same-origin in prod
  baseURL: '', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default client;