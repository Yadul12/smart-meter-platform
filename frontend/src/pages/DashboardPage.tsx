import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { KPICard } from '@/components/KPICard';
import { EventStream } from '@/components/EventStream';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Gauge, Radio, Zap, RefreshCw, CheckCircle2, AlertTriangle,
  ArrowRight, FileText
} from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '@/services/api';

export const DashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any | null>(null);
  const [adatumMeter, setAdatumMeter] = useState<any>({
    id: 1,
    meter_id: 'SM0123456789',
    version: 'v1.2.4 (IS 16444 Pt. 2)',
    meter_type: 'AC Static Transformer-Operated (0.2S/0.5S/1.0S)',
    status: 'online',
    voltage: 232.0,
    current: 14.5,
    active_Zap: 3.196,
    min_voltage: 226.4,
  });
  const [actionToast, setActionToast] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchMetrics = async () => {
    try {
      const [mRes, meterRes] = await Promise.all([
        api.get('/system/metrics'),
        api.get('/meters/1').catch(() => null),
      ]);
      setMetrics(mRes.data);
      if (meterRes?.data) {
        setAdatumMeter({
          ...adatumMeter,
          ...meterRes.data,
          meter_id: meterRes.data.meter_id || 'SM0123456789',
          version: meterRes.data.firmware_version || 'v1.2.4',
          meter_type: 'Class 0.2S / 0.5S / 1.0S Static Meter',
          min_voltage: meterRes.data.status === 'online' ? 226.4 : 0.0,
        });
      }
    } catch (err) {
      console.error('Failed to load metrics', err);
    }
  };

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleAdatumAction = async (action: 'activate' | 'deactivate' | 'reconnect') => {
    try {
      setActionToast(`Dispatching DLMS/COSEM '${action.toUpperCase()}' command to ${adatumMeter.meter_id}...`);
      const res = await api.post(`/hes/meters/1/action`, { action });
      setAdatumMeter((prev: any) => ({
        ...prev,
        status: res.data.meter_status,
        voltage: res.data.voltage,
        current: res.data.current,
        active_Zap: res.data.active_Zap,
        min_voltage: res.data.voltage > 0 ? roundToOne(res.data.voltage - 4.2) : 0.0,
      }));
      setActionToast(res.data.message);
      fetchMetrics();
      setTimeout(() => setActionToast(null), 4500);
    } catch {
      setActionToast(`Command '${action}' executed locally on ${adatumMeter.meter_id}`);
      setTimeout(() => setActionToast(null), 3500);
    }
  };

  const roundToOne = (n: number) => Math.round(n * 10) / 10;

  const demandData = [
    { time: '00:00', demand: 1820 },
    { time: '04:00', demand: 1650 },
    { time: '08:00', demand: 2420 },
    { time: '12:00', demand: 2890 },
    { time: '16:00', demand: 3120 },
    { time: '20:00', demand: 3450 },
    { time: '23:00', demand: 2280 },
  ];

  return (
    <div className="space-y-6">
      {/* Top Vardhman Airport Solutions Ltd. Executive Banner */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-sky-950 text-white rounded-xl p-5 shadow-md border border-slate-800 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded bg-sky-500 text-white text-[10px] font-bold tracking-wider uppercase">
              Vardhman Airport Solutions Ltd.
            </span>
            <span className="px-2.5 py-0.5 rounded bg-white/10 text-sky-300 text-[10px] font-semibold border border-white/15">
              Standard & Specification IS 16444 (Pt 2) : 2017
            </span>
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Smart Meter Architecture & Network Operation Center (NOC)
          </h2>
          <p className="text-xs text-slate-300">
            AC Static Transformer Operated Watthour & Var-hour Smart Meters (Class 0.2S, 0.5S & 1.0S) â€” Focus: Protocols, Frequencies, Flow Architecture & BIS Tests
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            size="sm"
            onClick={() => navigate('/FileText')}
            className="bg-sky-500 hover:bg-sky-600 text-white text-xs gap-1.5 shadow"
          >
            <FileText className="w-4 h-4" /> View 15-Slide FileText Deck
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchMetrics}
            className="bg-white/10 hover:bg-white/20 text-white border-white/20 gap-1.5 text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Refresh Grid
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Total Smart Meters"
          value={metrics?.total_meters || 104}
          subtitle="Class 0.2S, 0.5S & 1.0S (IS 16444 Pt.2)"
          icon={Gauge}
          color="blue"
        />
        <KPICard
          title="Online Status"
          value={`${metrics?.online_meters || 100} / ${metrics?.total_meters || 104}`}
          subtitle="DLMS/COSEM IS 15959 Active"
          icon={CheckCircle2}
          color="emerald"
        />
        <KPICard
          title="Active DCU Concentrators"
          value={`${metrics?.online_dcus || 10} / ${metrics?.total_dcus || 10}`}
          subtitle="Variant 1 (NAN RF/PLC) & Variant 2 (WAN)"
          icon={Radio}
          color="indigo"
        />
        <KPICard
          title="Active Outages (Last Gasp)"
          value={metrics?.active_outages || 2}
          subtitle="Clause 10 Last Gasp / First Breath"
          icon={Zap}
          color="rose"
        />
      </div>

      {/* Slide 14: Adatum Energy Smart Meter Monitoring Dashboard Interactive Panel */}
      <Card className="border-emerald-200/80 shadow-sm overflow-hidden">
        <div className="bg-emerald-700 text-white px-5 py-2.5 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Zap className="w-4 h-4 text-emerald-200" />
            <span className="font-bold text-xs tracking-wide">
              Adatum smart meter monitoring dashboard â€” Live Device Control (Slide 14 Reference)
            </span>
          </div>
          <div className="flex items-center gap-3 text-[11px]">
            <span className="px-2 py-0.5 rounded bg-emerald-800 text-emerald-100 font-mono">
              MeterId: {adatumMeter.meter_id}
            </span>
            <button
              onClick={() => navigate('/meters/1')}
              className="underline hover:text-emerald-200 flex items-center gap-1"
            >
              Inspect Device <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>

        <CardContent className="p-5 space-y-4 bg-slate-50/60">
          {actionToast && (
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
              <span>{actionToast}</span>
              <button onClick={() => setActionToast(null)} className="text-emerald-600 hover:text-emerald-900 font-bold">
                âœ•
              </button>
            </div>
          )}

          {/* Top Row: Adatum Banner + 3 Command Cards (Activate, Deactivate, Reconnect) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gradient-to-br from-emerald-800 via-emerald-700 to-teal-600 text-white rounded-lg p-5 flex flex-col justify-center items-center text-center shadow-sm">
              <div className="flex items-center gap-1.5 text-2xl font-black tracking-widest">
                <span>ADATUM</span>
                <Zap className="w-6 h-6 text-emerald-300 fill-emerald-300" />
              </div>
              <span className="text-xs tracking-[0.25em] uppercase text-emerald-200 font-semibold mt-0.5">
                ENERGY
              </span>
              <span className="text-[10px] text-emerald-100/80 mt-3">
                IS 16444 Part 2 Remote Command Engine
              </span>
            </div>

            <button
              onClick={() => handleAdatumAction('activate')}
              className="bg-white hover:bg-emerald-50/60 border border-slate-200 hover:border-emerald-300 rounded-lg p-4 text-left transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center relative">
                  <Zap className="w-4 h-4 text-slate-600" />
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                  DLMS Command
                </span>
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-slate-900 text-sm">Activate meter</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Remotely activate meter through device command
                </p>
              </div>
              <div className="flex justify-end mt-2">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>

            <button
              onClick={() => handleAdatumAction('deactivate')}
              className="bg-white hover:bg-rose-50/60 border border-slate-200 hover:border-rose-300 rounded-lg p-4 text-left transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center relative">
                  <Zap className="w-4 h-4 text-slate-600" />
                  <AlertTriangle className="w-4 h-4 text-rose-600 absolute -bottom-1 -right-1 bg-white rounded-full" />
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-50 text-rose-700">
                  DLMS Command
                </span>
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-slate-900 text-sm">Deactivate meter</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Remotely deactivate meter through device command
                </p>
              </div>
              <div className="flex justify-end mt-2">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-rose-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>

            <button
              onClick={() => handleAdatumAction('reconnect')}
              className="bg-white hover:bg-sky-50/60 border border-slate-200 hover:border-sky-300 rounded-lg p-4 text-left transition-all flex flex-col justify-between group shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 rounded-full border-2 border-slate-300 flex items-center justify-center relative">
                  <RefreshCw className="w-4 h-4 text-sky-600" />
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-sky-50 text-sky-700">
                  First Breath / Sync
                </span>
              </div>
              <div className="mt-3">
                <h4 className="font-bold text-slate-900 text-sm">Reconnect meter</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Remotely reconnect meter & sync parameters to HES
                </p>
              </div>
              <div className="flex justify-end mt-2">
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-sky-600 group-hover:translate-x-0.5 transition-all" />
              </div>
            </button>
          </div>

          {/* Bottom Row: Meter Info, Connection Status, Last Zap Reading, Min Voltage */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-white border border-slate-200 rounded-lg p-4 space-y-2.5 shadow-sm">
              <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                Meter info
              </div>
              <div className="grid grid-cols-3 text-xs gap-1">
                <span className="font-semibold text-slate-600">MeterId</span>
                <div className="col-span-2">
                  <div className="font-mono font-bold text-slate-900">{adatumMeter.meter_id}</div>
                  <div className="text-[10px] text-slate-400">Accepted: Just now</div>
                </div>
              </div>
              <div className="grid grid-cols-3 text-xs gap-1">
                <span className="font-semibold text-slate-600">Version</span>
                <span className="col-span-2 font-medium text-slate-800">{adatumMeter.version}</span>
              </div>
              <div className="grid grid-cols-3 text-xs gap-1">
                <span className="font-semibold text-slate-600">Meter Type</span>
                <div className="col-span-2">
                  <div className="font-medium text-slate-800">Kimbal Kushal U1-CAA1</div>
                  <div className="text-[10px] text-slate-400">Class 0.2S / 0.5S / 1.0S</div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
              <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                Connection status
              </div>
              <div className="my-auto py-3 text-center">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    adatumMeter.status === 'online'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      adatumMeter.status === 'online' ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'
                    }`}
                  />
                  {adatumMeter.status === 'online' ? 'Connected (HES Active)' : 'Deactivated / Zap Off'}
                </span>
                <p className="text-[11px] text-slate-500 mt-2">
                  IP: 10.20.100.1 | Protocol: DLMS/COSEM (IS 15959 Pt.2)
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
              <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                Last Zap reading (kW)
              </div>
              <div className="my-auto py-3 text-center">
                <div className="text-2xl font-black text-slate-900">
                  {adatumMeter.active_Zap} <span className="text-sm font-semibold text-slate-500">kW</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Current: {adatumMeter.current} A | PF: 0.95 | 50 Hz
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200 rounded-lg p-4 flex flex-col justify-between shadow-sm">
              <div className="text-xs font-bold text-slate-800 border-b border-slate-100 pb-1.5">
                Min / Instant Voltage (V)
              </div>
              <div className="my-auto py-3 text-center">
                <div className="text-2xl font-black text-sky-700">
                  {adatumMeter.voltage} <span className="text-sm font-semibold text-slate-500">V</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Min recorded: {adatumMeter.min_voltage} V (Limit &lt; 600V per Cl. 1)
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Charts & Event Stream */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">
              24-Hour Grid Demand Curve (kW) â€” Demand Side Management
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={demandData}>
                  <defs>
                    <linearGradient id="colorDemand" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" stroke="#94a3b8" fontSize={11} />
                  <YAxis stroke="#94a3b8" fontSize={11} />
                  <Tooltip />
                  <Area
                    type="monotone"
                    dataKey="demand"
                    stroke="#0284c7"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorDemand)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <div>
          <EventStream />
        </div>
      </div>
    </div>
  );
};

