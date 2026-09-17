import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import propertyRoutes from "./routes/properties.js";
import enquiryRoutes from "./routes/enquiries.js";
import savedRoutes from "./routes/saved.js";
import userRoutes from "./routes/users.js";
import offerRoutes from "./routes/offers.js";
import notificationRoutes from "./routes/notifications.js";
import prisma from "./lib/prisma.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Request logger for development
app.use((req, res, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  }
  next();
});

// Health check endpoint
app.get("/api/health", async (req, res) => {
  try {
    // Quick probe
    await prisma.$queryRaw`SELECT 1`;
    return res.json({ status: "healthy", database: "connected", timestamp: new Date().toISOString() });
  } catch (err) {
    return res.json({
      status: "degraded",
      database: "disconnected",
      message: "Database not connected. Please ensure DATABASE_URL in .env is valid.",
      error: err.message,
    });
  }
});

// Mount API routes
app.use("/api/properties", propertyRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/saved", savedRoutes);
app.use("/api/users", userRoutes);
app.use("/api/offers", offerRoutes);
app.use("/api/notifications", notificationRoutes);

// 404 handler for API routes
app.use((req, res, next) => {
  if (req.path.startsWith("/api")) {
    return res.status(404).json({ error: "Endpoint not found" });
  }
  next();
});

// Global error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error", details: err.message });
});

const server = app.listen(PORT, async () => {
  console.log(`\n🚀 Offhome Backend Server running on http://localhost:${PORT}`);
  console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
  console.log(`🏡 Properties API: http://localhost:${PORT}/api/properties\n`);

  try {
    await prisma.$connect();
    console.log("✅ Successfully connected to PostgreSQL database via Prisma.");
  } catch (e) {
    console.warn("⚠️  Prisma database connection check warning:", e.message);
    console.warn("👉 Make sure your PostgreSQL database is running and DATABASE_URL is set in .env.");
  }
});

export default app;
