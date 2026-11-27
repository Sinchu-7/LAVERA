const ALLOWED_CATEGORIES = ["Skincare", "Makeup", "Body Care"];

// Middleware to validate product creation payload
const validateProductCreation = (req, res, next) => {
  const { name, description, price, category, image, stock, rating } = req.body;
  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length < 2) {
    errors.push("Product name is required (minimum 2 characters)");
  }

  if (!description || typeof description !== "string" || description.trim().length < 5) {
    errors.push("Product description is required (minimum 5 characters)");
  }

  if (price === undefined || price === null || isNaN(Number(price)) || Number(price) <= 0) {
    errors.push("Valid product price greater than 0 is required");
  }

  if (!category || !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`);
  }

  if (!image || typeof image !== "string" || !image.trim()) {
    errors.push("A valid product image URL is required");
  }

  if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
    errors.push("Stock cannot be negative");
  }

  if (rating !== undefined && (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)) {
    errors.push("Rating must be a number between 0 and 5");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  // Sanitize fields
  req.body.name = name.trim();
  req.body.description = description.trim();
  req.body.image = image.trim();
  req.body.price = Number(price);
  if (stock !== undefined) req.body.stock = Number(stock);
  if (rating !== undefined) req.body.rating = Number(rating);

  next();
};

// Middleware to validate product update payload
const validateProductUpdate = (req, res, next) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return res.status(400).json({
      success: false,
      message: "Please provide at least one field to update",
    });
  }

  const { name, description, price, category, image, stock, rating } = req.body;
  const errors = [];

  if (name !== undefined && (typeof name !== "string" || name.trim().length < 2)) {
    errors.push("Product name must be at least 2 characters");
  }

  if (description !== undefined && (typeof description !== "string" || description.trim().length < 5)) {
    errors.push("Product description must be at least 5 characters");
  }

  if (price !== undefined && (isNaN(Number(price)) || Number(price) <= 0)) {
    errors.push("Price must be a number greater than 0");
  }

  if (category !== undefined && !ALLOWED_CATEGORIES.includes(category)) {
    errors.push(`Category must be one of: ${ALLOWED_CATEGORIES.join(", ")}`);
  }

  if (image !== undefined && (typeof image !== "string" || !image.trim())) {
    errors.push("Image URL cannot be empty");
  }

  if (stock !== undefined && (isNaN(Number(stock)) || Number(stock) < 0)) {
    errors.push("Stock cannot be negative");
  }

  if (rating !== undefined && (isNaN(Number(rating)) || Number(rating) < 0 || Number(rating) > 5)) {
    errors.push("Rating must be between 0 and 5");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

module.exports = {
  validateProductCreation,
  validateProductUpdate,
  ALLOWED_CATEGORIES,
};
