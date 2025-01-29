const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const emailService = require('./services/emailService');
const PaymentAnalytics = require('./models/PaymentAnalytics');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../build')));

// MongoDB connection with better logging
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB Connected Successfully!');
  console.log(`📦 Database: ${mongoose.connection.name}`);
  console.log(`🔌 Host: ${mongoose.connection.host}:${mongoose.connection.port}`);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err);
  process.exit(1);
});

// Log when database connection is lost
mongoose.connection.on('disconnected', () => {
  console.log('❌ MongoDB Disconnected');
});

// Log when database reconnects
mongoose.connection.on('reconnected', () => {
  console.log('✅ MongoDB Reconnected');
});

// Form Schema
const formSchema = new mongoose.Schema({
  title: String,
  questions: [{
    type: String,
    label: String,
    required: Boolean,
    options: [String],
  }],
  payment: {
    required: Boolean,
    amount: Number,
    currency: String,
    description: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const Form = mongoose.model('Form', formSchema);

// Payment Routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, email, formId } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      receipt_email: email,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        formId,
        email,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Stripe webhook handling
app.post('/api/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { formId, email } = paymentIntent.metadata;

    // Record analytics
    await PaymentAnalytics.create({
      formId,
      date: new Date(),
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: 'succeeded',
      country: paymentIntent.shipping?.address?.country,
      paymentMethod: paymentIntent.payment_method_types[0],
      customerEmail: email,
    });

    // Send receipt email
    const form = await Form.findById(formId);
    await emailService.sendPaymentReceipt({
      email,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      formTitle: form.title,
      paymentId: paymentIntent.id,
      date: new Date(),
      items: [{
        name: form.title,
        description: form.payment.description,
      }],
    });
  }

  res.json({ received: true });
});

// Analytics Routes
app.post('/api/analytics/:formId', async (req, res) => {
  try {
    const { formId } = req.params;
    const { startDate, endDate } = req.body;

    const analytics = await PaymentAnalytics.getAnalytics(formId, startDate, endDate);
    res.json(analytics);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Form Routes
app.post('/api/forms', async (req, res) => {
  try {
    const form = new Form(req.body);
    await form.save();
    res.status(201).json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findById(req.params.id);
    if (!form) {
      return res.status(404).json({ error: 'Form not found' });
    }
    res.json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.put('/api/forms/:id', async (req, res) => {
  try {
    const form = await Form.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    res.json(form);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.delete('/api/forms/:id', async (req, res) => {
  try {
    await Form.findByIdAndDelete(req.params.id);
    res.status(204).end();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// API Routes
const paymentRoutes = require('./routes/payment');
app.use('/api/payment', paymentRoutes);

// Serve React app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
