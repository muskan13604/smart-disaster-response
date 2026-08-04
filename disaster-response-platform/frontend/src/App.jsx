import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

// Lazy loading pages for Code Splitting
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MapDashboard = lazy(() => import('./pages/MapDashboard'));
const CitizenSOS = lazy(() => import('./pages/CitizenSOS'));
const Unauthorized = lazy(() => import('./pages/Unauthorized'));

import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Loading fallback
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
);

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <AuthProvider>
                    <Router>
                        <Suspense fallback={<PageLoader />}>
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/register" element={<Register />} />
                                <Route path="/unauthorized" element={<Unauthorized />} />
                                
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/dashboard" element={<Dashboard />} />
                                    <Route path="/map" element={<MapDashboard />} />
                                    <Route path="/sos" element={<CitizenSOS />} />
                                    
                                    <Route element={<RoleRoute allowedRoles={['Admin', 'Rescue Team']} />}>
                                        {/* Future Admin-only routes */}
                                    </Route>
                                </Route>
                            </Routes>
                        </Suspense>
                    </Router>
                </AuthProvider>
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
