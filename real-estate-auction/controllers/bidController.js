const Bid = require('../models/Bid');
const Auction = require('../models/Auction');

// Place a bid
exports.placeBid = async (req, res) => {
    if (req.user.role !== 'member') {
      return res.status(403).json({ error: 'Only members can place bids' });
    }
  
    try {
      const { auctionId } = req.params.auctionId;
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

exports.cancelBid = async (req, res) => {
  const { auctionId, bidId } = req.params;

  try {
      const auction = await Auction.findById(auctionId);
      if (!auction) return res.status(404).json({ error: 'Auction not found' });

      const bidIndex = auction.bids.findIndex((bid) => bid._id.toString() === bidId);
      if (bidIndex === -1) return res.status(404).json({ error: 'Bid not found' });

      // Remove the bid
      auction.bids.splice(bidIndex, 1);
      await auction.save();

      res.status(200).json({ message: 'Bid deleted successfully.' });
  } catch (err) {
      console.error('Error deleting bid:', err.message);
      res.status(500).json({ error: 'Failed to delete bid.' });
  }
};

