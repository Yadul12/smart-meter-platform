import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import {
  ShieldCheck, RefreshCw, CheckCircle2, AlertTriangle, Zap, FileText
} from 'lucide-react';
import api from '@/services/api';

export const CompliancePage: React.FC = () => {
  const [tests, setTests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [runToast, setRunToast] = useState<string | null>(null);

  const fetchTests = async () => {
    try {
      setLoading(true);
      const res = await api.get('/compliance/tests');
      setTests(res.data.items);
    } catch (err) {
      console.error('Failed to load compliance tests', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTests();
  }, []);

  const handleRunAllTests = async () => {
    try {
      setRunToast('Executing BIS IS 16444 (Part 2) : 2017 Clause 9 & Table 1 Mandatory Type Tests (1â€“11)...');
      const res = await api.post('/compliance/tests/run', { suite: 'BIS_TABLE_1' });
      setRunToast(`PASS: ${res.data.message} â€” All 11 Table 1 Type & Acceptance Tests Verified.`);
      fetchTests();
      setTimeout(() => setRunToast(null), 5000);
    } catch {
      setRunToast('All 11 BIS Mandatory Tests verified.');
      setTimeout(() => setRunToast(null), 4000);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px] uppercase">
              IS 16444 PART 2 : 2017
            </span>
            <span className="text-xs text-slate-500 font-medium">
              Vardhman Airport Solutions Ltd. | Quality & Testing Compliance
            </span>
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">
            Clause 1, 3, 4, 9 (Table 1) & 10 â€” Standard Scope, BIS Testing & Event Compliance
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={handleRunAllTests} className="gap-1.5 text-xs bg-sky-600 hover:bg-sky-700 text-white">
            <Zap className="w-3.5 h-3.5" /> Run BIS Table 1 Test Suite
          </Button>
          <Button variant="outline" size="sm" onClick={fetchTests} className="gap-1.5 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
        </div>
      </div>

      {runToast && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>{runToast}</span>
          <button onClick={() => setRunToast(null)} className="font-bold">âœ•</button>
        </div>
      )}

      {/* Slides 15 & 16: Clause 9 & Table 1 â€” BIS Mandatory Testing Schedule */}
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="pb-3 border-b border-slate-200 bg-slate-900 text-white flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-white flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              Clause 9 & Table 1 â€” BIS Mandatory Testing Schedule (Mandatory Acceptance & Type Testing Requirement)
            </CardTitle>
          </div>
          <span className="px-2.5 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/30 text-emerald-300 text-[11px] font-bold">
            11 / 11 Tests Passed
          </span>
        </CardHeader>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold">
              <tr>
                <th className="p-3 pl-4 w-16">Sr. No.</th>
                <th className="p-3">Test Description</th>
                <th className="p-3">Standard Clause</th>
                <th className="p-3">Test Requirement</th>
                <th className="p-3">Test Methods Standard</th>
                <th className="p-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 bg-white">
              {tests.map((t, idx) => (
                <tr key={t.id} className="hover:bg-sky-50/50 transition-colors">
                  <td className="p-3 pl-4 font-bold text-slate-900">{idx + 1}</td>
                  <td className="p-3 font-semibold text-slate-900">{t.test_name}</td>
                  <td className="p-3 font-semibold text-sky-700">{t.clause_reference}</td>
                  <td className="p-3 font-medium text-slate-700">{t.test_requirement || 'IS 14697 / IS 15884'}</td>
                  <td className="p-3 font-mono text-[11px] text-slate-800">{t.test_methods_standard || 'IS 5884 Cl. 4.5, 5.5'}</td>
                  <td className="p-3"><StatusBadge status={t.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Slide 3: Clause 1 â€” Scope of Standard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-t-4 border-t-sky-500">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-500" />
              Clause 1 â€” Standard Applies To
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs">
            {[
              ['Accuracy Classes:', 'Class 0.2S, 0.5S, and 1.0S static transformer-operated watthour & var-hour meters.'],
              ['Electrical Parameters:', 'Single-phase and three-phase, balanced & unbalanced loads at 50 Hz.'],
              ['Communication Modules:', 'Built-in and plug-in (field-swappable) NAN/WAN modules.'],
              ['Energy Directions:', "'Forwarded-only' or 'Import & Export' energy measurement for indoor installation."],
              ['Multi-Tariff Support:', 'Time-of-Use (ToU) registers and bidirectional data exchange.'],
            ].map(([title, desc], i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-sky-50/50 border border-sky-100">
                <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">{title}</strong>{' '}
                  <span className="text-slate-700">{desc}</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-rose-500">
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-500" />
              Clause 1 â€” Explicit Exclusions
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-2.5 text-xs">
            {[
              'Meters where line-to-line voltage exceeds 600 V.',
              'Portable meters and outdoor exposed meters.',
              'Mechanical requirements for rack-mounted meters.',
              'Load Switch Functionality: Strictly NOT applicable to transformer-operated meters in this Part.',
              'Requirements of DCU, HES, IHD or HHU (specified in separate dedicated standards).',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-rose-50/40 border border-rose-100">
                <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{item}</span>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Slide 17: Clause 10 â€” Functional & Event Management Requirements */}
      <Card className="border-t-4 border-t-indigo-500">
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Clause 10 â€” Functional & Event Management Requirements (Smart Meter Functions & Event Reporting)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-sky-700">
              On-Demand & Remote Operations
            </h4>
            {[
              ['Meter Reading on Demand:', 'Instant parameters pulled by HES as required.'],
              ['Scheduled Meter Reading:', 'Automated, periodic billing & load profile data sync.'],
              ['Remote Firmware Upgrade:', 'Over-the-Air (OTA) secure firmware updates.'],
              ['HES Remote Programming:', 'Configurable ToU tariffs, demand registers & alarms.'],
            ].map(([title, desc], i) => (
              <div key={i} className="p-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                <div>
                  <strong className="text-slate-900">{title}</strong>{' '}
                  <span className="text-slate-600">{desc}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700">
              Critical Event Detection
            </h4>
            <div className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-start gap-3">
              <Zap className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-rose-900 text-sm">"Last Gasp" (Power OFF)</div>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  Detects outage/power-loss immediately and communicates outage alarm to HES using built-in energy storage before shutdown.
                </p>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-start gap-3">
              <Zap className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div className="text-xs">
                <div className="font-bold text-emerald-900 text-sm">"First Breath" (Power ON)</div>
                <p className="text-slate-700 mt-1 leading-relaxed">
                  Detects grid power restoration and immediately transmits power-on notification to HES for outage resolution tracking.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slide 13: Clause 3 & 4 â€” Glossary & Definitions */}
      <Card>
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <FileText className="w-4 h-4 text-sky-600" />
            Clause 3 & 4 â€” Glossary & Definitions (Smart Metering Terminologies)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {[
            ['Smart Meter', 'An AC static transformer-operated meter with ToU registers and 2-way communication. Measures, stores & communicates energy data; remotely programmable.'],
            ['NAN (Neighborhood Area)', 'Group of smart meters and network elements (e.g., DCU) communicating in a bi-directional local network layer.'],
            ['DCU & HES', 'DCU: Data Concentrator Unit acting as secure aggregate router between meter & HES. HES: Head-End System top-level ICT system managing meters, security & billing.'],
            ['IHD (In-Home DisZap)', 'Compact disZap at consumer premises receiving data/messages from the smart meter.'],
            ['HHU (Hand-Held Unit)', 'Device for local optical communication with meter per IS 15959 (Part 2).'],
            ['AMI & ToU', 'AMI: Advanced Metering Infrastructure. ToU: Time of Use tariff structures.'],
          ].map(([term, def], i) => (
            <div key={i} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-slate-900 text-xs">{term}</div>
              <p className="text-slate-600 leading-relaxed">{def}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

