const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./swagger");

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser
app.use(express.json());

// Enable CORS
app.use(cors());

// Request logger middleware
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url} - body:`, req.body);
  next();
});

// Route files
const authRoutes = require("./routes/authRoutes");
const courseRoutes = require("./routes/courseRoutes");
const quizRoutes = require("./routes/quizRoutes");
const progressRoutes = require("./routes/progressRoutes");
const uploadRoutes = require("./routes/uploadRoutes");

// Mount routers
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/quizzes", quizRoutes);
app.use("/api/progress", progressRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Make uploads folder static
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (req, res) => {
  res.send("MernVerse LMS API is running...");
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, error: "Server Error" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
