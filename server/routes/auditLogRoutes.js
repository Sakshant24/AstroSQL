const express = require('express');
const router = express.Router();
const auditLogModel = require('../models/auditLogModel');

router.get('/', async (req, res) => {
  try {
    const logs = await auditLogModel.getAllLogs();
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;