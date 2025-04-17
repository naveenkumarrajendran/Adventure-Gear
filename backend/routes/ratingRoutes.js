const express = require('express');
const router = express.Router();
const RatingController = require('../controllers/ratingController');
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');

router.post('/products/:productId/rate', authenticateJWT, authorizeRoles('user'), RatingController.rateProduct);

module.exports = router;