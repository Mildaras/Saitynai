const express = require('express');
const { getAllAuctions, createAuction, updateAuction, deleteAuction } = require('../controllers/auctionController');
const router = express.Router();

// Define routes for auctions
router.get('/', getAllAuctions);           // Get all auctions
router.post('/', createAuction);           // Create a new auction
router.put('/:id', updateAuction);         // Update an auction by ID
router.delete('/:id', deleteAuction);      // Delete an auction by ID

module.exports = router;
