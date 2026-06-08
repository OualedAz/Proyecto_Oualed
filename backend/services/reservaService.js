const Reserva = require('../models/Reserva');
const Casa = require('../models/Casa');

class ReservaService {
  static async validarYCrearReserva({ usuario_id, casa_id, fecha_entrada, fecha_salida, num_personas, observaciones }) {
    // 1. Fetch house to check if active and get price/capacity
    const casa = await Casa.getById(casa_id);
    if (!casa) {
      throw new Error('La casa rural no existe.');
    }

    if (casa.estado !== 'activa') {
      throw new Error('La casa rural no está disponible para reservas actualmente.');
    }

    if (num_personas > casa.capacidad) {
      throw new Error(`La casa tiene una capacidad máxima de ${casa.capacidad} personas.`);
    }

    // 2. Validate dates
    const entrada = new Date(fecha_entrada);
    const salida = new Date(fecha_salida);
    const today = new Date();
    today.setHours(0,0,0,0);

    if (entrada < today) {
      throw new Error('La fecha de entrada no puede ser anterior a hoy.');
    }

    if (salida <= entrada) {
      throw new Error('La fecha de salida debe ser posterior a la fecha de entrada.');
    }

    // Calculate nights
    const diffTime = Math.abs(salida - entrada);
    const noches = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (noches < 1) {
      throw new Error('La reserva debe ser de al menos 1 noche.');
    }

    // 3. Check for overlaps (with accepted bookings)
    const overlaps = await Reserva.checkOverlap(casa_id, fecha_entrada, fecha_salida);
    if (overlaps) {
      throw new Error('La casa rural ya está reservada para las fechas seleccionadas.');
    }

    // 4. Calculate total price
    const precio_total = parseFloat(casa.precio) * noches;

    // 5. Create reservation
    const reservaId = await Reserva.create({
      usuario_id,
      casa_id,
      fecha_entrada,
      fecha_salida,
      num_personas,
      precio_total,
      observaciones
    });

    return {
      reservaId,
      noches,
      precio_total,
      casa_nombre: casa.nombre
    };
  }

  static async aprobarReserva(reservaId, adminId) {
    const reserva = await Reserva.getById(reservaId);
    if (!reserva) {
      throw new Error('La reserva no existe.');
    }

    if (reserva.estado !== 'pendiente') {
      throw new Error(`No se puede aprobar una reserva en estado: ${reserva.estado}`);
    }

    // Double check overlap before approving
    const overlaps = await Reserva.checkOverlap(reserva.casa_id, reserva.fecha_entrada, reserva.fecha_salida, reservaId);
    if (overlaps) {
      throw new Error('No se puede aprobar. Hay un solapamiento con otra reserva ya aceptada.');
    }

    const success = await Reserva.updateEstado(reservaId, 'aceptada', adminId);
    return success;
  }
}

module.exports = ReservaService;
