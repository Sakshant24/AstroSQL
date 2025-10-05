const pool = require('../config/db');

const milestoneModel = {
  // Get all milestones for a specific mission ID
  getMilestonesByMissionId: async (missionId) => {
    const [rows] = await pool.query(
      'SELECT * FROM milestones WHERE mission_id = ? ORDER BY event_date ASC',
      [missionId]
    );
    return rows;
  },

  createMilestoneForMission: async (missionId, milestoneData) => {
    const { event_date, milestone_type, description } = milestoneData;
    const [result] = await pool.query(
      'INSERT INTO milestones (mission_id, event_date, milestone_type, description) VALUES (?, ?, ?, ?)',
      [missionId, event_date, milestone_type, description]
    );
    return { id: result.insertId, mission_id: missionId, ...milestoneData };
  },
  updateMilestone: async (milestoneId, milestoneData) => {
    const { event_date, milestone_type, description } = milestoneData;
    const [result] = await pool.query(
      'UPDATE milestones SET event_date = ?, milestone_type = ?, description = ? WHERE milestone_id = ?',
      [event_date, milestone_type, description, milestoneId]
    );
    return result.affectedRows > 0;
  },

  deleteMilestone: async (milestoneId) => {
    const [result] = await pool.query('DELETE FROM milestones WHERE milestone_id = ?', [milestoneId]);
    return result.affectedRows > 0;
  }
};

module.exports = milestoneModel;