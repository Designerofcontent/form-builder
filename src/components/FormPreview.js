import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  FormControl,
  FormControlLabel,
  Checkbox,
  Alert,
  CircularProgress,
  Radio,
  RadioGroup,
} from '@mui/material';
import { Payment as PaymentIcon } from '@mui/icons-material';

const FormPreview = ({ questions, payment, onUpdate, viewOnly = false }) => {
  const [formData, setFormData] = useState({});
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

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
    // Update payment amount when price changes
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

    // If this is a dropdown with a price, update the selected price
    if (price !== null) {
      setSelectedPrice(price);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(false);

    try {
      // Here you would integrate with your selected payment gateway
      if (payment?.required) {
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real implementation, you would:
        // 1. Create a payment intent with your payment gateway
        // 2. Handle the payment confirmation
        // 3. Process the form submission
      }

      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccess(true);
      if (!viewOnly) {
        // Reset form after successful submission
        setFormData({});
        setSelectedPrice(0);
      }
    } catch (err) {
      setError(err.message || 'An error occurred while processing your submission.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {success && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Form submitted successfully!
          {payment?.required && ' Payment processed.'}
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

          {/* Add more question types here */}
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
        </Paper>
      )}

      {!viewOnly && (
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
          >
            {isSubmitting ? 'Processing...' : payment?.required ? 'Submit & Pay' : 'Submit'}
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default FormPreview;
