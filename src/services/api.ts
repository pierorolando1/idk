import axios from 'axios';

const API_URL = 'http://52.206.230.222:8080';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
