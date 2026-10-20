import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Meter } from '@/types';
import { RefreshCw, Search } from 'lucide-react';
import api from '@/services/api';

export const MetersPage: React.FC = () => {
  const [meters, setMeters] = useState<Meter[]>([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchMeters = async () => {
    try {
      setLoading(true);
      const params: any = { limit: 50 };
      if (search) params.search = search;
      if (statusFilter) params.status = statusFilter;
      const res = await api.get('/meters', { params });
      setMeters(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to load meters', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeters();
  }, [statusFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Smart Meters Fleet ({total})</h2>
          <p className="text-xs text-slate-500 mt-0.5">IS 16444 Static AC Transformer & Whole Current Meters</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchMeters} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Fleet
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search by Meter ID, Serial, IP..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchMeters()}
            className="w-full bg-white border border-slate-200 pl-9 pr-4 py-2 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-primary text-slate-800"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-slate-200 px-3 py-2 rounded-lg text-xs text-slate-700"
        >
          <option value="">All Statuses</option>
          <option value="online">Online</option>
          <option value="offline">Offline</option>
          <option value="power_off">Power Off (Outage)</option>
        </select>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="p-3 pl-4">Meter ID</th>
                <th className="p-3">Status</th>
                <th className="p-3">Phase & Class</th>
                <th className="p-3">Topology</th>
                <th className="p-3">Voltage (V)</th>
                <th className="p-3">Current (A)</th>
                <th className="p-3">Power (kW)</th>
                <th className="p-3">Consumer</th>
                <th className="p-3 pr-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {meters.map((m) => (
                <tr key={m.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 pl-4 font-semibold text-slate-900">{m.meter_id}</td>
                  <td className="p-3"><StatusBadge status={m.status} /></td>
                  <td className="p-3 capitalize">{m.phase.replace('_', ' ')} ({m.accuracy_class})</td>
                  <td className="p-3 uppercase font-mono text-[10px]">{m.topology.replace('_', ' ')}</td>
                  <td className="p-3">{m.voltage ? `${m.voltage} V` : '-'}</td>
                  <td className="p-3">{m.current ? `${m.current} A` : '-'}</td>
                  <td className="p-3">{m.active_power ? `${m.active_power} kW` : '-'}</td>
                  <td className="p-3">{m.consumer_name || '-'}</td>
                  <td className="p-3 pr-4 text-right">
                    <Button variant="outline" size="sm" onClick={() => navigate(`/meters/${m.id}`)} className="text-xs h-7">
                      Inspect
                    </Button>
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
