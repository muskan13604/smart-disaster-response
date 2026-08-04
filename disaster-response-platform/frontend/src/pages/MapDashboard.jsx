import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { io } from 'socket.io-client';
import axiosInstance from '../services/axiosInstance';
import { AuthContext } from '../context/AuthContext';

// Fix for default Leaflet icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const redIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const ambulanceIcon = new L.Icon({
    iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
});

const MapDashboard = () => {
    const { user } = useContext(AuthContext);
    const [disasters, setDisasters] = useState([]);
    const [sosList, setSosList] = useState([]);
    const [resources, setResources] = useState({}); // Tracking resources by ID
    const [activeRoute, setActiveRoute] = useState(null); // Array of LatLng for polyline

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axiosInstance.get('/disasters?status=Active');
                if (res.data.success) {
                    setDisasters(res.data.data.disasters);
                }

                if (['Admin', 'Rescue Team'].includes(user?.role)) {
                    const sosRes = await axiosInstance.get('/sos/history?status=Pending');
                    if (sosRes.data.success) {
                        setSosList(sosRes.data.data);
                    }
                }
            } catch (err) {
                console.error('Failed to fetch data', err);
            }
        };
        fetchData();

        const apiBaseUrl = import.meta.env.VITE_API_URL || '/api';
        const socketUrl = apiBaseUrl === '/api'
            ? window.location.origin
            : apiBaseUrl.replace(/\/api$/, '');
        const socket = io(socketUrl, {
            auth: { token: localStorage.getItem('accessToken') }
        });

        socket.on('new_disaster', (disaster) => {
            setDisasters(prev => [disaster, ...prev]);
        });

        socket.on('new_sos', (sos) => {
            if (['Admin', 'Rescue Team'].includes(user?.role)) {
                setSosList(prev => [sos, ...prev]);
            }
        });

        socket.on('tracking_update', (resourceUpdate) => {
            setResources(prev => ({
                ...prev,
                [resourceUpdate.identifier]: resourceUpdate
            }));
        });

        // Simulate a moving resource for demonstration
        let simInterval = setInterval(() => {
            const time = Date.now() / 1000;
            const simLat = 19.0760 + Math.sin(time) * 0.05;
            const simLng = 72.8777 + Math.cos(time) * 0.05;
            setResources(prev => ({
                ...prev,
                'AMB-01': {
                    identifier: 'AMB-01',
                    type: 'Ambulance',
                    status: 'Busy',
                    location: { coordinates: [simLng, simLat] }
                }
            }));
        }, 2000);

        return () => {
            socket.disconnect();
            clearInterval(simInterval);
        };
    }, [user]);

    const calculateRoute = async () => {
        try {
            // Mock call to Dijkstra API (A to F)
            const res = await axiosInstance.post('/algorithms/route', { start: 'A', end: 'F' });
            if (res.data.success) {
                // Mock coordinate mapping for graph nodes A-F for visualization around Mumbai
                const nodeCoords = {
                    'A': [19.0760, 72.8777],
                    'B': [19.1000, 72.9000],
                    'C': [19.1200, 72.8500],
                    'D': [19.1500, 72.9500],
                    'E': [19.1400, 73.0000],
                    'F': [19.1800, 73.0500]
                };
                const routeCoords = res.data.data.path.map(node => nodeCoords[node]);
                setActiveRoute(routeCoords);
            }
        } catch (err) {
            console.error('Routing failed', err);
        }
    };

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="bg-slate-900 text-white p-4 shadow-md z-10 flex justify-between items-center relative">
                <h1 className="text-xl font-bold">Live Operations Map</h1>
                <button onClick={calculateRoute} className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    Optimize Route (Dijkstra A→F)
                </button>
            </div>
            <div className="flex-grow z-0 relative">
                <MapContainer center={[19.1, 72.9]} zoom={11} style={{ height: '100%', width: '100%' }}>
                    <TileLayer
                        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    
                    {disasters.map(d => (
                        <Circle 
                            key={d._id}
                            center={[d.location.coordinates[1], d.location.coordinates[0]]}
                            radius={d.affectedRadius}
                            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
                        >
                            <Popup>
                                <strong>{d.title}</strong><br/>
                                Severity: {d.severity}<br/>
                                Type: {d.type}
                            </Popup>
                        </Circle>
                    ))}

                    {sosList.map(sos => (
                        <Marker 
                            key={sos._id} 
                            position={[sos.location.coordinates[1], sos.location.coordinates[0]]}
                            icon={redIcon}
                        >
                            <Popup>
                                <strong className="text-red-600">SOS ALERT ({sos.severity})</strong><br/>
                                By: {sos.citizenId?.name}<br/>
                                Time: {new Date(sos.createdAt).toLocaleString()}
                            </Popup>
                        </Marker>
                    ))}

                    {Object.values(resources).map(res => (
                        <Marker 
                            key={res.identifier} 
                            position={[res.location.coordinates[1], res.location.coordinates[0]]}
                            icon={ambulanceIcon}
                        >
                            <Popup>
                                <strong>{res.type}: {res.identifier}</strong><br/>
                                Status: <span className="font-semibold text-blue-600">{res.status}</span>
                            </Popup>
                        </Marker>
                    ))}

                    {activeRoute && (
                        <Polyline positions={activeRoute} color="#3b82f6" weight={5} opacity={0.8} dashArray="10, 10" />
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapDashboard;
