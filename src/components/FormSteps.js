import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  Typography,
  Paper,
} from '@mui/material';
import FormBuilder from './FormBuilder';
import PaymentConfig from './PaymentConfig';
import FormPreview from './FormPreview';

const steps = ['Build Form', 'Payment Settings', 'Preview & Submit'];

const FormSteps = ({ viewOnly = false }) => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    questions: [],
    payment: {
      required: false,
      amount: 0,
      currency: 'USD',
      description: '',
    },
  });

  const handleNext = () => {
    if (activeStep === steps.length - 1) {
      // Submit form
      const newFormId = formId || Date.now().toString();
      // Here you would typically save the form to your backend
      console.log('Form submitted:', formData);
      navigate(`/embed/${newFormId}`);
    } else {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFormUpdate = (data) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };

  if (viewOnly) {
    return <FormPreview questions={formData.questions} viewOnly />;
  }

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Paper sx={{ p: 3, mb: 3 }}>
        {activeStep === 0 && (
          <FormBuilder
            formData={formData}
            onUpdate={handleFormUpdate}
          />
        )}
        {activeStep === 1 && (
          <PaymentConfig
            paymentData={formData.payment}
            onUpdate={(payment) => handleFormUpdate({ payment })}
          />
        )}
        {activeStep === 2 && (
          <Box>
            <Typography variant="h6" gutterBottom>
              Preview Your Form
            </Typography>
            <Paper sx={{ p: 3, bgcolor: '#f5f5f5' }}>
              <FormPreview
                questions={formData.questions}
                payment={formData.payment}
              />
            </Paper>
          </Box>
        )}
      </Paper>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
        >
          Back
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
        >
          {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
        </Button>
      </Box>
    </Box>
  );
};

export default FormSteps;
