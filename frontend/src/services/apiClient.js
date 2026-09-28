import axios from 'axios';

// Base URL points strictly to Spring Cloud API Gateway (Port 8080)
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

apiClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      status: error.response?.status || 500,
      message: error.response?.data?.message || 'Unable to connect to HamaraShops.ai API Gateway services.',
      timestamp: error.response?.data?.timestamp || new Date().toISOString(),
    };
    return Promise.reject(customError);
  }
);

export default apiClient;
