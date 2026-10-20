import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'indigo' | 'slate';
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-600 border-blue-100',
  emerald: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  amber: 'bg-amber-50 text-amber-600 border-amber-100',
  rose: 'bg-rose-50 text-rose-600 border-rose-100',
  indigo: 'bg-indigo-50 text-indigo-600 border-indigo-100',
  slate: 'bg-slate-50 text-slate-600 border-slate-100',
};

export const KPICard: React.FC<KPICardProps> = ({
  title, value, subtitle, icon: Icon, trend, trendUp, color = 'blue'
}) => {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{title}</p>
            <h4 className="text-2xl font-bold text-slate-800 mt-1">{value}</h4>
            {subtitle && <p className="text-xs text-slate-400 mt-1">{subtitle}</p>}
            {trend && (
              <p className={cn("text-xs font-medium mt-2 flex items-center gap-1", trendUp ? "text-emerald-600" : "text-rose-600")}>
                <span>{trendUp ? '↑' : '↓'}</span> {trend}
              </p>
            )}
          </div>
          <div className={cn("p-3 rounded-xl border", colorMap[color])}>
            <Icon className="w-6 h-6" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
