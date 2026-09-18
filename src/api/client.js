import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  timeout: 8000,
});

export const getCachedData = (key, fallbackData) => {
  try {
    const item = localStorage.getItem(`polar_cache_${key}`);
    return item ? JSON.parse(item) : fallbackData;
  } catch (e) {
    return fallbackData;
  }
};

export const setCachedData = (key, data) => {
  try {
    localStorage.setItem(`polar_cache_${key}`, JSON.stringify(data));
  } catch (e) {
    console.warn('LocalStorage save failed', e);
  }
};
