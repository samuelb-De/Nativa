import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import enviarFacturaHandler from './api/enviar-factura.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// API route for sending email invoices
app.post('/api/enviar-factura', enviarFacturaHandler);

// Specific headers for Service Worker and Web App Manifest
app.use((req, res, next) => {
  if (req.path === '/sw.js') {
    res.setHeader('Service-Worker-Allowed', '/');
    res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  } else if (req.path === '/manifest.json') {
    res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  }
  next();
});

// Serve static assets and html files from the root directory
app.use(express.static(__dirname, { extensions: ['html'] }));

// Fallback to index.html for client-side routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Listen on configured port when run directly (Node.js dev or Google Cloud Run)
if (process.env.VERCEL !== '1') {
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running at http://0.0.0.0:${PORT}`);
  });
}

export default app;
