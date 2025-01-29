import React, { useState } from 'react';
import {
  Stepper,
  Step,
  StepLabel,
  Button,
  Box,
  Paper,
} from '@mui/material';
import FormBuilder from './FormBuilder';
import PaymentConfig from './PaymentConfig';
import FormPreview from './FormPreview';

const steps = ['Build Form', 'Configure Payment', 'Preview'];

function FormSteps() {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    questions: [],
    selectedPrice: null,
    payment: {
      required: true, // Always required
      amount: 0,
      currency: 'USD',
      description: '',
    },
  });

  const handleNext = () => {
    if (activeStep === 0 && Array.isArray(formData.questions)) {
      // Look for radio questions with prices
      for (const question of formData.questions) {
        if (question.type === 'radio' && Array.isArray(question.options)) {
          const selectedOption = question.options.find(opt => opt.selected);
          if (selectedOption?.price) {
            setFormData(prev => ({
              ...prev,
              selectedPrice: selectedOption.price,
              payment: {
                ...prev.payment,
                amount: selectedOption.price,
                description: `Selected plan: ${selectedOption.label}`
              }
            }));
            break;
          }
        }
      }
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleFormUpdate = (questions) => {
    setFormData(prev => ({
      ...prev,
      questions: Array.isArray(questions) ? questions : [],
    }));
  };

  const handlePaymentUpdate = (payment) => {
    setFormData(prev => ({
      ...prev,
      payment: {
        ...payment,
        required: true, // Always required
        // Keep the amount locked to the selected price if one exists
        amount: prev.selectedPrice || payment.amount
      },
    }));
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <FormBuilder
            questions={formData.questions}
            onUpdate={handleFormUpdate}
          />
        );
      case 1:
        return (
          <PaymentConfig
            payment={formData.payment}
            onUpdate={handlePaymentUpdate}
            selectedPrice={formData.selectedPrice}
          />
        );
      case 2:
        return (
          <FormPreview
            questions={formData.questions}
            payment={formData.payment}
          />
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <Paper sx={{ p: 3 }}>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          <Button
            disabled={activeStep === 0}
            onClick={handleBack}
            sx={{ mr: 1 }}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={activeStep === steps.length - 1}
          >
            {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}

export default FormSteps;
