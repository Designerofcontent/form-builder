import React from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Grid,
  Alert,
} from '@mui/material';

function PaymentConfig({ payment, onUpdate, selectedPrice }) {
  const handleChange = (field) => (event) => {
    onUpdate({
      ...payment,
      [field]: event.target.value
    });
  };

  return (
    <Box>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Settings
        </Typography>
        
        {selectedPrice ? (
          <Alert severity="info" sx={{ mb: 3 }}>
            Payment is required for the selected plan.
          </Alert>
        ) : null}

        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Amount"
              type="number"
              value={selectedPrice || payment.amount}
              onChange={handleChange('amount')}
              InputProps={{
                readOnly: !!selectedPrice,
                startAdornment: '$'
              }}
              helperText={selectedPrice ? "Amount is fixed based on the selected plan" : "Enter payment amount"}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Description"
              value={payment.description}
              onChange={handleChange('description')}
              InputProps={{
                readOnly: !!selectedPrice
              }}
              placeholder={selectedPrice ? "" : "e.g., Product purchase, Service fee, etc."}
              multiline
              rows={2}
            />
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

export default PaymentConfig;
