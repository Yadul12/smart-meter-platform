import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import { MainLayout } from '@/layouts/MainLayout';

// Pages
import { LoginPage } from '@/pages/LoginPage';
import { DashboardPage } from '@/pages/DashboardPage';
import { MetersPage } from '@/pages/MetersPage';
import { MeterDetailPage } from '@/pages/MeterDetailPage';
import { DCUsPage } from '@/pages/DCUsPage';
import { EventsPage } from '@/pages/EventsPage';
import { AlarmsPage } from '@/pages/AlarmsPage';
import { OutagesPage } from '@/pages/OutagesPage';
import { GISPage } from '@/pages/GISPage';
import { ConsumersPage } from '@/pages/ConsumersPage';
import { BillingPage } from '@/pages/BillingPage';
import { TariffsPage } from '@/pages/TariffsPage';
import { VEEPage } from '@/pages/VEEPage';
import { CommandsPage } from '@/pages/CommandsPage';
import { ReportsPage } from '@/pages/ReportsPage';
import { CompliancePage } from '@/pages/CompliancePage';
import { NetworkTestsPage } from '@/pages/NetworkTestsPage';
import { AuditLogPage } from '@/pages/AuditLogPage';
import { SystemHealthPage } from '@/pages/SystemHealthPage';
import { SimulationPage } from '@/pages/SimulationPage';
import { DataFlowPage } from '@/pages/DataFlowPage';
import { UsersPage } from '@/pages/UsersPage';
import { FirmwarePage } from '@/pages/FirmwarePage';
import { PresentationPage } from '@/pages/PresentationPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  if (!user && !localStorage.getItem('smp_token')) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route path="presentation" element={<PresentationPage />} />
            <Route path="meters" element={<MetersPage />} />
            <Route path="meters/:id" element={<MeterDetailPage />} />
            <Route path="dcus" element={<DCUsPage />} />
            <Route path="gis" element={<GISPage />} />
            <Route path="events" element={<EventsPage />} />
            <Route path="alarms" element={<AlarmsPage />} />
            <Route path="outages" element={<OutagesPage />} />
            <Route path="consumers" element={<ConsumersPage />} />
            <Route path="billing" element={<BillingPage />} />
            <Route path="tariffs" element={<TariffsPage />} />
            <Route path="vee" element={<VEEPage />} />
            <Route path="commands" element={<CommandsPage />} />
            <Route path="reports" element={<ReportsPage />} />
            <Route path="compliance" element={<CompliancePage />} />
            <Route path="network-tests" element={<NetworkTestsPage />} />
            <Route path="audit" element={<AuditLogPage />} />
            <Route path="system" element={<SystemHealthPage />} />
            <Route path="simulation" element={<SimulationPage />} />
            <Route path="dataflow" element={<DataFlowPage />} />
            <Route path="users" element={<UsersPage />} />
            <Route path="firmware" element={<FirmwarePage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
