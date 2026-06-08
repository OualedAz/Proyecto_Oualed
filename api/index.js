// Vercel Serverless Function entry point
// This file re-exports the Express app for Vercel's @vercel/node runtime
const app = require('../backend/server');
module.exports = app;
