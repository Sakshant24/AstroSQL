import React, { useState, useEffect } from 'react';

function Researchers() {
  const [researchers, setResearchers] = useState([]);
  const [filteredResearchers, setFilteredResearchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/researchers')
      .then(res => res.json())
      .then(data => {
        setResearchers(data);
        setFilteredResearchers(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching researchers:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = researchers.filter(researcher =>
      researcher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (researcher.role && researcher.role.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    setFilteredResearchers(filtered);
  }, [searchTerm, researchers]);

  if (loading) {
    return <div className="loading">Loading researchers...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-primary mb-8">Research Team</h1>
      
      {/* Search Section */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search researchers by name or role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-secondary">
          Showing {filteredResearchers.length} of {researchers.length} researchers
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredResearchers.map(researcher => (
          <div key={researcher.researcher_id} className="card text-center">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white font-bold text-xl">
                {researcher.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{researcher.name}</h3>
            <p className="text-secondary">{researcher.role || 'Researcher'}</p>
          </div>
        ))}
      </div>

      {filteredResearchers.length === 0 && !loading && (
        <div className="card text-center">
          <h3 className="text-xl text-secondary">No researchers found</h3>
          <p className="text-secondary">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}

export default Researchers;