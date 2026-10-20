import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { SearchBar } from '@/components/SearchBar';
import {
  LayoutDashboard, Gauge, Radio, Users, AlertTriangle,
  Zap, MapPin, FileText, DollarSign, Layers, Terminal,
  Cpu, ShieldCheck, Wifi, History, Activity, GitPullRequest,
  Sliders, LogOut, UserCheck, ShieldAlert
} from 'lucide-react';
import { cn } from '@/lib/utils';

export const MainLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navSections = [
    {
      title: 'OPERATIONS & DECK',
      items: [
        { name: 'NOC & Adatum Dashboard', path: '/', icon: LayoutDashboard },
        { name: 'IS 16444 Slide Deck (15)', path: '/FileText', icon: FileText },
        { name: 'Smart Meters (104)', path: '/meters', icon: Gauge },
        { name: 'DCUs (Variant 1 & 2)', path: '/dcus', icon: Radio },
        { name: 'GIS Spatial Map', path: '/gis', icon: MapPin },
      ],
    },
    {
      title: 'MONITORING & CLAUSE 10',
      items: [
        { name: 'Meter Events & Tamper', path: '/events', icon: ShieldAlert },
        { name: 'Active Alarms', path: '/alarms', icon: AlertTriangle },
        { name: 'Outages (Last Gasp)', path: '/outages', icon: Zap },
      ],
    },
    {
      title: 'MDMS & BILLING',
      items: [
        { name: 'VEE Data Quality', path: '/vee', icon: Layers },
        { name: 'Consumers', path: '/consumers', icon: Users },
        { name: 'Tariffs (ToU)', path: '/tariffs', icon: Sliders },
        { name: 'Billing & Invoicing', path: '/billing', icon: DollarSign },
        { name: 'Audit Reports', path: '/reports', icon: FileText },
      ],
    },
    {
      title: 'FIELD & BIS COMPLIANCE',
      items: [
        { name: 'BIS Table 1 & Scope', path: '/compliance', icon: ShieldCheck },
        { name: '4-6-10m & Field Engg', path: '/network-tests', icon: Wifi },
        { name: 'Command Center', path: '/commands', icon: Terminal },
        { name: 'Firmware Over-The-Air', path: '/firmware', icon: Cpu },
      ],
    },
    {
      title: 'ARCHITECTURE & SYSTEM',
      items: [
        { name: 'Architecture & Zones A-D', path: '/dataflow', icon: GitPullRequest },
        { name: 'Simulation Control', path: '/simulation', icon: Sliders },
        { name: 'System Health', path: '/system', icon: Activity },
        { name: 'Audit Trails', path: '/audit', icon: History },
        { name: 'User Access (RBAC)', path: '/users', icon: UserCheck },
      ],
    },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col flex-shrink-0 border-r border-slate-800">
        <div className="h-16 flex items-center px-5 gap-3 border-b border-slate-800 bg-slate-950">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-xs tracking-wider shadow flex-shrink-0">
            VAS
          </div>
          <div className="overflow-hidden">
            <h1 className="font-bold text-white text-xs leading-none truncate">Vardhman Airport Sol.</h1>
            <p className="text-[10px] text-primary font-medium tracking-wide mt-1 truncate">IS 16444 (Pt 2) : 2017</p>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
          {navSections.map((sec, idx) => (
            <div key={idx}>
              <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                {sec.title}
              </p>
              <div className="space-y-0.5">
                {sec.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      className={({ isActive }) =>
                        cn(
                          'flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-colors',
                          isActive
                            ? 'bg-primary text-white font-semibold shadow-sm'
                            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                        )
                      }
                    >
                      <Icon className="w-4 h-4 flex-shrink-0" />
                      <span>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="p-3 border-t border-slate-800 bg-slate-950 flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-hidden">
            <div className="w-8 h-8 rounded-full bg-slate-800 flex items-center justify-center text-primary font-semibold text-xs border border-slate-700 flex-shrink-0">
              {user?.username ? user.username.substring(0, 2).toUpperCase() : 'U'}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-medium text-white truncate">{user?.full_name || user?.username || 'Super Admin'}</p>
              <p className="text-[10px] text-slate-400 truncate">{user?.roles?.[0] || 'super_admin'}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="p-1.5 text-slate-400 hover:text-rose-400 rounded-md hover:bg-slate-800 transition-colors">
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 z-20 flex-shrink-0">
          <SearchBar />
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>HES / MDMS Online</span>
            </div>
            <div className="text-right">
              <p className="text-xs font-semibold text-slate-800">IS 16444 AMI Grid Active</p>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 bg-slate-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

