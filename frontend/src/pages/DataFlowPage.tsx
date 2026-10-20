import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import {
  Gauge, Radio, Server, Layers, LayoutDashboard, ArrowRight,
  Cpu, Wifi, Zap, ShieldCheck, CheckCircle2
} from 'lucide-react';

export const DataFlowPage: React.FC = () => {
  const [selectedVariant, setSelectedVariant] = useState<'v1' | 'v2'>('v1');

  const softwareModules = [
    {
      name: 'DCU (Data Concentrator Unit)',
      duration: '6 Months',
      overview:
        'Development of an industrial edge gateway deployed on field poles to aggregate data from smart meters over RF Mesh/PLC (NAN) and route it securely to the central Head-End System (HES) over WAN networks.',
      features: [
        'Local data aggregation, buffering, and storage',
        'Protocol conversion (RF/PLC to Cellular/4G/5G)',
        'Over-The-Air (OTA) firmware upgrade management',
        'Real-time local tamper detection & Power Outage (Last Gasp) alert handling',
      ],
      tech: 'C/C++, Embedded Linux, STM32 / ARM Cortex-M4, DLMS/COSEM, Modbus, Cellular (4G/LTE-M), Sub-1GHz RF Mesh',
    },
    {
      name: 'HES (Head-End System)',
      duration: '8 Months',
      overview:
        'A high-performance central communication engine responsible for direct multi-protocol interaction with millions of smart meters and DCUs in the field, enabling scheduled polling, configuration, and security key management.',
      features: [
        'Automated meter scheduled reading & on-demand polling',
        'Remote connect/disconnect load switch control',
        'PKI security key management & device authentication',
        'Real-time event/alarm monitoring and broadcast commands',
      ],
      tech: 'Java / Spring Boot, Python, C++, DLMS/COSEM, MQTT, RabbitMQ / Apache Kafka, PostgreSQL / TimescaleDB',
    },
    {
      name: 'Cloud Server & Security Infrastructure',
      duration: '4 Months',
      overview:
        'A secure, scalable cloud backend setup designed to host HES, MDMS, and database clusters with high availability, firewall protections, load balancing, and geographic mapping integration.',
      features: [
        'Enterprise Firewall & DDoS Protection setup',
        'High-availability Database Clustering (Time-series optimization)',
        'Integration with GIS (Geographic Information System)',
        'Auto-scaling server nodes for peak load management',
      ],
      tech: 'AWS / Azure, Docker, Kubernetes, NGINX, PostgreSQL, TimescaleDB, GIS, Linux (Ubuntu/RHEL)',
    },
    {
      name: 'MDMS (Meter Data Management System)',
      duration: '7 Months',
      overview:
        'An enterprise software suite that validates, edits, and processes raw time-series consumption data received from HES before making it actionable for utility billing, demand estimation, and customer management.',
      features: [
        'VEE Engine (Validation, Editing, and Estimation)',
        'Consumption pattern analysis & load profiling',
        'Billing system integration & Tariff Engine (TOU/TOD)',
        'Outage & loss identification algorithms',
      ],
      tech: 'Java Enterprise, Node.js, Python Data Analytics, PostgreSQL, Oracle, RESTful APIs',
    },
    {
      name: 'Web Dashboard (Network Operation Centre Portal)',
      duration: '5 Months',
      overview:
        'A centralized web portal providing real-time graphical monitoring, GIS grid visualizers, analytics, and manual command centers for system administrators and NOC engineers.',
      features: [
        'Live visual map of active meters, DCUs, and outages',
        'Demand Side Management & Outage Side Management dashboards',
        'Manual command execution panel (Disconnect/Reconnect)',
        'Detailed reporting on energy audit, billing, and system logs',
      ],
      tech: 'React.js / Angular, TypeScript, Chart.js / D3.js, Leaflet / OpenLayers (GIS), REST APIs, WebSockets',
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="px-2 py-0.5 rounded bg-sky-100 text-sky-800 font-bold text-[10px] uppercase">
            IS 16444 PART 2 : 2017 — Clause 5.1 & 5.2
          </span>
          <span className="text-xs text-slate-500 font-medium">
            Vardhman Airport Solutions Ltd. | Smart Infrastructure Division
          </span>
        </div>
        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Smart Meter Anatomy, Functional Zones, Topology Variants & Software Architecture
        </h2>
      </div>

      {/* Slide 11: Clause 5.1 — Four Functional Zones */}
      <Card>
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Clause 5.1 — Four Functional Zones (Smart Meter Sections A, B, C, D)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              sec: 'Section A',
              title: 'Metering / Metrology',
              desc: 'Metrology elements measuring active & reactive energy per meter accuracy class (0.2S / 0.5S / 1.0S).',
              active: true,
            },
            {
              sec: 'Section B',
              title: 'Load Switch',
              desc: 'Not Applicable in Part 2 for transformer-operated smart meters due to heavy industrial currents.',
              active: false,
            },
            {
              sec: 'Section C',
              title: 'Data Exchange',
              desc: 'Governs metering data structure and protocol exchanges (DLMS/COSEM via IS 15959 standard).',
              active: true,
            },
            {
              sec: 'Section D',
              title: 'Comm Modules',
              desc: 'NAN, WAN and optional IHD modules — built-in or field-swappable plug-in sealed units.',
              active: true,
            },
          ].map((z, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${
                z.active
                  ? 'bg-sky-50/50 border-t-4 border-t-sky-500 border-slate-200'
                  : 'bg-slate-100 border-t-4 border-t-slate-400 border-slate-300'
              }`}
            >
              <span
                className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                  z.active ? 'bg-sky-500 text-white' : 'bg-slate-500 text-white'
                }`}
              >
                {z.sec}
              </span>
              <h3 className="font-bold text-sm text-slate-900 mt-2">{z.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{z.desc}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Slides 5, 6, 12: Clause 5.2 — System Topology Variants & Operating Frequencies */}
      <Card>
        <CardHeader className="pb-2 border-b border-slate-100 flex flex-row items-center justify-between">
          <CardTitle className="text-sm font-bold text-slate-900">
            Clause 5.2 — System Topology Variants (C1, C2, C3) & Operating Frequencies
          </CardTitle>
          <div className="flex gap-2">
            <button
              onClick={() => setSelectedVariant('v1')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedVariant === 'v1'
                  ? 'bg-sky-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Variant 1: NAN via DCU (C1/C2)
            </button>
            <button
              onClick={() => setSelectedVariant('v2')}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                selectedVariant === 'v2'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              Variant 2: Direct WAN to HES (C3)
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-5 space-y-5">
          {selectedVariant === 'v1' ? (
            <div className="p-5 rounded-xl bg-sky-50/50 border border-sky-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Architecture — Variant 1: NAN via DCU Gateway (Connectivity C1 & C2)
                </h3>
                <span className="font-mono text-xs font-bold text-sky-800 bg-white px-3 py-1 rounded border border-sky-200">
                  Path: Smart Meter → NAN (RF/PLC) → DCU → WAN (Cellular/OFC) → HES
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="bg-white border-2 border-sky-600 rounded-xl p-4 flex-1 w-full">
                  <div className="text-xs font-bold text-sky-700 mb-2">SMART METER (Sections A, C, D)</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-sky-50 rounded border border-sky-200 font-semibold">A: Metrology</div>
                    <div className="p-2 bg-sky-50 rounded border border-sky-200 font-semibold">C: Data Exchange</div>
                    <div className="p-2 bg-sky-100 rounded border border-sky-300 font-bold">D: NAN Module + IHD</div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 flex justify-between">
                    <span>Optical Port: Local HHU access (IS 15959 Pt.2)</span>
                    <span className="font-semibold text-sky-700">C1 → IHD (Optional)</span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-xs font-bold text-sky-700">
                  <span>Connectivity C2</span>
                  <ArrowRight className="w-5 h-5" />
                  <span className="text-[10px] text-slate-500">LoRa/RF, PLC, Wi-Fi</span>
                </div>
                <div className="bg-indigo-50 border-2 border-indigo-600 rounded-xl p-4 text-center w-full md:w-48">
                  <div className="font-bold text-sm text-indigo-900">DCU / Network Element</div>
                  <div className="text-[11px] text-indigo-700">Bridges NAN to WAN</div>
                </div>
                <ArrowRight className="w-5 h-5 text-indigo-600" />
                <div className="bg-emerald-50 border-2 border-emerald-600 rounded-xl p-4 text-center w-full md:w-40">
                  <div className="font-bold text-sm text-emerald-900">HES</div>
                  <div className="text-[11px] text-emerald-700">Head-End System</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-5 rounded-xl bg-emerald-50/50 border border-emerald-200 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="font-bold text-sm text-slate-900">
                  Architecture — Variant 2: Direct WAN to HES (Connectivity C1 & C3)
                </h3>
                <span className="font-mono text-xs font-bold text-emerald-800 bg-white px-3 py-1 rounded border border-emerald-200">
                  Path: Smart Meter → WAN Module (SIM / Cellular / OFC) → Direct Carrier → HES
                </span>
              </div>
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="bg-white border-2 border-emerald-600 rounded-xl p-4 flex-1 w-full">
                  <div className="text-xs font-bold text-emerald-700 mb-2">SMART METER (Sections A, C, D)</div>
                  <div className="grid grid-cols-3 gap-2 text-center text-xs">
                    <div className="p-2 bg-slate-50 rounded border border-slate-200 font-semibold">A: Metrology</div>
                    <div className="p-2 bg-slate-50 rounded border border-slate-200 font-semibold">C: Data Exchange</div>
                    <div className="p-2 bg-emerald-100 rounded border border-emerald-300 font-bold">D: WAN Module + IHD</div>
                  </div>
                  <div className="text-[11px] text-slate-500 mt-2 flex justify-between">
                    <span>Optical Port: Local HHU access (IS 15959 Pt.2)</span>
                    <span className="font-semibold text-emerald-700">C1 → IHD (Optional)</span>
                  </div>
                </div>
                <div className="flex flex-col items-center text-xs font-bold text-emerald-700">
                  <span>Connectivity C3 (Direct)</span>
                  <ArrowRight className="w-6 h-6" />
                  <span className="text-[10px] text-slate-500">Cellular 2G/3G/4G/NB-IoT or OFC</span>
                </div>
                <div className="bg-emerald-100 border-2 border-emerald-600 rounded-xl p-5 text-center w-full md:w-56">
                  <div className="font-bold text-base text-emerald-950">HES (Direct)</div>
                  <div className="text-xs text-emerald-800">No DCU Required</div>
                </div>
              </div>
            </div>
          )}

          {/* Operating Frequencies & Comm Technologies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-xs text-sky-700 flex items-center gap-1.5">
                <Radio className="w-4 h-4" /> RF Sub-GHz Band (NAN)
              </div>
              <p className="text-xs text-slate-700">
                <strong>Frequency:</strong> 865 - 868 MHz (Sub-GHz Mesh / LoRaWAN) & 2.4 GHz.
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Regulations:</strong> WPC (Wireless Planning & Co-ordination) license-exempt bands per NFAP & DoT ETA approvals.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-xs text-indigo-700 flex items-center gap-1.5">
                <Zap className="w-4 h-4" /> Power Line Comm (PLC)
              </div>
              <p className="text-xs text-slate-700">
                <strong>Frequency:</strong> 3 kHz - 148.5 kHz (CENELEC A/B/C/D bands).
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Standards:</strong> IEEE 1901, IEEE 1901.2, ITU-T G.9901 / G.9903 / G.9904 over existing LV power lines.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
              <div className="font-bold text-xs text-emerald-700 flex items-center gap-1.5">
                <Wifi className="w-4 h-4" /> Cellular & WAN Bands
              </div>
              <p className="text-xs text-slate-700">
                <strong>Frequency:</strong> 2G/3G/4G LTE & NB-IoT carrier bands (700/850/900/1800/2100 MHz).
              </p>
              <p className="text-[11px] text-slate-500">
                <strong>Optical Backhaul:</strong> High-speed IPv6 Optical Fibre for central substations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Slide 4 & Slide 7 Side-by-Side Visual Diagrams */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900">
              Parts of Smart Meter (Kimbal Kushal U1-CAA1 Hardware Anatomy)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="bg-gradient-to-b from-slate-900 to-sky-900 rounded-xl p-3 flex justify-center">
              <img
                src="/assets/pptx/image10.png"
                alt="Parts of Smart Meter"
                className="max-h-64 w-auto object-contain rounded"
              />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-[11px]">
              {[
                'NIC Cover Sealing Screw',
                'RF / Cellular Module',
                'NIC Cover',
                'Output LED (imp/kWh)',
                'Display (Backlit LCD)',
                'Push Button (Scroll)',
                'Optical Port (IS 15959)',
                'Terminal Cover',
                'Terminal Sealing Screw',
              ].map((part, idx) => (
                <div key={idx} className="p-2 rounded bg-slate-50 border border-slate-200 font-semibold text-slate-800">
                  • {part}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-bold text-slate-900">
              End-to-End Smart Metering System Architecture (HAN → NAN → WAN → NOC)
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3">
            <div className="bg-white border border-slate-200 rounded-xl p-2 flex justify-center">
              <img
                src="/assets/pptx/image12.png"
                alt="End-to-End Smart Metering System Architecture"
                className="max-h-64 w-auto object-contain"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div className="p-2 rounded bg-sky-50 border border-sky-200">
                <strong className="text-sky-900">Field Layers:</strong> HAN (PLC) → NAN (Local Concentrator) → WAN (Global Concentrator)
              </div>
              <div className="p-2 rounded bg-emerald-50 border border-emerald-200">
                <strong className="text-emerald-900">Central NOC:</strong> Firewall → DB Cluster & GIS → HES & MDMS (DSM, Outage, Billing, Planning)
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Slides 8, 9, 10: Technical Overview of parts of Software development */}
      <Card>
        <CardHeader className="pb-2 border-b border-slate-100">
          <CardTitle className="text-sm font-bold text-slate-900">
            Technical Overview of Parts of Software Development (DCU, HES, Cloud, MDMS & NOC Web Dashboard)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {softwareModules.map((mod, i) => (
            <div key={i} className="border border-slate-200 rounded-xl overflow-hidden bg-white flex flex-col justify-between shadow-sm">
              <div>
                <div className="bg-slate-900 text-white px-4 py-2.5 flex items-center justify-between">
                  <span className="font-bold text-xs">{mod.name}</span>
                  <span className="px-2 py-0.5 rounded bg-sky-500 text-white text-[10px] font-bold">
                    {mod.duration}
                  </span>
                </div>
                <div className="p-4 space-y-2.5 text-xs">
                  <p className="text-slate-600 leading-relaxed">{mod.overview}</p>
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Key Features:</span>
                    <ul className="space-y-1 text-slate-600">
                      {mod.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-sky-500 flex-shrink-0 mt-0.5" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
              <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px]">
                <strong className="text-slate-900">Technology: </strong>
                <span className="text-sky-700 font-semibold">{mod.tech}</span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};
