const Usuario = require('../models/Usuario');
const LogAdmin = require('../models/LogAdmin');

exports.getAll = async (req, res) => {
  try {
    const usuarios = await Usuario.getAll();
    res.json(usuarios);
  } catch (err) {
    console.error('Error getting users:', err);
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const usuario = await Usuario.findById(id);
    if (!usuario) {
      return res.status(404).json({ error: 'El usuario no existe.' });
    }
    res.json(usuario);
  } catch (err) {
    console.error('Error getting user by ID:', err);
    res.status(500).json({ error: 'Error al obtener el usuario.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellidos, email, telefono } = req.body;

    const exists = await Usuario.findById(id);
    if (!exists) {
      return res.status(404).json({ error: 'El usuario no existe.' });
    }

    // Check if email already in use
    const emailUser = await Usuario.findByEmail(email);
    if (emailUser && emailUser.id !== parseInt(id)) {
      return res.status(400).json({ error: 'El correo electrónico ya está en uso por otro usuario.' });
    }

    const success = await Usuario.update(id, { nombre, apellidos, email, telefono });
    if (!success) {
      return res.status(400).json({ error: 'No se pudieron actualizar los datos del usuario.' });
    }

    // Log admin action if the person changing it is an admin and it's not their own profile
    if (req.user.id !== parseInt(id)) {
      await LogAdmin.create({
        admin_id: req.user.id,
        accion: `Modificados datos de usuario ID ${id}: ${nombre} ${apellidos}`,
        tabla_afectada: 'usuarios',
        registro_id: id,
        ip: req.ip
      });
    }

    res.json({ message: 'Usuario actualizado correctamente.' });
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).json({ error: 'Error al actualizar el usuario.' });
  }
};

exports.bloquear = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body; // 'activo', 'inactivo', 'bloqueado'

    if (!['activo', 'inactivo', 'bloqueado'].includes(estado)) {
      return res.status(400).json({ error: 'Estado no válido. Debe ser activo, inactivo o bloqueado.' });
    }

    const user = await Usuario.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe.' });
    }

    // Prevent admin from blocking themselves
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'No puede cambiar su propio estado.' });
    }

    const success = await Usuario.updateEstado(id, estado);
    if (!success) {
      return res.status(400).json({ error: 'No se pudo cambiar el estado del usuario.' });
    }

    await LogAdmin.create({
      admin_id: req.user.id,
      accion: `Cambio de estado del usuario ID ${id} (${user.nombre}) a: ${estado}`,
      tabla_afectada: 'usuarios',
      registro_id: id,
      ip: req.ip
    });

    res.json({ message: `Estado del usuario actualizado a ${estado} correctamente.` });
  } catch (err) {
    console.error('Error changing user status:', err);
    res.status(500).json({ error: 'Error al cambiar el estado del usuario.' });
  }
};

exports.cambiarRol = async (req, res) => {
  try {
    const { id } = req.params;
    const { rol } = req.body; // 'cliente', 'admin'

    if (!['cliente', 'admin'].includes(rol)) {
      return res.status(400).json({ error: 'Rol no válido. Debe ser cliente o admin.' });
    }

    const user = await Usuario.findById(id);
    if (!user) {
      return res.status(404).json({ error: 'El usuario no existe.' });
    }

    // Prevent admin from changing their own role
    if (parseInt(id) === req.user.id) {
      return res.status(400).json({ error: 'No puede cambiar su propio rol.' });
    }

    const success = await Usuario.updateRol(id, rol);
    if (!success) {
      return res.status(400).json({ error: 'No se pudo cambiar el rol del usuario.' });
    }

    await LogAdmin.create({
      admin_id: req.user.id,
      accion: `Cambio de rol del usuario ID ${id} (${user.nombre}) a: ${rol}`,
      tabla_afectada: 'usuarios',
      registro_id: id,
      ip: req.ip
    });

    res.json({ message: `Rol del usuario actualizado a ${rol} correctamente.` });
  } catch (err) {
    console.error('Error changing user role:', err);
    res.status(500).json({ error: 'Error al cambiar el rol del usuario.' });
  }
};
