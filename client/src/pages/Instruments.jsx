import React, { useState, useEffect } from 'react';

function Instruments() {
  const [instruments, setInstruments] = useState([]);
  const [filteredInstruments, setFilteredInstruments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => {
    fetchInstruments();
  }, []);

  useEffect(() => {
    filterInstruments();
  }, [instruments, searchTerm, typeFilter]);

  const fetchInstruments = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/v1/instruments');
      const data = await response.json();
      setInstruments(data);
    } catch (error) {
      console.error("Failed to fetch instruments:", error);
    } finally {
      setLoading(false);
    }
  };

  const filterInstruments = () => {
    let filtered = instruments;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(instrument =>
        instrument.instrument_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (instrument.type && instrument.type.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (instrument.description && instrument.description.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(instrument => instrument.type === typeFilter);
    }

    setFilteredInstruments(filtered);
  };

  const getUniqueTypes = () => {
    const types = instruments.map(instrument => instrument.type).filter(Boolean);
    return ['all', ...new Set(types)];
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading instruments...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-primary mb-8">Scientific Instruments</h1>

      {/* Search and Filter Section */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search instruments by name, type, or description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>

        {getUniqueTypes().length > 1 && (
          <div className="filter-buttons">
            {getUniqueTypes().map(type => (
              <button
                key={type}
                className={`filter-btn ${typeFilter === type ? 'active' : ''}`}
                onClick={() => setTypeFilter(type)}
              >
                {type === 'all' ? 'All Types' : type}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-secondary">
          Showing {filteredInstruments.length} of {instruments.length} instruments
        </p>
      </div>

      {/* Instruments Grid */}
      {filteredInstruments.length > 0 ? (
        <div className="instruments-grid">
          {filteredInstruments.map(instrument => (
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
          <p>Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

export default Instruments;