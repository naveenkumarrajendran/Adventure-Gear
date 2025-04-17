// controllers/adminDashboardController.js
const Product = require('../models/Product');

const getAdminDashboardData = async (req, res) => {
  try {
    console.log('[AdminDashboardController] Fetching dashboard data...');
    const totalProducts = await Product.countDocuments();
 
    const products = await Product.find().select('name stock');
    console.log('[AdminDashboardController] Total products:', totalProducts);
    res.status(200).json({
      totalProducts,
      products,
    });
  } catch (error) {
    console.error('[AdminDashboardController] Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard data' });
  }
};

module.exports = { getAdminDashboardData };
