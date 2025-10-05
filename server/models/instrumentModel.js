const pool = require('../config/db');

const instrumentModel = {
  // Function to get ALL instruments
  getAllInstruments: async () => {
    const [rows] = await pool.query('SELECT * FROM instruments ORDER BY instrument_name ASC');
    return rows;
  },

  // Function to get instruments for ONE mission
  getInstrumentsByMissionId: async (missionId) => {
    const [rows] = await pool.query(
      `SELECT i.instrument_id, i.instrument_name, i.type, i.purpose
       FROM instruments i
       JOIN mission_instruments mi ON i.instrument_id = mi.instrument_id
       WHERE mi.mission_id = ?`,
      [missionId]
    );
    return rows;
  },

  getInstrumentById: async (instrumentId) => {
    const [rows] = await pool.query('SELECT * FROM instruments WHERE instrument_id = ?', [instrumentId]);
    return rows[0];
  }
};

module.exports = instrumentModel;