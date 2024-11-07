const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

// Place a bid
exports.placeBid = async (req, res) => {
    if (req.user.role !== 'member') {
      return res.status(403).json({ error: 'Only members can place bids' });
    }
  
    try {
      const { auctionId } = req.params;
      const { amount } = req.body;
  
      // Ensure the auction exists
      const auction = await Auction.findById(auctionId);
      if (!auction) {
        return res.status(404).json({ error: 'Auction not found' });
      }
  
      // Create and save the bid
      const bid = new Bid({
        auctionId,
        userId: req.user.userId, // Assuming `req.user` contains the authenticated user's ID
        amount
      });
  
      await bid.save();
      res.status(201).json({ message: 'Bid placed successfully', bid });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

// List all bids for an auction
exports.listBidsForAuction = async (req, res) => {
  try {
    const bids = await Bid.find({ auctionId: req.params.auctionId }).populate('userId', 'username');
    res.status(200).json(bids);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Cancel a bid by ID (e.g., if user wants to remove their bid)
exports.cancelBid = async (req, res) => {
    try {
      const { bidId } = req.params;
  
      // Find the bid by ID and ensure it belongs to the current user
      const bid = await Bid.findOne({ _id: bidId, userId: req.user.userId });
      if (!bid) return res.status(404).json({ error: 'Bid not found' });
  
      // Delete the bid
      await Bid.deleteOne({ _id: bidId });
      res.status(200).json({ message: 'Bid cancelled successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
