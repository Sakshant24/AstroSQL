import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';

function MissionDetail() {
  const { id } = useParams();
  const [mission, setMission] = useState(null);
  const [instruments, setInstruments] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showMilestoneModal, setShowMilestoneModal] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState(null);
  const [milestoneForm, setMilestoneForm] = useState({
    title: '',
    description: '',
    scheduled_date: '',
    status: 'Planned'
  });

  useEffect(() => {
    fetchMissionData();
  }, [id]);

  const fetchMissionData = async () => {
    try {
      setLoading(true);
      const missionPromise = fetch(`http://localhost:3001/api/v1/missions/${id}`).then(res => res.json());
      const instrumentsPromise = fetch(`http://localhost:3001/api/v1/missions/${id}/instruments`).then(res => res.json());
      const milestonesPromise = fetch(`http://localhost:3001/api/v1/missions/${id}/milestones`).then(res => res.json());

      const [missionData, instrumentsData, milestonesData] = await Promise.all([
        missionPromise,
        instrumentsPromise,
        milestonesPromise
      ]);

      setMission(missionData);
      setInstruments(instrumentsData || []);
      setMilestones(milestonesData || []);
    } catch (error) {
      console.error("Failed to fetch mission data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleMilestoneSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = editingMilestone
        ? `http://localhost:3001/api/v1/missions/${id}/milestones/${editingMilestone.milestone_id}`
        : `http://localhost:3001/api/v1/missions/${id}/milestones`;

      const method = editingMilestone ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(milestoneForm),
      });

      if (response.ok) {
        setShowMilestoneModal(false);
        setEditingMilestone(null);
        setMilestoneForm({
          title: '',
          description: '',
          scheduled_date: '',
          status: 'Planned'
        });
        fetchMissionData();
      } else {
        alert('Failed to save milestone');
      }
    } catch (error) {
      console.error('Error saving milestone:', error);
      alert('Error saving milestone');
    }
  };

  const handleDeleteMilestone = async (milestoneId) => {
    if (window.confirm('Are you sure you want to delete this milestone?')) {
      try {
        const response = await fetch(`http://localhost:3001/api/v1/missions/${id}/milestones/${milestoneId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchMissionData();
        } else {
          alert('Failed to delete milestone');
        }
      } catch (error) {
        console.error('Error deleting milestone:', error);
        alert('Error deleting milestone');
      }
    }
  };

  const openEditMilestone = (milestone) => {
    setEditingMilestone(milestone);
    setMilestoneForm({
      title: milestone.title,
      description: milestone.description,
      scheduled_date: milestone.scheduled_date ? milestone.scheduled_date.split('T')[0] : '',
      status: milestone.status || 'Planned'
    });
    setShowMilestoneModal(true);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading mission details...</p>
      </div>
    );
  }

  if (!mission) {
    return (
      <div className="container">
        <div className="card text-center">
          <h2 className="text-2xl text-primary mb-4">Mission Not Found</h2>
          <p className="text-secondary mb-4">The mission you're looking for doesn't exist.</p>
          <Link to="/" className="btn btn-primary">
            Back to Missions
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Link to="/" className="btn btn-secondary mb-6">
        ← Back to Missions
      </Link>

      {/* Mission Header */}
      <div className="card mb-6">
        <h1 className="text-3xl font-bold text-primary mb-2">{mission.name}</h1>
        <p className="text-xl text-secondary mb-4">{mission.objective}</p>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <strong className="text-primary">Destination:</strong> {mission.destination_planet || 'N/A'}
          </div>
          <div>
            <strong className="text-primary">Status:</strong> {mission.mission_status || 'N/A'}
          </div>
          <div>
            <strong className="text-primary">Launch Date:</strong> {mission.launch_date ? new Date(mission.launch_date).toLocaleDateString() : 'N/A'}
          </div>
          <div>
            <strong className="text-primary">Type:</strong> {mission.mission_type || 'N/A'}
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="tabs-container">
        <div className="tabs-header">
          {['overview', 'instruments', 'milestones'].map(tab => (
            <button
              key={tab}
              className={`tab-button ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'instruments' && instruments.length > 0 && ` (${instruments.length})`}
              {tab === 'milestones' && milestones.length > 0 && ` (${milestones.length})`}
            </button>
          ))}
        </div>

        <div className="tab-content">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="info-grid">
              {/* Technical Specs */}
              {mission.technical_specs && (
                <div className="info-card">
                  <h3>Technical Specifications</h3>
                  <div className="space-y-2">
                    <div className="info-item">
                      <span className="info-label">Spacecraft Mass</span>
                      <span className="info-value">{mission.technical_specs.spacecraft_mass_kg} kg</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Power Source</span>
                      <span className="info-value">{mission.technical_specs.power_source}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Instrument Count</span>
                      <span className="info-value">{mission.technical_specs.instrument_payload_count}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Launch Details */}
              {mission.launch_details && (
                <div className="info-card">
                  <h3>Launch Information</h3>
                  <div className="space-y-2">
                    <div className="info-item">
                      <span className="info-label">Vehicle</span>
                      <span className="info-value">{mission.launch_details.vehicle_name}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Launch Site</span>
                      <span className="info-value">{mission.launch_details.launch_site}</span>
                    </div>
                    <div className="info-item">
                      <span className="info-label">Launch Success</span>
                      <span className="info-value">{mission.launch_details.launch_success ? 'Yes' : 'No'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Budget */}
              {mission.budget_records && mission.budget_records.length > 0 && (
                <div className="info-card">
                  <h3>Budget Records</h3>
                  <div className="space-y-2">
                    {mission.budget_records.map(record => (
                      <div key={record.budget_id} className="info-item">
                        <span className="info-label">{record.year}</span>
                        <span className="info-value">${record.cost_then}M</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Researchers */}
              {mission.researchers && mission.researchers.length > 0 && (
                <div className="info-card">
                  <h3>Research Team</h3>
                  <div className="space-y-2">
                    {mission.researchers.map(researcher => (
                      <div key={researcher.name} className="info-item">
                        <span className="info-label">{researcher.name}</span>
                        <span className="info-value">{researcher.role}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Instruments Tab */}
          {activeTab === 'instruments' && (
            <div>
              {instruments.length > 0 ? (
                <div className="instruments-grid">
                  {instruments.map(instrument => (
                    <div key={instrument.instrument_id} className="instrument-card">
                      <div className="instrument-header">
                        <h3 className="instrument-name">{instrument.instrument_name}</h3>
                        {instrument.type && (
                          <span className="instrument-type">{instrument.type}</span>
                        )}
                      </div>
                      
                      <div className="instrument-details">
                        {instrument.manufacturer && (
                          <div className="instrument-detail">
                            <span className="detail-label">Manufacturer:</span>
                            <span className="detail-value">{instrument.manufacturer}</span>
                          </div>
                        )}
                        
                        {instrument.mass_kg && (
                          <div className="instrument-detail">
                            <span className="detail-label">Mass:</span>
                            <span className="detail-value">{instrument.mass_kg} kg</span>
                          </div>
                        )}
                        
                        {instrument.power_requirement_w && (
                          <div className="instrument-detail">
                            <span className="detail-label">Power:</span>
                            <span className="detail-value">{instrument.power_requirement_w} W</span>
                          </div>
                        )}
                        
                        {instrument.description && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <p className="text-sm text-slate-400">{instrument.description}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <div className="no-data-icon">🔭</div>
                  <h3>No instruments found</h3>
                  <p>This mission doesn't have any instruments assigned yet.</p>
                </div>
              )}
            </div>
          )}

          {/* Milestones Tab */}
          {activeTab === 'milestones' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-primary">Mission Milestones</h2>
                <button 
                  onClick={() => setShowMilestoneModal(true)}
                  className="btn btn-primary"
                >
                  + Add Milestone
                </button>
              </div>

              {milestones.length > 0 ? (
                <div className="milestones-list">
                  {milestones.map(milestone => (
                    <div key={milestone.milestone_id} className="milestone-card">
                      <div className="milestone-header">
                        <h3 className="milestone-title">{milestone.title}</h3>
                        <div className="milestone-actions">
                          <button 
                            onClick={() => openEditMilestone(milestone)}
                            className="action-btn edit"
                          >
                            Edit
                          </button>
                          <button 
                            onClick={() => handleDeleteMilestone(milestone.milestone_id)}
                            className="action-btn delete"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                      <div className="milestone-date">
                        Scheduled: {milestone.scheduled_date ? new Date(milestone.scheduled_date).toLocaleDateString() : 'Not scheduled'}
                      </div>
                      <div className="milestone-description">{milestone.description}</div>
                      <div className="mt-2">
                        <span className={`status-badge status-${(milestone.status || 'Planned').toLowerCase()}`}>
                          {milestone.status || 'Planned'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="no-data">
                  <div className="no-data-icon">📅</div>
                  <h3>No milestones found</h3>
                  <p>Add the first milestone to track mission progress</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Milestone Modal */}
      {showMilestoneModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">
                {editingMilestone ? 'Edit Milestone' : 'Add New Milestone'}
              </h2>
              <button 
                className="close-btn"
                onClick={() => {
                  setShowMilestoneModal(false);
                  setEditingMilestone(null);
                  setMilestoneForm({
                    title: '',
                    description: '',
                    scheduled_date: '',
                    status: 'Planned'
                  });
                }}
              >
                ×
              </button>
            </div>

            <form onSubmit={handleMilestoneSubmit}>
              <div className="form-group">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-control"
                  value={milestoneForm.title}
                  onChange={(e) => setMilestoneForm({...milestoneForm, title: e.target.value})}
                  required
                  placeholder="Enter milestone title"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description *</label>
                <textarea
                  className="form-textarea"
                  value={milestoneForm.description}
                  onChange={(e) => setMilestoneForm({...milestoneForm, description: e.target.value})}
                  required
                  placeholder="Describe the milestone..."
                  rows="4"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Scheduled Date *</label>
                <input
                  type="date"
                  className="form-control"
                  value={milestoneForm.scheduled_date}
                  onChange={(e) => setMilestoneForm({...milestoneForm, scheduled_date: e.target.value})}
                  required
                />
              </div>

              <div className="form-group">
                <label className="form-label">Status *</label>
                <select
                  className="form-select"
                  value={milestoneForm.status}
                  onChange={(e) => setMilestoneForm({...milestoneForm, status: e.target.value})}
                >
                  <option value="Planned">Planned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                  <option value="Delayed">Delayed</option>
                </select>
              </div>

              <div className="flex gap-2 justify-end mt-6">
                <button 
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setShowMilestoneModal(false);
                    setEditingMilestone(null);
                  }}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingMilestone ? 'Update Milestone' : 'Create Milestone'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default MissionDetail;