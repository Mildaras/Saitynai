const Region = require('../models/Region');

// Get all regions
exports.getAllRegions = async (req, res) => {
  try {
    const regions = await Region.find();
    res.status(200).json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Create a new region
exports.createRegion = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newRegion = new Region({ name, description });
    await newRegion.save();
    res.status(201).json(newRegion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update a region by ID
exports.updateRegion = async (req, res) => {
  try {
    const updatedRegion = await Region.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedRegion) return res.status(404).json({ error: 'Region not found' });
    res.status(200).json(updatedRegion);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a region by ID
exports.deleteRegion = async (req, res) => {
  try {
    const deletedRegion = await Region.findByIdAndDelete(req.params.id);
    if (!deletedRegion) return res.status(404).json({ error: 'Region not found' });
    res.status(200).json({ message: 'Region deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
