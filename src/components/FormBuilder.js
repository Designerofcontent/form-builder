import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  IconButton,
  Grid,
  Drawer,
  Tabs,
  Tab,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  Tooltip,
  MenuItem,
  InputAdornment,
  Radio,
  RadioGroup,
  FormControlLabel,
} from '@mui/material';
import {
  Title as HeadingIcon,
  TextFields as TextIcon,
  ShortText as SingleLineIcon,
  Notes as MultiLineIcon,
  Numbers as NumberIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Link as LinkIcon,
  LocationOn as AddressIcon,
  DateRange as DateIcon,
  Schedule as TimeIcon,
  Event as SchedulerIcon,
  Poll as ScaleIcon,
  Star as StarIcon,
  FormatListNumbered as RankingIcon,
  RadioButtonChecked as SingleChoiceIcon,
  CheckBox as MultipleChoiceIcon,
  Image as ImageIcon,
  Payment as PaymentIcon,
  Security as RecaptchaIcon,
  Upload as FileUploadIcon,
  DragIndicator,
  Delete,
  Palette as DesignIcon,
  Settings as AdvancedIcon,
  Preview as PreviewIcon,
  History as HistoryIcon,
  Add,
  ArrowDropDown,
  RemoveCircle,
} from '@mui/icons-material';

const ELEMENT_CATEGORIES = {
  basic: {
    label: 'Basic Elements',
    items: [
      { id: 'heading', label: 'Heading', icon: HeadingIcon },
      { id: 'text', label: 'Text Block', icon: TextIcon },
      { id: 'singleline', label: 'Single Line', icon: SingleLineIcon },
      { id: 'multiline', label: 'Multi Line', icon: MultiLineIcon },
      { id: 'number', label: 'Number', icon: NumberIcon },
      { id: 'email', label: 'Email', icon: EmailIcon },
      { id: 'phone', label: 'Phone', icon: PhoneIcon },
      { id: 'link', label: 'Link', icon: LinkIcon },
      { id: 'address', label: 'Address', icon: AddressIcon },
    ],
  },
  datetime: {
    label: 'Date & Time',
    items: [
      { id: 'date', label: 'Date', icon: DateIcon },
      { id: 'time', label: 'Time', icon: TimeIcon },
      { id: 'scheduler', label: 'Scheduler', icon: SchedulerIcon },
    ],
  },
  choice: {
    label: 'Choice',
    items: [
      { id: 'scale', label: 'Scale', icon: ScaleIcon },
      { id: 'rating', label: 'Rating', icon: StarIcon },
      { id: 'ranking', label: 'Ranking', icon: RankingIcon },
      { id: 'singlechoice', label: 'Single Choice', icon: SingleChoiceIcon },
      { id: 'multiplechoice', label: 'Multiple Choice', icon: MultipleChoiceIcon },
      { id: 'dropdown', label: 'Dropdown', icon: ArrowDropDown },
    ],
  },
  upload: {
    label: 'Upload',
    items: [
      { id: 'image', label: 'Image', icon: ImageIcon },
      { id: 'file', label: 'File Upload', icon: FileUploadIcon },
    ],
  },
  payment: {
    label: 'Payment',
    items: [
      { id: 'payment', label: 'Payment', icon: PaymentIcon },
    ],
  },
  security: {
    label: 'Security',
    items: [
      { id: 'recaptcha', label: 'reCAPTCHA', icon: RecaptchaIcon },
    ],
  },
};

const FormBuilder = ({ formData, onUpdate }) => {
  const [questions, setQuestions] = useState(formData?.questions || []);
  const [rightPanelTab, setRightPanelTab] = useState('design');
  const [elementSearchQuery, setElementSearchQuery] = useState('');
  const [showElementPicker, setShowElementPicker] = useState(false);

  useEffect(() => {
    onUpdate?.({ questions });
  }, [questions, onUpdate]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(questions);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setQuestions(items);
  };

  const addElement = (elementType) => {
    const newElement = {
      id: Date.now().toString(),
      type: elementType,
      label: `New ${elementType}`,
      required: false,
      options: elementType === 'dropdown' ? [
        { label: 'Basic Plan', price: 2.99, selected: true },
        { label: 'Pro Plan', price: 7.99, selected: false },
        { label: 'Premium Plan', price: 14.99, selected: false }
      ] : undefined,
    };
    setQuestions([...questions, newElement]);
    setShowElementPicker(false);
  };

  const handleOptionChange = (questionId, index, field, value) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        const newOptions = q.options.map((opt, i) => ({
          ...opt,
          selected: field === 'selected' ? i === index : opt.selected
        }));
        if (field !== 'selected') {
          newOptions[index] = {
            ...newOptions[index],
            [field]: value
          };
        }
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const addOption = (questionId) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId) {
        return {
          ...q,
          options: [
            ...q.options,
            { label: `Plan ${q.options.length + 1}`, price: 0, selected: false }
          ]
        };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const removeOption = (questionId, index) => {
    const updatedQuestions = questions.map(q => {
      if (q.id === questionId && q.options.length > 1) {
        const newOptions = q.options.filter((_, i) => i !== index);
        return { ...q, options: newOptions };
      }
      return q;
    });
    setQuestions(updatedQuestions);
  };

  const filteredCategories = elementSearchQuery
    ? Object.entries(ELEMENT_CATEGORIES).map(([category, data]) => ({
        ...data,
        items: data.items.filter(item =>
          item.label.toLowerCase().includes(elementSearchQuery.toLowerCase())
        ),
      }))
    : ELEMENT_CATEGORIES;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Box sx={{ display: 'flex', height: '100vh' }}>
        {/* Main Form Area */}
        <Box sx={{ flex: 1, p: 3, overflow: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
            <Button
              variant="contained"
              onClick={() => setShowElementPicker(true)}
              startIcon={<Add />}
            >
              Add Elements
            </Button>
            <Box>
              <Tooltip title="Preview">
                <IconButton><PreviewIcon /></IconButton>
              </Tooltip>
              <Tooltip title="History">
                <IconButton><HistoryIcon /></IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Droppable droppableId="questions">
            {(provided) => (
              <Box
                {...provided.droppableProps}
                ref={provided.innerRef}
                sx={{ minHeight: '100px' }}
              >
                {questions.map((question, index) => (
                  <Draggable 
                    key={question.id} 
                    draggableId={question.id} 
                    index={index}
                  >
                    {(provided) => (
                      <Paper
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        sx={{ mb: 2, p: 2 }}
                      >
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <IconButton {...provided.dragHandleProps}>
                            <DragIndicator />
                          </IconButton>
                          <TextField
                            value={question.label}
                            onChange={(e) => {
                              const updatedQuestions = questions.map(q =>
                                q.id === question.id ? { ...q, label: e.target.value } : q
                              );
                              setQuestions(updatedQuestions);
                            }}
                            fullWidth
                            variant="standard"
                          />
                          <IconButton onClick={() => {
                            setQuestions(questions.filter(q => q.id !== question.id));
                          }}>
                            <Delete />
                          </IconButton>
                        </Box>
                        
                        {question.type === 'dropdown' && (
                          <Box sx={{ mt: 2, pl: 6 }}>
                            <RadioGroup
                              value={question.options.findIndex(opt => opt.selected)}
                              onChange={(e) => handleOptionChange(question.id, parseInt(e.target.value), 'selected', true)}
                            >
                              {question.options.map((option, optionIndex) => (
                                <Box key={optionIndex} sx={{ display: 'flex', alignItems: 'center', mb: 1, gap: 1 }}>
                                  <FormControlLabel
                                    value={optionIndex}
                                    control={<Radio />}
                                    label=""
                                  />
                                  <TextField
                                    value={option.label}
                                    onChange={(e) => handleOptionChange(question.id, optionIndex, 'label', e.target.value)}
                                    size="small"
                                    sx={{ flex: 1 }}
                                    placeholder="Plan name"
                                  />
                                  <TextField
                                    value={option.price}
                                    onChange={(e) => handleOptionChange(question.id, optionIndex, 'price', parseFloat(e.target.value) || 0)}
                                    size="small"
                                    type="number"
                                    sx={{ width: 120 }}
                                    InputProps={{
                                      startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                    }}
                                    placeholder="Price"
                                  />
                                  <IconButton 
                                    size="small" 
                                    onClick={() => removeOption(question.id, optionIndex)}
                                    disabled={question.options.length <= 1}
                                  >
                                    <Delete fontSize="small" />
                                  </IconButton>
                                </Box>
                              ))}
                            </RadioGroup>
                            <Button
                              startIcon={<Add />}
                              onClick={() => addOption(question.id)}
                              size="small"
                              sx={{ mt: 1 }}
                            >
                              Add Plan
                            </Button>
                          </Box>
                        )}
                      </Paper>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </Box>

        {/* Right Panel */}
        <Drawer
          variant="permanent"
          anchor="right"
          sx={{
            width: 300,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: 300,
              boxSizing: 'border-box',
              position: 'relative',
            },
          }}
        >
          <Tabs
            value={rightPanelTab}
            onChange={(_, newValue) => setRightPanelTab(newValue)}
            centered
          >
            <Tab 
              icon={<DesignIcon />} 
              label="Design" 
              value="design"
            />
            <Tab 
              icon={<AdvancedIcon />} 
              label="Advanced" 
              value="advanced"
            />
          </Tabs>
          <Box sx={{ p: 2 }}>
            {rightPanelTab === 'design' && (
              <>
                <Typography variant="subtitle1" gutterBottom>Theme</Typography>
                <TextField
                  select
                  fullWidth
                  value="custom"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="custom">Custom Theme</MenuItem>
                </TextField>

                <Typography variant="subtitle1" gutterBottom>Colors</Typography>
                <Grid container spacing={2} sx={{ mb: 2 }}>
                  <Grid item xs={6}>
                    <Typography variant="caption">Primary Color</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value="#FF00BFF"
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: '#FF00BFF',
                              mr: 1,
                              borderRadius: 1,
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="caption">Background Color</Typography>
                    <TextField
                      fullWidth
                      size="small"
                      value="#FFFFFF"
                      InputProps={{
                        startAdornment: (
                          <Box
                            sx={{
                              width: 20,
                              height: 20,
                              bgcolor: '#FFFFFF',
                              mr: 1,
                              borderRadius: 1,
                              border: '1px solid #E0E0E0',
                            }}
                          />
                        ),
                      }}
                    />
                  </Grid>
                </Grid>

                <Typography variant="subtitle1" gutterBottom>Font</Typography>
                <TextField
                  select
                  fullWidth
                  value="inter"
                  variant="outlined"
                  size="small"
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="inter">Inter</MenuItem>
                </TextField>
              </>
            )}
          </Box>
        </Drawer>

        {/* Element Picker Dialog */}
        <Dialog 
          open={showElementPicker} 
          onClose={() => setShowElementPicker(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography variant="h6">Add Elements</Typography>
              <TextField
                placeholder="Search elements..."
                size="small"
                value={elementSearchQuery}
                onChange={(e) => setElementSearchQuery(e.target.value)}
                sx={{ ml: 'auto', width: 200 }}
              />
            </Box>
          </DialogTitle>
          <DialogContent>
            <Grid container spacing={3}>
              {Object.entries(filteredCategories).map(([category, { label, items }]) => (
                items.length > 0 && (
                  <Grid item xs={12} key={category}>
                    <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold' }}>
                      {label}
                    </Typography>
                    <Grid container spacing={1}>
                      {items.map((item) => {
                        const Icon = item.icon;
                        return (
                          <Grid item xs={4} key={item.id}>
                            <Button
                              fullWidth
                              variant="outlined"
                              startIcon={<Icon />}
                              onClick={() => addElement(item.id)}
                              sx={{ 
                                justifyContent: 'flex-start',
                                textTransform: 'none',
                                py: 1.5,
                              }}
                            >
                              {item.label}
                            </Button>
                          </Grid>
                        );
                      })}
                    </Grid>
                    <Divider sx={{ my: 2 }} />
                  </Grid>
                )
              ))}
            </Grid>
          </DialogContent>
        </Dialog>
      </Box>
    </DragDropContext>
  );
};

export default FormBuilder;
