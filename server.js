const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");
require('dotenv').config();

const app = express();

// 1. Middleware (The helpers)
app.use(cors()); // Allows the HTML file to talk to this server
app.use(express.json()); // Replaces body-parser: allows us to read JSON data

// 2. Database Connection (The Phone Line to Postgres)
const pool = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "Demographics_db",
  password: process.env.DB_PASSWORD || "Isabelle", // set via .env
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432,
});

// 3. The Saving Route
app.post("/save", async (req, res) => {
  // Get data from the frontend
  const { name, age, gender, country } = req.body;

  console.log("📥 Received data for:", name);

  try {
    // Talk to the database
    const newEntry = await pool.query(
      "INSERT INTO demographics (name, age, gender, country) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, age, gender, country]
    );

    console.log("✅ Saved successfully!", newEntry.rows[0]);
    res.json({ message: "Data saved successfully!" });
    
  } catch (err) {
    // If it fails, log the EXACT error to the console so we see it
    console.error("❌ Database Error:", err.message);
    res.status(500).json({ error: "Failed to save data. Check server console." });
  }
});

// 4. Start the Server
const PORT = process.env.PORT ? Number(process.env.PORT) : 3000;
app.listen(PORT, () => {
  console.log("-----------------------------------------");
  console.log(`🤖 Brain is active on http://localhost:${PORT}`);
  console.log("-----------------------------------------");
});
