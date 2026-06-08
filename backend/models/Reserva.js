const db = require('../config/db');

class Reserva {
  static async checkOverlap(casaId, fechaEntrada, fechaSalida, ignoreReservaId = null) {
    let sql = `
      SELECT id, fecha_entrada, fecha_salida, estado 
      FROM reservas 
      WHERE casa_id = ? 
        AND estado = 'aceptada'
        AND (fecha_entrada < ? AND fecha_salida > ?)
    `;
    const params = [casaId, fechaSalida, fechaEntrada];
    
    if (ignoreReservaId) {
      sql += ' AND id != ?';
      params.push(ignoreReservaId);
    }

    const [rows] = await db.query(sql, params);
    return rows.length > 0 ? rows : null;
  }

  static async create({ usuario_id, casa_id, fecha_entrada, fecha_salida, num_personas, precio_total, observaciones = null }) {
    const sql = `
      INSERT INTO reservas (usuario_id, casa_id, fecha_entrada, fecha_salida, num_personas, precio_total, estado, observaciones)
      VALUES (?, ?, ?, ?, ?, ?, 'pendiente', ?)
    `;
    const [result] = await db.query(sql, [
      usuario_id,
      casa_id,
      fecha_entrada,
      fecha_salida,
      num_personas,
      precio_total,
      observaciones
    ]);
    return result.insertId;
  }

  static async getById(id) {
    const sql = `
      SELECT r.*, 
             u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos, u.email AS usuario_email, u.telefono AS usuario_telefono,
             c.nombre AS casa_nombre, c.precio AS casa_precio_noche
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN casas c ON r.casa_id = c.id
      WHERE r.id = ?
    `;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }

  static async getAll() {
    const sql = `
      SELECT r.*, 
             u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos, u.email AS usuario_email,
             c.nombre AS casa_nombre
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN casas c ON r.casa_id = c.id
      ORDER BY r.fecha_reserva DESC
    `;
    const [rows] = await db.query(sql);
    return rows;
  }

  static async getByUsuarioId(usuarioId) {
    const sql = `
      SELECT r.*, c.nombre AS casa_nombre, i.ruta AS imagen_principal
      FROM reservas r
      JOIN casas c ON r.casa_id = c.id
      LEFT JOIN imagenes_casas i ON c.id = i.casa_id AND i.es_principal = 1
      WHERE r.usuario_id = ?
      ORDER BY r.fecha_reserva DESC
    `;
    const [rows] = await db.query(sql, [usuarioId]);
    return rows;
  }

  static async updateEstado(id, estado, adminId = null) {
    const sql = `
      UPDATE reservas 
      SET estado = ?, fecha_gestion = NOW()
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [estado, id]);
    return result.affectedRows > 0;
  }

  static async getOccupiedDates(casaId) {
    const sql = `
      SELECT fecha_entrada, fecha_salida 
      FROM reservas 
      WHERE casa_id = ? AND estado = 'aceptada' AND fecha_salida >= CURRENT_DATE()
      ORDER BY fecha_entrada ASC
    `;
    const [rows] = await db.query(sql, [casaId]);
    return rows;
  }
}

module.exports = Reserva;
