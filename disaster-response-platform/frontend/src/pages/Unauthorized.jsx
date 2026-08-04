import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle } from 'lucide-react';

const Unauthorized = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-800 p-4">
            <div className="max-w-md w-full bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-8 shadow-2xl text-center">
                <div className="bg-red-500/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.3)]">
                    <AlertTriangle className="text-red-400 w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-white tracking-tight mb-4">Access Denied</h2>
                <p className="text-slate-300 mb-8">
                    You don't have the required permissions to access this page. Please contact an administrator if you believe this is a mistake.
                </p>
                <Link
                    to="/dashboard"
                    className="inline-flex justify-center items-center py-3 px-6 border border-transparent rounded-xl shadow-lg text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 transition-all transform hover:-translate-y-0.5"
                >
                    Return to Dashboard
                </Link>
            </div>
        </div>
    );
};

export default Unauthorized;
