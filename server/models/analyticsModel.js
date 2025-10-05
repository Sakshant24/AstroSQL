const pool = require('../config/db');
const analyticsModel = {
  getSuccessByDestination: async () => {
    const [rows] = await pool.query(`
      SELECT destination_planet, COUNT(mission_id) AS total_missions,
      SUM(CASE WHEN mission_status IN ('Success', 'Completed', 'Operational') THEN 1 ELSE 0 END) AS successful_missions,
      CAST(SUM(CASE WHEN mission_status IN ('Success', 'Completed', 'Operational') THEN 1 ELSE 0 END) AS DECIMAL(10,4)) / COUNT(mission_id) AS success_rate
      FROM missions GROUP BY destination_planet ORDER BY success_rate DESC, total_missions DESC;
    `);
    return rows;
  },
  getAvgCostByType: async () => {
    const [rows] = await pool.query(`
      SELECT m.mission_type, COUNT(m.mission_id) AS total_successful_missions,
      AVG(m.duration_days) AS avg_duration_days, AVG(br.cost_then) AS avg_cost_millions
      FROM missions AS m JOIN budget_records AS br ON m.mission_id = br.mission_id
      WHERE m.mission_status IN ('Success', 'Completed', 'Operational')
      GROUP BY m.mission_type HAVING COUNT(m.mission_id) > 1 ORDER BY avg_duration_days DESC;
    `);
    return rows;
  },
  getTopLaunchVehicles: async () => {
    const [rows] = await pool.query(`
      SELECT lv.name AS launch_vehicle_name, COUNT(ml.id) AS total_launches,
      SUM(CASE WHEN ml.launch_success = 1 THEN 1 ELSE 0 END) AS successful_launches,
      CAST(SUM(CASE WHEN ml.launch_success = 1 THEN 1 ELSE 0 END) AS DECIMAL(10,4)) / COUNT(ml.id) AS success_rate
      FROM launch_vehicles AS lv JOIN mission_launch AS ml ON lv.vehicle_id = ml.vehicle_id
      GROUP BY lv.name ORDER BY success_rate DESC, total_launches DESC LIMIT 3;
    `);
    return rows;
  },
  getSuccessfulMissionSummary: async () => {
    // This is simple because the VIEW does all the hard work!
    const [rows] = await pool.query('SELECT * FROM vw_successful_mission_summary');
    return rows;
  }
};
module.exports = analyticsModel;