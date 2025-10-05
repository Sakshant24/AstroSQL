import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function MissionsDashboard() {
  const [missions, setMissions] = useState([]);
  const [filteredMissions, setFilteredMissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingMission, setEditingMission] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    destination_planet: '',
    mission_status: 'Planned',
    mission_type: 'Orbiter',
    objective: '',
    launch_date: ''
  });

  useEffect(() => {
    fetchMissions();
  }, []);

  useEffect(() => {
    filterMissions();
  }, [missions, searchTerm, statusFilter]);

  const fetchMissions = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/missions');
      const data = await response.json();
      setMissions(data);
    } catch (error) {
      console.error("Failed to fetch missions:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterMissions = () => {
    let filtered = missions;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(mission =>
        mission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (mission.destination_planet && mission.destination_planet.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (mission.mission_type && mission.mission_type.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(mission => mission.mission_status === statusFilter);
    }

    setFilteredMissions(filtered);
  };

  const handleDelete = async (missionId) => {
    if (window.confirm('Are you sure you want to delete this mission?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/missions/${missionId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchMissions(); 
        } else {
          alert('Failed to delete mission');
        }
      } catch (error) {
        console.error('Error deleting mission:', error);
        alert('Error deleting mission');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMission 
        ? `http://localhost:3001/api/v1/missions/${editingMission.mission_id}`
        : 'http://localhost:3001/api/v1/missions';
      
      const method = editingMission ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setShowAddModal(false);
        setEditingMission(null);
        setFormData({
          name: '',
          destination_planet: '',
          mission_status: 'Planned',
          mission_type: 'Orbiter',
          objective: '',
          launch_date: ''
        });
        fetchMissions(); 
      } else {
        alert('Failed to save mission');
      }
    } catch (error) {
      console.error('Error saving mission:', error);
      alert('Error saving mission');
    }
  };

  const openEditModal = (mission) => {
    setEditingMission(mission);
    setFormData({
      name: mission.name,
      destination_planet: mission.destination_planet || '',
      mission_status: mission.mission_status || 'Planned',
      mission_type: mission.mission_type || 'Orbiter',
      objective: mission.objective || '',
      launch_date: mission.launch_date ? mission.launch_date.split('T')[0] : ''
    });
    setShowAddModal(true);
  };

  const getStatusBadge = (status) => {
    const statusClass = {
      'Operational': 'status-operational',
      'Completed': 'status-completed',
      'Failed': 'status-failed',
      'Planned': 'status-planned',
      'Launched': 'status-launched'
    }[status] || 'status-planned';

    return <span className={`status-badge ${statusClass}`}>{status}</span>;
  };

  const statusOptions = ['all', 'Planned', 'Launched', 'Operational', 'Completed', 'Failed'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading missions...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-primary mb-2">Space Missions Dashboard</h1>
        <p className="text-secondary">Monitor and manage all space exploration missions</p>
      </div>

      {/* Search and Filter Section */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search missions by name, destination, or type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          <button 
            onClick={() => setShowAddModal(true)}
            className="btn btn-primary"
          >
            + Add Mission
          </button>
        </div>

        <div className="filter-buttons">
          {statusOptions.map(status => (
            <button
              key={status}
              className={`filter-btn ${statusFilter === status ? 'active' : ''}`}
              onClick={() => setStatusFilter(status)}
            >
              {status === 'all' ? 'All Status' : status}
            </button>
          ))}
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-secondary">
          Showing {filteredMissions.length} of {missions.length} missions
        </p>
      </div>

      {/* Missions Table */}
      <div className="card">
        {filteredMissions.length > 0 ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Mission Name</th>
                <th>Destination</th>
                <th>Status</th>
                <th>Launch Date</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMissions.map((mission) => (
                <tr key={mission.mission_id}>
                  <td>
                    <Link 
                      to={`/missions/${mission.mission_id}`}
                      className="text-white font-semibold hover:text-primary"
                    >
                      {mission.name}
                    </Link>
                  </td>
                  <td className="text-secondary">{mission.destination_planet || 'N/A'}</td>
                  <td>{getStatusBadge(mission.mission_status)}</td>
                  <td className="text-secondary">
                    {mission.launch_date ? new Date(mission.launch_date).toLocaleDateString() : 'N/A'}
                  </td>
                  <td className="text-secondary">{mission.mission_type || 'N/A'}</td>
                  <td>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => openEditModal(mission)}
                        className="action-btn edit"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(mission.mission_id)}
                        className="action-btn delete"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="no-data">
            <div className="no-data-icon">🚀</div>
            <h3>No missions found</h3>
            <p>Try adjusting your search or filters, or create a new mission</p>
          </div>
        )}
      </div>

      {/* Add/Edit Mission Modal */}
      {showAddModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMission ? 'Edit Mission' : 'Add New Mission'}
              </h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingMission(null);
                  setFormData({
                    name: '',
                    destination_planet: '',
                    mission_status: 'Planned',
                    mission_type: 'Orbiter',
                    objective: '',
                    launch_date: ''
                  });
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Mission Name *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                  placeholder="Enter mission name"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Destination Planet *</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.destination_planet}
                  onChange={(e) => setFormData({...formData, destination_planet: e.target.value})}
                  required
                  placeholder="e.g., Mars, Moon, Venus"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Mission Status *</label>
                <select
                  className="form-select"
                  value={formData.mission_status}
                  onChange={(e) => setFormData({...formData, mission_status: e.target.value})}
                >
                  <option value="Planned">Planned</option>
                  <option value="Launched">Launched</option>
                  <option value="Operational">Operational</option>
                  <option value="Completed">Completed</option>
                  <option value="Failed">Failed</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Mission Type *</label>
                <select
                  className="form-select"
                  value={formData.mission_type}
                  onChange={(e) => setFormData({...formData, mission_type: e.target.value})}
                >
                  <option value="Orbiter">Orbiter</option>
                  <option value="Lander">Lander</option>
                  <option value="Rover">Rover</option>
                  <option value="Flyby">Flyby</option>
                  <option value="Sample Return">Sample Return</option>
                  <option value="Telescope">Telescope</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Launch Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={formData.launch_date}
                  onChange={(e) => setFormData({...formData, launch_date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Objective *</label>
                <textarea
                  className="form-textarea"
                  value={formData.objective}
                  onChange={(e) => setFormData({...formData, objective: e.target.value})}
                  required
                  placeholder="Describe the mission objectives and goals..."
                  rows="4"
                />
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingMission(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMission ? 'Update Mission' : 'Create Mission'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissionsDashboard;