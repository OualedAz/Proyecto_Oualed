const express = require('express');
const router = express.Router();
const casaController = require('../controllers/casaController');
const { verifyToken, isAdmin } = require('../middlewares/auth');
const { validateCasa } = require('../middlewares/validators');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

const JWT_SECRET = process.env.JWT_SECRET || 'gesCasesRurals_S3cr3t_K3y_2026_!@#SuperSegura';

// Optional token validation for viewing active/inactive houses
const optionalVerifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    if (token) {
      try {
        req.user = jwt.verify(token, JWT_SECRET);
      } catch (err) {
        // Proceed as guest
      }
    }
  }
  next();
};

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, '../uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'casa-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG, WEBP)'));
  }
});

// Routes
router.get('/', optionalVerifyToken, casaController.getAll);
router.get('/:id', optionalVerifyToken, casaController.getById);

// Admin only CRUD
router.post('/', verifyToken, isAdmin, validateCasa, casaController.create);
router.put('/:id', verifyToken, isAdmin, validateCasa, casaController.update);
router.delete('/:id', verifyToken, isAdmin, casaController.delete);

// Admin only image upload
router.post('/:id/images', verifyToken, isAdmin, upload.array('imagenes', 5), casaController.uploadImages);

module.exports = router;
