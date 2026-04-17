require("dotenv").config();
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// GET all notes
app.get("/notes", async (req, res) => {
  const result = await pool.query("SELECT * FROM notes ORDER BY id DESC");
  res.json(result.rows);
});

// POST a note
app.post("/notes", async (req, res) => {
  const { content } = req.body;
  const result = await pool.query(
    "INSERT INTO notes (content) VALUES ($1) RETURNING *",
    [content]
  );
  res.json(result.rows[0]);
});

// DELETE a note
app.delete("/notes/:id", async (req, res) => {
  const { id } = req.params;
  await pool.query("DELETE FROM notes WHERE id=$1", [id]);
  res.json({ message: "Deleted" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log("Server running on port", PORT));