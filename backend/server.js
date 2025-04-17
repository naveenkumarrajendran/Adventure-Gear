//------------------------------------------------------------
// server.js
//------------------------------------------------------------
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/database');
const { errorHandler } = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();
const PORT = process.env.PORT || 5000;


const whitelist = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:5173',
  process.env.FRONTEND_URL,  
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    
    if (!origin || whitelist.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  },
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  credentials: true,
  allowedHeaders: 'Content-Type, Authorization',
};

app.use(cors(corsOptions));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads')); 

// Authentication routes
const authRoutes = require('./routes/authRoutes');
// Category routes
const categoryRoutes = require('./routes/categoryRoutes');
// Product routes
const adminProductRoutes = require('./routes/adminProductRoutes');
const productRoutes = require('./routes/productRoutes');
// Cart routes
const cartRoutes = require('./routes/cartRoutes');
// Order routes
const orderRoutes = require('./routes/orderRoutes');
// User profile routes
const userRoutes = require('./routes/userRoutes');
// Admin dashboard routes
const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
// Payment routes
const paymentRoutes = require('./routes/paymentRoutes');
// Rating routes
const ratingRoutes = require('./routes/ratingRoutes');
// Additional Admin routes (users, etc.)
const adminRoutes = require('./routes/adminRoutes');
const adminOrdersRoutes = require('./routes/adminOrdersRoutes');
// Invoice routes for sending invoice emails (make sure this file exists)
const invoiceRoutes = require('./routes/invoiceRoutes');


// Auth endpoints
app.use('/auth', authRoutes);
// Categories endpoints
app.use('/api/categories', categoryRoutes);
// Public product endpoints
app.use('/products', productRoutes);
// Orders endpoints (for public or user-orders)
app.use('/orders', orderRoutes);
// Cart endpoints
app.use('/cart', cartRoutes);
// User profile endpoints
app.use('/users', userRoutes);
// Admin products endpoints (requires JWT and admin role)
app.use('/admin/products', adminProductRoutes);
// Payment endpoints
app.use('/payment', paymentRoutes);
// Admin dashboard endpoints
app.use('/admin/dashboard', adminDashboardRoutes);
// Additional admin endpoints (users, etc.)
app.use('/admin', adminRoutes);
// Admin orders endpoints (for updating order status, etc.)
app.use('/admin', adminOrdersRoutes);
// Invoice endpoints for sending invoice emails
app.use('/api/invoice', invoiceRoutes);
// Rating endpoints (grouped with the root)
app.use('/', ratingRoutes);


app.get('/', (req, res) => res.send('Welcome to Adventure Gear Backend!'));

app.use(errorHandler);


app.listen(PORT, () =>
  console.log(`Server is running on port ${PORT}`)
);
