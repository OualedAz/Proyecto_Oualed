const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { verifyToken, isAdmin } = require('../middlewares/auth');

// Admin only routes for user management
router.get('/', verifyToken, isAdmin, usuarioController.getAll);
router.get('/:id', verifyToken, isAdmin, usuarioController.getById);

// Admin can modify any user, but the controller handles details.
router.put('/:id', verifyToken, isAdmin, usuarioController.update);

// Status and Role management (Admin only)
router.put('/:id/bloquear', verifyToken, isAdmin, usuarioController.bloquear);
router.put('/:id/rol', verifyToken, isAdmin, usuarioController.cambiarRol);

module.exports = router;
