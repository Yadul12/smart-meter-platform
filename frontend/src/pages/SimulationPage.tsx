import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Activity, CheckCircle2, Play, Pause } from 'lucide-react';
import api from '@/services/api';

export const SimulationPage: React.FC = () => {
  const [simStatus, setSimStatus] = useState<any | null>(null);
  const [meterId, setMeterId] = useState('13');
  const [loading, setLoading] = useState(false);
  const [actionMsg, setActionMsg] = useState<string | null>(null);

  const fetchStatus = async () => {
    try {
      const res = await api.get('/simulator/status');
      setSimStatus(res.data);
    } catch (err) {
      console.error('Failed to load simulator status', err);
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  const showFeedback = (msg: string) => {
    setActionMsg(msg);
    setTimeout(() => setActionMsg(null), 4000);
    fetchStatus();
  };

  const handleToggle = async () => {
    try {
      setLoading(true);
      const res = await api.post('/simulator/toggle');
      showFeedback(`Simulator ${res.data.is_running ? 'Resumed' : 'Paused'}`);
    } catch {
      showFeedback('Failed to toggle simulator');
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerReading = async () => {
    try {
      const res = await api.post('/simulator/trigger/reading', { meter_id: Number(meterId) });
      showFeedback(`Generated ${res.data.readings_created} new telemetry readings over WebSocket`);
    } catch {
      showFeedback('Failed to generate readings');
    }
  };

  const handleTriggerLastGasp = async () => {
    try {
      const res = await api.post('/simulator/trigger/last-gasp', { meter_id: Number(meterId) });
      showFeedback(`🚨 Triggered Last Gasp power outage event on meter ${res.data.meter_id}`);
    } catch {
      showFeedback('Failed to trigger Last Gasp');
    }
  };

  const handleTriggerFirstBreath = async () => {
    try {
      const res = await api.post('/simulator/trigger/first-breath', { meter_id: Number(meterId) });
      showFeedback(`✅ Triggered First Breath power restoration event on meter ${res.data.meter_id}`);
    } catch {
      showFeedback('Failed to trigger First Breath');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Simulation & Scenario Control Panel</h2>
          <p className="text-xs text-slate-500 mt-0.5">IS 16444 Real-Time AMI Event Injection & Demo Automation Controls</p>
        </div>
        <Button
          variant={simStatus?.is_running ? 'destructive' : 'default'}
          size="sm"
          onClick={handleToggle}
          disabled={loading}
          className="gap-2 text-xs"
        >
          {simStatus?.is_running ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          {simStatus?.is_running ? 'Pause Autonomous Ticks' : 'Resume Simulation'}
        </Button>
      </div>

      {actionMsg && (
        <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
          <span>{actionMsg}</span>
        </div>
      )}

      <Card>
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-semibold text-slate-800">Target Injection Meter</CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-center gap-4 max-w-sm">
            <label className="text-xs font-medium text-slate-700">Select Meter ID (1 - 104):</label>
            <input
              type="number"
              min="1"
              max="104"
              value={meterId}
              onChange={(e) => setMeterId(e.target.value)}
              className="w-24 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-900"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-rose-100 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-rose-600 flex items-center gap-2">
              <Zap className="w-4 h-4" /> Trigger Last Gasp (Power Loss)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-500">
              Simulates power outage per IS 16444 Clause 9.5. Meter uses built-in capacitor reserve to send final outage broadcast.
            </p>
            <Button onClick={handleTriggerLastGasp} variant="destructive" size="sm" className="w-full text-xs">
              Inject Last Gasp Signal
            </Button>
          </CardContent>
        </Card>

        <Card className="border-emerald-100 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-emerald-600 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" /> Trigger First Breath (Restoration)
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-500">
              Simulates supply restoration per IS 16444 Clause 9.6. Meter broadcasts restoration packet and closes outage.
            </p>
            <Button onClick={handleTriggerFirstBreath} size="sm" className="w-full text-xs bg-emerald-600 hover:bg-emerald-700 text-white">
              Inject First Breath Signal
            </Button>
          </CardContent>
        </Card>

        <Card className="border-blue-100 hover:shadow-md transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-semibold text-primary flex items-center gap-2">
              <Activity className="w-4 h-4" /> Trigger Telemetry Burst
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-xs">
            <p className="text-slate-500">
              Injects instant DLMS/COSEM electrical readings into the database and broadcasts live updates over WebSockets.
            </p>
            <Button onClick={handleTriggerReading} size="sm" className="w-full text-xs">
              Inject Instant Reading
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
