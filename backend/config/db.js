const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/lavera";

    const options = {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
    };

    const connection = await mongoose.connect(mongoUri, options);

    console.log(`[MongoDB] Connected to database: ${connection.connection.name} at host: ${connection.connection.host}`);

    // Database connection lifecycle listeners
    mongoose.connection.on("error", (err) => {
      console.error(`[MongoDB] Runtime connection error: ${err.message}`);
    });

    mongoose.connection.on("disconnected", () => {
      console.warn("[MongoDB] Database disconnected. Reconnecting...");
    });

    mongoose.connection.on("reconnected", () => {
      console.log("[MongoDB] Database successfully reconnected.");
    });

    // Graceful process shutdown handler
    const handleShutdown = async (signal) => {
      console.log(`[MongoDB] Received ${signal}. Gracefully closing database connection...`);
      try {
        await mongoose.connection.close(false);
        console.log("[MongoDB] Connection closed safely.");
        process.exit(0);
      } catch (err) {
        console.error("[MongoDB] Error during connection close:", err);
        process.exit(1);
      }
    };

    process.on("SIGINT", () => handleShutdown("SIGINT"));
    process.on("SIGTERM", () => handleShutdown("SIGTERM"));

  } catch (error) {
    console.error("[MongoDB] Initial connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;
