const env = require("./env");

/**
 * Database Configuration Placeholder
 * 
 * PostgreSQL client / pool connection configuration will be initialized here.
 * Ready for future integration with pg / knex / prisma / sequelize.
 */

const dbConfig = {
  connectionString: env.DATABASE_URL,
  ssl: env.NODE_ENV === "production" ? { rejectUnauthorized: false } : false,
};

module.exports = dbConfig;
