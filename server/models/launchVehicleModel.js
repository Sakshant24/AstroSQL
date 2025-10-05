const pool = require('../config/db');

const launchVehicleModel = {
  getAllLaunchVehicles: async () => {
    const [rows] = await pool.query('SELECT * FROM launch_vehicles ORDER BY name ASC');
    return rows;
  },

  getLaunchVehicleById: async (vehicleId) => {
    const [rows] = await pool.query('SELECT * FROM launch_vehicles WHERE vehicle_id = ?', [vehicleId]);
    return rows[0];
  }
};

module.exports = launchVehicleModel;