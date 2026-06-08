const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'gesCasesRurals_S3cr3t_K3y_2026_!@#SuperSegura';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

exports.register = async (req, res) => {
  try {
    const { nombre, apellidos, email, telefono, password } = req.body;

    // Check if email already registered
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado.' });
    }

    // Default role for registration is 'cliente'
    const userId = await Usuario.create({
      nombre,
      apellidos,
      email,
      telefono,
      password,
      rol: 'cliente'
    });

    res.status(201).json({
      message: 'Usuario registrado correctamente.',
      userId
    });
  } catch (err) {
    console.error('Error in registration:', err);
    res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await Usuario.findByEmail(email);
    if (!user) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    if (user.estado === 'inactivo') {
      return res.status(403).json({ error: 'Su cuenta está inactiva. Contacte con el administrador.' });
    }
    if (user.estado === 'bloqueado') {
      return res.status(403).json({ error: 'Su cuenta ha sido bloqueada. Contacte con el administrador.' });
    }

    const isMatch = await Usuario.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas.' });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol
      },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({
      message: 'Inicio de sesión correcto.',
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidos: user.apellidos,
        email: user.email,
        rol: user.rol
      }
    });
  } catch (err) {
    console.error('Error in login:', err);
    res.status(500).json({ error: 'Error interno del servidor al iniciar sesión.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const user = await Usuario.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Usuario no encontrado.' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error fetching profile:', err);
    res.status(500).json({ error: 'Error al obtener el perfil.' });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { nombre, apellidos, email, telefono } = req.body;
    const userId = req.user.id;

    // Check if email already registered by someone else
    const existingUser = await Usuario.findByEmail(email);
    if (existingUser && existingUser.id !== userId) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso por otro usuario.' });
    }

    const success = await Usuario.update(userId, { nombre, apellidos, email, telefono });
    if (!success) {
      return res.status(400).json({ error: 'No se pudo actualizar el perfil.' });
    }

    res.json({ message: 'Perfil actualizado correctamente.' });
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).json({ error: 'Error al actualizar el perfil.' });
  }
};
