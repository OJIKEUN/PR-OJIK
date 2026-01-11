import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Packages
export const getPackages = async (params = {}) => {
  const response = await api.get("/packages", { params });
  return response.data;
};

export const getFeaturedPackages = async () => {
  const response = await api.get("/packages/featured");
  return response.data;
};

export const getPackageBySlug = async (slug) => {
  const response = await api.get(`/packages/${slug}`);
  return response.data;
};

export const getPackageAvailability = async (id, startDate, endDate) => {
  const response = await api.get(`/packages/${id}/availability`, {
    params: { start_date: startDate, end_date: endDate },
  });
  return response.data;
};

// Locations
export const getLocations = async () => {
  const response = await api.get("/locations");
  return response.data;
};

export const getLocationById = async (id) => {
  const response = await api.get(`/locations/${id}`);
  return response.data;
};

// Reservations
export const createReservation = async (data) => {
  const response = await api.post("/reservations", data);
  return response.data;
};

export const checkReservation = async (bookingCode, email) => {
  const response = await api.post("/reservations/check", {
    booking_code: bookingCode,
    email: email,
  });
  return response.data;
};

// Galleries
export const getGalleries = async () => {
  const response = await api.get("/galleries");
  return response.data;
};

export const getFeaturedGalleries = async () => {
  const response = await api.get("/galleries/featured");
  return response.data;
};

// Pages
export const getPageBySlug = async (slug) => {
  const response = await api.get(`/pages/${slug}`);
  return response.data;
};

export default api;
