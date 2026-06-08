const express = require('express');
const router = express.Router();
const notificacionController = require('../controllers/notificacionController');
const { verifyToken } = require('../middlewares/auth');

router.get('/', verifyToken, notificacionController.getNotificaciones);
router.put('/leidas', verifyToken, notificacionController.marcarTodasLeidas);
router.put('/:id/leida', verifyToken, notificacionController.marcarLeida);

module.exports = router;
