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
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: false
}));

// CORS Configuration — allow frontend origin(s)
const allowedOrigins = [
  process.env.FRONTEND_URL,       // Production: https://tu-app.vercel.app
  'http://localhost:5500',        // VS Code Live Server
  'http://127.0.0.1:5500',
  'http://localhost:3000'         // Local dev
].filter(Boolean);

const corsOptions = {
  origin: allowedOrigins.length > 0 ? allowedOrigins : '*',
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

// Health Check (Railway uses this to verify the service is alive)
app.get('/', (req, res) => {
  res.json({ status: 'ok', service: 'gesCasesRurals API', timestamp: new Date().toISOString() });
});

// Mount API Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/casas', require('./routes/casaRoutes'));
app.use('/api/reservas', require('./routes/reservaRoutes'));
app.use('/api/usuarios', require('./routes/usuarioRoutes'));
app.use('/api/notificaciones', require('./routes/notificacionRoutes'));
app.use('/api/stats', require('./routes/statsRoutes'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Ha ocurrido un error inesperado en el servidor.' });
});

// Start server
app.listen(PORT, () => {
  console.log(`gesCasesRurals API running on port ${PORT}`);
});

