/**
 * Auth Interceptor
 * Adds Firebase Authentication token to all API requests
 * 
 * This is used with Axios interceptors
 */

import auth from '@react-native-firebase/auth';
import { AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';

/**
 * Request interceptor to add Firebase ID token
 */
export const authRequestInterceptor = async (
  config: InternalAxiosRequestConfig
): Promise<InternalAxiosRequestConfig> => {
  try {
    // Get current Firebase user
    const currentUser = auth().currentUser;

    if (currentUser) {
      // Get Firebase ID token
      const token = await currentUser.getIdToken(false);

      // Add Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    // Add Content-Type header
    config.headers['Content-Type'] = 'application/json';

    return config;
  } catch (error) {
    console.error('Error getting Firebase token:', error);
    return config;
  }
};

/**
 * Error interceptor for request errors
 */
export const authRequestErrorInterceptor = (error: any): Promise<any> => {
  console.error('Request error:', error);
  return Promise.reject(error);
};

/**
 * Response error interceptor
 * Handle 401 unauthorized errors
 */
export const authResponseErrorInterceptor = async (error: any): Promise<any> => {
  if (error.response?.status === 401) {
    // Token expired or invalid - could trigger re-authentication here
    console.error('Authentication failed - token may be expired');
    
    // Optionally: Sign out user or refresh token
    // await auth().signOut();
  }

  return Promise.reject(error);
};