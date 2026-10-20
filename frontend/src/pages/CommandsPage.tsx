import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Terminal, Send, RefreshCw, CheckCircle2 } from 'lucide-react';
import api from '@/services/api';

export const CommandsPage: React.FC = () => {
  const [commands, setCommands] = useState<any[]>([]);
  const [meterId, setMeterId] = useState('1');
  const [cmdType, setCmdType] = useState('READ_INSTANTANEOUS');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchCommands = async () => {
    try {
      const res = await api.get('/commands');
      setCommands(res.data.items || []);
    } catch (err) {
      console.error('Failed to load commands', err);
    }
  };

  useEffect(() => {
    fetchCommands();
  }, []);

  const handleDispatch = async () => {
    try {
      setLoading(true);
      const res = await api.post('/commands', {
        meter_id: Number(meterId),
        command_type: cmdType,
      });
      setResult(`Acknowledged: ${res.data.message}`);
      fetchCommands();
    } catch {
      setResult('Failed to dispatch command');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Two-Way Command Dispatch & Control</h2>
          <p className="text-xs text-slate-500 mt-0.5">IS 15959 DLMS Interrogation, Clock Sync, Load Profile & Connect/Disconnect</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-primary" /> Issue DLMS Command
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Meter ID</label>
              <input
                type="number"
                value={meterId}
                onChange={(e) => setMeterId(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">DLMS Command Type</label>
              <select
                value={cmdType}
                onChange={(e) => setCmdType(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs"
              >
                <option value="READ_INSTANTANEOUS">Read Instantaneous Profile (DLMS 1.0.94.91.0.255)</option>
                <option value="READ_BILLING_PROFILE">Read Billing Profile (DLMS 1.0.98.1.0.255)</option>
                <option value="SYNC_CLOCK">Synchronize Meter Real-Time Clock</option>
                <option value="PING_METER">Ping & Check Signal RSSI</option>
              </select>
            </div>
            <Button onClick={handleDispatch} disabled={loading} className="w-full text-xs gap-2">
              <Send className="w-3.5 h-3.5" /> {loading ? 'Dispatching...' : 'Dispatch Command'}
            </Button>
            {result && (
              <p className="text-[11px] text-emerald-600 bg-emerald-50 p-2 rounded border border-emerald-100 font-medium">
                {result}
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">Command Execution History</CardTitle>
          </CardHeader>
          <CardContent className="p-0 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
                <tr>
                  <th className="p-3 pl-4">Command Code</th>
                  <th className="p-3">Target Meter</th>
                  <th className="p-3">Type</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {commands.map((c) => (
                  <tr key={c.id}>
                    <td className="p-3 pl-4 font-mono font-semibold text-slate-900">{c.command_id}</td>
                    <td className="p-3 font-semibold text-primary">Meter {c.meter_id}</td>
                    <td className="p-3">{c.command_type}</td>
                    <td className="p-3"><StatusBadge status={c.status} /></td>
                    <td className="p-3 text-slate-400">{new Date(c.created_at).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
