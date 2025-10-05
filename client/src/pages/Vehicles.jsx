import React, { useState, useEffect } from 'react';

function Vehicles() {
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetch('http://localhost:3001/api/v1/launch_vehicles')
      .then(res => res.json())
      .then(data => {
        setVehicles(data);
        setFilteredVehicles(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching vehicles:', error);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const filtered = vehicles.filter(vehicle =>
      vehicle.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.manufacturer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vehicle.orbit_type.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredVehicles(filtered);
  }, [searchTerm, vehicles]);

  if (loading) {
    return <div className="loading">Loading vehicles...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-primary mb-8">Launch Vehicles</h1>
      
      {/* Search Section */}
      <div className="search-container">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search vehicles by name, manufacturer, or orbit type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-secondary">
          Showing {filteredVehicles.length} of {vehicles.length} vehicles
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVehicles.map(vehicle => (
          <div key={vehicle.vehicle_id} className="card">
            <h3 className="text-xl font-semibold text-white mb-2">{vehicle.name}</h3>
            <p className="text-secondary mb-3">{vehicle.manufacturer}</p>
            
            <div className="space-y-2">
              <p><strong className="text-primary">Orbit Type:</strong> {vehicle.orbit_type}</p>
              <p><strong className="text-primary">Payload Capacity:</strong> {vehicle.payload_capacity_kg} kg</p>
              <p><strong className="text-primary">Status:</strong> {vehicle.status}</p>
            </div>
          </div>
        ))}
      </div>

      {filteredVehicles.length === 0 && !loading && (
        <div className="card text-center">
          <h3 className="text-xl text-secondary">No vehicles found</h3>
          <p className="text-secondary">Try adjusting your search</p>
        </div>
      )}
    </div>
  );
}

export default Vehicles;