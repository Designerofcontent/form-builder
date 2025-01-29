import React from 'react';
import { Box, Typography, Paper } from '@mui/material';

function Home() {
  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5">
          Welcome to Pokkadot Form Builder
        </Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>
          Start building your form by adding questions and configuring payment options.
        </Typography>
      </Paper>
    </Box>
  );
}

export default Home;
