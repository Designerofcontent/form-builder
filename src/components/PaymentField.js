import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import {
  Box,
  Button,
  TextField,
  Typography,
  Alert,
} from '@mui/material';

const CARD_ELEMENT_OPTIONS = {
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
};

const PaymentField = ({ amount, currency = 'usd', onPaymentSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    try {
      // Create payment intent
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          email,
        }),
      });

      const { clientSecret } = await response.json();

      // Confirm payment
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            email,
          },
        },
      });

      if (result.error) {
        setError(result.error.message);
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          onPaymentSuccess(result.paymentIntent);
        }
      }
    } catch (err) {
      setError('An error occurred while processing your payment.');
    }

    setProcessing(false);
  };

  return (
    <Box sx={{ maxWidth: 500, mx: 'auto', p: 2 }}>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          type="email"
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          sx={{ mb: 2 }}
        />

        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" gutterBottom>
            Card Details
          </Typography>
          <Box
            sx={{
              p: 2,
              border: '1px solid #e0e0e0',
              borderRadius: 1,
            }}
          >
            <CardElement options={CARD_ELEMENT_OPTIONS} />
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={!stripe || processing}
        >
          Pay {new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency,
          }).format(amount / 100)}
        </Button>
      </form>
    </Box>
  );
};

export default PaymentField;
