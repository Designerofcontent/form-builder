import React, { useState } from 'react';
import {
  Box,
  Typography,
  Switch,
  TextField,
  MenuItem,
  FormControlLabel,
  InputAdornment,
  Button,
  Paper,
  Alert,
  Divider,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
];

const paymentGateways = [
  { value: 'stripe', label: 'Stripe', logo: '🔒' },
  { value: 'paypal', label: 'PayPal', logo: '🔒' },
  { value: 'square', label: 'Square', logo: '🔒' },
];

const PaymentConfig = ({ paymentData, onUpdate }) => {
  const [selectedGateway, setSelectedGateway] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [secretKey, setSecretKey] = useState('');

  const handleChange = (field) => (event) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    onUpdate({
      ...paymentData,
      [field]: value,
    });
  };

  const handleGatewayChange = (event) => {
    setSelectedGateway(event.target.value);
    onUpdate({
      ...paymentData,
      gateway: event.target.value,
    });
  };

  const handleApiKeyChange = (event) => {
    setApiKey(event.target.value);
    onUpdate({
      ...paymentData,
      apiKey: event.target.value,
    });
  };

  const handleSecretKeyChange = (event) => {
    setSecretKey(event.target.value);
    onUpdate({
      ...paymentData,
      secretKey: event.target.value,
    });
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Payment Settings
      </Typography>

      {!selectedGateway && !paymentData.gateway && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          You will not be able to take payments unless integration is complete. Please select a payment gateway below.
        </Alert>
      )}

      <Box sx={{ mt: 3 }}>
        <FormControlLabel
          control={
            <Switch
              checked={paymentData.required}
              onChange={handleChange('required')}
            />
          }
          label="Require payment with form submission"
        />

        {paymentData.required && (
          <Box sx={{ mt: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Gateway
              </Typography>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Payment Gateway</InputLabel>
                <Select
                  value={selectedGateway || paymentData.gateway || ''}
                  onChange={handleGatewayChange}
                  label="Select Payment Gateway"
                >
                  {paymentGateways.map((gateway) => (
                    <MenuItem key={gateway.value} value={gateway.value}>
                      {gateway.logo} {gateway.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              {selectedGateway && (
                <>
                  <TextField
                    label="API Key"
                    value={apiKey || paymentData.apiKey || ''}
                    onChange={handleApiKeyChange}
                    fullWidth
                    sx={{ mb: 2 }}
                    type="password"
                  />
                  <TextField
                    label="Secret Key"
                    value={secretKey || paymentData.secretKey || ''}
                    onChange={handleSecretKeyChange}
                    fullWidth
                    type="password"
                  />
                </>
              )}
            </Paper>

            <Paper sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Payment Details
              </Typography>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Amount
                </Typography>
                <TextField
                  value={paymentData.amount}
                  type="number"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        {paymentData.currency === 'USD' ? '$' : 
                         paymentData.currency === 'EUR' ? '€' : '£'}
                      </InputAdornment>
                    ),
                    readOnly: true,
                  }}
                  sx={{ width: 200 }}
                  helperText="Amount will be set based on the selected option"
                  disabled
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Currency
                </Typography>
                <TextField
                  select
                  value={paymentData.currency}
                  onChange={handleChange('currency')}
                  sx={{ width: 200 }}
                >
                  {currencies.map((currency) => (
                    <MenuItem key={currency.value} value={currency.value}>
                      {currency.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Payment Description
                </Typography>
                <TextField
                  value={paymentData.description}
                  onChange={handleChange('description')}
                  placeholder="e.g., Conference Registration Fee"
                  fullWidth
                  multiline
                  rows={2}
                />
              </Box>
            </Paper>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default PaymentConfig;
