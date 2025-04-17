// routes/adminDashboardRoutes.js
const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const { getAdminDashboardData } = require('../controllers/adminDashboardController');


router.get('/', authenticateJWT, authorizeRoles('admin'), getAdminDashboardData);

module.exports = router;
