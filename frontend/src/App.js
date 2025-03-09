import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import './components/styles/App.css';
import Home from './components/user/Home';
import Register from './components/auth/Register';
import Login from './components/auth/Login';
import Profile from './components/user/Profile'; 
import Navbar from './components/common/NavBar';
import Products from './components/user/Products';
import Category from './components/user/Category'; 
import CartContainer from './components/user/cartContainer';
import ProductDetails from './components/user/ProductDetails';
import Footer from './components/common/Footer';
import AboutUs from './components/user/AboutUs';
import Checkout from './components/user/Checkout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminUsers from './components/admin/AdminUsers';
import AdminCategories from './components/admin/AdminCategories';

const App = () => {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Container className="content">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} /> 
            <Route path="/products" element={<Products />} /> 
            <Route path="/category/:category" element={<Category />} />
            <Route path="/products/:id" element={<ProductDetails />} /> 
            <Route path="/login" element={<Login />} /> 
            <Route path="/register" element={<Register />} /> 

            {/* User Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/profile" element={<Profile />} /> 
              <Route path="/cart" element={<CartContainer />} /> 
              <Route path="/checkout" element={<Checkout />} /> 
            </Route>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} /> 
              <Route path="/admin/products/*" element={<AdminProducts />} /> 
              <Route path='/admin/categories' element={<AdminCategories/>} />
              <Route path="/admin/orders" element={<AdminOrders />} /> 
              <Route path="/admin/users" element={<AdminUsers />} /> 
            </Route>

            
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Container>
        <Footer />
      </div>
    </Router>
  );
};

export default App;