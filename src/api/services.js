import api from './axios';

// Cart
export const getCart        = ()              => api.get('/cart');
export const addToCart      = (data)          => api.post('/cart', data);
export const updateCartItem = (id, data)      => api.put(`/cart/${id}`, data);
export const removeCartItem = (id)            => api.delete(`/cart/${id}`);
export const clearCart      = ()              => api.delete('/cart/clear');

// Orders
export const createOrder       = (data) => api.post('/orders', data);
export const getMyOrders       = ()     => api.get('/orders/my');
export const getOrderById      = (id)   => api.get(`/orders/${id}`);
export const getAllOrders       = (p)   => api.get('/orders', { params: p });
export const updateOrderStatus = (id, data) => api.put(`/orders/${id}`, data);

// Users (admin)
export const getAllUsers  = ()         => api.get('/users');
export const updateUser   = (id, data) => api.put(`/users/${id}`, data);
export const deleteUser   = (id)       => api.delete(`/users/${id}`);
export const getDashboardStats = ()    => api.get('/users/stats');

// Reviews
export const getProductReviews = (productId) => api.get(`/reviews/${productId}`);
export const createReview      = (data)      => api.post('/reviews', data);
export const deleteReview      = (id)        => api.delete(`/reviews/${id}`);

// Wishlist
export const getWishlist        = ()     => api.get('/wishlist');
export const addToWishlist      = (data) => api.post('/wishlist', data);
export const removeFromWishlist = (id)   => api.delete(`/wishlist/${id}`);
