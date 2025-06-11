const Auction = require('../models/Auction');

// List all auctions by regionId
exports.listAuctions = async (req, res) => {
  try {
    const regionId = req.params.regionId;
    if (!regionId) return res.status(400).json({ error: 'Region ID is required' });
    const auctions = await Auction.find({ regionId }).populate('regionId');
    res.status(200).json(auctions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get auction details
exports.getAuctionDetails = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.auctionId);
    if (!auction) return res.status(404).json({ error: 'Auction not found' });

    res.status(200).json(auction);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new auction
exports.createAuction = async (req, res) => {
  const { regionId } = req.params; // Get `regionId` from the URL
  const { title, description, startingPrice, endDate } = req.body;

  if (!regionId) {
      return res.status(400).json({ error: 'Region ID is required' });
  }

  try {
      const newAuction = await Auction.create({
          regionId, // Use regionId from the URL
          title,
          description,
          startingPrice,
          endDate,
      });
      res.status(201).json(newAuction);
  } catch (err) {
      console.error('Error creating auction:', err.message);
      res.status(500).json({ error: err.message });
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
