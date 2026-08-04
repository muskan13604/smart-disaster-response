import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex flex-col items-center justify-center p-4">
            <h1 className="text-5xl font-bold text-slate-800 dark:text-white mb-6 text-center">Smart Disaster Response Platform</h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl text-center">
                A real-time, cloud-native platform for dynamic resource optimization, priority-based SOS processing, and complete visibility during critical emergencies.
            </p>
            <div className="flex gap-4">
                <Link to="/login" className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-colors">
                    Log In
                </Link>
                <Link to="/register" className="px-8 py-3 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-white font-medium rounded-xl border border-slate-200 dark:border-slate-700 transition-colors">
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Home;
