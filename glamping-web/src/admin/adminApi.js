import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL?.replace('/v1', '') || 'http://localhost:8000/api';

const adminApi = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Add token to requests
adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle auth errors
adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const adminLogin = (email, password) => 
  adminApi.post('/login', { email, password }).then((res) => res.data);

export const adminLogout = () => 
  adminApi.post('/logout').then((res) => res.data);

export const getMe = () => 
  adminApi.get('/me').then((res) => res.data);

// Dashboard
export const getDashboard = () => 
  adminApi.get('/dashboard').then((res) => res.data);

// Packages
export const getAdminPackages = () => 
  adminApi.get('/packages').then((res) => res.data);

export const getAdminPackage = (id) => 
  adminApi.get(`/packages/${id}`).then((res) => res.data);

export const createPackage = (data) => 
  adminApi.post('/packages', data, {
    headers: { 'Content-Type': undefined }
  }).then((res) => res.data);

export const updatePackage = (id, data) => 
  adminApi.post(`/packages/${id}`, data, {
    headers: { 'Content-Type': undefined }
  }).then((res) => res.data);

export const deletePackage = (id) => 
  adminApi.delete(`/packages/${id}`).then((res) => res.data);

// Locations
export const getAdminLocations = () => 
  adminApi.get('/locations').then((res) => res.data);

export const getAdminLocation = (id) => 
  adminApi.get(`/locations/${id}`).then((res) => res.data);

export const createLocation = (data) => 
  adminApi.post('/locations', data, {
    headers: { 'Content-Type': undefined }
  }).then((res) => res.data);

export const updateLocation = (id, data) => 
  adminApi.post(`/locations/${id}`, data, {
    headers: { 'Content-Type': undefined }
  }).then((res) => res.data);

export const deleteLocation = (id) => 
  adminApi.delete(`/locations/${id}`).then((res) => res.data);

// Galleries
export const getAdminGalleries = () => 
  adminApi.get('/galleries').then((res) => res.data);

export const getAdminGallery = (id) => 
  adminApi.get(`/galleries/${id}`).then((res) => res.data);

export const createGallery = (data) => 
  adminApi.post('/galleries', data, {
    headers: { 'Content-Type': undefined }
  }).then((res) => res.data);

export const updateGallery = (id, data) => 
  adminApi.post(`/galleries/${id}`, data, {
    headers: { 'Content-Type': undefined }
  }).then((res) => res.data);

export const deleteGallery = (id) => 
  adminApi.post(`/galleries/${id}`, { _method: 'DELETE' }).then((res) => res.data);

// Pages
export const getAdminPages = () => 
  adminApi.get('/pages').then((res) => res.data);

export const getAdminPage = (id) => 
  adminApi.get(`/pages/${id}`).then((res) => res.data);

export const updatePage = (id, data) => 
  adminApi.put(`/pages/${id}`, data).then((res) => res.data);

// Settings
export const getSettings = () => 
  adminApi.get('/settings').then((res) => res.data);

export const updateSettings = (settings) => 
  adminApi.put('/settings', { settings }).then((res) => res.data);

// Reservations
export const getAdminReservations = (params = {}) => 
  adminApi.get('/reservations', { params }).then((res) => res.data);

export const getAdminReservation = (id) => 
  adminApi.get(`/reservations/${id}`).then((res) => res.data);

export const updateReservationStatus = (id, status) => 
  adminApi.patch(`/reservations/${id}/status`, { status }).then((res) => res.data);

export default adminApi;
