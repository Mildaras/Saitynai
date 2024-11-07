const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const regionRoutes = require('./routes/regionRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Real Estate Auction API');
});

app.use('/users', userRoutes);
app.use('/regions', regionRoutes);
app.use('/auctions', auctionRoutes);
app.use('/auctions', bidRoutes);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
