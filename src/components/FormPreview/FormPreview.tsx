import React from 'react';
import styled from 'styled-components';

interface FormPreviewProps {
  elements: any[];
  theme: {
    primaryColor: string;
    backgroundColor: string;
    font: string;
  };
}

const PreviewContainer = styled.div<{ backgroundColor: string, font: string }>`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: ${props => props.backgroundColor};
  font-family: ${props => props.font}, sans-serif;
`;

const ElementWrapper = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
`;

const Input = styled.input<{ primaryColor: string }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  &:focus {
    outline: none;
    border-color: ${props => props.primaryColor};
    box-shadow: 0 0 0 2px ${props => props.primaryColor}33;
  }
`;

const TextArea = styled.textarea<{ primaryColor: string }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  min-height: 100px;
  resize: vertical;
  &:focus {
    outline: none;
    border-color: ${props => props.primaryColor};
    box-shadow: 0 0 0 2px ${props => props.primaryColor}33;
  }
`;

const Select = styled.select<{ primaryColor: string }>`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #e2e8f0;
  border-radius: 0.375rem;
  background-color: white;
  &:focus {
    outline: none;
    border-color: ${props => props.primaryColor};
    box-shadow: 0 0 0 2px ${props => props.primaryColor}33;
  }
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const RadioLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
`;

const Heading = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1rem;
`;

const FormPreview: React.FC<FormPreviewProps> = ({ elements, theme }) => {
  const renderElement = (element: any) => {
    switch (element.type) {
      case 'heading':
        return <Heading>{element.label}</Heading>;
      
      case 'text':
        return (
          <ElementWrapper>
            <Label>{element.label}</Label>
            <Input type="text" primaryColor={theme.primaryColor} />
          </ElementWrapper>
        );
      
      case 'email':
        return (
          <ElementWrapper>
            <Label>{element.label}</Label>
            <Input type="email" primaryColor={theme.primaryColor} />
          </ElementWrapper>
        );
      
      case 'phone':
        return (
          <ElementWrapper>
            <Label>{element.label}</Label>
            <Input type="tel" primaryColor={theme.primaryColor} />
          </ElementWrapper>
        );
      
      case 'date':
        return (
          <ElementWrapper>
            <Label>{element.label}</Label>
            <Input type="date" primaryColor={theme.primaryColor} />
          </ElementWrapper>
        );
      
      case 'textarea':
        return (
          <ElementWrapper>
            <Label>{element.label}</Label>
            <TextArea primaryColor={theme.primaryColor} />
          </ElementWrapper>
        );
      
      case 'dropdown':
        return (
          <ElementWrapper>
            <Label>{element.label}</Label>
            <Select primaryColor={theme.primaryColor}>
              {element.options?.map((option: any) => (
                <option key={option.id} value={option.id}>
                  {option.label} {option.price && `($${option.price})`}
                </option>
              ))}
            </Select>
          </ElementWrapper>
        );
      
      case 'radio':
        return (
          <ElementWrapper>
            <Label>{element.label}</Label>
            <RadioGroup>
              {element.options?.map((option: any) => (
                <RadioLabel key={option.id}>
                  <input type="radio" name={`radio-${element.id}`} />
                  {option.label} {option.price && `($${option.price})`}
                </RadioLabel>
              ))}
            </RadioGroup>
          </ElementWrapper>
        );
      
      default:
        return null;
    }
  };

  return (
    <PreviewContainer backgroundColor={theme.backgroundColor} font={theme.font}>
      {elements.map((element) => (
        <div key={element.id}>
          {renderElement(element)}
        </div>
      ))}
    </PreviewContainer>
  );
};

export default FormPreview;
