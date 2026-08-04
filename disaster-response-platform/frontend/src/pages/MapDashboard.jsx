import React, { useState, useEffect, useContext } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
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
    shadowSize: [41, 41]
});

const MapDashboard = () => {
    const { user } = useContext(AuthContext);
    const [disasters, setDisasters] = useState([]);
    const [sosList, setSosList] = useState([]);

    useEffect(() => {
        // Fetch initial data
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

        // Socket.IO Setup
        const socket = io(import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:5000');

        socket.on('new_disaster', (disaster) => {
            setDisasters(prev => [disaster, ...prev]);
        });

        socket.on('new_sos', (sos) => {
            if (['Admin', 'Rescue Team'].includes(user?.role)) {
                setSosList(prev => [sos, ...prev]);
                // Optional: trigger browser notification here
            }
        });

        return () => socket.disconnect();
    }, [user]);

    return (
        <div className="h-screen w-full flex flex-col">
            <div className="bg-slate-900 text-white p-4 shadow-md z-10 relative">
                <h1 className="text-xl font-bold">Live Operations Map</h1>
            </div>
            <div className="flex-grow z-0 relative">
                <MapContainer center={[20, 77]} zoom={5} style={{ height: '100%', width: '100%' }}>
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
                </MapContainer>
            </div>
        </div>
    );
};

export default MapDashboard;
