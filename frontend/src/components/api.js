import axios from 'axios';
import { getToken, saveToken, getUser, saveUser } from './services/authService';

axios.defaults.baseURL = 'http://localhost:5000'; 

// Authentication
export const registerUser = async (userData) => {
  try {
    const response = await axios.post('/auth/register', userData); 
    return response.data;
  } catch (error) {
    throw error.response?.data||{message:'Registration Failed'};
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await axios.post('/auth/login', credentials);

    if (response.data.otpRequired) {
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
    return response.data;  // This will return the token and user info
  } catch (error) {
    throw error.response.data;
  }
};


export const logoutUser = () => {
  try {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login'; // Redirect to login after logout
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
    throw error.response.data;
  }
};

export const getProductById = async (productId) => {
  try {
    const response = await axios.get(`/products/${productId}`);
    return response.data;
  } catch (error) {
    throw error.response.data;
  }
};


export const createProduct = async (formData) => {
  try {
    const token = getToken();  
    const response = await fetch('http://localhost:5000/admin/products', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,  
      },
      body: formData,  
    });
    if (!response.ok) {
      throw new Error('Failed to create product');
    }
    return response.json();
  } catch (error) {
    console.error('Error in creating product:', error);
    throw error;
  }
};



export const updateProductById = async (productId, productData) => {
  const response = await fetch(`/admin/products/${productId}`, {
    method: 'PUT',
    body: productData,
  });
  return response.json();
};

export const deleteProductById = async (productId) => {
  const response = await fetch(`/admin/products/${productId}`, {
    method: 'DELETE',
  });
  return response.ok;
};

// User Profile
export const getUserProfile = async () => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('User not authorized');
    } else {
      const profile = await axios.get('/users/profile', { 
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return profile.data;
    }
  } catch (error) {
    throw error.response.data;
  }
};

export const getCart = async () => {
  try {
    const token = getToken();
    const response = await axios.get('/orders/me', { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch cart' };
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const token = getToken();
    if (!token) {
      alert('You need to be logged in to add items to the cart');
      return;
    }

    const response = await axios.post('/orders', 
      { orderItems: [{ productId, quantity }] }, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response.data) {
      return response.data; 
    } else {
      throw new Error('Failed to add item to cart');
    }
  } catch (error) {
    throw error.response?.data || { message: 'Failed to add item to cart' };
  }
};



export const getAllOrdersForAdmin = async () => {
  try {
    const token = getToken();
    const response = await axios.get('/admin/orders', { 
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to fetch orders' };
  }
};


export const removeFromCart = async (productId) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('You need to be logged in to remove items from the cart');
    }

    let existingOrder = await axios.get('/orders/me', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    
    if (existingOrder.data && existingOrder.data._id) {
      const orderId = existingOrder.data._id;
      const updatedOrderItems = existingOrder.data.orderItems.filter(
        (item) => item.productId !== productId
      );

      await axios.put(
        `/orders/${orderId}`,
        { orderItems: updatedOrderItems },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    return { message: 'Product removed from cart' };
  } catch (error) {
    console.error('Error removing product from cart:', error);
    throw error;
  }
};


export const updateOrderStatus = async (orderId, status) => {
  try {
    const token = getToken();
    const response = await axios.put(`/orders/${orderId}/status`, { status }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Failed to update order status' };
  }
};


// Categories
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
    if (error.response) {
      throw new Error(error.response.data);
    } else {
      throw new Error('Failed to fetch products by category');
    }
  }
};

// Admin Dashboard
export const getAdminDashboardData = async () => {
  try {
    const response = await axios.get('/admin/dashboard', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching admin dashboard data:', error);
    throw error;
  }
};