import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://e-commerce-d01f.onrender.com'
});

axiosInstance.interceptors.request.use(async function (config) {
  let token = localStorage.getItem('token');
  token = token ? JSON.parse(token) : '';

  config.headers.Authorization = `${token}`;
  return config;
});

// prod - http://216.107.136.206:4000
// stag - https://e-commerce-d01f.onrender.com/
// local- http://192.168.1.8:4000
export default axiosInstance;
