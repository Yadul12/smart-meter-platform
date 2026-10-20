import React, { useEffect, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/StatusBadge';
import { Cpu, RefreshCw, Plus } from 'lucide-react';
import api from '@/services/api';

export const FirmwarePage: React.FC = () => {
  const [versions, setVersions] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFirmwareData = async () => {
    try {
      setLoading(true);
      const [vRes, jRes] = await Promise.all([
        api.get('/firmware/versions'),
        api.get('/firmware/jobs'),
      ]);
      setVersions(vRes.data.items || []);
      setJobs(jRes.data.items || []);
    } catch (err) {
      console.error('Failed to load firmware data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFirmwareData();
  }, []);

  const handleCreateJob = async () => {
    await api.post('/firmware/jobs', {
      job_name: `OTA-Rollout-v1.2.4`,
      firmware_version_id: 1,
      target_meters_count: 25,
    });
    fetchFirmwareData();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Firmware Over-The-Air (FOTA) Engine</h2>
          <p className="text-xs text-slate-500 mt-0.5">IS 16444 Secure Cryptographic Binary Updates & Rollout Orchestrator</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={fetchFirmwareData} className="gap-2 text-xs">
            <RefreshCw className="w-3.5 h-3.5" /> Refresh
          </Button>
          <Button size="sm" onClick={handleCreateJob} className="gap-2 text-xs">
            <Plus className="w-3.5 h-3.5" /> Launch OTA Rollout
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800 flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary" /> Approved Firmware Images
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {versions.map((v) => (
              <div key={v.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-900">{v.version_code}</span>
                  <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 font-semibold text-[10px]">Active Release</span>
                </div>
                <p className="text-slate-500">{v.release_notes}</p>
                <p className="text-[10px] text-slate-400 font-mono truncate">Checksum: {v.checksum}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2 border-b border-slate-100">
            <CardTitle className="text-sm font-semibold text-slate-800">Active OTA Rollout Jobs</CardTitle>
          </CardHeader>
          <CardContent className="p-4 space-y-3 text-xs">
            {jobs.length === 0 ? (
              <p className="text-slate-400 italic">No active rollout jobs. Click 'Launch OTA Rollout' to begin.</p>
            ) : (
              jobs.map((j) => (
                <div key={j.id} className="p-3 bg-slate-50 rounded-lg border border-slate-100 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-900">{j.job_name}</span>
                    <StatusBadge status={j.status} />
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>Target Devices: {j.target_meters_count} meters</span>
                    <span>Progress: {j.completed_meters_count} / {j.target_meters_count}</span>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
