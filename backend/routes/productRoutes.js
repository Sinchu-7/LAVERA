const express = require("express");
const router = express.Router();

const {
  getProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

// Specific routes before param routes
router.get("/search", searchProducts);
router.get("/featured", getFeaturedProducts);
router.get("/categories", getCategories);

// Standard CRUD routes
router.get("/", getProducts);
router.get("/:id", getProductById);
router.get("/:id/related", getRelatedProducts);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
