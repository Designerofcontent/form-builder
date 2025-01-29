import React from 'react';
import { CssBaseline, Container } from '@mui/material';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FormSteps from './components/FormSteps';
import EmbedForm from './components/EmbedForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <FormSteps />
            </Container>
          </>
        } />
        <Route path="/embed/:formId" element={<EmbedForm />} />
        <Route path="/f/:formId" element={
          <>
            <CssBaseline />
            <Container maxWidth="lg" sx={{ py: 4 }}>
              <FormSteps viewOnly />
            </Container>
          </>
        } />
      </Routes>
    </Router>
  );
}

export default App;
