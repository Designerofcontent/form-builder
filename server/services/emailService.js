const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const path = require('path');
const fs = require('fs').promises;

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: process.env.EMAIL_PORT === 465,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  }

  async sendPaymentReceipt(options) {
    const {
      email,
      amount,
      currency,
      formTitle,
      paymentId,
      date,
      items = [],
    } = options;

    const templatePath = path.join(__dirname, '../templates/payment-receipt.html');
    const template = await fs.readFile(templatePath, 'utf-8');
    const compiledTemplate = handlebars.compile(template);

    const formattedAmount = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount / 100);

    const htmlContent = compiledTemplate({
      formTitle,
      amount: formattedAmount,
      paymentId,
      date: new Date(date).toLocaleDateString(),
      items,
    });

    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: email,
      subject: `Payment Receipt for ${formTitle}`,
      html: htmlContent,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Payment receipt sent to ${email}`);
    } catch (error) {
      console.error('Error sending payment receipt:', error);
      throw error;
    }
  }
}

module.exports = new EmailService();
