import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Zap, Lock, User } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(username, password);
      navigate('/');
    } catch {
      alert('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col justify-center items-center p-4 font-sans">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-primary text-white mb-3 shadow-lg shadow-primary/30">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">Smart Metering Platform</h1>
          <p className="text-sm text-slate-400 mt-1">IS 16444 (Part 2): 2017 Architecture Reference</p>
        </div>

        <Card className="border-slate-800 bg-slate-950/80 backdrop-blur shadow-2xl">
          <CardHeader>
            <CardTitle className="text-lg text-white">Sign In to NOC Control</CardTitle>
            <CardDescription className="text-slate-400">Enter your credentials or click a preset</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 pl-9 pr-4 py-2 rounded-lg text-sm text-white focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isLoading} className="w-full mt-2">
                {isLoading ? 'Authenticating...' : 'Sign In'}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-slate-800 grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => { setUsername('admin'); setPassword('admin123'); }}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-left border border-slate-800"
              >
                <p className="font-semibold text-primary">Super Admin</p>
                <p className="text-[10px] text-slate-500">admin / admin123</p>
              </button>
              <button
                type="button"
                onClick={() => { setUsername('noc_engineer'); setPassword('noc123'); }}
                className="p-2 rounded bg-slate-900 hover:bg-slate-800 text-slate-300 text-left border border-slate-800"
              >
                <p className="font-semibold text-emerald-400">NOC Engineer</p>
                <p className="text-[10px] text-slate-500">noc_engineer / noc123</p>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
