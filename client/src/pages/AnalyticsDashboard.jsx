import React, { useState, useEffect } from 'react';

function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState({
    topVehicles: [],
    successRates: [],
    avgCosts: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const [vehiclesRes, successRes, costsRes] = await Promise.all([
          fetch('http://localhost:3001/api/v1/analytics/top-launch-vehicles'),
          fetch('http://localhost:3001/api/v1/analytics/success-by-destination'),
          fetch('http://localhost:3001/api/v1/analytics/avg-cost-by-type')
        ]);

        const topVehicles = await vehiclesRes.json();
        const successRates = await successRes.json();
        const avgCosts = await costsRes.json();

        setAnalytics({ topVehicles, successRates, avgCosts });
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return <div className="loading">Loading analytics...</div>;
  }

  return (
    <div className="container">
      <h1 className="text-4xl font-bold text-primary mb-8">Mission Analytics</h1>

      {/* Top Vehicles */}
      <div className="card mb-8">
        <h2 className="text-2xl font-semibold text-primary mb-6">Top Launch Vehicles</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {analytics.topVehicles.map(vehicle => (
            <div key={vehicle.launch_vehicle_name} className="text-center">
              <h3 className="text-lg font-semibold text-white mb-2">{vehicle.launch_vehicle_name}</h3>
              <div className="text-3xl font-bold text-primary mb-1">
                {(vehicle.success_rate * 100).toFixed(0)}%
              </div>
              <p className="text-secondary">Success Rate</p>
              <p className="text-sm text-secondary mt-2">{vehicle.total_launches} launches</p>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Success Rates */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-primary mb-6">Success Rate by Destination</h2>
          <div className="space-y-4">
            {analytics.successRates.map(dest => (
              <div key={dest.destination_planet}>
                <div className="flex justify-between mb-1">
                  <span className="text-white">{dest.destination_planet}</span>
                  <span className="text-primary">{(dest.success_rate * 100).toFixed(0)}%</span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-3">
                  <div 
                    className="bg-primary h-3 rounded-full" 
                    style={{ width: `${dest.success_rate * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Average Costs */}
        <div className="card">
          <h2 className="text-2xl font-semibold text-primary mb-6">Average Cost by Mission Type</h2>
          <div className="space-y-4">
            {analytics.avgCosts.map(type => (
              <div key={type.mission_type} className="flex justify-between items-center p-3 bg-white/5 rounded">
                <span className="text-white font-semibold">{type.mission_type}</span>
                <span className="text-primary font-bold">
                  ${Math.round(type.avg_cost_millions)}M
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;