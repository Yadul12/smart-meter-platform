import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import {
  Wifi, Send, CheckCircle2, MapPin, Cpu, Layers,
  Server, Sliders, RefreshCw
} from 'lucide-react';
import api from '@/services/api';

export const NetworkTestsPage: React.FC = () => {
  const [meterId, setMeterId] = useState('1');
  const [distanceM, setDistanceM] = useState<number>(6);
  const [pingResult, setPingResult] = useState<any | null>(null);
  const [testLogs, setTestLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeWorkflowStep, setActiveWorkflowStep] = useState<number>(6);
  const [workflowToast, setWorkflowToast] = useState<string | null>(null);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/network-tests/tests');
      setTestLogs(res.data.items || []);
    } catch (err) {
      console.error('Failed to load network test history', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleRunCertificationTest = async (dist?: number) => {
    const targetDist = dist || distanceM;
    setDistanceM(targetDist);
    try {
      setLoading(true);
      const res = await api.post('/network-tests/ping', {
        meter_id: Number(meterId),
        distance_m: targetDist,
      });
      setPingResult(res.data);
      fetchHistory();
    } catch {
      setPingResult({ status: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const fieldEngineeringSteps = [
    {
      step: 1,
      title: 'Engineer to remove old meter after taking readings',
      desc: 'Final cumulative kWh / kVArh reading captured and old electromechanical/static meter decommissioned.',
      icon: Sliders,
    },
    {
      step: 2,
      title: 'Install smart meter',
      desc: 'Mount AC Static Transformer-Operated Smart Meter (Class 0.2S / 0.5S / 1.0S) with NIC & Terminal Cover seals.',
      icon: CheckCircle2,
    },
    {
      step: 3,
      title: 'Feeding of meter data in Consumer Indexing APP',
      desc: 'Scan QR / Serial Number (Kimbal Kushal U1-CAA1) and map Consumer ID in mobile Consumer Indexing App.',
      icon: Cpu,
    },
    {
      step: 4,
      title: 'Jio location update, assign UI based IP',
      desc: 'Capture GPS coordinates via Jio cellular network & assign static IPv6 / UI-based IP (10.20.100.x).',
      icon: MapPin,
    },
    {
      step: 5,
      title: 'Then they will pull the IP wise data from meter into HES via Consumer Portal',
      desc: 'Execute IP-based DLMS/COSEM (IS 15959 Pt.2) interrogation from Head-End System via Consumer Portal.',
      icon: Server,
    },
    {
      step: 6,
      title: 'Then updating of data from HES to MDMS',
      desc: 'Stream validated interval readings from HES to MDMS VEE engine for ToU billing & collection reports.',
      icon: Layers,
    },
  ];

  const handleSimulateFieldWorkflow = () => {
    setActiveWorkflowStep(1);
    setWorkflowToast('Running 6-Step Field Engineering & Consumer Indexing Commissioning...');
    let step = 1;
    const timer = setInterval(() => {
      step += 1;
      if (step <= 6) {
        setActiveWorkflowStep(step);
      } else {
        clearInterval(timer);
        setWorkflowToast(
          'Completed all 6 Field Engineering steps: Old meter removed â†’ Smart Meter installed â†’ Indexed in App â†’ Jio GPS & UI IP assigned â†’ Pulled into HES â†’ Synced to MDMS!'
        );
      }
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px] uppercase">
              IS 16444 PART 2 : 2017 â€” Clause 1
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Vardhman Airport Solutions Ltd. | Smart Infrastructure Division
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Cellular Certification (4-6-10m Network Testing) & Field Engineering
          </h2>
        </div>
        <Button variant="outline" size="sm" onClick={fetchHistory} className="gap-1.5 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh Logs
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Scope of Cellular Certification (4-6-10m Network Testing) */}
        <Card className="border-t-4 border-t-sky-500">
          <CardHeader className="pb-3 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-sky-500" />
              Scope of Cellular Certification (4-6-10-Meters Network Testing)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-5 space-y-4">
            <div className="p-3.5 bg-sky-50/70 border border-sky-200 rounded-xl text-xs text-slate-700 leading-relaxed flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-sky-600 flex-shrink-0 mt-0.5" />
              <span>
                <strong>4-6-10-meters network testing</strong> for checking of power parameters, billing update, checking of disconnection facility in the event of negative charge with sending of ESend to consumer, billing, collection report etc.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Smart Meter ID
                </label>
                <input
                  type="number"
                  value={meterId}
                  onChange={(e) => setMeterId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-lg text-xs font-semibold"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Certification Test Distance
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[4, 6, 10].map((d) => (
                    <button
                      key={d}
                      onClick={() => handleRunCertificationTest(d)}
                      className={`py-2 rounded-lg text-xs font-bold border transition-all ${
                        distanceM === d
                          ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      {d} Meters
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <Button
              onClick={() => handleRunCertificationTest(distanceM)}
              disabled={loading}
              className="w-full text-xs gap-2 bg-sky-600 hover:bg-sky-700 text-white"
            >
              <Send className="w-3.5 h-3.5" />
              {loading
                ? `Executing ${distanceM}m Cellular Certification Test...`
                : `Run ${distanceM}-Meter Cellular Certification & Negative Charge Test`}
            </Button>

            {pingResult && pingResult.status === 'success' && (
              <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200 space-y-2.5 text-xs">
                <div className="font-bold text-emerald-900 flex items-center justify-between border-b border-emerald-200/70 pb-1.5">
                  <span>{pingResult.distance_m}m Cellular Network Certification Result</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-600 text-white text-[10px]">CERTIFIED PASS</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Round-Trip Latency / RSSI:</span>
                  <span className="font-bold text-slate-900">
                    {pingResult.latency_ms} ms | {pingResult.rssi} dBm (0% Loss)
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Power Parameters Check:</span>
                  <span className="font-bold text-emerald-700">{pingResult.power_params}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Billing & Collection Report:</span>
                  <span className="font-bold text-slate-900">{pingResult.billing_update}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-600">Negative Charge Disconnection Check:</span>
                  <span className="font-bold text-rose-700">{pingResult.negative_charge_disconnect}</span>
                </div>
                <div className="flex justify-between items-center pt-1 border-t border-emerald-200/60">
                  <span className="text-slate-600 flex items-center gap-1">
                    <Send className="w-3.5 h-3.5 text-sky-600" /> Consumer ESend Notification:
                  </span>
                  <span className="font-mono font-semibold text-sky-800">{pingResult.eSend_sent}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Right Column: 6-Step Field Engineering Workflow */}
        <Card className="border-t-4 border-t-indigo-500">
          <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-indigo-600" />
              Field Engineering â€” 6-Step Commissioning Flow
            </CardTitle>
            <Button
              size="sm"
              variant="outline"
              onClick={handleSimulateFieldWorkflow}
              className="h-7 text-[11px] border-indigo-200 text-indigo-700 hover:bg-indigo-50"
            >
              Simulate Commissioning
            </Button>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5">
            {workflowToast && (
              <div className="p-2.5 rounded-lg bg-indigo-50 border border-indigo-200 text-indigo-900 text-xs font-semibold">
                {workflowToast}
              </div>
            )}
            {fieldEngineeringSteps.map((s) => {
              const Icon = s.icon;
              const isDone = s.step <= activeWorkflowStep;
              return (
                <div
                  key={s.step}
                  className={`p-3 rounded-xl border transition-all flex items-start gap-3 ${
                    isDone
                      ? 'bg-white border-sky-200 shadow-sm'
                      : 'bg-slate-50 border-slate-200 opacity-60'
                  }`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold ${
                      isDone ? 'bg-sky-500 text-white' : 'bg-slate-200 text-slate-600'
                    }`}
                  >
                    {s.step}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-xs text-slate-900">{s.title}</h4>
                      <Icon className={`w-4 h-4 flex-shrink-0 ${isDone ? 'text-sky-500' : 'text-slate-400'}`} />
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Recent 4m / 6m / 10m Cellular Certification Test Logs */}
      <Card>
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-800">
            Recent 4-6-10m Cellular Certification & Network Test Logs
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold">
              <tr>
                <th className="p-3 pl-4">Test Type</th>
                <th className="p-3">Meter ID</th>
                <th className="p-3">Latency</th>
                <th className="p-3">RSSI Signal</th>
                <th className="p-3">Verification Details</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {testLogs.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50">
                  <td className="p-3 pl-4 font-mono font-bold text-sky-700">{t.test_type}</td>
                  <td className="p-3 font-semibold">MTR-#{t.meter_id}</td>
                  <td className="p-3 font-bold text-emerald-700">{t.latency_ms} ms</td>
                  <td className="p-3 font-mono">{t.rssi} dBm</td>
                  <td className="p-3 text-slate-600">{t.details}</td>
                  <td className="p-3"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};

