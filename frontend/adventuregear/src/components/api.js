// src/api.js
import axios from 'axios';
import { getToken, saveToken, getUser, saveUser } from './services/authService';

// Set the base URL for all Axios requests
axios.defaults.baseURL = 'http://localhost:5000';

// Authentication
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Registration Failed' };
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);

    if (response.data.otpRequired) {
      // OTP required
      return response.data;
    }

    const { token, user } = response.data;
    saveToken(token);
    saveUser(user);

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Login failed' };
  }
};

export const verifyOTP = async (otpData) => {
  try {
    const response = await axios.post('/auth/verify-otp', otpData);
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'OTP verification failed' };
  }
};

export const logoutUser = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; 
    return Promise.resolve({ message: 'Logout successful' });
  } catch (error) {
    throw error;
  }
};

// Products
export const getProducts = async () => {
  try {
    const response = await axios.get('/products');
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch products' };
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch product' };
  }
};

// Create a new product (admin)
export const createProduct = async (formData) => {
  try {
    const token = getToken();
    const response = await axios.post('/admin/products', formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error.response?.data || { message: 'Failed to create product' };
  }
};

// Update existing product by ID (admin)
export const updateProductById = async (productId, formData) => {
  try {
    const token = getToken();
    const response = await axios.put(`/admin/products/${productId}`, formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error.response?.data || { message: 'Failed to update product' };
  }
};

// Delete product by ID (admin)
export const deleteProductById = async (productId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`/admin/products/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error.response?.data || { message: 'Failed to delete product' };
  }
};

// User Profile
export const getUserProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('User not authorized');
    }
    const profile = await axios.get('/users/profile', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return profile.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch user profile' };
  }
};

// Cart
export const addToCart = async (productId, quantity = 1) => {
  try {
    const token = getToken();
    const response = await axios.post(
      '/cart',
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add item to cart' };
  }
};

export const getCart = async () => {
  try {
    const token = getToken();
    const response = await axios.get('/cart/me', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch cart' };
  }
};

export const removeFromCart = async (productId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`/cart/${productId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to remove item from cart' };
  }
};

export const updateCartItemQuantity = async (productId, quantity) => {
  try {
    const token = getToken();
    const response = await axios.put(
      '/cart/quantity',
      { productId, quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update quantity' };
  }
};


export const getAllOrdersForAdmin = async () => {
  try {
    const token = getToken();
    const response = await axios.get('/admin/orders', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = getToken();
    const response = await axios.put(
      `/orders/${orderId}/status`,
      { status },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};


export const getCategories = async () => {
  try {
    const response = await axios.get('/api/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(`/products/category/${category}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch products by category' };
  }
};


export const rateProduct = async (productId, rating) => {
  try {
    const token = getToken(); 
    const response = await axios.post(
      `/products/${productId}/rate`,
      { rating },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to rate product' };
  }
};


export const getAdminDashboardData = async () => {
  try {
    const token = getToken();
    const response = await axios.get('/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error.response?.data || { message: 'Failed to fetch admin dashboard data' };
  }
};

export const getAdminUsers = async () => {
  try {
    const token = getToken();
    const response = await axios.get('/admin/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch users' };
  }
};

export const deleteUser = async (userId) => {
  try {
    const token = getToken();
    const response = await axios.delete(`/admin/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to delete user' };
  }
};


export const getProductSuggestions = async (query) => {
  try {
    
    const allProducts = await getProducts();
    return allProducts.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    );
  } catch (error) {
    console.error('Error fetching product suggestions:', error);
    return [];
  }
};
