import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';

export const AlarmsPage: React.FC = () => {
  const [alarms, setAlarms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlarms = async () => {
    try {
      setLoading(true);
      const res = await api.get('/alarms');
      setAlarms(res.data.items);
    } catch (err) {
      console.error('Failed to load alarms', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  const handleClear = async (id: number) => {
    await api.post(`/alarms/${id}/clear`);
    fetchAlarms();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Active Critical Alarms</h2>
          <p className="text-xs text-slate-500 mt-0.5">Threshold Violations, Power Quality Anomalies & Connectivity Failures</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchAlarms} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="p-3 pl-4">Alarm Code</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Status</th>
                <th className="p-3">Description</th>
                <th className="p-3">Raised At</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {alarms.map((a) => (
                <tr key={a.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 pl-4 font-mono font-semibold text-slate-900">{a.alarm_id}</td>
                  <td className="p-3"><StatusBadge status={a.severity} /></td>
                  <td className="p-3"><StatusBadge status={a.status} /></td>
                  <td className="p-3 font-medium text-slate-800">{a.description}</td>
                  <td className="p-3 text-slate-400">{new Date(a.raised_at).toLocaleString()}</td>
                  <td className="p-3 pr-4 text-right">
                    {a.status === 'active' && (
                      <Button variant="outline" size="sm" onClick={() => handleClear(a.id)} className="text-xs h-7">
                        Clear Alarm
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
