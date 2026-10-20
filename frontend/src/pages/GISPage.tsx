import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, CircleMarker, Popup } from 'react-leaflet';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { StatusBadge } from '@/components/StatusBadge';
import { MapPin, RefreshCw } from 'lucide-react';
import api from '@/services/api';

export const GISPage: React.FC = () => {
  const [meters, setMeters] = useState<any[]>([]);
  const [dcus, setDcus] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, dRes] = await Promise.all([
        api.get('/gis/meters'),
        api.get('/gis/dcus'),
      ]);
      setMeters(mRes.data.features || []);
      setDcus(dRes.data.features || []);
    } catch (err) {
      console.error('Failed to load GIS features', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getColor = (status: string) => {
    if (status === 'online') return '#10b981';
    if (status === 'power_off') return '#ef4444';
    if (status === 'warning') return '#f59e0b';
    return '#64748b';
  };

  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between flex-shrink-0">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">GIS Spatial Grid & Outage Map</h2>
          <p className="text-xs text-slate-500 mt-0.5">Live Coordinates for 100+ Smart Meters and 10 Neighborhood DCUs in Delhi</p>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500" /> Online</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500" /> Last Gasp Outage</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-blue-600" /> DCU Hub</span>
        </div>
      </div>

      <Card className="flex-1 overflow-hidden p-0 border-slate-200 shadow-sm relative">
        <MapContainer center={[28.6139, 77.2090]} zoom={11} className="h-full w-full">
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution="&copy; OpenStreetMap contributors"
          />

          {/* DCUs */}
          {dcus.map((d: any, idx: number) => (
            <CircleMarker
              key={`dcu-${idx}`}
              center={[d.geometry.coordinates[1], d.geometry.coordinates[0]]}
              radius={10}
              pathOptions={{ color: '#2563eb', fillColor: '#3b82f6', fillOpacity: 0.9, weight: 3 }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900">{d.properties.name}</p>
                  <p className="text-slate-500">{d.properties.dcu_id}</p>
                  <p className="text-slate-600">Connected: {d.properties.total_connected_meters} meters</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}

          {/* Meters */}
          {meters.map((m: any, idx: number) => (
            <CircleMarker
              key={`meter-${idx}`}
              center={[m.geometry.coordinates[1], m.geometry.coordinates[0]]}
              radius={5}
              pathOptions={{ color: getColor(m.properties.status), fillColor: getColor(m.properties.status), fillOpacity: 0.8, weight: 1 }}
            >
              <Popup>
                <div className="text-xs space-y-1">
                  <p className="font-bold text-slate-900">{m.properties.meter_id}</p>
                  <p className="text-slate-500">Status: <span className="font-semibold capitalize">{m.properties.status}</span></p>
                  <p className="text-slate-600">Voltage: {m.properties.voltage || 0} V</p>
                  <p className="text-slate-600">Power: {m.properties.active_power || 0} kW</p>
                </div>
              </Popup>
            </CircleMarker>
          ))}
        </MapContainer>
      </Card>
    </div>
  );
};
