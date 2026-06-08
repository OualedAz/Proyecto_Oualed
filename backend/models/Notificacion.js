const db = require('../config/db');

class Notificacion {
  static async create({ usuario_id, mensaje, tipo = 'sistema' }) {
    const sql = `
      INSERT INTO notificaciones (usuario_id, mensaje, tipo, leida)
      VALUES (?, ?, ?, 0)
    `;
    const [result] = await db.query(sql, [usuario_id, mensaje, tipo]);
    return result.insertId;
  }

  static async getByUsuarioId(usuarioId, soloNoLeidas = false) {
    let sql = `SELECT * FROM notificaciones WHERE usuario_id = ?`;
    const params = [usuarioId];

    if (soloNoLeidas) {
      sql += ` AND leida = 0`;
    }

    sql += ` ORDER BY fecha DESC LIMIT 50`;
    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async markAsRead(id, usuarioId) {
    const sql = `UPDATE notificaciones SET leida = 1 WHERE id = ? AND usuario_id = ?`;
    const [result] = await db.query(sql, [id, usuarioId]);
    return result.affectedRows > 0;
  }

  static async markAllAsRead(usuarioId) {
    const sql = `UPDATE notificaciones SET leida = 1 WHERE usuario_id = ?`;
    const [result] = await db.query(sql, [usuarioId]);
    return result.affectedRows > 0;
  }
}

module.exports = Notificacion;
