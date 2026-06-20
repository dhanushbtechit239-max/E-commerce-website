import api from './axios';

export const fetchProducts   = (params) => api.get('/products', { params });
export const fetchProductById = (id)    => api.get(`/products/${id}`);
export const fetchCategories  = ()      => api.get('/products/categories');
export const createProduct    = (data)  => api.post('/products', data, { headers: { 'Content-Type': 'multipart/form-data' } });
export const updateProduct    = (id, d) => api.put(`/products/${id}`, d, { headers: { 'Content-Type': 'multipart/form-data' } });
export const deleteProduct    = (id)    => api.delete(`/products/${id}`);
