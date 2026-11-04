const fs = require("fs");
const path = require("path");
const db = require("../src/database/postgres.database");

async function main() {
  const archivoSql = path.join(__dirname, "..", "src", "database", "data_base.sql");
  const sql = fs.readFileSync(archivoSql, "utf8");

  try {
    console.log("Conectando a la base de datos y ejecutando data_base.sql...");
    await db.query(sql);
    console.log("Tablas creadas correctamente (roles, users, employees).");

    const { rows } = await db.query("SELECT id, name, description FROM roles ORDER BY id");
    console.log("Roles registrados:");
    console.table(rows);
  } catch (error) {
    if (error.code === "42P07") {
      console.error("Las tablas ya existen: el script ya se había ejecutado antes. No hace falta repetirlo.");
    } else {
      console.error("Error al ejecutar el script:", error.message);
    }
    process.exitCode = 1;
  } finally {
    await db.cerrarConexion();
  }
}

main();