import { apiGet, apiPost, apiPut, apiDelete, apiPostForm, apiPutForm } from './client';

export const AuthAPI = {
  sendVerificationCode: (email) => apiPost('/api/auth/send-verification-code', { email }),
  register: (email, password, code) => apiPost('/api/auth/register', { email, password, code }),
  login: (email, password) => apiPost('/api/auth/login', { email, password }),
  google: (idToken) => apiPost('/api/auth/google', { idToken })
};

export const ProductAPI = {
  list: (category) => apiGet(`/api/product${category ? `?category=${encodeURIComponent(category)}` : ''}`),
  featured: () => apiGet('/api/product/featured'),
  get: (id) => apiGet(`/api/product/${id}`),
  create: (formData) => apiPostForm('/api/product', formData),
  update: (id, formData) => apiPutForm(`/api/product/${id}`, formData),
  remove: (id) => apiDelete(`/api/product/${id}`)
};

export const CartAPI = {
  get: () => apiGet('/api/cart'),
  add: (productId) => apiPost(`/api/cart/add/${productId}`),
  increase: (id) => apiPut(`/api/cart/${id}/increase`),
  decrease: (id) => apiPut(`/api/cart/${id}/decrease`),
  remove: (id) => apiDelete(`/api/cart/${id}`),
  validateCoupon: (couponCode) => apiPost('/api/cart/validate-coupon', { couponCode }),
  placeOrder: (dto) => apiPost('/api/cart/place-order', dto),
  myOrders: () => apiGet('/api/cart/orders')
};

export const CouponAPI = {
  list: () => apiGet('/api/coupon'),
  create: (dto) => apiPost('/api/coupon', dto),
  update: (id, dto) => apiPut(`/api/coupon/${id}`, dto),
  remove: (id) => apiDelete(`/api/coupon/${id}`)
};

export const AdminAPI = {
  dashboard: () => apiGet('/api/admin/dashboard'),
  orders: () => apiGet('/api/admin/orders'),
  users: () => apiGet('/api/admin/users'),
  promote: (userId) => apiPut(`/api/admin/users/${userId}/promote`),
  demote: (userId) => apiPut(`/api/admin/users/${userId}/demote`),
  deleteUser: (userId) => apiDelete(`/api/admin/users/${userId}`)
};
