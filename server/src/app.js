const express = require("express");
require("dotenv").config();

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const connectDB = require("./utils/db.js");

const app = express();

/* ================================
   DATABASE CONNECTION
================================ */
connectDB();

/* ================================
   SECURITY MIDDLEWARE
================================ */

// Secure HTTP headers
app.use(helmet());

// Logging (Only in development)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// Rate Limiting (Protect against brute force)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

/* ================================
   CORS CONFIGURATION
================================ */
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://todoexellence.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

/* ================================
   BODY PARSING
================================ */
app.use(express.json({ limit: "10kb" })); // protect large payload
app.use(cookieParser());

app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/* ================================
   ROUTES
================================ */
app.use("/api/users", require("./router/userRouter.js"));
app.use("/api/todos", require("./router/todoRoutes.js"));

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Server is running 🚀",
  });
});

/* ================================
   404 HANDLER
================================ */
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */
app.use((err, req, res, next) => {
  console.error(err);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;