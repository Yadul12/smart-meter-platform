import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { DCU } from '@/types';
import { Radio, RefreshCw } from 'lucide-react';
import api from '@/services/api';

export const DCUsPage: React.FC = () => {
  const [dcus, setDcus] = useState<DCU[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchDcus = async () => {
    try {
      setLoading(true);
      const res = await api.get('/dcus');
      setDcus(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to load DCUs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDcus();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Data Concentrator Units (DCU) ({total})</h2>
          <p className="text-xs text-slate-500 mt-0.5">IS 16444 NAN Aggregation, Protocol Translation & 4G WAN Backhaul</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchDcus} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {dcus.map((d) => (
          <Card key={d.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-100">
                    <Radio className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm">{d.dcu_id}</h4>
                    <p className="text-[11px] text-slate-400">{d.name}</p>
                  </div>
                </div>
                <StatusBadge status={d.status} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-2 border-t border-slate-100">
                <div><span className="text-slate-400">WAN Link:</span> <span className="font-semibold text-slate-800">4G LTE</span></div>
                <div><span className="text-slate-400">NAN Mesh:</span> <span className="font-semibold text-slate-800">RF 865MHz</span></div>
                <div><span className="text-slate-400">Meters:</span> <span className="font-semibold text-emerald-600">{d.online_meters}/{d.total_connected_meters}</span></div>
                <div><span className="text-slate-400">Signal:</span> <span className="font-semibold text-slate-800">-65 dBm</span></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
