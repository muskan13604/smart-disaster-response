import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Dashboard</h1>
                        <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                            Role: {user?.role}
                        </span>
                        <button
                            onClick={logout}
                            className="px-6 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors"
                        >
                            Log Out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
