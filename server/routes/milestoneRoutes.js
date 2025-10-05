const express = require('express');
const router = express.Router({ mergeParams: true });
const milestoneModel = require('../models/milestoneModel');

// GET /api/v1/missions/:id/milestones
router.get('/', async (req, res) => {
  try {
    const { id } = req.params;
    const milestones = await milestoneModel.getMilestonesByMissionId(id);
    res.json(milestones);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/v1/missions/:id/milestones
router.post('/', async (req, res) => {
  try {
    const { id } = req.params; 
    const newMilestone = await milestoneModel.createMilestoneForMission(id, req.body);
    res.status(201).json(newMilestone);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT /api/v1/missions/:id/milestones/:milestoneId
router.put('/:milestoneId', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const success = await milestoneModel.updateMilestone(milestoneId, req.body);
    if (!success) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.json({ message: 'Milestone updated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// DELETE /api/v1/missions/:id/milestones/:milestoneId
router.delete('/:milestoneId', async (req, res) => {
  try {
    const { milestoneId } = req.params;
    const success = await milestoneModel.deleteMilestone(milestoneId);
    if (!success) {
      return res.status(404).json({ message: 'Milestone not found' });
    }
    res.json({ message: 'Milestone deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;