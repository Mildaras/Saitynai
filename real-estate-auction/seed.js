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
    await User.deleteMany({});
    await Region.deleteMany({});
    await Auction.deleteMany({});
    await Bid.deleteMany({});

    const adminPassword = await bcrypt.hash('admin', 10);
    const memberPassword = await bcrypt.hash('member', 10);

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

    const region = new Region({
      name: 'Test Region',
      description: 'Test region description',
    });
    await region.save();

    const auction = new Auction({
      title: 'Test Auction',
      description: 'Test auction description',
      startingPrice: 100,
      regionId: region._id,
      endDate: new Date('2025-12-31'),
    });
    await auction.save();

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

  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedData();
