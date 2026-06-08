const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middlewares/auth');
const { validateRegistro, validateLogin } = require('../middlewares/validators');

// Public routes
router.post('/register', validateRegistro, authController.register);
router.post('/login', validateLogin, authController.login);

// Private routes
router.get('/profile', verifyToken, authController.getProfile);
router.put('/profile', verifyToken, authController.updateProfile);

module.exports = router;
