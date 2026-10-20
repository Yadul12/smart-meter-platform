import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { KPICard } from '@/components/KPICard';
import { ArrowLeft, RefreshCw, Zap, Activity, Radio, Terminal } from 'lucide-react';
import api from '@/services/api';

export const MeterDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [meter, setMeter] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [cmdStatus, setCmdStatus] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMeter = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/meters/${id}`);
      setMeter(res.data);
    } catch (err) {
      console.error('Failed to load meter details', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeter();
  }, [id]);

  const handleReadNow = async () => {
    try {
      setCmdStatus('Issuing HES DLMS interrogation...');
      const res = await api.post(`/hes/meters/${id}/read`);
      setCmdStatus(`Success: Instant Read V=${res.data.voltage}V, I=${res.data.current}A`);
      fetchMeter();
      setTimeout(() => setCmdStatus(null), 4000);
    } catch {
      setCmdStatus('Failed to read meter');
    }
  };

  if (!meter) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={() => navigate('/meters')} className="h-8 gap-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back
          </Button>
          <div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">{meter.meter_id}</h2>
            <p className="text-xs text-slate-500">Serial: {meter.serial_number} | Manufacturer: {meter.manufacturer}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleReadNow} className="gap-2 text-xs">
            <Terminal className="w-3.5 h-3.5" /> Read Meter Now (DLMS)
          </Button>
        </div>
      </div>

      {cmdStatus && (
        <div className="p-3 bg-primary/10 border border-primary/20 rounded-lg text-xs font-semibold text-primary">
          {cmdStatus}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard title="Instantaneous Voltage" value={`${meter.voltage || 0} V`} icon={Zap} color="blue" />
        <KPICard title="Instantaneous Current" value={`${meter.current || 0} A`} icon={Activity} color="emerald" />
        <KPICard title="Active Power Demand" value={`${meter.active_power || 0} kW`} icon={Radio} color="indigo" />
        <KPICard title="Cumulative Import Energy" value={`${meter.import_energy || 0} kWh`} icon={Activity} color="slate" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">IS 16444 Device Specifications</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Phase Configuration:</span><span className="font-semibold text-slate-800 capitalize">{meter.phase}</span></div>
            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Accuracy Class:</span><span className="font-semibold text-slate-800">{meter.accuracy_class}</span></div>
            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Topology:</span><span className="font-semibold text-primary uppercase">{meter.topology}</span></div>
            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Firmware:</span><span className="font-mono text-slate-800">{meter.firmware_version}</span></div>
            <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">IP Address:</span><span className="font-mono text-slate-800">{meter.ip_address || '10.20.100.1'}</span></div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">Consumer Assignment</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2 text-xs">
            {meter.consumer ? (
              <>
                <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Consumer Name:</span><span className="font-semibold text-slate-800">{meter.consumer.name}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Consumer Number:</span><span className="font-semibold text-slate-800">{meter.consumer.consumer_number}</span></div>
                <div className="flex justify-between py-1 border-b border-slate-50"><span className="text-slate-500">Service Address:</span><span className="text-slate-700">{meter.consumer.address}</span></div>
              </>
            ) : (
              <p className="text-slate-400 italic">No consumer assigned to this meter.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
