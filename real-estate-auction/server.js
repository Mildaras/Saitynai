const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const regionRoutes = require('./routes/regionRoutes');
const auctionRoutes = require('./routes/auctionRoutes');
const bidRoutes = require('./routes/bidRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Welcome to the Real Estate Auction API');
});

app.use('/users', userRoutes);

app.use('/regions', regionRoutes);                // Routes related to regions
app.use('/auctions', auctionRoutes);
app.use('/auctions/bids', bidRoutes);
app.use(errorHandler);

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
