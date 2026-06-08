const db = require('../config/db');

class LogAdmin {
  static async create({ admin_id, accion, tabla_afectada = null, registro_id = null, ip = null }) {
    const sql = `
      INSERT INTO logs_admin (admin_id, accion, tabla_afectada, registro_id, ip)
      VALUES (?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [admin_id, accion, tabla_afectada, registro_id, ip]);
    return result.insertId;
  }

  static async getAll() {
    const sql = `
      SELECT l.*, u.nombre AS admin_nombre, u.apellidos AS admin_apellidos, u.email AS admin_email
      FROM logs_admin l
      JOIN usuarios u ON l.admin_id = u.id
      ORDER BY l.fecha DESC
      LIMIT 100
    `;
    const [rows] = await db.query(sql);
    return rows;
  }
}

module.exports = LogAdmin;
