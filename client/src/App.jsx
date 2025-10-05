import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MissionsDashboard from './pages/MissionsDashboard';
import MissionDetail from './pages/MissionDetail';
import AdminDashboard from './pages/AdminDashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Researchers from './pages/Researchers';
import Vehicles from './pages/Vehicles';
import Instruments from './pages/Instruments';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import './index.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <main>
          <Routes>
            <Route path="/" element={<MissionsDashboard />} />
            <Route path="/missions/:id" element={<MissionDetail />} />
            <Route path="/analytics" element={<AnalyticsDashboard />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/researchers" element={<Researchers />} />
            <Route path="/instruments" element={<Instruments />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;