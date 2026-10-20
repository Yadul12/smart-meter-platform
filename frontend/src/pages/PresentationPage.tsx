import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  ArrowLeft, ArrowRight, Layers, CheckCircle2,
  AlertTriangle, Radio, Cpu, ShieldCheck, Zap, Wifi, Server,
  LayoutDashboard, Gauge
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const PresentationPage: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const navigate = useNavigate();

  const totalSlides = 15;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % totalSlides);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);

  const SlideHeader: React.FC<{ subtitle: string; rightTitle: string }> = ({ subtitle, rightTitle }) => (
    <div className="border-b border-slate-200 pb-3 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
      <div className="flex items-center gap-3">
        <div className="px-2.5 py-1 bg-slate-950 text-white font-bold text-xs tracking-wider rounded">
          VARDHMAN AIRPORT SOLUTIONS
        </div>
        <span className="text-xs font-medium text-slate-500">
          Vardhman Airport Solutions Ltd. | {subtitle}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs font-semibold text-slate-600">{rightTitle}</span>
        <span className="px-2.5 py-0.5 rounded-full bg-sky-50 border border-sky-200 text-sky-700 font-bold text-[11px]">
          IS 16444 PART 2 : 2017
        </span>
      </div>
    </div>
  );

  const renderSlide = (idx: number) => {
    switch (idx) {
      case 0:
        return (
          <div className="flex flex-col justify-between h-full bg-gradient-to-br from-slate-950 via-slate-900 to-sky-950 text-white rounded-xl p-8 md:p-12 relative overflow-hidden">
            <div className="flex items-center justify-between z-10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-sky-500 flex items-center justify-center font-black text-white shadow-lg">
                  VAS
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-wide">Vardhman Airport Solutions Ltd.</h3>
                  <p className="text-xs text-sky-300">Smart Infrastructure Division</p>
                </div>
              </div>
              <span className="px-3 py-1 rounded-full bg-sky-500/20 border border-sky-400/30 text-sky-300 text-xs font-bold">
                Standard & Specification IS 16444 (Pt 2) : 2017
              </span>
            </div>

            <div className="my-auto py-8 z-10 max-w-3xl space-y-4">
              <div className="inline-block px-3 py-1 rounded bg-sky-500 text-white text-xs font-bold uppercase tracking-wider">
                BIS Indian Standard Specification
              </div>
              <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">
                Smart Meter Architecture
              </h1>
              <p className="text-lg md:text-xl text-sky-200 font-medium">
                AC Static Transformer Operated Watthour & Var-hour Smart Meters (Class 0.2S, 0.5S & 1.0S)
              </p>
              <div className="pt-4 border-t border-white/15">
                <p className="text-sm text-slate-300">
                  <strong className="text-white">Focus Areas:</strong> Communication Protocols, Frequencies, Flow Architecture & Mandatory BIS Tests
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-white/10 text-xs text-slate-400 z-10">
              <span>IS 16444 (Part 2) : 2017 | IS 15959 (DLMS/COSEM)</span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => navigate('/')} className="bg-sky-500 hover:bg-sky-600 text-white text-xs gap-1.5">
                  Open Live NOC Portal <ArrowRight className="w-3.5 h-3.5" />
                </Button>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Clause 1 â€” Scope of Standard" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Standard Scope & Field Engineering</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="bg-sky-50/60 border-t-4 border-t-sky-500 border border-slate-200 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Scope of Cellular Certification</h3>
                </div>
                <div className="p-4 bg-white rounded-lg border border-slate-200 flex gap-3 items-start shadow-sm">
                  <CheckCircle2 className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700 leading-relaxed">
                    <strong>4-6-10-meters network testing</strong> for checking of power parameters, billing update, checking of disconnection facility in the event of negative charge with sending of Email to consumer, billing, collection report etc.
                  </p>
                </div>
                <div className="pt-2">
                  <Button size="sm" variant="outline" onClick={() => navigate('/network-tests')} className="text-xs gap-1.5">
                    Launch 4-6-10m Network Test Bench <ArrowRight className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>

              <div className="bg-sky-50/60 border-t-4 border-t-sky-500 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Field Engineering Workflow</h3>
                </div>
                <div className="space-y-2">
                  {[
                    'Engineer to remove old meter after taking readings',
                    'Install smart meter',
                    'Feeding of meter data in Consumer Indexing APP',
                    'Jio location update, assign UI based IP',
                    'Then they will pull the IP wise data from meter into HES via Consumer Portal',
                    'Then updating of data from HES to MDMS',
                  ].map((step, i) => (
                    <div key={i} className="flex items-center gap-3 p-2.5 bg-white rounded-lg border border-slate-200 text-xs font-medium text-slate-800">
                      <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                      <span>{step}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Clause 1 â€” Scope of Standard" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Standard Scope & Technical Application</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="bg-sky-50/50 border-t-4 border-t-sky-500 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Standard Applies To</h3>
                </div>
                {[
                  { label: 'Accuracy Classes:', text: 'Class 0.2S, 0.5S, and 1.0S static transformer-operated watthour & var-hour meters.' },
                  { label: 'Electrical Parameters:', text: 'Single-phase and three-phase, balanced & unbalanced loads at 50 Hz.' },
                  { label: 'Communication Modules:', text: 'Built-in and plug-in (field-swappable) NAN/WAN modules.' },
                  { label: 'Energy Directions:', text: "'Forwarded-only' or 'Import & Export' energy measurement for indoor installation." },
                  { label: 'Multi-Tariff Support:', text: 'Time-of-Use (ToU) registers and bidirectional data exchange.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span><strong className="text-slate-900">{item.label}</strong> {item.text}</span>
                  </div>
                ))}
              </div>

              <div className="bg-rose-50/40 border-t-4 border-t-rose-500 border border-slate-200 rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-rose-500 text-white flex items-center justify-center">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-slate-900 text-base">Explicit Exclusions</h3>
                </div>
                {[
                  'Meters where line-to-line voltage exceeds 600 V.',
                  'Portable meters and outdoor exposed meters.',
                  'Mechanical requirements for rack-mounted meters.',
                  'Load Switch Functionality: Strictly NOT applicable to transformer-operated meters in this Part.',
                  'Requirements of DCU, HES, IHD or HHU (specified in separate dedicated standards).',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2.5 p-2.5 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                    <AlertTriangle className="w-4 h-4 text-rose-500 flex-shrink-0 mt-0.5" />
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Field Architecture & Deployment" rightTitle="System Integration Architecture Diagram" />
            <h2 className="text-xl font-bold text-slate-900 mb-3">Parts of Smart Meter (Kimbal Kushal U1-CAA1)</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-center">
              <div className="lg:col-span-2 bg-gradient-to-b from-slate-900 to-sky-900 rounded-xl p-4 flex items-center justify-center shadow-inner">
                <img
                  src="/assets/pptx/image10.png"
                  alt="Parts of Smart Meter"
                  className="max-h-[360px] w-auto object-contain rounded-lg"
                />
              </div>
              <div className="space-y-2">
                <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2">Labeled Hardware Components</h4>
                {[
                  { name: 'NIC Cover Sealing Screw', desc: 'Tamper-evident seal for plug-in communication module' },
                  { name: 'RF / Cellular Module', desc: 'Field-swappable Sub-GHz RF Mesh or 4G/LTE-M WAN card' },
                  { name: 'NIC Cover', desc: 'Transparent polycarbonate enclosure for comm module' },
                  { name: 'Output LED', desc: 'Metrological pulse calibration indicators (imp/kWh, imp/kVArh)' },
                  { name: 'Display (LCD)', desc: 'Backlit multi-segment LCD with ToU, quadrant & status icons' },
                  { name: 'Push Button', desc: 'Manual scroll button for display parameter cycling' },
                  { name: 'Optical Port', desc: 'IEC 62056-21 / IS 15959 Pt.2 local HHU communication port' },
                  { name: 'Terminal Cover & Sealing Screw', desc: 'Sealed terminal block cover with tamper detection switch' },
                ].map((part, i) => (
                  <div key={i} className="p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                    <span className="font-bold text-slate-900">{part.name}: </span>
                    <span className="text-slate-600">{part.desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Clause 5.2 â€” System Topology Variants" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Architecture â€” Variant 1 (NAN via DCU Gateway)</h2>
            <div className="flex-1 flex flex-col justify-center bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="border-2 border-sky-600 bg-white rounded-xl p-4 w-full md:w-1/2 space-y-3 shadow-sm">
                  <div className="text-xs font-bold text-sky-700 uppercase tracking-wider border-b pb-1.5">
                    SMART METER (IS 16444 PART 2)
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
                      <div className="font-black text-sky-700 text-sm">A</div>
                      <div className="text-[11px] font-semibold text-slate-800 mt-1">Metering / Metrology</div>
                    </div>
                    <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
                      <div className="font-black text-sky-700 text-sm">C</div>
                      <div className="text-[11px] font-semibold text-slate-800 mt-1">Data Exchange Protocol</div>
                    </div>
                    <div className="p-3 rounded-lg bg-sky-100 border border-sky-300">
                      <div className="font-black text-sky-800 text-sm">D</div>
                      <div className="text-[11px] font-semibold text-slate-900 mt-1">Comm. NAN-Module + optional IHD</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 bg-slate-100 px-3 py-1.5 rounded flex justify-between">
                    <span><strong>Optical Port:</strong> Local HHU access (per IS 15959 Pt.2)</span>
                    <span className="text-sky-700 font-semibold">Connectivity C1 â†’ IHD (Optional)</span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-xs font-bold text-sky-700">
                  <span>Connectivity C2</span>
                  <ArrowRight className="w-6 h-6 my-1" />
                  <span className="text-[10px] text-slate-500">RF Mesh / PLC / Wi-Fi</span>
                </div>

                <div className="border-2 border-indigo-600 bg-indigo-50 rounded-xl p-4 text-center w-full md:w-48 shadow-sm">
                  <div className="font-bold text-indigo-900 text-sm">DCU / Network Element</div>
                  <div className="text-[11px] text-indigo-700 mt-1">Data Concentrator Unit</div>
                </div>

                <ArrowRight className="w-6 h-6 text-indigo-600" />

                <div className="border-2 border-emerald-600 bg-emerald-50 rounded-xl p-4 text-center w-full md:w-44 shadow-sm">
                  <div className="font-bold text-emerald-900 text-base">HES</div>
                  <div className="text-[11px] text-emerald-700 mt-1">Head-End System</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                <strong>Variant 1 Summary:</strong> In Variant 1, a <strong>DCU (Data Concentrator Unit)</strong> is used to bridge the <strong>NAN (Neighbourhood Area Network)</strong> and connect smart meters to the HES due to low-range protocols like LoRa/RF, PLC, or Wi-Fi.
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Clause 5.2 â€” System Topology Variants" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Architecture â€” Variant 2 (Direct WAN to HES)</h2>
            <div className="flex-1 flex flex-col justify-center bg-slate-50 border border-slate-200 rounded-xl p-6 space-y-6">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="border-2 border-sky-600 bg-white rounded-xl p-4 w-full md:w-3/5 space-y-3 shadow-sm">
                  <div className="text-xs font-bold text-sky-700 uppercase tracking-wider border-b pb-1.5">
                    SMART METER (IS 16444 PART 2)
                  </div>
                  <div className="grid grid-cols-3 gap-2 text-center">
                    <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
                      <div className="font-black text-sky-700 text-sm">A</div>
                      <div className="text-[11px] font-semibold text-slate-800 mt-1">Metering / Metrology</div>
                    </div>
                    <div className="p-3 rounded-lg bg-sky-50 border border-sky-200">
                      <div className="font-black text-sky-700 text-sm">C</div>
                      <div className="text-[11px] font-semibold text-slate-800 mt-1">Data Exchange Protocol</div>
                    </div>
                    <div className="p-3 rounded-lg bg-emerald-100 border border-emerald-300">
                      <div className="font-black text-emerald-800 text-sm">D</div>
                      <div className="text-[11px] font-semibold text-slate-900 mt-1">Comm. WAN-Module + optional IHD</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-500 bg-slate-100 px-3 py-1.5 rounded flex justify-between">
                    <span><strong>Optical Port:</strong> Local HHU access (per IS 15959 Pt.2)</span>
                    <span className="text-sky-700 font-semibold">Connectivity C1 â†’ IHD (Optional)</span>
                  </div>
                </div>

                <div className="flex flex-col items-center text-xs font-bold text-emerald-700">
                  <span>Connectivity C3 (Direct)</span>
                  <ArrowRight className="w-8 h-8 my-1" />
                  <span className="text-[10px] text-slate-500">Cellular 2G/3G/4G/NB-IoT or OFC</span>
                </div>

                <div className="border-2 border-emerald-600 bg-emerald-50 rounded-xl p-6 text-center w-full md:w-60 shadow-sm">
                  <div className="font-bold text-emerald-900 text-lg">HES (Direct)</div>
                  <div className="text-xs text-emerald-700 mt-1">Head-End System (No DCU Required)</div>
                </div>
              </div>

              <div className="p-4 bg-white rounded-lg border border-slate-200 text-xs text-slate-700">
                <strong>Variant 2 Summary:</strong> Mandatory <strong>WAN module (Cellular 2G/3G/4G or OFC)</strong> connects the smart meter directly to the <strong>HES (Head-End System)</strong> via Connectivity C3 â€” no intermediate DCU required.
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Field Architecture & Deployment" rightTitle="System Integration Architecture Diagram" />
            <h2 className="text-xl font-bold text-slate-900 mb-3">End-to-End Smart Metering System Architecture</h2>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 items-center">
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center shadow-sm">
                <img
                  src="/assets/pptx/image12.png"
                  alt="End-to-End Smart Metering System Architecture"
                  className="max-h-[360px] w-auto object-contain"
                />
              </div>
              <div className="space-y-3 text-xs">
                <div className="p-3 bg-sky-50 border border-sky-200 rounded-lg">
                  <div className="font-bold text-sky-900">1. Home Area Network (HAN)</div>
                  <p className="text-slate-600 mt-1">Smart Meter at consumer premises communicating over PLC / Local Optical / IHD.</p>
                </div>
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg">
                  <div className="font-bold text-indigo-900">2. Neighbor Area Network (NAN)</div>
                  <p className="text-slate-600 mt-1">Local Concentrator (DCU) aggregating meter data over Wi-Fi, Cellular, RF Mesh, or PLC.</p>
                </div>
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <div className="font-bold text-purple-900">3. Wide Area Network (WAN)</div>
                  <p className="text-slate-600 mt-1">Global Concentrator backhaul via Fibre Optic, Satellite, WiMAX, Cellular 4G/5G, DSL.</p>
                </div>
                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <div className="font-bold text-emerald-900">4. Firewall, DB Cluster, GIS & NOC</div>
                  <p className="text-slate-600 mt-1">HES & MDMS powering Demand Side Management, Outage Management, Billing & Planning.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 7:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Technical Overview of parts of Software development" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Software Development: DCU & HES</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-900 text-white px-4 py-3 font-bold text-sm flex justify-between items-center">
                  <span>DCU (Data Concentrator Unit)</span>
                  <span className="px-2 py-0.5 bg-sky-500 text-white rounded text-xs">Duration: 6 Months</span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Project Overview</span>
                    <p className="text-slate-600">Development of an industrial edge gateway deployed on field poles to aggregate data from smart meters over RF Mesh/PLC (NAN) and route it securely to the central Head-End System (HES) over WAN networks.</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Features</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Local data aggregation, buffering, and storage</li>
                      <li>Protocol conversion (RF/PLC to Cellular/4G/5G)</li>
                      <li>Over-The-Air (OTA) firmware upgrade management</li>
                      <li>Real-time local tamper detection & Power Outage (Last Gasp) alert handling</li>
                    </ul>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-slate-900">Technology: </span>
                    <span className="text-sky-700 font-medium">C/C++, Embedded Linux, STM32 / ARM Cortex-M4, DLMS/COSEM, Modbus, Cellular (4G/LTE-M), Sub-1GHz RF Mesh</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-900 text-white px-4 py-3 font-bold text-sm flex justify-between items-center">
                  <span>HES (Head-End System)</span>
                  <span className="px-2 py-0.5 bg-sky-500 text-white rounded text-xs">Duration: 8 Months</span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Project Overview</span>
                    <p className="text-slate-600">A high-performance central communication engine responsible for direct multi-protocol interaction with millions of smart meters and DCUs in the field, enabling scheduled polling, configuration, and security key management.</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Features</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Automated meter scheduled reading & on-demand polling</li>
                      <li>Remote connect/disconnect load switch control</li>
                      <li>PKI security key management & device authentication</li>
                      <li>Real-time event/alarm monitoring and broadcast commands</li>
                    </ul>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-slate-900">Technology: </span>
                    <span className="text-sky-700 font-medium">Java / Spring Boot, Python, C++, DLMS/COSEM, MQTT, RabbitMQ / Apache Kafka, PostgreSQL / TimescaleDB</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 8:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Technical Overview of parts of Software development" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Software Development: Cloud Infrastructure & MDMS</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-900 text-white px-4 py-3 font-bold text-sm flex justify-between items-center">
                  <span>Cloud Server & Security Infrastructure</span>
                  <span className="px-2 py-0.5 bg-sky-500 text-white rounded text-xs">Duration: 4 Months</span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Project Overview</span>
                    <p className="text-slate-600">A secure, scalable cloud backend setup designed to host HES, MDMS, and database clusters with high availability, firewall protections, load balancing, and geographic mapping integration.</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Features</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>Enterprise Firewall & DDoS Protection setup</li>
                      <li>High-availability Database Clustering (Time-series optimization)</li>
                      <li>Integration with GIS (Geographic Information System)</li>
                      <li>Auto-scaling server nodes for peak load management</li>
                    </ul>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-slate-900">Technology: </span>
                    <span className="text-sky-700 font-medium">AWS / Azure, Docker, Kubernetes, NGINX, PostgreSQL, TimescaleDB, GIS, Linux (Ubuntu/RHEL)</span>
                  </div>
                </div>
              </div>

              <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
                <div className="bg-slate-900 text-white px-4 py-3 font-bold text-sm flex justify-between items-center">
                  <span>MDMS (Meter Data Management System)</span>
                  <span className="px-2 py-0.5 bg-sky-500 text-white rounded text-xs">Duration: 7 Months</span>
                </div>
                <div className="p-4 space-y-3 text-xs">
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Project Overview</span>
                    <p className="text-slate-600">An enterprise software suite that validates, edits, and processes raw time-series consumption data received from HES before making it actionable for utility billing, demand estimation, and customer management.</p>
                  </div>
                  <div>
                    <span className="font-bold text-slate-900 block mb-1">Features</span>
                    <ul className="list-disc pl-4 space-y-1 text-slate-600">
                      <li>VEE Engine (Validation, Editing, and Estimation)</li>
                      <li>Consumption pattern analysis & load profiling</li>
                      <li>Billing system integration & Tariff Engine (TOU/TOD)</li>
                      <li>Outage & loss identification algorithms</li>
                    </ul>
                  </div>
                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200">
                    <span className="font-bold text-slate-900">Technology: </span>
                    <span className="text-sky-700 font-medium">Java Enterprise, Node.js, Python Data Analytics, PostgreSQL, Oracle, RESTful APIs</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 9:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Technical Overview of parts of Software development" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Software Development: Web Dashboard (NOC Portal)</h2>
            <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm max-w-4xl mx-auto w-full my-auto">
              <div className="bg-slate-900 text-white px-5 py-3.5 font-bold text-base flex justify-between items-center">
                <span>Web Dashboard (Network Operation Centre Portal)</span>
                <span className="px-3 py-1 bg-sky-500 text-white rounded text-xs">Duration: 5 Months</span>
              </div>
              <div className="p-6 space-y-4 text-sm">
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Project Overview</span>
                  <p className="text-slate-600 leading-relaxed">
                    A centralized web portal providing real-time graphical monitoring, GIS grid visualizers, analytics, and manual command centers for system administrators and NOC engineers.
                  </p>
                </div>
                <div>
                  <span className="font-bold text-slate-900 block mb-1">Key Features</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-2">
                    {[
                      'Live visual map of active meters, DCUs, and outages',
                      'Demand Side Management & Outage Side Management dashboards',
                      'Manual command execution panel (Disconnect/Reconnect)',
                      'Detailed reporting on energy audit, billing, and system logs',
                    ].map((f, i) => (
                      <div key={i} className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center gap-2 text-xs font-medium text-slate-800">
                        <CheckCircle2 className="w-4 h-4 text-sky-500 flex-shrink-0" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-3.5 bg-sky-50 rounded-lg border border-sky-200 text-xs">
                  <span className="font-bold text-slate-900">Technology Stack: </span>
                  <span className="text-sky-800 font-semibold">React.js / Angular, TypeScript, Chart.js / D3.js, Leaflet / OpenLayers (GIS), REST APIs, WebSockets</span>
                </div>
              </div>
            </div>
          </div>
        );

      case 10:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Clause 5.1 â€” Four Functional Zones" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Smart Meter Sections (Clause 5.1)</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-1 items-stretch">
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
                  desc: 'NAN, WAN and optional IHD modules â€” built-in or field-swappable plug-in sealed units.',
                  active: true,
                },
              ].map((z, i) => (
                <div
                  key={i}
                  className={`rounded-xl p-5 border flex flex-col justify-between ${
                    z.active
                      ? 'bg-sky-50/50 border-t-4 border-t-sky-500 border-slate-200'
                      : 'bg-slate-100/80 border-t-4 border-t-slate-400 border-slate-300 opacity-85'
                  }`}
                >
                  <div className="space-y-3">
                    <span className={`inline-block px-2.5 py-0.5 rounded text-xs font-bold ${z.active ? 'bg-sky-500 text-white' : 'bg-slate-500 text-white'}`}>
                      {z.sec}
                    </span>
                    <h3 className="text-base font-bold text-slate-900">{z.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{z.desc}</p>
                  </div>
                  <div className="pt-4 border-t border-slate-200/80 text-[11px] font-semibold text-slate-500">
                    {z.active ? 'Mandatory in IS 16444 Pt. 2' : 'Excluded in Part 2 (Transformer-Operated)'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 11:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Clause 5.2 â€” System Topology Variants" />
            <h2 className="text-xl font-bold text-slate-900 mb-3">System Architecture Variants & Operating Frequencies</h2>
            <div className="space-y-4 flex-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-sky-50/60 border-t-4 border-t-sky-500 border border-slate-200 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900">Variant 1: NAN via DCU Gateway (C1 / C2)</h3>
                  <p className="text-xs text-slate-600">Mandatory NAN module (PLC or RF Sub-GHz) connects meter to a Data Concentrator Unit (DCU), which relays data to the Head-End System over WAN backhaul.</p>
                  <div className="p-2 bg-white rounded border border-sky-200 font-mono text-[11px] font-bold text-sky-800">
                    Path: Smart Meter â†’ NAN (RF/PLC) â†’ DCU â†’ WAN (Cellular/OFC) â†’ HES
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-sky-50/60 border-t-4 border-t-sky-500 border border-slate-200 space-y-2">
                  <h3 className="font-bold text-sm text-slate-900">Variant 2: Direct WAN to HES (C3)</h3>
                  <p className="text-xs text-slate-600">Mandatory WAN module (Cellular 2G/3G/4G/NB-IoT or OFC) connects the meter directly to the HES â€” eliminating the need for an intermediate DCU router.</p>
                  <div className="p-2 bg-white rounded border border-sky-200 font-mono text-[11px] font-bold text-sky-800">
                    Path: Smart Meter â†’ WAN Module (SIM / Cellular / OFC) â†’ Direct Carrier â†’ HES
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-xs text-sky-700">RF Sub-GHz Band (NAN)</h4>
                  <p className="text-xs text-slate-700"><strong>Frequency:</strong> 865 - 868 MHz (Sub-GHz Mesh / LoRaWAN) & 2.4 GHz.</p>
                  <p className="text-[11px] text-slate-500"><strong>Regulations:</strong> WPC license-exempt bands per NFAP & DoT ETA approvals.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-xs text-indigo-700">Power Line Comm (PLC)</h4>
                  <p className="text-xs text-slate-700"><strong>Frequency:</strong> 3 kHz - 148.5 kHz (CENELEC A/B/C/D bands).</p>
                  <p className="text-[11px] text-slate-500"><strong>Standards:</strong> IEEE 1901, IEEE 1901.2, ITU-T G.9901 / G.9903 / G.9904 over LV lines.</p>
                </div>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1.5">
                  <h4 className="font-bold text-xs text-emerald-700">Cellular & WAN Bands</h4>
                  <p className="text-xs text-slate-700"><strong>Frequency:</strong> 2G/3G/4G LTE & NB-IoT (700/850/900/1800/2100 MHz).</p>
                  <p className="text-[11px] text-slate-500"><strong>Optical Backhaul:</strong> High-speed IPv6 Optical Fibre for central substations.</p>
                </div>
              </div>

              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-[11px] text-amber-900">
                <strong>Regulatory Compliance Note:</strong> Equipment Type Approval (ETA) from Department of Telecommunications (DoT) and compliance with Wireless Planning & Co-ordination (WPC) notifications are mandatory for all RF emitting modules.
              </div>
            </div>
          </div>
        );

      case 12:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Smart Infrastructure Division" rightTitle="Clause 3 & 4 â€” Glossary & Definitions" />
            <h2 className="text-xl font-bold text-slate-900 mb-4">Smart Metering Terminologies</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
              {[
                {
                  title: 'Smart Meter',
                  desc: 'An AC static transformer-operated meter with ToU registers and 2-way communication. Measures, stores & communicates energy data; remotely programmable.',
                },
                {
                  title: 'NAN (Neighborhood Area)',
                  desc: 'Group of smart meters and network elements (e.g., DCU) communicating in a bi-directional local network layer.',
                },
                {
                  title: 'DCU & HES',
                  desc: 'DCU: Data Concentrator Unit acting as secure aggregate router between meter & HES. HES: Head-End System top-level ICT system managing meters, security & billing.',
                },
                {
                  title: 'IHD (In-Home Display)',
                  desc: 'Compact display at consumer premises receiving data/messages from the smart meter.',
                },
                {
                  title: 'HHU (Hand-Held Unit)',
                  desc: 'Device for local optical communication with meter per IS 15959 (Part 2).',
                },
                {
                  title: 'AMI & ToU',
                  desc: 'AMI: Advanced Metering Infrastructure. ToU: Time of Use tariff structures.',
                },
              ].map((g, i) => (
                <div key={i} className="p-4 rounded-xl bg-sky-50/50 border-t-4 border-t-sky-500 border border-slate-200 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-slate-900 mb-2">{g.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{g.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 13:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Field Architecture & Deployment" rightTitle="System Integration Architecture Diagram" />
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-slate-900">User Dashboard (Adatum Energy Smart Meter Monitoring)</h2>
              <Button size="sm" onClick={() => navigate('/')} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs gap-1.5">
                Use Interactive Adatum Panel on Dashboard <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="flex-1 bg-white border border-slate-200 rounded-xl p-3 flex items-center justify-center shadow-sm">
              <img
                src="/assets/pptx/image46.png"
                alt="Adatum Energy Smart Meter Monitoring Dashboard"
                className="max-h-[370px] w-auto object-contain rounded border border-slate-200"
              />
            </div>
          </div>
        );

      case 14:
        return (
          <div className="h-full flex flex-col">
            <SlideHeader subtitle="Quality & Testing Compliance" rightTitle="Clause 9, Table 1 & Clause 10" />
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold text-slate-900">BIS Mandatory Testing Schedule (1â€“11) & Clause 10 Events</h2>
              <Button size="sm" variant="outline" onClick={() => navigate('/compliance')} className="text-xs gap-1.5">
                Open Live Compliance Matrix <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
            <div className="overflow-y-auto max-h-[360px] border border-slate-200 rounded-xl">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-900 text-white sticky top-0">
                  <tr>
                    <th className="p-2.5">Sr.</th>
                    <th className="p-2.5">Test Description</th>
                    <th className="p-2.5">Standard Clause</th>
                    <th className="p-2.5">Test Requirement</th>
                    <th className="p-2.5">Test Methods Standard</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white text-slate-700">
                  {[
                    [1, 'Short Time Over Current', 'IS 16444 (Part 2) Cl. 6.10.3', 'IS 14697 Cl. 9.2.3', 'IS 5884 Cl. 4.4.3'],
                    [2, 'Test of Immunity to Electromagnetic HF Field', 'IS 16444 (Part 2) Cl. 6.11', 'IS 15884 Cl. 10', 'IS 5884 Cl. 4.5, 5.5'],
                    [3, 'EMI Test', 'IS 16444 (Part 2) Cl. 6.11', 'IS 15884 Cl. 10', 'IS 5884 Cl. 4.5, 5.5'],
                    [4, 'Resistance to Heat and Fire', 'IS 16444 (Part 2) Cl. 6.4', 'IS 14697 Cl. 6.8', 'IS 13779 Cl. 6.8'],
                    [5, 'Surge Immunity Test', 'IS 16444 (Part 2) Cl. 6.11', 'IS 14697 Cl. 12.8.5 / IS 13779 Cl. 12.9.5', 'IS 14700 (Part 4/Sec 5)'],
                    [6, 'Electrostatic Discharge (ESD) Test', 'IS 16444 (Part 2) Cl. 6.11', 'IS 14697 Cl. 10', 'IS 15884 Cl. 4.5, 5.5'],
                    [7, 'Electrostatic discharge', 'IS 16444 (Part 2) Cl. 6.11', 'IS 15884 Cl. 10', 'IS 5884 Cl. 4.5, 5.5'],
                    [8, 'AC Electromagnetic', 'IS 16444 (Part 2) Cl. 6.11', 'IS 14697 Cl. 10', 'IS 15884 Cl. 4.5, 5.5'],
                    [9, 'DC Electromagnetic', 'IS 16444 (Part 2) Cl. 6.11', 'IS 14697 Cl. 10', 'IS 15884 Cl. 4.5, 5.5'],
                    [10, 'Test for Climatic Influences: 1. Dry Heat | 2. Cold | 3. Damp Heat Cycle', 'IS 16444 (Part 2) Cl. 6.9', 'IS 15884 Cl. 4.5, 5.5', 'IS 14697 Cl. 8 and 12.6'],
                    [11, 'Resistive Load 40A and 100A', 'IS 16444 (Part 2) Cl. 6.4', 'IS 14697 Cl. 6.8', 'IS 13779 Cl. 6.8'],
                  ].map(([sr, desc, cl, req, meth]) => (
                    <tr key={sr} className="hover:bg-sky-50/50">
                      <td className="p-2.5 font-bold text-slate-900">{sr}</td>
                      <td className="p-2.5 font-semibold text-slate-900">{desc}</td>
                      <td className="p-2.5 text-sky-700 font-medium">{cl}</td>
                      <td className="p-2.5">{req}</td>
                      <td className="p-2.5 font-mono text-[11px]">{meth}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className={isFullscreen ? 'fixed inset-0 z-50 bg-slate-900 p-6 flex flex-col' : 'space-y-4'}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className={`text-xl font-bold tracking-tight ${isFullscreen ? 'text-white' : 'text-slate-900'}`}>
            IS 16444 (Part 2) : 2017 â€” Interactive Presentation Deck
          </h2>
          <p className={`text-xs ${isFullscreen ? 'text-slate-300' : 'text-slate-500'}`}>
            Vardhman Airport Solutions Ltd. | Complete 15-Slide Specification & System Architecture Deck
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={prevSlide} className="h-8 gap-1 text-xs">
            <ArrowLeft className="w-4 h-4" /> Prev
          </Button>
          <span className={`text-xs font-bold px-3 py-1 rounded ${isFullscreen ? 'bg-slate-800 text-white' : 'bg-slate-200 text-slate-800'}`}>
            Slide {currentSlide + 1} / {totalSlides}
          </span>
          <Button variant="outline" size="sm" onClick={nextSlide} className="h-8 gap-1 text-xs">
            Next <ArrowRight className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="h-8 gap-1.5 text-xs"
          >
            {isFullscreen ? <Layers className="w-3.5 h-3.5" /> : <Layers className="w-3.5 h-3.5" />}
            {isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          </Button>
        </div>
      </div>

      {/* Slide Thumbnails Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
        {[
          '1. Cover',
          '2. Field Engg',
          '3. Scope & Exclusions',
          '4. Meter Parts',
          '5. Variant 1 (DCU)',
          '6. Variant 2 (WAN)',
          '7. End-to-End Arch',
          '8. Dev: DCU & HES',
          '9. Dev: Cloud & MDMS',
          '10. Dev: NOC Portal',
          '11. Cl 5.1 Zones A-D',
          '12. Frequencies & Bands',
          '13. Cl 3-4 Glossary',
          '14. Adatum Dashboard',
          '15. BIS Table 1 Tests',
        ].map((label, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`px-2.5 py-1.5 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-all ${
              currentSlide === idx
                ? 'bg-sky-600 text-white shadow-sm'
                : isFullscreen
                ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Active Slide Viewport */}
      <Card className={`flex-1 ${isFullscreen ? 'h-[calc(100vh-140px)]' : 'min-h-[500px]'} shadow-lg border-slate-200`}>
        <CardContent className="p-6 h-full flex flex-col justify-between">
          {renderSlide(currentSlide)}
        </CardContent>
      </Card>
    </div>
  );
};

