const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

async function initializeDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Create collections
    await mongoose.connection.createCollection('forms');
    await mongoose.connection.createCollection('paymentanalytics');
    
    console.log('Collections created successfully');
    
    // Create indexes
    await mongoose.connection.collection('forms').createIndex({ createdAt: 1 });
    await mongoose.connection.collection('paymentanalytics').createIndex({ formId: 1, date: 1 });
    
    console.log('Indexes created successfully');
    
    console.log('Database initialization complete');
  } catch (error) {
    console.error('Error initializing database:', error);
  } finally {
    await mongoose.disconnect();
  }
}

initializeDatabase();
