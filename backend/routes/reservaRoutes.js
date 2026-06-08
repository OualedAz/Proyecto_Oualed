const express = require('express');
const router = express.Router();
const reservaController = require('../controllers/reservaController');
const { verifyToken, isAdmin, isCliente } = require('../middlewares/auth');
const { validateReserva } = require('../middlewares/validators');

// Public route for calendar occupancy verification
router.get('/ocupadas/:casaId', reservaController.getOccupiedDates);

// Client-specific history
router.get('/mis-reservas', verifyToken, isCliente, reservaController.getMisReservas);

// Shared/Admin route for bookings list
router.get('/', verifyToken, isAdmin, reservaController.getAll);
router.get('/:id', verifyToken, reservaController.getById);

// Create reservation
router.post('/', verifyToken, isCliente, validateReserva, reservaController.create);

// Manage reservation
router.put('/:id/aprobar', verifyToken, isAdmin, reservaController.aprobar);
router.put('/:id/rechazar', verifyToken, isAdmin, reservaController.rechazar);
router.put('/:id/cancelar', verifyToken, reservaController.cancelar);

module.exports = router;
