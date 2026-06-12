const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function importDatabase() {
  console.log("Iniciando importación de la base de datos...");
  let connection;
  try {
    // 1. Connect without database to create/recreate it
    connection = await mysql.createConnection({
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      multipleStatements: true
    });

    console.log("Conectado a MySQL.");

    // 2. Read SQL files
    const dbSqlPath = path.join(__dirname, "..", "database", "database.sql");
    const seedSqlPath = path.join(__dirname, "..", "database", "seed.sql");

    const dbSql = fs.readFileSync(dbSqlPath, "utf8");
    const seedSql = fs.readFileSync(seedSqlPath, "utf8");

    // 3. Recreate Database to ensure clean state
    console.log("Restaurando esquema de base de datos...");
    await connection.query("DROP DATABASE IF EXISTS `gescasesrurals`;");
    await connection.query(dbSql);
    console.log("Esquema creado correctamente.");

    // 4. Insert Seed Data
    console.log("Insertando datos de prueba (semilla)...");
    await connection.query(seedSql);
    console.log("Datos de prueba insertados correctamente.");

    console.log("¡Importación completada con éxito!");
    console.log("Ahora puedes iniciar sesión con admin@gescasesrurals.com / 123456");
  } catch (error) {
    console.error("Error durante la importación:", error.message);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

importDatabase();
