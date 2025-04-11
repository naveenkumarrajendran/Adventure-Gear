// src/App.js
import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet
} from 'react-router-dom';
import './components/styles/App.css';

/* USER COMPONENTS */
import Home from './components/user/Home';
import AboutUs from './components/user/AboutUs';
import Products from './components/user/Products';
import Category from './components/user/Category';
import ProductDetails from './components/user/ProductDetails';
import CartContainer from './components/user/cartContainer';
import Profile from './components/user/Profile';
import Checkout from './components/user/Checkout';

/* AUTH COMPONENTS */
import Login from './components/auth/Login';
import Register from './components/auth/Register';

/* COMMON COMPONENTS */
import NavBar from './components/common/NavBar';
import Footer from './components/common/Footer';

/* ADMIN COMPONENTS */
import AdminDashboard from './components/admin/AdminDashboard';
import AdminProducts from './components/admin/AdminProducts';
import AdminOrders from './components/admin/AdminOrders';
import AdminUsers from './components/admin/AdminUsers';
import AdminCategories from './components/admin/AdminCategories';
import ProtectedRoute from './components/ProtectedRoute';


const Layout = () => {
  return (
    <>
      <NavBar />
      <div style={{ marginTop: '70px' }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

const App = () => {
  const [cartCount, setCartCount] = useState(0);
  const handleCartUpdate = (newCount) => {
    setCartCount(newCount);
  };

  return (
    <div className="app-wrapper">
      <Router>
        <Routes>
          {/* Routes without Navbar/Footer */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Routes with Layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<AboutUs />} />
            <Route
              path="/products"
              element={<Products onCartUpdate={() => handleCartUpdate(cartCount + 1)} />}
            />
            <Route path="/category/:category" element={<Category />} />
            <Route
              path="/products/:id"
              element={<ProductDetails onCartUpdate={() => handleCartUpdate(cartCount + 1)} />}
            />

            {/* Protected User Routes */}
            <Route element={<ProtectedRoute allowedRoles={['user']} />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/cart" element={<CartContainer onCartUpdate={handleCartUpdate} />} />
              <Route path="/checkout" element={<Checkout />} />
            </Route>

            {/* Protected Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/products/*" element={<AdminProducts />} />
              <Route path="/admin/categories" element={<AdminCategories />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/users" element={<AdminUsers />} />
            </Route>

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
};

export default App;
