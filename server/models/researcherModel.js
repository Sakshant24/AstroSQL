const pool = require('../config/db');

const researcherModel = {
  getAllResearchers: async () => {
    const [rows] = await pool.query('SELECT * FROM researchers ORDER BY name ASC');
    return rows;
  },
  getResearcherById: async (researcherId) => {
    const [rows] = await pool.query('SELECT * FROM researchers WHERE researcher_id = ?', [researcherId]);
    return rows[0];
  }
};

module.exports = researcherModel;