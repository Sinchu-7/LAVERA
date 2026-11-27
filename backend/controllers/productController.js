const Product = require("../models/Product");

// Get all products with search, filtering, sorting, and pagination support
const getProducts = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = parseInt(req.query.limit, 10) || 0;
    const searchTerm = (req.query.search || req.query.q || "").trim();
    const category = (req.query.category || "").trim();
    const minPrice = parseFloat(req.query.minPrice);
    const maxPrice = parseFloat(req.query.maxPrice);
    const inStock = req.query.inStock === "true" || req.query.inStock === "1";
    const featured = req.query.featured === "true" || req.query.featured === "1";
    const minRating = parseFloat(req.query.minRating);
    const sort = req.query.sort || "default";

    const query = {};

    // Category filter
    if (category && category.toLowerCase() !== "all") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    // Price range filter
    if (!isNaN(minPrice) || !isNaN(maxPrice)) {
      query.price = {};
      if (!isNaN(minPrice)) query.price.$gte = minPrice;
      if (!isNaN(maxPrice)) query.price.$lte = maxPrice;
    }

    // Stock availability filter
    if (inStock) {
      query.stock = { $gt: 0 };
    }

    // Featured filter
    if (featured) {
      query.featured = true;
    }

    // Rating filter
    if (!isNaN(minRating)) {
      query.rating = { $gte: minRating };
    }

    // Keyword search filter
    if (searchTerm) {
      const escaped = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(escaped, "i");
      query.$or = [
        { name: regex },
        { description: regex },
        { category: regex },
      ];
    }

    // Dynamic sort mapping
    let sortOptions = { createdAt: -1 };
    if (sort === "low" || sort === "price_asc") {
      sortOptions = { price: 1 };
    } else if (sort === "high" || sort === "price_desc") {
      sortOptions = { price: -1 };
    } else if (sort === "rating") {
      sortOptions = { rating: -1, reviews: -1 };
    } else if (sort === "newest") {
      sortOptions = { createdAt: -1 };
    } else if (sort === "name-asc" || sort === "name_asc") {
      sortOptions = { name: 1 };
    }

    const totalProducts = await Product.countDocuments(query);

    let productQuery = Product.find(query).sort(sortOptions);

    if (limit > 0) {
      const skip = (page - 1) * limit;
      productQuery = productQuery.skip(skip).limit(limit);
    }

    const products = await productQuery;
    const totalPages = limit > 0 ? Math.ceil(totalProducts / limit) : 1;

    res.status(200).json({
      success: true,
      filters: {
        category: category || "All",
        searchTerm: searchTerm || undefined,
        minPrice: !isNaN(minPrice) ? minPrice : undefined,
        maxPrice: !isNaN(maxPrice) ? maxPrice : undefined,
        inStock,
        featured,
        minRating: !isNaN(minRating) ? minRating : undefined,
        sort,
      },
      count: products.length,
      totalProducts,
      pagination: {
        page,
        limit: limit > 0 ? limit : totalProducts,
        totalPages,
        totalProducts,
        hasNextPage: limit > 0 ? page < totalPages : false,
        hasPrevPage: limit > 0 ? page > 1 : false,
      },
      data: products,
      products,
      message: "Products fetched successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Dedicated search endpoint with relevance ranking
const searchProducts = async (req, res) => {
  try {
    const q = (req.query.q || req.query.search || "").trim();
    if (!q) {
      return res.status(200).json({ success: true, count: 0, products: [], data: [] });
    }
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escaped, "i");
    const products = await Product.find({
      $or: [{ name: regex }, { description: regex }, { category: regex }],
    }).sort({ rating: -1, createdAt: -1 });

    res.status(200).json({
      success: true,
      query: q,
      count: products.length,
      data: products,
      products,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single product by ID
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
      product,
      message: "Product retrieved successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID",
      error: error.message,
    });
  }
};

// Get featured products
const getFeaturedProducts = async (req, res) => {
  try {
    const featured = await Product.find({ featured: true }).limit(8).sort({ rating: -1 });
    res.status(200).json({
      success: true,
      count: featured.length,
      data: featured,
      products: featured,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get related products (same category)
const getRelatedProducts = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    const related = await Product.find({
      category: product.category,
      _id: { $ne: product._id },
    }).limit(4);

    res.status(200).json({
      success: true,
      count: related.length,
      data: related,
      products: related,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Get unique categories with product counts
const getCategories = async (req, res) => {
  try {
    const categories = await Product.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $project: { name: "$_id", count: 1, _id: 0 } },
      { $sort: { name: 1 } },
    ]);

    res.status(200).json({
      success: true,
      count: categories.length,
      categories,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Create product
const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
      product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Update product
const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
      product,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete product
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
      deletedId: req.params.id,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  searchProducts,
  getFeaturedProducts,
  getRelatedProducts,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
