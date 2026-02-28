import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const auth = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post('/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
};

export const transactions = {
  // Expenses
  createExpense: (data: any) => api.post('/transactions/expense', data),
  getExpenses: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/transactions/expenses', { params }),
  updateExpense: (id: string, data: any) =>
    api.put(`/transactions/expense/${id}`, data),
  deleteExpense: (id: string) => api.delete(`/transactions/expense/${id}`),

  // Incomes
  createIncome: (data: any) => api.post('/transactions/income', data),
  getIncomes: (params?: { startDate?: string; endDate?: string }) =>
    api.get('/transactions/incomes', { params }),
  updateIncome: (id: string, data: any) =>
    api.put(`/transactions/income/${id}`, data),
  deleteIncome: (id: string) => api.delete(`/transactions/income/${id}`),

  // Summary
  getSummary: (month?: string) => api.get('/transactions/summary', { params: { month } }),
  getCategories: (month?: string) => api.get('/transactions/categories', { params: { month } }),
};

export default api;
