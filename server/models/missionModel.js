// server/models/missionModel.js
const pool = require('../config/db'); // Note the path change

const missionModel = {
  // Function to get all missions
  getAllMissions: async () => {
    const [rows] = await pool.query('SELECT * FROM missions ORDER BY launch_date DESC');
    return rows;
  },

  // Function to get one mission by its ID
  getMissionById: async (missionId) => {
    const [rows] = await pool.query('SELECT * FROM missions WHERE mission_id = ?', [missionId]);
    return rows[0]; // Return the first result, or undefined if not found
  }
};

module.exports = missionModel;