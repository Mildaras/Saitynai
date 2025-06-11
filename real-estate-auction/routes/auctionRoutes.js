const express = require('express');
const { listAuctions, getAuctionDetails, createAuction, updateAuction, deleteAuction } = require('../controllers/auctionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/:regionId', listAuctions);
router.get('/:auctionId/details', getAuctionDetails);
router.post('/:regionId', protect, createAuction);
router.put('/:auctionId', protect, updateAuction);
router.delete('/:auctionId', protect, deleteAuction);

module.exports = router;
