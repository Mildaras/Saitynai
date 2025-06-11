const mongoose = require('mongoose');

// Define the Auction schema
const auctionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  startingPrice: { type: Number, required: true },
  regionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Region', required: true },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: (value) => value > Date.now(),
      message: 'End date must be in the future.',
    },
  },  
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Auction', auctionSchema);
