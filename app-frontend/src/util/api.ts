import axios from 'axios';

const api = axios.create({
  baseURL: 'https://projeto-future-backend.onrender.com/',
});

export default api;