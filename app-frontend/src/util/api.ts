import axios from 'axios';

const api = axios.create({
  baseURL: 'http://ip172-18-0-139-cvvh40291nsg009e3c4g-8000.direct.labs.play-with-docker.com',
});

export default api;