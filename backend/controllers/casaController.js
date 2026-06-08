const Casa = require('../models/Casa');
const LogAdmin = require('../models/LogAdmin');

exports.getAll = async (req, res) => {
  try {
    // If user is admin (check if token was verified and role is admin), we can show all.
    // Otherwise only active.
    let filterEstado = 'activa';
    if (req.user && req.user.rol === 'admin') {
      filterEstado = null; // Show all states (activa, inactiva, mantenimiento)
    }

    const casas = await Casa.getAll(filterEstado);
    res.json(casas);
  } catch (err) {
    console.error('Error fetching houses:', err);
    res.status(500).json({ error: 'Error al obtener las casas rurales.' });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const casa = await Casa.getById(id);
    if (!casa) {
      return res.status(404).json({ error: 'La casa rural no existe.' });
    }
    
    // If not active and user not admin, deny access
    if (casa.estado !== 'activa' && (!req.user || req.user.rol !== 'admin')) {
      return res.status(403).json({ error: 'Esta casa rural no está disponible.' });
    }

    res.json(casa);
  } catch (err) {
    console.error('Error fetching house details:', err);
    res.status(500).json({ error: 'Error al obtener los detalles de la casa rural.' });
  }
};

exports.create = async (req, res) => {
  try {
    const { nombre, descripcion, capacidad, precio, num_habitaciones, num_banos, metros, servicios, estado } = req.body;
    
    const casaId = await Casa.create({
      nombre,
      descripcion,
      capacidad,
      precio,
      num_habitaciones,
      num_banos,
      metros,
      servicios,
      estado
    });

    // Log admin action
    await LogAdmin.create({
      admin_id: req.user.id,
      accion: `Creada casa rural: ${nombre}`,
      tabla_afectada: 'casas',
      registro_id: casaId,
      ip: req.ip
    });

    res.status(201).json({
      message: 'Casa rural creada correctamente.',
      casaId
    });
  } catch (err) {
    console.error('Error creating house:', err);
    res.status(500).json({ error: 'Error al crear la casa rural.' });
  }
};

exports.update = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion, capacidad, precio, num_habitaciones, num_banos, metros, servicios, estado } = req.body;

    const exists = await Casa.getById(id);
    if (!exists) {
      return res.status(404).json({ error: 'La casa rural no existe.' });
    }

    const success = await Casa.update(id, {
      nombre,
      descripcion,
      capacidad,
      precio,
      num_habitaciones,
      num_banos,
      metros,
      servicios,
      estado
    });

    if (!success) {
      return res.status(400).json({ error: 'No se pudo actualizar la casa rural.' });
    }

    // Log admin action
    await LogAdmin.create({
      admin_id: req.user.id,
      accion: `Modificada casa rural ID ${id}: ${nombre}`,
      tabla_afectada: 'casas',
      registro_id: id,
      ip: req.ip
    });

    res.json({ message: 'Casa rural actualizada correctamente.' });
  } catch (err) {
    console.error('Error updating house:', err);
    res.status(500).json({ error: 'Error al actualizar la casa rural.' });
  }
};

exports.delete = async (req, res) => {
  try {
    const { id } = req.params;
    const casa = await Casa.getById(id);
    if (!casa) {
      return res.status(404).json({ error: 'La casa rural no existe.' });
    }

    await Casa.delete(id);

    // Log admin action
    await LogAdmin.create({
      admin_id: req.user.id,
      accion: `Eliminada casa rural ID ${id}: ${casa.nombre}`,
      tabla_afectada: 'casas',
      registro_id: id,
      ip: req.ip
    });

    res.json({ message: 'Casa rural eliminada correctamente.' });
  } catch (err) {
    console.error('Error deleting house:', err);
    res.status(500).json({ error: 'No se puede eliminar la casa rural porque tiene reservas asociadas. Se recomienda desactivarla cambiando su estado.' });
  }
};

exports.uploadImages = async (req, res) => {
  try {
    const { id } = req.params;
    const files = req.files;

    if (!files || files.length === 0) {
      return res.status(400).json({ error: 'No se subieron imágenes.' });
    }

    const casa = await Casa.getById(id);
    if (!casa) {
      return res.status(404).json({ error: 'La casa rural no existe.' });
    }

    // Check if we should clear existing images (if requested)
    if (req.body.clearExisting === 'true') {
      await Casa.clearImagenes(id);
    }

    // Add new images
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const ruta = `/uploads/${file.filename}`;
      // Set the first image as principal if there are no principal images yet
      const esPrincipal = (i === 0 && casa.imagenes.length === 0) ? 1 : 0;
      await Casa.addImagen(id, ruta, esPrincipal, i);
    }

    // Log admin action
    await LogAdmin.create({
      admin_id: req.user.id,
      accion: `Subidas ${files.length} imágenes para casa rural ID ${id}`,
      tabla_afectada: 'imagenes_casas',
      registro_id: id,
      ip: req.ip
    });

    res.json({ message: 'Imágenes subidas e incorporadas correctamente.' });
  } catch (err) {
    console.error('Error uploading house images:', err);
    res.status(500).json({ error: 'Error al subir las imágenes.' });
  }
};
