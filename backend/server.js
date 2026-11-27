require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const productRoutes = require("./routes/productRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Welcome to LAVERA API!",
    status: "Backend is running successfully",
    endpoints: {
      products: "/api/products",
      featured: "/api/products/featured",
      categories: "/api/products/categories",
      search: "/api/products/search?q=:term",
    },
  });
});

// Product API routes
app.use("/api/products", productRoutes);

// 404 & Centralized Error Handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`LAVERA server running on port ${PORT}`);
  });
};

startServer();
