const express = require('express');
const { placeBid, listBidsForAuction, cancelBid } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:auctionId/bids', protect, placeBid);
router.get('/:auctionId/bids', listBidsForAuction);
router.delete('/:auctionId/bids/:bidId', protect, cancelBid);

module.exports = router;
