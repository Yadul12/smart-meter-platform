import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';

export const EventsPage: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get('/events');
      setEvents(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to load events', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleAck = async (id: number) => {
    await api.post(`/events/${id}/acknowledge`);
    fetchEvents();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Meter Events & Tamper Alarms ({total})</h2>
          <p className="text-xs text-slate-500 mt-0.5">IS 16444 Tamper Detection, Power Quality & Grid Notifications</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchEvents} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="p-3 pl-4">Event Code</th>
                <th className="p-3">Severity</th>
                <th className="p-3">Category</th>
                <th className="p-3">Description</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3">Status</th>
                <th className="p-3 pr-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {events.map((e) => (
                <tr key={e.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 pl-4 font-mono font-semibold text-slate-900">{e.event_id}</td>
                  <td className="p-3"><StatusBadge status={e.severity} /></td>
                  <td className="p-3 capitalize">{e.event_category.replace('_', ' ')}</td>
                  <td className="p-3 font-medium text-slate-800">{e.description}</td>
                  <td className="p-3 text-slate-400">{new Date(e.event_time).toLocaleString()}</td>
                  <td className="p-3">{e.acknowledged ? <span className="text-emerald-600 font-semibold">Acknowledged</span> : <span className="text-amber-600 font-semibold">Unacknowledged</span>}</td>
                  <td className="p-3 pr-4 text-right">
                    {!e.acknowledged && (
                      <Button variant="outline" size="sm" onClick={() => handleAck(e.id)} className="text-xs h-7">
                        Acknowledge
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
