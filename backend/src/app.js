const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const routes = require("./routes");
const { errorHandler, notFoundHandler } = require("./middleware");

// Initialize Express application
const app = express();

// Security Middleware
app.use(helmet());

// Cross-Origin Resource Sharing
app.use(cors());

// Body Parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use("/api", routes);

// 404 Not Found Middleware
app.use(notFoundHandler);

// Centralized Error Handling Middleware
app.use(errorHandler);

module.exports = app;
