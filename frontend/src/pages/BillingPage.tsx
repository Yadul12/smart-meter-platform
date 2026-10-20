import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { DollarSign, RefreshCw, Plus } from 'lucide-react';
import api from '@/services/api';

export const BillingPage: React.FC = () => {
  const [bills, setBills] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchBills = async () => {
    try {
      setLoading(true);
      const res = await api.get('/billing');
      setBills(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to load bills', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleGenerate = async () => {
    await api.post('/billing/generate');
    fetchBills();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Time of Use (ToU) Invoices & Billing ({total})</h2>
          <p className="text-xs text-slate-500 mt-0.5">Automated Slabs (Peak, Off-Peak, Normal) & Tariff Calculation</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchBills} className="gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={handleGenerate} className="gap-2 text-xs">
            <Plus className="w-3.5 h-3.5" /> Generate Billing Cycle
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="p-3 pl-4">Bill Number</th>
                <th className="p-3">Status</th>
                <th className="p-3">Units (kWh)</th>
                <th className="p-3">Energy Charge</th>
                <th className="p-3">Fixed Charge</th>
                <th className="p-3">Tax</th>
                <th className="p-3 font-bold">Total Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {bills.map((b) => (
                <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 pl-4 font-mono font-semibold text-slate-900">{b.bill_number}</td>
                  <td className="p-3"><StatusBadge status={b.status} /></td>
                  <td className="p-3 font-semibold">{b.total_active_energy} kWh</td>
                  <td className="p-3">₹{b.energy_charge}</td>
                  <td className="p-3">₹{b.fixed_charge}</td>
                  <td className="p-3">₹{b.tax_amount}</td>
                  <td className="p-3 font-bold text-slate-900">₹{b.total_amount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
