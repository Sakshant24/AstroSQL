const pool = require('../config/db');

const missionModel = {
  getAllMissions: async () => {
    const [rows] = await pool.query('SELECT * FROM missions ORDER BY launch_date DESC');
    return rows;
  },
  getMissionById: async (missionId) => {
    const missionQuery = pool.query('SELECT * FROM missions WHERE mission_id = ?', [missionId]);
    
    const launchQuery = pool.query(`
      SELECT ml.launch_site, lv.name AS vehicle_name, ml.launch_success
      FROM mission_launch ml
      JOIN launch_vehicles lv ON ml.vehicle_id = lv.vehicle_id
      WHERE ml.mission_id = ?`, [missionId]);
      
    const specsQuery = pool.query('SELECT * FROM technical_specs WHERE mission_id = ?', [missionId]);
    const budgetQuery = pool.query('SELECT * FROM budget_records WHERE mission_id = ? ORDER BY year ASC', [missionId]);
    
    const instrumentsQuery = pool.query(`
      SELECT i.instrument_name, i.type, i.purpose FROM instruments i
      JOIN mission_instruments mi ON i.instrument_id = mi.instrument_id
      WHERE mi.mission_id = ?`, [missionId]);
      
    const researchersQuery = pool.query(`
      SELECT r.name, mr.role FROM researchers r
      JOIN mission_researchers mr ON r.researcher_id = mr.researcher_id
      WHERE mr.mission_id = ?`, [missionId]);

    const [
      [missionRows],
      [launchRows],
      [specsRows],
      [budgetRows],
      [instrumentRows],
      [researcherRows]
    ] = await Promise.all([
      missionQuery,
      launchQuery,
      specsQuery,
      budgetQuery,
      instrumentsQuery,
      researchersQuery
    ]);

    if (missionRows.length === 0) {
      return null;
    }

    const mission = missionRows[0];
    mission.launch_details = launchRows[0] || null;
    mission.technical_specs = specsRows[0] || null;
    mission.budget_records = budgetRows;
    mission.instruments = instrumentRows;
    mission.researchers = researcherRows;

    return mission;
  },
  createMission: async (missionData) => {
    const { name, launch_date, destination_planet, mission_status, mission_type, objective } = missionData;
    const [result] = await pool.query(
      'INSERT INTO missions (name, launch_date, destination_planet, mission_status, mission_type, objective) VALUES (?, ?, ?, ?, ?, ?)',
      [name, launch_date, destination_planet, mission_status, mission_type, objective]
    );
    return { id: result.insertId, ...missionData };
  },
  updateMission: async (missionId, missionData) => {
    const { name, mission_status, objective } = missionData;
    const [result] = await pool.query(
      'UPDATE missions SET name = ?, mission_status = ?, objective = ? WHERE mission_id = ?',
      [name, mission_status, objective, missionId]
    );
    return result.affectedRows > 0;
  },
  deleteMission: async (missionId) => {
    const [result] = await pool.query('DELETE FROM missions WHERE mission_id = ?', [missionId]);
    return result.affectedRows > 0;
  }
};

module.exports = missionModel;