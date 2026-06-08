const Notificacion = require('../models/Notificacion');

exports.getNotificaciones = async (req, res) => {
  try {
    const soloNoLeidas = req.query.unread === 'true';
    const notif = await Notificacion.getByUsuarioId(req.user.id, soloNoLeidas);
    res.json(notif);
  } catch (err) {
    console.error('Error fetching notifications:', err);
    res.status(500).json({ error: 'Error al obtener las notificaciones.' });
  }
};

exports.marcarLeida = async (req, res) => {
  try {
    const { id } = req.params;
    const success = await Notificacion.markAsRead(id, req.user.id);
    if (!success) {
      return res.status(404).json({ error: 'Notificación no encontrada o ya leída.' });
    }
    res.json({ message: 'Notificación marcada como leída.' });
  } catch (err) {
    console.error('Error marking notification as read:', err);
    res.status(500).json({ error: 'Error al actualizar la notificación.' });
  }
};

exports.marcarTodasLeidas = async (req, res) => {
  try {
    await Notificacion.markAllAsRead(req.user.id);
    res.json({ message: 'Todas las notificaciones marcadas como leídas.' });
  } catch (err) {
    console.error('Error marking all notifications as read:', err);
    res.status(500).json({ error: 'Error al actualizar las notificaciones.' });
  }
};
