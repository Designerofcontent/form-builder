import React, { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Plus, X, Search, Type, Mail, Phone, Calendar, Image, FileText, Star, BarChart, CheckSquare, List, Settings, Eye, DollarSign, Trash, Code } from 'lucide-react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import DesignSettings from './DesignSettings';
import EmbedCode from './EmbedCode';

// Initialize Stripe with the publishable key from environment
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_live_GfpA1cJKg6Q7Bp0aMPAmzci200BLRNKgG4');

const PaymentForm = ({ amount, onSuccess }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement),
    });

    if (error) {
      setError(error.message);
      setProcessing(false);
    } else {
      // Here you would typically send the paymentMethod.id to your server
      // to complete the payment
      console.log('Payment successful:', paymentMethod);
      onSuccess(paymentMethod);
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-4 border rounded-lg">
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {processing ? 'Processing...' : `Pay $${amount}`}
      </button>
    </form>
  );
};

const FormBuilder = ({ onUpdate }) => {
  const [elements, setElements] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showEmbedModal, setShowEmbedModal] = useState(false);
  const [selectedTab, setSelectedTab] = useState('design'); // 'design' or 'advanced'
  const [selectedOptions, setSelectedOptions] = useState({});
  const [totalAmount, setTotalAmount] = useState(0);
  const [theme, setTheme] = useState({
    name: 'custom',
    primaryColor: '#FF00BF',
    questionColor: '#101828',
    answerColor: '#101828',
    formColor: '#ffffff',
    backgroundColor: '#ffffff',
    fontFamily: 'Inter',
    fontSize: 'md',
    fontWeight: 'normal',
    margin: 'md',
    layout: 'standard'
  });

  useEffect(() => {
    // Calculate total amount based on selected options
    let total = 0;
    Object.entries(selectedOptions).forEach(([elementId, optionId]) => {
      const element = elements.find(el => el.id.toString() === elementId);
      if (element && element.options) {
        const selectedOption = element.options.find(opt => opt.id.toString() === optionId);
        if (selectedOption) {
          total += parseFloat(selectedOption.price) || 0;
        }
      }
    });
    setTotalAmount(total);
  }, [selectedOptions, elements]);

  const elementCategories = [
    {
      title: 'Basic',
      items: [
        { id: 'heading', icon: Type, label: 'Heading' },
        { id: 'richtext', icon: FileText, label: 'Rich Text Block' },
        { id: 'singleline', icon: FileText, label: 'Single Line Input' },
        { id: 'multiline', icon: FileText, label: 'Multi-line Input' },
        { id: 'number', icon: List, label: 'Number' },
      ]
    },
    {
      title: 'Personal',
      items: [
        { id: 'name', icon: Type, label: 'Name' },
        { id: 'email', icon: Mail, label: 'Email' },
        { id: 'phone', icon: Phone, label: 'Phone' },
        { id: 'link', icon: FileText, label: 'Link' },
        { id: 'address', icon: FileText, label: 'Address' },
      ]
    },
    {
      title: 'Date & Time',
      items: [
        { id: 'date', icon: Calendar, label: 'Date' },
        { id: 'time', icon: Calendar, label: 'Time' },
        { id: 'scheduler', icon: Calendar, label: 'Scheduler' },
      ]
    },
    {
      title: 'Survey',
      items: [
        { id: 'scale', icon: BarChart, label: 'Scale Rating' },
        { id: 'star', icon: Star, label: 'Star Rating' },
        { id: 'ranking', icon: List, label: 'Ranking' },
      ]
    },
    {
      title: 'Choice',
      items: [
        { id: 'singlechoice', icon: CheckSquare, label: 'Single Choice' },
        { id: 'multiplechoice', icon: CheckSquare, label: 'Multiple Choice' },
        { id: 'picturechoice', icon: Image, label: 'Picture Choice' },
        { id: 'dropdown', icon: List, label: 'Drop Down' },
      ]
    },
  ];

  const handleAddElement = (type) => {
    const newElement = {
      id: Date.now(),
      type,
      label: `New ${type}`,
      required: false,
      options: type === 'dropdown' ? [{ label: '', price: '0', id: Date.now() }] : undefined
    };
    setElements([...elements, newElement]);
  };

  const handleOptionSelect = (elementId, optionId) => {
    setSelectedOptions(prev => ({
      ...prev,
      [elementId]: optionId
    }));
  };

  const renderElement = (element) => {
    switch (element.type) {
      case 'dropdown':
        return (
          <div className="space-y-2">
            {element.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-4">
                <input
                  type="radio"
                  name={`element-${element.id}`}
                  checked={selectedOptions[element.id] === option.id.toString()}
                  onChange={() => handleOptionSelect(element.id.toString(), option.id.toString())}
                  className="w-4 h-4 text-pink-600"
                />
                <span className="flex-1">{option.label}</span>
                <span className="text-gray-600">${parseFloat(option.price).toFixed(2)}</span>
              </div>
            ))}
          </div>
        );
      // Add other element types here
      default:
        return null;
    }
  };

  const handlePaymentSuccess = (paymentMethod) => {
    console.log('Payment successful:', paymentMethod);
    setShowPaymentModal(false);
    // Handle post-payment logic here
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(elements);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setElements(items);
  };

  return (
    <div className="min-h-screen bg-gray-50" style={{ fontFamily: theme.fontFamily }}>
      <div className="border-b bg-white px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <span className="font-medium">Untitled Form</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setShowEmbedModal(true)}
            className="px-3 py-1.5 text-sm border rounded-lg hover:bg-gray-50 flex items-center gap-2"
          >
            <Code className="w-4 h-4" />
            Embed
          </button>
          <button className="px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700">
            Publish
          </button>
        </div>
      </div>

      <div className="flex">
        {/* Left Panel - Elements */}
        <div className="w-64 bg-[#FF00BF] p-4 min-h-screen">
          <h2 className="text-white font-semibold mb-4">Form Elements</h2>
          <div className="space-y-2">
            {elementCategories.map(category => (
              <div key={category.title} className="bg-white/10 rounded-lg p-3">
                <h3 className="text-white text-sm mb-2">{category.title}</h3>
                <div className="space-y-1">
                  {category.items.map(item => (
                    <button
                      key={item.id}
                      onClick={() => handleAddElement(item.id)}
                      className="w-full flex items-center space-x-2 p-2 bg-white/5 hover:bg-white/20 rounded-lg text-white text-sm"
                    >
                      <item.icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel - Form Builder */}
        <div className="flex-1 p-6" style={{ backgroundColor: theme.backgroundColor }}>
          <div className="max-w-3xl mx-auto">
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="form-elements">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4"
                  >
                    {elements.map((element, index) => (
                      <Draggable
                        key={element.id}
                        draggableId={element.id.toString()}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            className="bg-white p-4 rounded-lg shadow-sm border border-gray-200"
                            style={{ backgroundColor: theme.formColor }}
                          >
                            <div className="flex justify-between items-center mb-4">
                              <input
                                type="text"
                                value={element.label}
                                onChange={(e) => {
                                  const newElements = [...elements];
                                  newElements[index].label = e.target.value;
                                  setElements(newElements);
                                }}
                                className="text-lg font-medium bg-transparent border-none focus:outline-none"
                                style={{ color: theme.questionColor }}
                              />
                              <button
                                onClick={() => {
                                  const newElements = [...elements];
                                  newElements.splice(index, 1);
                                  setElements(newElements);
                                }}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash className="w-4 h-4" />
                              </button>
                            </div>
                            
                            {element.type === 'dropdown' && (
                              <div className="space-y-2">
                                {element.options.map((option, optionIndex) => (
                                  <div key={option.id} className="flex items-center space-x-2">
                                    <input
                                      type="text"
                                      value={option.label}
                                      onChange={(e) => {
                                        const newElements = [...elements];
                                        newElements[index].options[optionIndex].label = e.target.value;
                                        setElements(newElements);
                                      }}
                                      placeholder="Option label"
                                      className="flex-1 p-2 border rounded"
                                      style={{ color: theme.answerColor }}
                                    />
                                    <div className="flex items-center">
                                      <span className="text-gray-500">$</span>
                                      <input
                                        type="number"
                                        value={option.price}
                                        onChange={(e) => {
                                          const newElements = [...elements];
                                          newElements[index].options[optionIndex].price = e.target.value;
                                          setElements(newElements);
                                        }}
                                        placeholder="0.00"
                                        className="w-24 p-2 border rounded"
                                      />
                                    </div>
                                    <button
                                      onClick={() => {
                                        const newElements = [...elements];
                                        newElements[index].options.splice(optionIndex, 1);
                                        if (newElements[index].options.length === 0) {
                                          newElements[index].options.push({ label: '', price: '0', id: Date.now() });
                                        }
                                        setElements(newElements);
                                      }}
                                      className="text-gray-400 hover:text-red-500"
                                    >
                                      <Trash className="w-4 h-4" />
                                    </button>
                                  </div>
                                ))}
                                <button
                                  onClick={() => {
                                    const newElements = [...elements];
                                    newElements[index].options.push({ label: '', price: '0', id: Date.now() });
                                    setElements(newElements);
                                  }}
                                  className="flex items-center text-blue-600 hover:text-blue-700"
                                >
                                  <Plus className="w-4 h-4 mr-1" />
                                  Add Option
                                </button>
                              </div>
                            )}
                            {renderElement(element)}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            {elements.length > 0 && (
              <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-xl font-semibold mb-4">Payment Details</h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center text-lg">
                    <span>Total Amount:</span>
                    <span className="font-semibold">${totalAmount.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="w-full bg-[#FF00BF] text-white py-3 px-4 rounded-lg hover:bg-opacity-90"
                    style={{ backgroundColor: theme.primaryColor }}
                  >
                    Proceed to Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel - Design Settings */}
        <div className="w-80 bg-white border-l border-gray-200 overflow-y-auto">
          <div className="flex border-b">
            <button
              className={`flex-1 px-4 py-2 text-sm ${
                selectedTab === 'design'
                  ? 'text-[#FF00BF] border-b-2 border-[#FF00BF]'
                  : 'text-gray-500'
              }`}
              onClick={() => setSelectedTab('design')}
            >
              Design
            </button>
            <button
              className={`flex-1 px-4 py-2 text-sm ${
                selectedTab === 'advanced'
                  ? 'text-[#FF00BF] border-b-2 border-[#FF00BF]'
                  : 'text-gray-500'
              }`}
              onClick={() => setSelectedTab('advanced')}
            >
              Advanced
            </button>
          </div>

          {selectedTab === 'design' ? (
            <DesignSettings theme={theme} onThemeChange={setTheme} />
          ) : (
            <div className="p-4">
              {/* Add advanced settings here */}
            </div>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[500px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Complete Payment</h2>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <Elements stripe={stripePromise}>
              <PaymentForm
                amount={totalAmount.toFixed(2)}
                onSuccess={handlePaymentSuccess}
              />
            </Elements>
          </div>
        </div>
      )}

      {/* Embed Modal */}
      {showEmbedModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-[600px]">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Embed Form</h2>
              <button
                onClick={() => setShowEmbedModal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <EmbedCode formId="your-form-id" theme={theme} />
          </div>
        </div>
      )}
    </div>
  );
};

export default FormBuilder;
