import React from 'react';
import { Badge } from '@/components/ui/badge';

export const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const normalized = (status || '').toLowerCase();
  if (['online', 'passed', 'paid', 'resolved'].includes(normalized)) {
    return <Badge variant="success" className="capitalize font-medium">{status.replace('_', ' ')}</Badge>;
  }
  if (['warning', 'acknowledged', 'due'].includes(normalized)) {
    return <Badge variant="warning" className="capitalize font-medium">{status.replace('_', ' ')}</Badge>;
  }
  if (['offline', 'power_off', 'critical', 'failed', 'overdue'].includes(normalized)) {
    return <Badge variant="destructive" className="capitalize font-medium">{status.replace('_', ' ')}</Badge>;
  }
  return <Badge variant="secondary" className="capitalize font-medium">{status.replace('_', ' ')}</Badge>;
};
