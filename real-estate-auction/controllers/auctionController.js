const Auction = require('../models/Auction');

// Get all auctions
exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().populate('regionId');
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new auction
exports.createAuction = async (req, res) => {
  try {
    const { title, description, startingPrice, regionId, endDate } = req.body;
    const newAuction = new Auction({ title, description, startingPrice, regionId, endDate });
    await newAuction.save();
    res.status(201).json(newAuction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an auction by ID
exports.updateAuction = async (req, res) => {
  try {
    const updatedAuction = await Auction.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedAuction) return res.status(404).json({ error: 'Auction not found' });
    res.status(200).json(updatedAuction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an auction by ID
exports.deleteAuction = async (req, res) => {
  try {
    const deletedAuction = await Auction.findByIdAndDelete(req.params.id);
    if (!deletedAuction) return res.status(404).json({ error: 'Auction not found' });
    res.status(200).json({ message: 'Auction deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
