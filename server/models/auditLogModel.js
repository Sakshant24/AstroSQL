const pool = require('../config/db');
const auditLogModel = {
  getAllLogs: async () => {
    const [rows] = await pool.query('SELECT * FROM audit_logs ORDER BY timestamp DESC');
    return rows;
  }
};
module.exports = auditLogModel;