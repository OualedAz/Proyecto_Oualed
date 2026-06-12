const mysql = require("mysql2/promise");
const fs = require("fs");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env") });

async function importDatabase() {
  console.log("Iniciando importación de la base de datos...");
  let connection;

  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_URL || process.env.MYSQLURL;
  let isCloud = false;
  let connectionConfig = {};
  let dbName = "gescasesrurals";

  if (dbUrl && (dbUrl.startsWith("mysql://") || dbUrl.startsWith("mysql2://") || dbUrl.startsWith("mariadb://"))) {
    isCloud = true;
    try {
      const url = new URL(dbUrl);
      dbName = url.pathname.replace(/^\//, "") || "gescasesrurals";
      connectionConfig = {
        host: url.hostname,
        port: url.port ? parseInt(url.port, 10) : 3306,
        user: url.username,
        password: decodeURIComponent(url.password),
        database: dbName,
        multipleStatements: true
      };
      if (process.env.DB_SSL === "true" || url.searchParams.get("ssl") === "true") {
        connectionConfig.ssl = { rejectUnauthorized: true };
      }
    } catch (err) {
      console.error("Error al parsear la URL de la base de datos:", err.message);
      process.exit(1);
    }
  } else {
    connectionConfig = {
      host: process.env.DB_HOST || "localhost",
      port: process.env.DB_PORT || 3306,
      user: process.env.DB_USER || "root",
      password: process.env.DB_PASS || "",
      multipleStatements: true
    };
    if (process.env.DB_SSL === "true") {
      connectionConfig.ssl = { rejectUnauthorized: true };
    }
  }

  try {
    if (isCloud) {
      console.log(`Conectando a la base de datos en la nube (${connectionConfig.host})...`);
      connection = await mysql.createConnection(connectionConfig);
      console.log(`Conectado a la base de datos '${dbName}'.`);

      // Limpieza de tablas existentes individualmente (para evitar problemas de permisos de DROP DATABASE)
      console.log("Limpiando tablas existentes (si las hay)...");
      await connection.query("SET FOREIGN_KEY_CHECKS = 0;");
      const [tables] = await connection.query("SHOW TABLES;");
      for (const tableRow of tables) {
        const tableName = Object.values(tableRow)[0];
        console.log(`Eliminando tabla: ${tableName}`);
        await connection.query(`DROP TABLE IF EXISTS \`${tableName}\`;`);
      }
      await connection.query("SET FOREIGN_KEY_CHECKS = 1;");
    } else {
      console.log("Conectando a base de datos local...");
      connection = await mysql.createConnection(connectionConfig);
      console.log("Conectado a MySQL.");

      console.log("Restaurando esquema de base de datos local...");
      await connection.query("DROP DATABASE IF EXISTS `gescasesrurals`;");
    }

    // 2. Read SQL files
    const dbSqlPath = path.join(__dirname, "..", "database", "database.sql");
    const seedSqlPath = path.join(__dirname, "..", "database", "seed.sql");

    const dbSql = fs.readFileSync(dbSqlPath, "utf8");
    const seedSql = fs.readFileSync(seedSqlPath, "utf8");

    let cleanDbSql = dbSql;
    if (isCloud) {
      // En la nube, eliminamos sentencias CREATE DATABASE y USE para evitar problemas de permisos
      cleanDbSql = cleanDbSql.replace(/CREATE DATABASE IF NOT EXISTS `[^`]+`[\s\S]*?;/gi, "");
      cleanDbSql = cleanDbSql.replace(/USE `[^`]+`;/gi, "");
    }

    // 3. Recreate schema
    console.log("Creando esquema de base de datos...");
    await connection.query(cleanDbSql);
    console.log("Esquema de base de datos creado correctamente.");

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

