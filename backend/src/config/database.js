const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");
const env = require("./env");

let pool = null;
let isEmbedded = false;

/**
 * Initialize an embedded in-memory PostgreSQL instance with migrations applied
 */
const initEmbeddedDb = () => {
  const { newDb } = require("pg-mem");
  const db = newDb();

  const migrationsDir = path.resolve(__dirname, "../../../database/migrations");
  if (fs.existsSync(migrationsDir)) {
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      try {
        const sql = fs.readFileSync(path.join(migrationsDir, file), "utf8");
        db.public.none(sql);
      } catch (err) {
        console.warn(`[FIZZ-CONNECT DB] Warning running migration ${file} in embedded DB:`, err.message);
      }
    }
  }

  const adapter = db.adapters.createPg();
  const memPool = new adapter.Pool();
  isEmbedded = true;
  console.log("[FIZZ-CONNECT DB] Connected to embedded PostgreSQL database (schema migrations applied).");
  return memPool;
};

/**
 * Get or initialize PostgreSQL connection pool
 */
const getPool = () => {
  if (!pool) {
    if (!env.DATABASE_URL) {
      console.log("[FIZZ-CONNECT DB] No DATABASE_URL configured. Initializing embedded PostgreSQL...");
      pool = initEmbeddedDb();
    } else {
      try {
        pool = new Pool({
          connectionString: env.DATABASE_URL,
          ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
          max: 20,
          idleTimeoutMillis: 30000,
          connectionTimeoutMillis: 3000,
        });

        pool.on("error", (err) => {
          console.error("[FIZZ-CONNECT DB] Unexpected error on idle PostgreSQL client:", err.message);
        });
      } catch (err) {
        console.warn("[FIZZ-CONNECT DB] Failed to create PostgreSQL pool. Falling back to embedded DB:", err.message);
        pool = initEmbeddedDb();
      }
    }
  }

  return pool;
};

/**
 * Execute a parameterized query against PostgreSQL pool with automatic fallback
 * @param {string} text - SQL query text with parameter placeholders ($1, $2, ...)
 * @param {Array} params - Array of parameter values
 */
const query = async (text, params) => {
  const activePool = getPool();
  try {
    return await activePool.query(text, params);
  } catch (err) {
    if (
      !isEmbedded &&
      (err.code === "ECONNREFUSED" ||
        (err.message && err.message.includes("ECONNREFUSED")) ||
        err.code === "ETIMEDOUT")
    ) {
      console.warn(
        `[FIZZ-CONNECT DB] External PostgreSQL connection failed (${err.code || err.message}). Switching to embedded PostgreSQL...`
      );
      pool = initEmbeddedDb();
      return pool.query(text, params);
    }
    throw err;
  }
};

/**
 * Get a client from the pool for transactions with automatic fallback
 */
const getClient = async () => {
  const activePool = getPool();
  try {
    return await activePool.connect();
  } catch (err) {
    if (
      !isEmbedded &&
      (err.code === "ECONNREFUSED" ||
        (err.message && err.message.includes("ECONNREFUSED")) ||
        err.code === "ETIMEDOUT")
    ) {
      console.warn(
        `[FIZZ-CONNECT DB] External PostgreSQL connection failed. Switching to embedded PostgreSQL...`
      );
      pool = initEmbeddedDb();
      return pool.connect();
    }
    throw err;
  }
};

module.exports = {
  getPool,
  query,
  getClient,
};
