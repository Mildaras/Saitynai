const express = require('express');
const { getAllRegions, createRegion, updateRegion, deleteRegion } = require('../controllers/regionController');
const router = express.Router();

// Define routes for regions
router.get('/', getAllRegions);           // Get all regions
router.post('/', createRegion);           // Create a new region
router.put('/:id', updateRegion);         // Update a region by ID
router.delete('/:id', deleteRegion);      // Delete a region by ID

module.exports = router;
