const express = require('express');
const { listAuctions, getAuctionDetails, createAuction, updateAuction, deleteAuction } = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', listAuctions);
router.get('/:auctionId', getAuctionDetails);
router.post('/', protect, createAuction);
router.put('/:auctionId', protect, updateAuction);
router.delete('/:auctionId', protect, deleteAuction);

module.exports = router;
