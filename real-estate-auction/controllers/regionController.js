const Region = require('../models/Region');

// List all regions
exports.listRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new region
exports.createRegion = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  try {
    const region = new Region(req.body);
    await region.save();
    res.status(201).json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a region by ID
exports.updateRegion = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  try {
    const region = await Region.findByIdAndUpdate(req.params.regionId, req.body, { new: true });
    if (!region) return res.status(404).json({ error: 'Region not found' });

    res.status(200).json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a region by ID
exports.deleteRegion = async (req, res) => {
  if (req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });

  try {
    const region = await Region.findByIdAndDelete(req.params.regionId);
    if (!region) return res.status(404).json({ error: 'Region not found' });

    res.status(200).json({ message: 'Region deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
