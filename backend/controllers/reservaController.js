const Reserva = require('../models/Reserva');
const ReservaService = require('../services/reservaService');
const Notificacion = require('../models/Notificacion');
const LogAdmin = require('../models/LogAdmin');

exports.getAll = async (req, res) => {
  try {
    const reservas = await Reserva.getAll();
    res.json(reservas);
  } catch (err) {
    console.error('Error fetching reservations:', err);
    res.status(500).json({ error: 'Error al obtener las reservas.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const reserva = await Reserva.getById(id);
    if (!reserva) {
      return res.status(404).json({ error: 'La reserva no existe.' });
    }

    // Check permissions: admin or owner of the booking
    if (req.user.rol !== 'admin' && reserva.usuario_id !== req.user.id) {
      return res.status(403).json({ error: 'Permiso denegado. No puede ver detalles de la reserva de otro usuario.' });
    }

    res.json(reserva);
  } catch (err) {
    console.error('Error fetching reservation details:', err);
    res.status(500).json({ error: 'Error al obtener la reserva.' });
  }
};

exports.getMisReservas = async (req, res) => {
  try {
    const reservas = await Reserva.getByUsuarioId(req.user.id);
    res.json(reservas);
  } catch (err) {
    console.error('Error fetching user reservations:', err);
    res.status(500).json({ error: 'Error al obtener sus reservas.' });
  }
};

exports.getOccupiedDates = async (req, res) => {
  try {
    const { casaId } = req.params;
    const dates = await Reserva.getOccupiedDates(casaId);
    res.json(dates);
  } catch (err) {
    console.error('Error fetching occupied dates:', err);
    res.status(500).json({ error: 'Error al obtener fechas ocupadas.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { casa_id, fecha_entrada, fecha_salida, num_personas, observaciones } = req.body;
    const usuario_id = req.user.id;

    const result = await ReservaService.validarYCrearReserva({
      usuario_id,
      casa_id,
      fecha_entrada,
      fecha_salida,
      num_personas,
      observaciones
    });

    // Notify the client
    await Notificacion.create({
      usuario_id,
      mensaje: `Tu solicitud de reserva para "${result.casa_nombre}" (${fecha_entrada} a ${fecha_salida}) ha sido recibida y está pendiente de aprobación.`,
      tipo: 'nueva_reserva'
    });

    // Notify admins (user_id = 1 is the main admin, or let's find all admins. For simplicity, let's look for user_id = 1 or admin users.
    // In our seed, Jordi (1) and Montserrat (2) are admins. Let's send notifications to admin #1.
    await Notificacion.create({
      usuario_id: 1, 
      mensaje: `Nueva reserva pendiente en "${result.casa_nombre}" de ${req.user.nombre} ${req.user.apellidos}.`,
      tipo: 'admin_alerta'
    });

    res.status(201).json({
      message: 'Reserva solicitada correctamente. Pendiente de aprobación por administración.',
      reservaId: result.reservaId,
      noches: result.noches,
      precio_total: result.precio_total
    });
  } catch (err) {
    console.error('Error creating reservation:', err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.aprobar = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    await ReservaService.aprobarReserva(id, adminId);
    const reserva = await Reserva.getById(id);

    // Notify the client with a payment link
    await Notificacion.create({
      usuario_id: reserva.usuario_id,
      mensaje: `¡Buenas noticias! Tu reserva para "${reserva.casa_nombre}" ha sido aprobada. Completa el pago para confirmarla: <a href="#/pago/${id}">Ir a la pasarela de pago</a>`,
      tipo: 'reserva_aprobada_pago'
    });

    // Log admin action
    await LogAdmin.create({
      admin_id: adminId,
      accion: `Aprobada reserva ID ${id} para la casa: ${reserva.casa_nombre} (pendiente de pago)`,
      tabla_afectada: 'reservas',
      registro_id: id,
      ip: req.ip
    });

    res.json({ message: 'Reserva aprobada correctamente. El cliente recibirá una notificación para realizar el pago.' });
  } catch (err) {
    console.error('Error approving reservation:', err.message);
    res.status(400).json({ error: err.message });
  }
};

exports.confirmarPago = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reserva = await Reserva.getById(id);
    if (!reserva) {
      return res.status(404).json({ error: 'La reserva no existe.' });
    }

    // Only the owner of the reservation can confirm payment
    if (reserva.usuario_id !== userId) {
      return res.status(403).json({ error: 'Permiso denegado. No puede confirmar el pago de la reserva de otro usuario.' });
    }

    if (reserva.estado !== 'aprobada_pendiente_pago') {
      return res.status(400).json({ error: `No se puede confirmar el pago de una reserva en estado: ${reserva.estado}` });
    }

    await Reserva.updateEstado(id, 'confirmada');

    // Notify the client
    await Notificacion.create({
      usuario_id: userId,
      mensaje: `¡Pago confirmado! Tu reserva para "${reserva.casa_nombre}" del ${reserva.fecha_entrada} al ${reserva.fecha_salida} está confirmada. ¡Nos vemos pronto!`,
      tipo: 'reserva_confirmada'
    });

    // Notify admin
    await Notificacion.create({
      usuario_id: 1,
      mensaje: `El cliente ha completado el pago de la reserva ID ${id} para "${reserva.casa_nombre}".`,
      tipo: 'admin_alerta'
    });

    res.json({ message: 'Pago confirmado y reserva aceptada correctamente.' });
  } catch (err) {
    console.error('Error confirming payment:', err.message);
    res.status(500).json({ error: 'Error al confirmar el pago.' });
  }
};

exports.rechazar = async (req, res) => {
  try {
    const { id } = req.params;
    const adminId = req.user.id;

    const reserva = await Reserva.getById(id);
    if (!reserva) {
      return res.status(404).json({ error: 'La reserva no existe.' });
    }

    if (reserva.estado !== 'pendiente') {
      return res.status(400).json({ error: `No se puede rechazar una reserva en estado: ${reserva.estado}` });
    }

    await Reserva.updateEstado(id, 'rechazada', adminId);

    // Notify client
    await Notificacion.create({
      usuario_id: reserva.usuario_id,
      mensaje: `Tu solicitud de reserva para la casa rural "${reserva.casa_nombre}" del ${reserva.fecha_entrada} al ${reserva.fecha_salida} ha sido rechazada por administración.`,
      tipo: 'reserva_rechazada'
    });

    // Log admin action
    await LogAdmin.create({
      admin_id: adminId,
      accion: `Rechazada reserva ID ${id} para la casa: ${reserva.casa_nombre}`,
      tabla_afectada: 'reservas',
      registro_id: id,
      ip: req.ip
    });

    res.json({ message: 'Reserva rechazada correctamente.' });
  } catch (err) {
    console.error('Error rejecting reservation:', err);
    res.status(500).json({ error: 'Error al rechazar la reserva.' });
  }
};

exports.cancelar = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const reserva = await Reserva.getById(id);
    if (!reserva) {
      return res.status(404).json({ error: 'La reserva no existe.' });
    }

    // Permission check: only admin or the booking client can cancel
    if (req.user.rol !== 'admin' && reserva.usuario_id !== userId) {
      return res.status(403).json({ error: 'Permiso denegado. No puede cancelar la reserva de otro usuario.' });
    }

    if (reserva.estado === 'cancelada') {
      return res.status(400).json({ error: 'La reserva ya se encuentra cancelada.' });
    }

    if (reserva.estado === 'rechazada') {
      return res.status(400).json({ error: 'No se puede cancelar una reserva ya rechazada.' });
    }

    await Reserva.updateEstado(id, 'cancelada');

    // Notify client if canceled by admin, or notify admin if canceled by client
    if (req.user.rol === 'admin') {
      await Notificacion.create({
        usuario_id: reserva.usuario_id,
        mensaje: `Tu reserva para la casa rural "${reserva.casa_nombre}" (${reserva.fecha_entrada} a ${reserva.fecha_salida}) ha sido cancelada por administración.`,
        tipo: 'reserva_cancelada'
      });

      await LogAdmin.create({
        admin_id: userId,
        accion: `Cancelada reserva ID ${id} para la casa: ${reserva.casa_nombre}`,
        tabla_afectada: 'reservas',
        registro_id: id,
        ip: req.ip
      });
    } else {
      // Canceled by client, notify client confirmation
      await Notificacion.create({
        usuario_id: reserva.usuario_id,
        mensaje: `Has cancelado correctamente tu reserva para "${reserva.casa_nombre}" (${reserva.fecha_entrada} a ${reserva.fecha_salida}).`,
        tipo: 'reserva_cancelada'
      });

      // Notify admin
      await Notificacion.create({
        usuario_id: 1, 
        mensaje: `El cliente ${req.user.nombre} ${req.user.apellidos} ha cancelado su reserva ID ${id} para "${reserva.casa_nombre}".`,
        tipo: 'admin_alerta'
      });
    }

    res.json({ message: 'Reserva cancelada correctamente.' });
  } catch (err) {
    console.error('Error canceling reservation:', err);
    res.status(500).json({ error: 'Error al cancelar la reserva.' });
  }
};
