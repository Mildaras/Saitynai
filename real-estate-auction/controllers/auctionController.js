const Auction = require('../models/Auction');

// List all auctions
exports.listAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find().populate('regionId');
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get auction details
exports.getAuctionDetails = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.auctionId).populate('regionId');
    if (!auction) return res.status(404).json({ error: 'Auction not found' });

    res.status(200).json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new auction
exports.createAuction = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  try {
    const auction = new Auction(req.body);
    await auction.save();
    res.status(201).json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an auction
exports.updateAuction = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  try {
    const auction = await Auction.findByIdAndUpdate(req.params.auctionId, req.body, { new: true });
    if (!auction) return res.status(404).json({ error: 'Auction not found' });

    res.status(200).json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete an auction
exports.deleteAuction = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  try {
    const auction = await Auction.findByIdAndDelete(req.params.auctionId);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });

    res.status(200).json({ message: 'Auction deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
