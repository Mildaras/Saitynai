const mongoose = require('mongoose');

// Define the Bid schema
const bidSchema = new mongoose.Schema({
  auctionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: {
    type: Number,
    required: true,
    min: [1, 'Bid amount must be greater than zero.'],
  },  
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Bid', bidSchema);
