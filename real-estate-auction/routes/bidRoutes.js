const express = require('express');
const { placeBid, listBidsForAuction, cancelBid } = require('../controllers/bidController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/:auctionId', protect, placeBid);
router.get('/:auctionId', listBidsForAuction);
router.delete('/:bidId', protect, cancelBid);

module.exports = router;
