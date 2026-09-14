import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for sending email invoices
app.post('/api/enviar-factura', async (req, res) => {
  const { name, email, orderNum, total, subtotal, shipping, paymentLabel, cart } = req.body;

  if (!email || !cart || cart.length === 0) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const formatMoney = (amount) => '$ ' + Math.round(Number(amount)).toLocaleString('es-CO');

    const itemsHtml = cart.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}x ${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatMoney(item.priceNum * item.quantity)}</td>
      </tr>
    `).join('');

    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
        <h2 style="color: #285943; text-align: center;">¡Gracias por tu compra en Nativa!</h2>
        <p>Hola <strong>${name}</strong>,</p>
        <p>Hemos recibido tu pedido <strong>#${orderNum}</strong>. Aquí tienes el resumen de tu compra:</p>
        
        <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
          <thead>
            <tr style="background-color: #f4faf6; text-align: left;">
              <th style="padding: 10px; border-bottom: 2px solid #285943;">Producto</th>
              <th style="padding: 10px; border-bottom: 2px solid #285943; text-align: right;">Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td style="padding: 10px; text-align: right; font-weight: bold;">Subtotal:</td>
              <td style="padding: 10px; text-align: right;">${formatMoney(subtotal)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right; font-weight: bold;">Envío:</td>
              <td style="padding: 10px; text-align: right;">${shipping === 0 ? 'Gratis' : formatMoney(shipping)}</td>
            </tr>
            <tr>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.2em; color: #285943;">Total Cancelado:</td>
              <td style="padding: 10px; text-align: right; font-weight: bold; font-size: 1.2em; color: #285943;">${formatMoney(total)}</td>
            </tr>
          </tfoot>
        </table>

        <p style="margin-top: 20px;"><strong>Método de pago:</strong> ${paymentLabel}</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #777; font-size: 12px;">
          <p>Nos pondremos en contacto pronto para coordinar el envío de tus productos naturales.</p>
          <p>Nativa - Productos Naturales</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Nativa" <${process.env.SMTP_USER}>`,
      to: email,
      subject: `Resumen de tu compra #${orderNum} - Nativa`,
      html: htmlContent,
    });

    res.json({ success: true, message: 'Factura enviada por correo' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    res.status(500).json({ error: 'No se pudo enviar el correo de la factura' });
  }
});

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

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running at http://0.0.0.0:${PORT}`);
});
