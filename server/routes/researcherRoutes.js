const express = require('express');
const router = express.Router();
const researcherModel = require('../models/researcherModel');

// GET /api/v1/researchers
router.get('/', async (req, res) => {
  try {
    const researchers = await researcherModel.getAllResearchers();
    res.json(researchers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// GET /api/v1/researchers/:id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const researcher = await researcherModel.getResearcherById(id);
    if (!researcher) {
      return res.status(404).json({ message: 'Researcher not found' });
    }
    res.json(researcher);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
module.exports = router;