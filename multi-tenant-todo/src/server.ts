import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ====================
// HEALTH CHECK
// ====================

app.get("/", (req, res) => {
  res.json({
    message: "Multi-Tenant Todo API is running 🚀",
  });
});

app.get("/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");

    res.json({
      status: "OK",
      database: "Connected",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      status: "ERROR",
      database: "Disconnected",
    });
  }
});

// ====================
// CREATE TENANT
// ====================

app.post("/tenants", async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Tenant name is required",
      });
    }

    const result = await pool.query(
      "INSERT INTO tenants (name) VALUES ($1) RETURNING *",
      [name]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create tenant",
    });
  }
});

// ====================
// CREATE USER
// ====================

app.post("/users", async (req, res) => {
  try {
    const { name, email, tenantId } = req.body;

    if (!name || !email || !tenantId) {
      return res.status(400).json({
        message: "name, email and tenantId are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO users (name, email, tenant_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, email, tenantId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user",
    });
  }
});

// ====================
// CREATE TODO
// ====================

app.post("/todos", async (req, res) => {
  try {
    const { title, userId, tenantId } = req.body;

    if (!title || !userId || !tenantId) {
      return res.status(400).json({
        message: "title, userId and tenantId are required",
      });
    }

    const result = await pool.query(
      `INSERT INTO todos (title, user_id, tenant_id)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [title, userId, tenantId]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create todo",
    });
  }
});

// ====================
// GET TODOS
// ====================

app.get("/todos", async (req, res) => {
  try {
    const tenantId = req.header("x-tenant-id");

    if (!tenantId) {
      return res.status(400).json({
        message: "x-tenant-id header is required",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM todos
       WHERE tenant_id = $1
       ORDER BY id DESC`,
      [tenantId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch todos",
    });
  }
});

// ====================
// GET SINGLE TODO
// ====================

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.header("x-tenant-id");

    if (!tenantId) {
      return res.status(400).json({
        message: "x-tenant-id header is required",
      });
    }

    const result = await pool.query(
      `SELECT *
       FROM todos
       WHERE id = $1 AND tenant_id = $2`,
      [id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch todo",
    });
  }
});

// ====================
// UPDATE TODO
// ====================

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const tenantId = req.header("x-tenant-id");

    if (!tenantId) {
      return res.status(400).json({
        message: "x-tenant-id header is required",
      });
    }

    const result = await pool.query(
      `UPDATE todos
       SET title = COALESCE($1, title),
           completed = COALESCE($2, completed)
       WHERE id = $3 AND tenant_id = $4
       RETURNING *`,
      [title, completed, id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update todo",
    });
  }
});

// ====================
// DELETE TODO
// ====================

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tenantId = req.header("x-tenant-id");

    if (!tenantId) {
      return res.status(400).json({
        message: "x-tenant-id header is required",
      });
    }

    const result = await pool.query(
      `DELETE FROM todos
       WHERE id = $1 AND tenant_id = $2
       RETURNING *`,
      [id, tenantId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found",
      });
    }

    res.json({
      message: "Todo deleted successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to delete todo",
    });
  }
});

// ====================
// START SERVER
// ====================

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
app.patch("/todos/:id", async (req, res) => {
  try {
    const tenantId = Number(req.headers["x-tenant-id"]);
    const todoId = Number(req.params.id);

    if (!tenantId) {
      return res.status(400).json({
        message: "x-tenant-id header is required"
      });
    }

    const { completed, title } = req.body;

    const result = await pool.query(
      `
      UPDATE todos
      SET
        title = COALESCE($1, title),
        completed = COALESCE($2, completed)
      WHERE id = $3
        AND tenant_id = $4
      RETURNING *
      `,
      [
        title ?? null,
        completed ?? null,
        todoId,
        tenantId
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "Todo not found"
      });
    }

    res.json(result.rows[0]);

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to update todo"
    });
  }
});
