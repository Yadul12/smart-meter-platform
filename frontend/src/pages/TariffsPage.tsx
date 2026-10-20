import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sliders, RefreshCw } from 'lucide-react';
import api from '@/services/api';

export const TariffsPage: React.FC = () => {
  const [tariffs, setTariffs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTariffs = async () => {
    try {
      setLoading(true);
      const res = await api.get('/tariffs');
      setTariffs(res.data.items);
    } catch (err) {
      console.error('Failed to load tariffs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTariffs();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Time of Use (ToU) Tariff Structures</h2>
          <p className="text-xs text-slate-500 mt-0.5">Peak, Off-Peak & Normal Multi-Rate Energy Slabs</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchTariffs} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tariffs.map((t) => (
          <Card key={t.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-2 border-b border-slate-100">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-semibold text-slate-800">{t.name}</CardTitle>
                <span className="font-mono text-xs text-primary font-bold">{t.tariff_code}</span>
              </div>
              <p className="text-xs text-slate-500">{t.description}</p>
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <div className="flex justify-between text-xs text-slate-600">
                <span>Fixed Monthly Charge: <strong className="text-slate-800">₹{t.fixed_charge}</strong></span>
                <span>Electricity Duty / Tax: <strong className="text-slate-800">{t.tax_rate_percent}%</strong></span>
              </div>
              <div className="space-y-1.5 pt-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">ToU Slabs & Intervals</p>
                {t.slabs?.map((s: any) => (
                  <div key={s.id} className="flex justify-between items-center p-2 bg-slate-50 rounded text-xs">
                    <span className="font-semibold capitalize text-slate-700">{s.slab_type.replace('_', ' ')} ({s.start_time} - {s.end_time})</span>
                    <span className="font-bold text-primary">₹{s.rate_per_unit} / kWh</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
