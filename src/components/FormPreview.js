import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  FormControlLabel,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// Initialize Stripe with environment variable
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ amount, currency, onPaymentComplete }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent
      const response = await fetch('/api/payment/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          currency: currency.toLowerCase(),
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        onPaymentComplete();
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ mb: 2 }}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      <Button
        type="submit"
        variant="contained"
        disabled={!stripe || processing}
        startIcon={processing ? <CircularProgress size={20} /> : <PaymentIcon />}
        fullWidth
      >
        {processing ? 'Processing...' : `Pay ${currency} ${amount.toFixed(2)}`}
      </Button>
    </form>
  );
};

const FormPreview = ({ questions, payment, onUpdate, viewOnly = false }) => {
  const [formData, setFormData] = useState({});
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Set initial selected prices from default selections
    questions.forEach(question => {
      if (question.type === 'dropdown') {
        const selectedOption = question.options.find(opt => opt.selected);
        if (selectedOption) {
          handleInputChange(question.id, selectedOption.label, selectedOption.price);
        }
      }
    });
  }, [questions]);

  useEffect(() => {
    if (payment?.required && onUpdate) {
      onUpdate({
        ...payment,
        amount: selectedPrice
      });
    }
  }, [selectedPrice, payment, onUpdate]);

  const handleInputChange = (questionId, value, price = null) => {
    setFormData(prev => ({
      ...prev,
      [questionId]: value
    }));

    if (price !== null) {
      setSelectedPrice(price);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (payment?.required && !paymentComplete) {
      setShowPaymentForm(true);
      return;
    }

    // Handle form submission after payment or if payment not required
    try {
      // Submit form data to your backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      if (!viewOnly) {
        setFormData({});
        setSelectedPrice(0);
        setShowPaymentForm(false);
        setPaymentComplete(false);
      }
    } catch (err) {
      setError('An error occurred while submitting the form.');
    }
  };

  const handlePaymentComplete = () => {
    setPaymentComplete(true);
    setShowPaymentForm(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {paymentComplete && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Payment successful! Form submitted.
        </Alert>
      )}

      {questions.map((question) => (
        <Paper key={question.id} sx={{ mb: 2, p: 2 }}>
          <Typography variant="subtitle1" gutterBottom>
            {question.label}
            {question.required && <span style={{ color: 'red' }}> *</span>}
          </Typography>

          {question.type === 'dropdown' && (
            <RadioGroup
              value={formData[question.id] || ''}
              onChange={(e) => {
                const selectedOption = question.options.find(opt => opt.label === e.target.value);
                handleInputChange(question.id, e.target.value, selectedOption?.price || 0);
              }}
            >
              {question.options.map((option, index) => (
                <FormControlLabel
                  key={index}
                  value={option.label}
                  control={<Radio />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Typography>{option.label}</Typography>
                      <Typography color="primary" fontWeight="bold">
                        ${option.price.toFixed(2)}
                      </Typography>
                    </Box>
                  }
                  sx={{ mb: 1 }}
                />
              ))}
            </RadioGroup>
          )}

          {question.type === 'text' && (
            <TextField
              fullWidth
              value={formData[question.id] || ''}
              onChange={(e) => handleInputChange(question.id, e.target.value)}
              required={question.required}
              disabled={viewOnly}
            />
          )}
        </Paper>
      ))}

      {payment?.required && (
        <Paper sx={{ mb: 2, p: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <PaymentIcon sx={{ mr: 1 }} />
            <Typography variant="subtitle1">
              Payment Required
            </Typography>
          </Box>
          
          <Typography variant="body1" gutterBottom>
            Amount: {payment.currency === 'USD' ? '$' : 
                    payment.currency === 'EUR' ? '€' : '£'}
            {selectedPrice.toFixed(2)}
          </Typography>
          
          {payment.description && (
            <Typography variant="body2" color="text.secondary">
              {payment.description}
            </Typography>
          )}

          {showPaymentForm && !paymentComplete && (
            <Box sx={{ mt: 2 }}>
              <Elements stripe={stripePromise}>
                <PaymentForm
                  amount={selectedPrice}
                  currency={payment.currency}
                  onPaymentComplete={handlePaymentComplete}
                />
              </Elements>
            </Box>
          )}
        </Paper>
      )}

      {!viewOnly && !showPaymentForm && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            startIcon={<PaymentIcon />}
          >
            {payment?.required ? 'Proceed to Payment' : 'Submit'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FormPreview;
