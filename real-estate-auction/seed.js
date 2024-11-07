const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Region = require('./models/Region');
const Auction = require('./models/Auction');
const Bid = require('./models/Bid');

mongoose.connect('mongodb://localhost:27017/real_estate_auction', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    console.log('Deleting existing data...');
    await User.deleteMany({});
    await Region.deleteMany({});
    await Auction.deleteMany({});
    await Bid.deleteMany({});
    console.log('Existing data deleted');

    // Insert sample users
    console.log('Inserting sample users...');
    const adminPassword = await bcrypt.hash('adminpassword', 10);
    const memberPassword = await bcrypt.hash('memberpassword', 10);

    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    });

    const memberUser = new User({
      username: 'member',
      email: 'member@example.com',
      password: memberPassword,
      role: 'member',
    });

    await adminUser.save();
    await memberUser.save();
    console.log('Admin and member users saved');

    // Insert a sample region
    console.log('Inserting sample region...');
    const region = new Region({
      name: 'Region A',
      description: 'Sample region description',
    });
    await region.save();
    console.log('Region saved with ID:', region._id);

    // Insert a sample auction in the region
    console.log('Inserting sample auction...');
    const auction = new Auction({
      title: 'Auction 1',
      description: 'Sample auction description',
      startingPrice: 100,
      regionId: region._id,
      endDate: new Date('2025-12-31'),
    });
    await auction.save();
    console.log('Auction saved with ID:', auction._id);

    // Insert sample bids for the auction
    console.log('Inserting sample bids...');
    const bid1 = new Bid({
      auctionId: auction._id,
      userId: memberUser._id,
      amount: 150,
    });
    const bid2 = new Bid({
      auctionId: auction._id,
      userId: memberUser._id,
      amount: 200,
    });

    await bid1.save();
    await bid2.save();
    console.log('Sample bids saved with IDs:', bid1._id, bid2._id);

    console.log('Sample data added successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedData();
