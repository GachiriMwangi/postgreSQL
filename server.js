const express = require("express");
const { Pool } = require("pg");
const dotenv = require("dotenv");
const router = require("./Routes/route.js");

dotenv.config();
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Database connection configuration
// const pool = new Pool({
//   user: process.env.Username,
//   host: process.env.hostname,
//   database: process.env.database,
//   password: process.env.password,
//   port: process.env.port,
// });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});
// Test the connection
pool.connect((err) => {
  if (err) {
    console.error("Error connecting to the database", err);
  } else {
    console.log("Successfully connected to the database");
  }
});

app.use("/", (req, res, next) => {
  req.pool = pool; 
  next();
}, router);

const PORT = process.env.PORTNUMBER || 4500;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
