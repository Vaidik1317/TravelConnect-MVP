import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import AgencyLogin from './pages/AgencyLogin';
import AgencyDashboard from './pages/AgencyDashboard';
import TripDetail from './pages/TripDetail';
import JoinCall from './pages/JoinCall';
import CallRoom from './pages/CallRoom';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<AgencyLogin />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AgencyDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/dashboard/trips/:tripId"
        element={
          <ProtectedRoute>
            <TripDetail />
          </ProtectedRoute>
        }
      />
      <Route path="/join/:travelerId" element={<JoinCall />} />
      <Route path="/room/:travelerId" element={<CallRoom />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
