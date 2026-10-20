import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { KPICard } from '@/components/KPICard';
import { FileText, Download, RefreshCw } from 'lucide-react';
import api from '@/services/api';

export const ReportsPage: React.FC = () => {
  const [audit, setAudit] = useState<any | null>(null);
  const [billing, setBilling] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const [aRes, bRes] = await Promise.all([
        api.get('/reports/energy-audit'),
        api.get('/reports/billing-summary'),
      ]);
      setAudit(aRes.data);
      setBilling(bRes.data);
    } catch (err) {
      console.error('Failed to load reports', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleExport = () => {
    window.open('/api/reports/export/csv', '_blank');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Energy Accounting & Revenue Audit Reports</h2>
          <p className="text-xs text-slate-500 mt-0.5">T&D Technical Loss Analysis, Revenue Recovery & Compliance Audits</p>
        </div>
        <Button size="sm" onClick={handleExport} className="gap-2 text-xs">
          <Download className="w-3.5 h-3.5" /> Export Fleet CSV
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">Energy Accounting & Loss Balance</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Total Grid Inflow (Import):</span>
              <span className="font-bold text-slate-900">{audit?.total_import_energy_kwh} kWh</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Solar / Consumer Outflow (Export):</span>
              <span className="font-bold text-slate-900">{audit?.total_export_energy_kwh} kWh</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Estimated Technical Loss:</span>
              <span className="font-bold text-amber-600">{audit?.estimated_technical_loss_pct}%</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Commercial / Tamper Loss:</span>
              <span className="font-bold text-rose-600">{audit?.estimated_commercial_loss_pct}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">Revenue & Billing Collection Summary</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Total Invoices Issued:</span>
              <span className="font-bold text-slate-900">{billing?.total_bills}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Total Billed Demand:</span>
              <span className="font-bold text-slate-900">₹{billing?.total_billed_amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Collected Revenue:</span>
              <span className="font-bold text-emerald-600">₹{billing?.collected_amount?.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-50">
              <span className="text-slate-500">Collection Efficiency:</span>
              <span className="font-bold text-primary">{billing?.collection_efficiency_pct}%</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
