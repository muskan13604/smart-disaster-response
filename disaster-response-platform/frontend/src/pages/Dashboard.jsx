import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axiosInstance from '../services/axiosInstance';
import { Search, Calculator } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useContext(AuthContext);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [allocationResult, setAllocationResult] = useState(null);

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.length > 1) {
            try {
                const res = await axiosInstance.get(`/algorithms/search?q=${query}`);
                if (res.data.success) {
                    setSearchResults(res.data.data);
                }
            } catch (err) {
                console.error(err);
            }
        } else {
            setSearchResults([]);
        }
    };

    const runDPAllocation = async () => {
        try {
            // Mock data for testing DP API
            const payload = {
                totalResources: 100,
                disasters: [
                    { id: '1', requiredResources: 30, livesSavedEstimate: 50, name: 'Flood in Zone A' },
                    { id: '2', requiredResources: 50, livesSavedEstimate: 80, name: 'Earthquake in Zone B' },
                    { id: '3', requiredResources: 40, livesSavedEstimate: 60, name: 'Fire in Zone C' }
                ]
            };
            const res = await axiosInstance.post('/algorithms/allocate', payload);
            if (res.data.success) {
                setAllocationResult(res.data.data);
            }
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-800">Command Center</h1>
                        <p className="text-slate-500 mt-1">Welcome back, {user?.name}</p>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium border border-blue-200">
                            {user?.role}
                        </span>
                        <button onClick={logout} className="px-6 py-2 bg-slate-900 text-white rounded-xl font-medium hover:bg-slate-800 transition-colors">
                            Log Out
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Location Search (Trie) */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><Search className="w-5 h-5 mr-2"/> Location Search (Trie)</h2>
                        <div className="relative">
                            <input 
                                type="text"
                                className="w-full pl-10 pr-4 py-3 bg-slate-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Search cities, hospitals, camps..."
                                value={searchQuery}
                                onChange={handleSearch}
                            />
                            <Search className="absolute left-3 top-3.5 text-slate-400 w-5 h-5" />
                            
                            {searchResults.length > 0 && (
                                <ul className="absolute z-10 w-full mt-2 bg-white border border-slate-200 rounded-xl shadow-lg max-h-60 overflow-auto">
                                    {searchResults.map((loc, idx) => (
                                        <li key={idx} className="px-4 py-3 hover:bg-slate-50 cursor-pointer border-b last:border-0 border-slate-100 flex justify-between">
                                            <span className="font-medium text-slate-800">{loc.name}</span>
                                            <span className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded">{loc.type}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    </div>

                    {/* DP Allocation */}
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
                        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center"><Calculator className="w-5 h-5 mr-2"/> DP Resource Allocation</h2>
                        <button onClick={runDPAllocation} className="w-full py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors shadow-md">
                            Run Optimization Engine
                        </button>

                        {allocationResult && (
                            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl">
                                <h3 className="font-bold text-green-800 mb-2">Optimization Result</h3>
                                <p className="text-sm text-green-700 mb-1"><strong>Max Lives Saved:</strong> {allocationResult.maxLivesSaved}</p>
                                <p className="text-sm text-green-700 mb-3"><strong>Resources Used:</strong> {allocationResult.resourcesUsed} / 100</p>
                                <h4 className="font-semibold text-green-800 text-sm mb-2">Allocated To:</h4>
                                <ul className="list-disc pl-5 text-sm text-green-700">
                                    {allocationResult.allocatedDisasters.map(d => (
                                        <li key={d.id}>{d.name} ({d.requiredResources} units)</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
