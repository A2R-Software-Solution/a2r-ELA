/**
 * API Client
 * Axios instance with interceptors (Retrofit equivalent)
 * 
 * Installation required: npm install axios
 */

import axios, { AxiosInstance } from 'axios';
import { ApiConfig } from './apiConfig';
import {
  authRequestInterceptor,
  authRequestErrorInterceptor,
  authResponseErrorInterceptor,
} from './interceptors/AuthInterceptor';

/**
 * Create and configure Axios instance
 */
const createApiClient = (): AxiosInstance => {
  const client = axios.create({
    baseURL: ApiConfig.BASE_URL,
    timeout: ApiConfig.Timeouts.CONNECT_TIMEOUT,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor - adds auth token
  client.interceptors.request.use(
    authRequestInterceptor,
    authRequestErrorInterceptor
  );

  // Response interceptor - handles errors
  client.interceptors.response.use(
    (response) => response,
    authResponseErrorInterceptor
  );

  // Enable request/response logging in development
  if (__DEV__) {
    client.interceptors.request.use((config) => {
      console.log('🚀 Request:', {
        method: config.method?.toUpperCase(),
        url: config.url,
        data: config.data,
      });
      return config;
    });

    client.interceptors.response.use(
      (response) => {
        console.log('✅ Response:', {
          status: response.status,
          url: response.config.url,
          data: response.data,
        });
        return response;
      },
      (error) => {
        console.log('❌ Response Error:', {
          status: error.response?.status,
          url: error.config?.url,
          message: error.message,
          data: error.response?.data,
        });
        return Promise.reject(error);
      }
    );
  }

  return client;
};

// Export singleton instance
export const apiClient = createApiClient();

/**
 * Helper to reset the client (useful for testing or logout)
 */
export const resetApiClient = (): void => {
  apiClient.defaults.headers.common['Authorization'] = '';
};