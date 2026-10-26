import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export default async function handler(req, res) {
  // CORS configuration
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const { name, email, orderNum, total, subtotal, discount, couponCode, shipping, paymentLabel, cart } = req.body || {};

  if (!email || !cart || !Array.isArray(cart) || cart.length === 0) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const formatMoney = (amount) => '$ ' + Math.round(Number(amount) || 0).toLocaleString('es-CO');

    const itemsHtml = cart.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.quantity}x ${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">${formatMoney(item.priceNum * item.quantity)}</td>
      </tr>
    `).join('');

    const discountRow = (discount && Number(discount) > 0) ? `
      <tr>
        <td style="padding: 10px; text-align: right; font-weight: bold; color: #285943;">Descuento ${couponCode ? `(${couponCode})` : ''}:</td>
        <td style="padding: 10px; text-align: right; font-weight: bold; color: #285943;">-${formatMoney(discount)}</td>
      </tr>
    ` : '';

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
            ${discountRow}
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

    return res.status(200).json({ success: true, message: 'Factura enviada por correo' });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return res.status(500).json({ error: 'No se pudo enviar el correo de la factura' });
  }
}
