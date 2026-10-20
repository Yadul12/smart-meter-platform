import React, { useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Activity, AlertTriangle, Zap, CheckCircle2 } from 'lucide-react';

export const EventStream: React.FC = () => {
  const { lastMessage, isConnected } = useWebSocket('events');
  const [events, setEvents] = useState<any[]>([
    { id: 1, type: 'LAST_GASP', meter_id: 'MTR-IS16444-00013', text: 'Power failure Last Gasp signal received', time: '14:32:11' },
    { id: 2, type: 'TAMPER_DETECT', meter_id: 'MTR-IS16444-00029', text: 'Optical port cover opened', time: '14:30:05' },
    { id: 3, type: 'FIRST_BREATH', meter_id: 'MTR-IS16444-00045', text: 'Supply restored First Breath signal', time: '14:28:40' },
  ]);

  useEffect(() => {
    if (lastMessage) {
      setEvents((prev) => [
        {
          id: Date.now(),
          type: lastMessage.type || 'TELEMETRY',
          meter_id: lastMessage.meter_id || 'SYSTEM',
          text: lastMessage.description || (lastMessage.type === 'METER_READING' ? `Reading: ${lastMessage.voltage}V / ${lastMessage.current}A` : 'Telemetry Event'),
          time: new Date().toLocaleTimeString(),
        },
        ...prev.slice(0, 19),
      ]);
    }
  }, [lastMessage]);

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between">
        <CardTitle className="text-sm font-semibold flex items-center gap-2">
          <Activity className="w-4 h-4 text-primary animate-pulse" />
          Live Event Stream (WebSocket)
        </CardTitle>
        <span className={`inline-block w-2.5 h-2.5 rounded-full ${isConnected ? 'bg-emerald-500' : 'bg-rose-500'}`} />
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto max-h-[380px]">
        <div className="divide-y divide-slate-100">
          {events.map((ev) => (
            <div key={ev.id} className="p-3 hover:bg-slate-50 transition-colors flex items-start gap-3 text-xs">
              <Zap className="w-4 h-4 text-rose-500 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-800">{ev.meter_id}</span>
                  <span className="text-[10px] text-slate-400">{ev.time}</span>
                </div>
                <p className="text-slate-600 mt-0.5">{ev.text}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
