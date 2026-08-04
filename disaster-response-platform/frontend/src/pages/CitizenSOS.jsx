import React, { useState } from 'react';
import axiosInstance from '../services/axiosInstance';
import { AlertCircle, MapPin, Camera, Mic } from 'lucide-react';

const CitizenSOS = () => {
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState(null);
    const [severity, setSeverity] = useState('High');

    const triggerSOS = () => {
        setLoading(true);
        setStatus(null);

        if (!navigator.geolocation) {
            setStatus({ type: 'error', msg: 'Geolocation is not supported by your browser' });
            setLoading(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const payload = {
                        longitude: position.coords.longitude,
                        latitude: position.coords.latitude,
                        severity
                    };
                    
                    // Note: If using FormData for file uploads, append data instead
                    const res = await axiosInstance.post('/sos', payload);
                    if (res.data.success) {
                        setStatus({ type: 'success', msg: 'SOS sent successfully! Help is on the way.' });
                    }
                } catch (err) {
                    setStatus({ type: 'error', msg: 'Failed to send SOS. Please try again or call emergency services.' });
                } finally {
                    setLoading(false);
                }
            },
            (error) => {
                setStatus({ type: 'error', msg: 'Failed to get location: ' + error.message });
                setLoading(false);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="bg-white max-w-md w-full rounded-3xl shadow-xl overflow-hidden text-center p-8">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <AlertCircle className="text-red-600 w-12 h-12" />
                </div>
                
                <h1 className="text-3xl font-bold text-slate-900 mb-2">Emergency SOS</h1>
                <p className="text-slate-500 mb-8">Tap the button below to instantly alert nearby rescue teams with your precise location.</p>

                {status && (
                    <div className={`mb-6 p-4 rounded-xl ${status.type === 'error' ? 'bg-red-50 text-red-700 border border-red-200' : 'bg-green-50 text-green-700 border border-green-200'}`}>
                        {status.msg}
                    </div>
                )}

                <div className="mb-8">
                    <label className="block text-sm font-medium text-slate-700 mb-2 text-left">Severity Level</label>
                    <select 
                        value={severity}
                        onChange={(e) => setSeverity(e.target.value)}
                        className="w-full bg-slate-100 border-none rounded-xl p-4 text-slate-700 focus:ring-2 focus:ring-red-500 font-medium"
                    >
                        <option value="Low">Low - Minor Assistance Needed</option>
                        <option value="Medium">Medium - Urgent Assistance</option>
                        <option value="High">High - Life Threatening</option>
                        <option value="Critical">Critical - Mass Casualty / Extreme</option>
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                        <Camera className="text-slate-600 w-6 h-6 mb-2" />
                        <span className="text-xs font-semibold text-slate-600">Add Photo</span>
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl hover:bg-slate-200 transition-colors">
                        <Mic className="text-slate-600 w-6 h-6 mb-2" />
                        <span className="text-xs font-semibold text-slate-600">Voice Note</span>
                    </button>
                </div>

                <button
                    onClick={triggerSOS}
                    disabled={loading}
                    className={`w-full py-6 rounded-2xl text-xl font-bold text-white shadow-lg transition-all transform hover:-translate-y-1 ${loading ? 'bg-red-400' : 'bg-gradient-to-br from-red-500 to-red-700 hover:from-red-600 hover:to-red-800'}`}
                >
                    {loading ? 'Transmitting...' : 'SLIDE TO SEND SOS'}
                </button>
                
                <div className="mt-6 flex items-center justify-center text-xs text-slate-400">
                    <MapPin className="w-3 h-3 mr-1" />
                    Your location will be transmitted securely
                </div>
            </div>
        </div>
    );
};

export default CitizenSOS;
