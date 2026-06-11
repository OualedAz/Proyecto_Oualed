const mysql = require("mysql2/promise");
require("dotenv").config();

const poolConfig = {
  host: process.env.DB_HOST || "localhost",
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "gescasesrurals",
  waitForConnections: true,
  connectionLimit: process.env.VERCEL ? 3 : 10,
  queueLimit: 0,
  timezone: "+00:00",
};

// Enable SSL for cloud database connections (TiDB, PlanetScale, etc.)
if (process.env.DB_SSL === "true") {
  poolConfig.ssl = { rejectUnauthorized: true };
}

const pool = mysql.createPool(poolConfig);

// Test connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully to gescasesrurals database");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

module.exports = pool;
