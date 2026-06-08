const db = require('../config/db');

exports.getStats = async (req, res) => {
  try {
    // 1. Total users
    const [[{ totalUsers }]] = await db.query('SELECT COUNT(*) AS totalUsers FROM usuarios');

    // 2. Total houses
    const [[{ totalHouses }]] = await db.query('SELECT COUNT(*) AS totalHouses FROM casas');

    // 3. Reservations grouped by status
    const [reservationsByStatus] = await db.query('SELECT estado, COUNT(*) AS count FROM reservas GROUP BY estado');
    
    const statsReservas = {
      pendiente: 0,
      aceptada: 0,
      rechazada: 0,
      cancelada: 0,
      total: 0
    };
    
    reservationsByStatus.forEach(row => {
      if (statsReservas.hasOwnProperty(row.estado)) {
        statsReservas[row.estado] = row.count;
      }
      statsReservas.total += row.count;
    });

    // 4. Total revenue from accepted bookings
    const [[{ totalRevenue }]] = await db.query("SELECT COALESCE(SUM(precio_total), 0) AS totalRevenue FROM reservas WHERE estado = 'aceptada'");

    // 5. Recent reservations (limit 5)
    const [recentReservations] = await db.query(`
      SELECT r.id, r.fecha_entrada, r.fecha_salida, r.precio_total, r.estado, r.fecha_reserva,
             u.nombre AS usuario_nombre, u.apellidos AS usuario_apellidos,
             c.nombre AS casa_nombre
      FROM reservas r
      JOIN usuarios u ON r.usuario_id = u.id
      JOIN casas c ON r.casa_id = c.id
      ORDER BY r.fecha_reserva DESC
      LIMIT 5
    `);

    // 6. Recent admin logs (limit 5)
    const [recentLogs] = await db.query(`
      SELECT l.id, l.accion, l.tabla_afectada, l.registro_id, l.fecha,
             u.nombre AS admin_nombre, u.apellidos AS admin_apellidos
      FROM logs_admin l
      JOIN usuarios u ON l.admin_id = u.id
      ORDER BY l.fecha DESC
      LIMIT 5
    `);

    // 7. House details with booking counts (simple occupancy metrics)
    const [housesStats] = await db.query(`
      SELECT c.id, c.nombre, c.precio, c.capacidad, c.estado,
             (SELECT COUNT(*) FROM reservas r WHERE r.casa_id = c.id AND r.estado = 'aceptada') AS reservas_aceptadas
      FROM casas c
    `);

    res.json({
      summary: {
        totalUsers,
        totalHouses,
        reservations: statsReservas,
        totalRevenue: parseFloat(totalRevenue)
      },
      recentReservations,
      recentLogs,
      housesStats
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ error: 'Error al obtener las estadísticas del panel.' });
  }
};
