const dotenv = require("dotenv");

// Load environment variables from .env file
dotenv.config();

const env = {
  NODE_ENV: process.env.NODE_ENV || "development",
  PORT: parseInt(process.env.PORT, 10) || 5000,
  DATABASE_URL: process.env.DATABASE_URL || "",
  JWT_SECRET: process.env.JWT_SECRET || "default_fizz_connect_secret_key_change_in_production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "24h",
  JWT_REMEMBER_EXPIRES_IN: process.env.JWT_REMEMBER_EXPIRES_IN || "7d",
  FRONTEND_URL: process.env.FRONTEND_URL || "http://localhost:5173",
  RESET_PASSWORD_URL: process.env.RESET_PASSWORD_URL || "http://localhost:5173/reset-password",
  SMTP_HOST: process.env.SMTP_HOST || "",
  SMTP_PORT: parseInt(process.env.SMTP_PORT, 10) || 587,
  SMTP_USER: process.env.SMTP_USER || "",
  SMTP_PASSWORD: process.env.SMTP_PASSWORD || "",
  EMAIL_FROM: process.env.EMAIL_FROM || "no-reply@fizzconnect.com",
};

module.exports = env;
