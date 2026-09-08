const { Pool } = require("pg");
const env = require("./env");

let pool = null;

/**
 * Get or initialize PostgreSQL connection pool
 */
const getPool = () => {
  if (!pool) {
    if (!env.DATABASE_URL) {
      console.warn("[FIZZ-CONNECT DB] Warning: DATABASE_URL environment variable is not defined.");
    }

    pool = new Pool({
      connectionString: env.DATABASE_URL,
      ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
      max: 20,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on("error", (err) => {
      console.error("[FIZZ-CONNECT DB] Unexpected error on idle PostgreSQL client:", err.message);
    });
  }

  return pool;
};

/**
 * Execute a parameterized query against PostgreSQL pool
 * @param {string} text - SQL query text with parameter placeholders ($1, $2, ...)
 * @param {Array} params - Array of parameter values
 */
const query = async (text, params) => {
  const activePool = getPool();
  return activePool.query(text, params);
};

/**
 * Get a client from the pool for transactions
 */
const getClient = async () => {
  const activePool = getPool();
  return activePool.connect();
};

module.exports = {
  getPool,
  query,
  getClient,
};
