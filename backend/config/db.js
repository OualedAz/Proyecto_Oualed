const mysql = require("mysql2/promise");
require("dotenv").config();

let poolConfig;
const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQLURL;

if (dbUrl && (dbUrl.startsWith("mysql://") || dbUrl.startsWith("mysql2://") || dbUrl.startsWith("mariadb://"))) {
  try {
    const url = new URL(dbUrl);
    poolConfig = {
      host: url.hostname,
      port: url.port ? parseInt(url.port, 10) : 3306,
      user: url.username,
      password: decodeURIComponent(url.password),
      database: url.pathname.replace(/^\//, ""),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      timezone: "+00:00",
    };

    if (process.env.DB_SSL === "true" || url.searchParams.get("ssl") === "true") {
      poolConfig.ssl = { rejectUnauthorized: false };
    }
  } catch (err) {
    console.error("Error parsing DATABASE_URL/MYSQL_URL, falling back to individual variables:", err.message);
  }
}

if (!poolConfig) {
  poolConfig = {
    host: process.env.DB_HOST || "localhost",
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASS || "",
    database: process.env.DB_NAME || "gescasesrurals",
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    timezone: "+00:00",
  };

  // Enable SSL for cloud database connections
  if (process.env.DB_SSL === "true") {
    poolConfig.ssl = { rejectUnauthorized: false };
  }
}

const pool = mysql.createPool(poolConfig);

// Test connection
pool
  .getConnection()
  .then((connection) => {
    console.log("Database connected successfully to", poolConfig.database || "database");
    connection.release();
  })
  .catch((err) => {
    console.error("Error connecting to the database:", err.message);
  });

module.exports = pool;

