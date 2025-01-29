const mongoose = require('mongoose');

const paymentAnalyticsSchema = new mongoose.Schema({
  formId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Form',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['succeeded', 'failed', 'refunded'],
    required: true,
  },
  country: String,
  paymentMethod: String,
  customerEmail: String,
  metadata: mongoose.Schema.Types.Mixed,
});

paymentAnalyticsSchema.statics.getAnalytics = async function(formId, startDate, endDate) {
  const match = {
    formId: mongoose.Types.ObjectId(formId),
    status: 'succeeded',
  };

  if (startDate && endDate) {
    match.date = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const analytics = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: {
          $dateToString: { format: '%Y-%m-%d', date: '$date' },
        },
        totalAmount: { $sum: '$amount' },
        count: { $sum: 1 },
        avgAmount: { $avg: '$amount' },
      },
    },
    { $sort: { '_id': 1 } },
  ]);

  const summary = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalRevenue: { $sum: '$amount' },
        totalTransactions: { $sum: 1 },
        avgTransactionValue: { $avg: '$amount' },
        countries: { $addToSet: '$country' },
        paymentMethods: { $addToSet: '$paymentMethod' },
      },
    },
  ]);

  return {
    dailyData: analytics,
    summary: summary[0] || {
      totalRevenue: 0,
      totalTransactions: 0,
      avgTransactionValue: 0,
      countries: [],
      paymentMethods: [],
    },
  };
};

module.exports = mongoose.model('PaymentAnalytics', paymentAnalyticsSchema);
