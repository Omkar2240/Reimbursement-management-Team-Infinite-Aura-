import storage from '@/lib/storage';
import axios from 'axios';
import { toast } from 'sonner';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

apiClient.interceptors.request.use(
  (config) => {
    const token = storage.getToken();

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response.data?.result ?? response.data;
  },
  (error) => {
    let message = error.response?.data?.message || error.message;

    // Enhanced error handling with a clearer structure
    if (error.response?.data?.error) {
      const { errors, error_params } = error.response.data.error;

      if (errors) {
        message = errors.join(', ');
      } else if (error_params) {
        message = error_params.map((e: any) => e.message || e.msg).join(', ');
      }
    }

    toast.error(message, {
      position: 'top-right'
    });

    // eslint-disable-next-line no-undef
    return Promise.reject({
      statusCode: error.response?.status,
      message: message
    });
  }
);

export default apiClient;
