const mongoose = require('mongoose');
const User = require('./models/User');
const Region = require('./models/Region');
const Auction = require('./models/Auction');

mongoose.connect('mongodb://localhost:27017/real_estate_auction', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const seedData = async () => {
  try {
    console.log('Deleting existing data...');
    await User.deleteMany({});
    console.log('Users deleted');
    await Region.deleteMany({});
    console.log('Regions deleted');
    await Auction.deleteMany({});
    console.log('Auctions deleted');

    // Insert sample users
    console.log('Inserting sample users...');
    const adminUser = new User({
      username: 'admin',
      email: 'admin@example.com',
      password: 'adminpassword', // use bcrypt to hash in real setup
      role: 'admin',
    });
    const memberUser = new User({
      username: 'member',
      email: 'member@example.com',
      password: 'memberpassword',
      role: 'member',
    });

    await adminUser.save();
    console.log('Admin user saved');
    await memberUser.save();
    console.log('Member user saved');

    // Insert sample region
    console.log('Inserting sample region...');
    const region = new Region({ name: 'Region A', description: 'Sample region description' });
    await region.save();
    console.log('Region saved with ID:', region._id);

    // Insert sample auction
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

    console.log('Sample data added successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    mongoose.connection.close();
    console.log('MongoDB connection closed');
  }
};

seedData();
