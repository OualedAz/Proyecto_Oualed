const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Security Middlewares
app.use(helmet({
  contentSecurityPolicy: false, // Turn off CSP for development to easily pull assets/fonts
  crossOriginResourcePolicy: false
}));

// CORS Configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || '*',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Rate Limiting (Prevent brute force / DOS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // limit each IP to 1000 requests per windowMs
  message: { error: 'Demasiadas peticiones desde esta IP. Por favor intente más tarde.' }
});
app.use('/api/', limiter);

// Request Parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve Uploaded Images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/casas', require('./routes/casaRoutes'));
app.use('/api/reservas', require('./routes/reservaRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/notificaciones', require('./routes/notificacionRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Fallback to index.html for SPA (though hash routing is used, it's nice to have a default)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Ha ocurrido un error inesperado en el servidor.' });
});

// Export for Vercel serverless, or start server locally
if (process.env.VERCEL) {
  module.exports = app;
} else {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`Access the application at http://localhost:${PORT}`);
  });
}
