const express = require('express');
const { listRegions, createRegion, updateRegion, deleteRegion } = require('../controllers/regionController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.get('/', listRegions);
router.post('/', protect, createRegion);
router.put('/:regionId', protect, updateRegion);
router.delete('/:regionId', protect, deleteRegion);

module.exports = router;
