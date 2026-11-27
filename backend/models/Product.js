const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Product name must be at least 2 characters"],
      maxlength: [120, "Product name cannot exceed 120 characters"],
      index: true,
    },

    description: {
      type: String,
      required: [true, "Product description is required"],
      trim: true,
      minlength: [5, "Product description must be at least 5 characters"],
    },

    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
      index: true,
    },

    originalPrice: {
      type: Number,
      default: 0,
      min: [0, "Original price cannot be negative"],
    },

    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["Skincare", "Makeup", "Body Care"],
        message: "{VALUE} is not a supported beauty category",
      },
      index: true,
    },

    image: {
      type: String,
      required: [true, "Image URL is required"],
      trim: true,
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
      index: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: [0, "Rating minimum is 0"],
      max: [5, "Rating maximum is 5"],
      index: true,
    },

    reviews: {
      type: Number,
      default: 0,
      min: [0, "Reviews count cannot be negative"],
    },

    featured: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual property: calculate discount percentage
productSchema.virtual("discountPercent").get(function () {
  if (this.originalPrice && this.originalPrice > this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// Virtual property: check if in stock
productSchema.virtual("isInStock").get(function () {
  return typeof this.stock === "number" && this.stock > 0;
});

// Compound text index for search queries
productSchema.index(
  { name: "text", description: "text" },
  { weights: { name: 5, description: 1 } }
);

// Compound index for category and price queries
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
