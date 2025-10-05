import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/audit-logs');
        const data = await response.json();
        setLogs(data);
      } catch (error) {
        console.error('Error fetching logs:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return <div className="loading">Loading audit logs...</div>;
  }

  return (
    <div className="container">
      <Link to="/" className="btn btn-secondary mb-6">
        ← Back to Dashboard
      </Link>

      <h1 className="text-4xl font-bold text-primary mb-8">Admin Dashboard</h1>

      <div className="card">
        <h2 className="text-2xl font-semibold text-primary mb-6">Audit Logs</h2>
        
        {logs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Table</th>
                  <th>Operation</th>
                  <th>Record ID</th>
                  <th>Timestamp</th>
                </tr>
              </thead>
              <tbody>
                {logs.map(log => (
                  <tr key={log.log_id}>
                    <td className="font-semibold">{log.table_name}</td>
                    <td>
                      <span className={`status-badge ${
                        log.operation === 'INSERT' ? 'status-operational' :
                        log.operation === 'UPDATE' ? 'status-planned' : 'status-failed'
                      }`}>
                        {log.operation}
                      </span>
                    </td>
                    <td className="text-secondary">{log.record_pk}</td>
                    <td className="text-secondary">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-secondary text-xl">No audit logs found</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;