const express = require('express');
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

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