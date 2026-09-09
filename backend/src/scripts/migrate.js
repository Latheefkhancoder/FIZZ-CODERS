const fs = require("fs");
const path = require("path");
const { getPool } = require("../config/database");

/**
 * Migration runner for FIZZ-CONNECT PostgreSQL database
 */
const runMigrations = async () => {
  const pool = getPool();
  const client = await pool.connect();

  try {
    console.log("[FIZZ-CONNECT Migration] Starting database migration runner...");

    // Create schema_migrations table to track applied migrations
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        filename VARCHAR(255) PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `);

    // Fetch applied migrations
    const { rows: appliedRows } = await client.query(
      "SELECT filename FROM schema_migrations;"
    );
    const appliedFiles = new Set(appliedRows.map((r) => r.filename));

    // Migration directory path
    const migrationsDir = path.resolve(__dirname, "../../../database/migrations");

    if (!fs.existsSync(migrationsDir)) {
      console.error(`[FIZZ-CONNECT Migration] Migrations directory not found at: ${migrationsDir}`);
      process.exit(1);
    }

    // Read and sort migration files
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort();

    console.log(`[FIZZ-CONNECT Migration] Found ${files.length} migration file(s).`);

    for (const file of files) {
      if (appliedFiles.has(file)) {
        console.log(`[FIZZ-CONNECT Migration] Skipping already applied migration: ${file}`);
        continue;
      }

      console.log(`[FIZZ-CONNECT Migration] Executing migration: ${file}...`);
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf8");

      await client.query("BEGIN;");
      await client.query(sql);
      await client.query(
        "INSERT INTO schema_migrations (filename) VALUES ($1);",
        [file]
      );
      await client.query("COMMIT;");

      console.log(`[FIZZ-CONNECT Migration] Successfully applied migration: ${file}`);
    }

    console.log("[FIZZ-CONNECT Migration] All database migrations completed successfully!");
  } catch (error) {
    await client.query("ROLLBACK;");
    console.error("[FIZZ-CONNECT Migration] Error during migration execution:", error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
};

if (require.main === module) {
  runMigrations()
    .then(() => {
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

module.exports = runMigrations;
