const db = require('../config/db');
const bcrypt = require('bcryptjs');

class Usuario {
  static async create({ nombre, apellidos, email, telefono, password, rol = 'cliente' }) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const sql = `
      INSERT INTO usuarios (nombre, apellidos, email, telefono, password, rol, estado)
      VALUES (?, ?, ?, ?, ?, ?, 'activo')
    `;
    const [result] = await db.query(sql, [nombre, apellidos, email, telefono, hashedPassword, rol]);
    return result.insertId;
  }

  static async findByEmail(email) {
    const sql = `SELECT * FROM usuarios WHERE email = ?`;
    const [rows] = await db.query(sql, [email]);
    return rows[0] || null;
  }

  static async findById(id) {
    const sql = `SELECT id, nombre, apellidos, email, telefono, rol, estado, fecha_registro FROM usuarios WHERE id = ?`;
    const [rows] = await db.query(sql, [id]);
    return rows[0] || null;
  }

  static async getAll() {
    const sql = `SELECT id, nombre, apellidos, email, telefono, rol, estado, fecha_registro FROM usuarios ORDER BY fecha_registro DESC`;
    const [rows] = await db.query(sql);
    return rows;
  }

  static async update(id, { nombre, apellidos, email, telefono }) {
    const sql = `
      UPDATE usuarios 
      SET nombre = ?, apellidos = ?, email = ?, telefono = ?
      WHERE id = ?
    `;
    const [result] = await db.query(sql, [nombre, apellidos, email, telefono, id]);
    return result.affectedRows > 0;
  }

  static async updatePassword(id, password) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const sql = `UPDATE usuarios SET password = ? WHERE id = ?`;
    const [result] = await db.query(sql, [hashedPassword, id]);
    return result.affectedRows > 0;
  }

  static async updateEstado(id, estado) {
    const sql = `UPDATE usuarios SET estado = ? WHERE id = ?`;
    const [result] = await db.query(sql, [estado, id]);
    return result.affectedRows > 0;
  }

  static async updateRol(id, rol) {
    const sql = `UPDATE usuarios SET rol = ? WHERE id = ?`;
    const [result] = await db.query(sql, [rol, id]);
    return result.affectedRows > 0;
  }

  static async comparePassword(password, hashed) {
    return await bcrypt.compare(password, hashed);
  }
}

module.exports = Usuario;
