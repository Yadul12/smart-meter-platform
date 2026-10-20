import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RefreshCw, Users } from 'lucide-react';
import api from '@/services/api';

export const ConsumersPage: React.FC = () => {
  const [consumers, setConsumers] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchConsumers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/consumers');
      setConsumers(res.data.items);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to load consumers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchConsumers();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Consumers Directory ({total})</h2>
          <p className="text-xs text-slate-500 mt-0.5">Customer Master, Sanctioned Load & Service Accounts</p>
        </div>
        <Button variant="outline" size="sm" onClick={fetchConsumers} className="gap-2 text-xs">
          <RefreshCw className="w-3.5 h-3.5" /> Refresh
        </Button>
      </div>

      <Card>
        <CardContent className="p-0 overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-medium">
              <tr>
                <th className="p-3 pl-4">Consumer #</th>
                <th className="p-3">Customer Name</th>
                <th className="p-3">Category</th>
                <th className="p-3">Sanctioned Load</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {consumers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="p-3 pl-4 font-mono font-semibold text-slate-900">{c.consumer_number}</td>
                  <td className="p-3 font-semibold text-slate-800">{c.name}</td>
                  <td className="p-3 capitalize">{c.consumer_type}</td>
                  <td className="p-3 font-semibold">{c.sanctioned_load} kW</td>
                  <td className="p-3 text-slate-500">{c.phone}</td>
                  <td className="p-3 text-slate-600">{c.address}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
};
