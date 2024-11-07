const mongoose = require('mongoose');

// Define the Region schema
const regionSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
}, { timestamps: true });

// Export the model
module.exports = mongoose.model('Region', regionSchema);
