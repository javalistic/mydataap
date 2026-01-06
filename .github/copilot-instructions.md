const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); // This lets the website talk to the server
const { Pool } = require("pg");
const app = express();
app.use(cors());
app.use(bodyParser.json());

// This connects to your database
const pool = new Pool({
user: "postgres",
host: "localhost",
database: "demographics_db",
password: "Isabelle", // <--- PUT YOUR REAL PASSWORD HERE!
port: 5432,
});

// This listens for data coming in
app.post("/save", async (req, res) => {
const { name, age, gender, country } = req.body;
try {
await pool.query(
"INSERT INTO demographics (name, age, gender, country) VALUES ($1, $2, $3, $4)",
[name, age, gender, country]
);
console.log("New person added: " + name);
res.send("Success! Data saved.");
} catch (err) {
console.error(err);
res.status(500).send("Error saving data");
}
});

// Start the robot!
app.listen(3000, () => {
console.log("🤖 Server is running on http://localhost:3000");
});