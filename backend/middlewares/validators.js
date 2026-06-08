const { body, validationResult } = require('express-validator');

const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array().map(err => ({ field: err.path, message: err.msg })) });
  }
  next();
};

const validateRegistro = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre es obligatorio')
    .isLength({ max: 100 }).withMessage('El nombre no puede exceder los 100 caracteres'),
  body('apellidos')
    .trim()
    .notEmpty().withMessage('Los apellidos son obligatorios')
    .isLength({ max: 150 }).withMessage('Los apellidos no pueden exceder los 150 caracteres'),
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio')
    .isEmail().withMessage('Debe ser un correo electrónico válido')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  body('telefono')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .matches(/^[0-9+\s\-()]{8,20}$/).withMessage('El teléfono no tiene un formato válido'),
  handleValidationErrors
];

const validateLogin = [
  body('email')
    .trim()
    .notEmpty().withMessage('El correo electrónico es obligatorio')
    .isEmail().withMessage('Debe ser un correo electrónico válido'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  handleValidationErrors
];

const validateReserva = [
  body('casa_id')
    .isInt({ min: 1 }).withMessage('Debe especificar una casa rural válida'),
  body('fecha_entrada')
    .isDate().withMessage('Debe ingresar una fecha de entrada válida (YYYY-MM-DD)')
    .custom((value) => {
      const today = new Date();
      today.setHours(0,0,0,0);
      const entrada = new Date(value);
      if (entrada < today) {
        throw new Error('La fecha de entrada no puede ser anterior a hoy');
      }
      return true;
    }),
  body('fecha_salida')
    .isDate().withMessage('Debe ingresar una fecha de salida válida (YYYY-MM-DD)')
    .custom((value, { req }) => {
      const entrada = new Date(req.body.fecha_entrada);
      const salida = new Date(value);
      if (salida <= entrada) {
        throw new Error('La fecha de salida debe ser posterior a la fecha de entrada');
      }
      return true;
    }),
  body('num_personas')
    .isInt({ min: 1 }).withMessage('Debe haber al menos 1 persona para la reserva'),
  body('observaciones')
    .optional({ nullable: true, checkFalsy: true })
    .trim()
    .isLength({ max: 1000 }).withMessage('Las observaciones no pueden exceder los 1000 caracteres'),
  handleValidationErrors
];

const validateCasa = [
  body('nombre')
    .trim()
    .notEmpty().withMessage('El nombre de la casa es obligatorio')
    .isLength({ max: 150 }).withMessage('El nombre no puede exceder los 150 caracteres'),
  body('descripcion')
    .trim()
    .notEmpty().withMessage('La descripción es obligatoria'),
  body('capacidad')
    .isInt({ min: 1 }).withMessage('La capacidad debe ser un número entero mayor que 0'),
  body('precio')
    .isDecimal({ decimal_digits: '0,2' }).withMessage('El precio debe ser un número decimal válido')
    .custom(val => parseFloat(val) > 0).withMessage('El precio debe ser mayor que 0'),
  body('num_habitaciones')
    .optional()
    .isInt({ min: 1 }).withMessage('El número de habitaciones debe ser mayor que 0'),
  body('num_banos')
    .optional()
    .isInt({ min: 1 }).withMessage('El número de baños debe ser mayor que 0'),
  body('metros')
    .optional()
    .isInt({ min: 1 }).withMessage('Los metros cuadrados deben ser mayor que 0'),
  body('servicios')
    .optional()
    .trim(),
  body('estado')
    .optional()
    .isIn(['activa', 'inactiva', 'mantenimiento']).withMessage('Estado de casa no válido'),
  handleValidationErrors
];

module.exports = {
  validateRegistro,
  validateLogin,
  validateReserva,
  validateCasa
};
