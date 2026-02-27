const express = require("express");
require("dotenv").config();

const sanitize = require("mongo-sanitize"); // Safe NoSQL sanitizer
const xss = require("xss"); // Safe XSS sanitizer (Express 5 compatible)
const { v4: uuidv4 } = require("uuid");
const logger = require("./utils/logger");

const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");

const connectDB = require("./utils/db.js");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

/* ================================
   TRUST PROXY (Important for deployment)
================================ */
app.set("trust proxy", 1);

/* ================================
   DATABASE CONNECTION
================================ */
connectDB();

/* ================================
   SECURITY MIDDLEWARE
================================ */

// 1️⃣ Secure HTTP headers
app.use(helmet());

// 2️⃣ Request ID Tracking
app.use((req, res, next) => {
  req.id = uuidv4();
  res.setHeader("X-Request-ID", req.id);

  logger.info({
    requestId: req.id,
    method: req.method,
    url: req.originalUrl,
  });

  next();
});

// 3️⃣ Rate Limiting (Only on API routes)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many requests, please try again later.",
  },
});
app.use("/api", limiter);

// 4️⃣ Body Parsing
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

// 5️⃣ Prevent NoSQL Injection (Express 5 Safe)
app.use((req, res, next) => {
  if (req.body) req.body = sanitize(req.body);
  if (req.params) req.params = sanitize(req.params);
  if (req.query) req.query = sanitize(req.query);
  next();
});

// 6️⃣ Prevent XSS Attacks (Express 5 Safe Custom Middleware)
app.use((req, res, next) => {
  if (req.body && typeof req.body === "object") {
    for (let key in req.body) {
      if (typeof req.body[key] === "string") {
        req.body[key] = xss(req.body[key]);
      }
    }
  }
  next();
});

// 7️⃣ Enable CORS
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://todoexellence.netlify.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

// 8️⃣ Logging (Development only)
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// 9️⃣ Disable Caching
app.use((req, res, next) => {
  res.set("Cache-Control", "no-store");
  next();
});

/* ================================
   ROUTES
================================ */
app.use("/api/users", require("./router/userRouter.js"));
app.use("/api/todos", require("./router/todoRoutes.js"));

// Root route
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
    message: `Route ${req.originalUrl} not found`,
  });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */
app.use(errorHandler);

module.exports = app;