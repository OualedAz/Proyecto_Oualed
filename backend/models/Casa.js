const db = require('../config/db');

class Casa {
  static async getAll(filterEstado = null) {
    let sql = `
      SELECT c.*, 
        COALESCE(
          (SELECT ruta FROM imagenes_casas WHERE casa_id = c.id AND es_principal = 1 LIMIT 1),
          (SELECT ruta FROM imagenes_casas WHERE casa_id = c.id ORDER BY orden ASC, id ASC LIMIT 1)
        ) AS imagen_principal
      FROM casas c
    `;
    
    const params = [];
    if (filterEstado) {
      sql += ' WHERE c.estado = ?';
      params.push(filterEstado);
    }
    
    sql += ' ORDER BY c.id ASC';
    const [rows] = await db.query(sql, params);
    return rows;
  }

  static async getById(id) {
    const sqlCasa = `SELECT * FROM casas WHERE id = ?`;
    const [casas] = await db.query(sqlCasa, [id]);
    if (casas.length === 0) return null;

    const casa = casas[0];
    
    const sqlImages = `SELECT id, ruta, es_principal, orden FROM imagenes_casas WHERE casa_id = ? ORDER BY orden ASC`;
    const [images] = await db.query(sqlImages, [id]);
    casa.imagenes = images;

    return casa;
  }

  static async create({ nombre, descripcion, capacidad, precio, num_habitaciones = 2, num_banos = 1, metros = null, servicios = null, estado = 'activa' }) {
    const sql = `
      INSERT INTO casas (nombre, descripcion, capacidad, precio, num_habitaciones, num_banos, metros, servicios, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    const [result] = await db.query(sql, [
      nombre, 
      descripcion, 
      capacidad, 
      precio, 
      num_habitaciones, 
      num_banos, 
      metros, 
      servicios, 
      estado
    ]);
    return result.insertId;
  }

  static async update(id, { nombre, descripcion, capacidad, precio, num_habitaciones, num_banos, metros, servicios, estado }) {
    const sql = `
      UPDATE casas
      SET nombre = ?, descripcion = ?, capacidad = ?, precio = ?, num_habitaciones = ?, num_banos = ?, metros = ?, servicios = ?, estado = ?
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [
      nombre,
      descripcion,
      capacidad,
      precio,
      num_habitaciones,
      num_banos,
      metros,
      servicios,
      estado,
      id
    ]);
    return result.affectedRows > 0;
  }

  static async delete(id) {
    // Note: If there are bookings, foreign keys on reservations might restrict this.
    // The handler can catch errors.
    const sql = `DELETE FROM casas WHERE id = ?`;
    const [result] = await db.query(sql, [id]);
    return result.affectedRows > 0;
  }

  // Image helpers
  static async addImagen(casaId, ruta, esPrincipal = 0, orden = 0) {
    const sql = `INSERT INTO imagenes_casas (casa_id, ruta, es_principal, orden) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [casaId, ruta, esPrincipal, orden]);
    return result.insertId;
  }

  static async clearImagenes(casaId) {
    const sql = `DELETE FROM imagenes_casas WHERE casa_id = ?`;
    const [result] = await db.query(sql, [casaId]);
    return result.affectedRows > 0;
  }

  static async setImagenPrincipal(casaId, imageId) {
    // Reset all to 0
    await db.query(`UPDATE imagenes_casas SET es_principal = 0 WHERE casa_id = ?`, [casaId]);
    // Set target to 1
    const [result] = await db.query(`UPDATE imagenes_casas SET es_principal = 1 WHERE id = ? AND casa_id = ?`, [imageId, casaId]);
    return result.affectedRows > 0;
  }
}

module.exports = Casa;
