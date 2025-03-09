const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

const {
  createProduct,
  updateProductById,
  deleteProductById,
} = require('../controllers/adminProductController');

router.post(
  '/',
  authenticateJWT,
  authorizeRoles('admin'),
  upload.single('image'), 
  createProduct
);

router.put(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  upload.single('image'), 
  updateProductById
);

router.delete(
  '/:id',
  authenticateJWT,
  authorizeRoles('admin'),
  deleteProductById
);

module.exports = router;
