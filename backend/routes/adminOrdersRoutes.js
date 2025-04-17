// routes/adminOrdersRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { getAllOrdersForAdmin, updateOrderStatus } = require('../controllers/adminOrderController');


router.get('/orders', authenticateJWT, authorizeRoles('admin'), getAllOrdersForAdmin);


router.put('/orders/:id/status', authenticateJWT, authorizeRoles('admin'), updateOrderStatus);

module.exports = router;
