
const express = require("express");
const router = express.Router();
const { authenticateJWT, authorizeRoles } = require('../middleware/authMiddleware'); 

const {
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

// User routes
router.get("/", getCategories);
router.get("/:id", getCategoryById);

// Admin routes 
router.post("/", authenticateJWT, authorizeRoles("admin"), createCategory);
router.put(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  updateCategory,
);
router.delete(
  "/:id",
  authenticateJWT,
  authorizeRoles("admin"),
  deleteCategory,
);

module.exports = router;