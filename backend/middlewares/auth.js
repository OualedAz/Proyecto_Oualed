const jwt = require('jsonwebtoken');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'gesCasesRurals_S3cr3t_K3y_2026_!@#SuperSegura';

const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) {
    return res.status(401).json({ error: 'Acceso denegado. No se proporcionó un token.' });
  }

  const token = authHeader.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Formato de token no válido. Debe ser Bearer <token>.' });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token no válido o expirado.' });
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }
  
  if (req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Permiso denegado. Se requiere rol de administrador.' });
  }
  
  next();
};

const isCliente = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Usuario no autenticado.' });
  }

  if (req.user.rol !== 'cliente' && req.user.rol !== 'admin') {
    return res.status(403).json({ error: 'Permiso denegado.' });
  }

  next();
};

module.exports = {
  verifyToken,
  isAdmin,
  isCliente
};
