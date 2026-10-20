import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { RefreshCw, Zap } from 'lucide-react';
import api from '@/services/api';

export const OutagesPage: React.FC = () => {
  const [outages, setOutages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOutages = async () => {
    try {
      setLoading(true);
      const res = await api.get('/outages');
      setOutages(res.data.items);
    } catch (err) {
      console.error('Failed to load outages', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOutages();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Grid Outages (Last Gasp Intercepts)</h2>
          <p className="text-xs text-slate-500 mt-0.5">IS 16444 Capacitor Reserve Supply Interruption Tracking</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchOutages} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="p-3 pl-4">Outage Code</th>
                <th className="p-3">Status</th>
                <th className="p-3">Area / Feeder</th>
                <th className="p-3">Trigger Cause</th>
                <th className="p-3">Start Time</th>
                <th className="p-3">Duration (Mins)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {outages.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 pl-4 font-mono font-semibold text-slate-900">{o.outage_id}</td>
                  <td className="p-3"><StatusBadge status={o.status} /></td>
                  <td className="p-3 font-semibold text-slate-800">{o.area || 'South Delhi Sector 4'}</td>
                  <td className="p-3 text-slate-600">{o.cause}</td>
                  <td className="p-3 text-slate-400">{new Date(o.start_time).toLocaleString()}</td>
                  <td className="p-3 font-semibold">{o.duration_minutes ? `${o.duration_minutes} min` : 'Ongoing'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
