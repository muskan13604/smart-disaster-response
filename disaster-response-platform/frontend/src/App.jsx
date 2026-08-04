import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Unauthorized from './pages/Unauthorized';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';
import MapDashboard from './pages/MapDashboard';
import CitizenSOS from './pages/CitizenSOS';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/unauthorized" element={<Unauthorized />} />
                    
                    {/* Protected Routes (Any logged in user) */}
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/map" element={<MapDashboard />} />
                        <Route path="/sos" element={<CitizenSOS />} />
                        
                        {/* Role specific example */}
                        <Route element={<RoleRoute allowedRoles={['Admin', 'Rescue Team']} />}>
                            {/* <Route path="/admin" element={<AdminPanel />} /> */}
                        </Route>
                    </Route>
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
