import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { Container, Box, Typography, CssBaseline } from '@mui/material';
import FormSteps from './components/FormSteps';

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Pokkadot Form Builder
            </Typography>
          </Box>
          <Routes>
            <Route path="/" element={<FormSteps />} />
          </Routes>
        </Container>
      </Router>
    </>
  );
}

export default App;
