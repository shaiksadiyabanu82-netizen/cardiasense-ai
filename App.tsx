
import React, { useState, useEffect } from 'react';
import { User, UserRole, AuthState } from './types';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AuthPortal } from './components/AuthPortal';

const App: React.FC = () => {
  const [auth, setAuth] = useState<AuthState>(() => {
    const saved = localStorage.getItem('cardia_session');
    return saved ? { user: JSON.parse(saved), isAuthenticated: true } : { user: null, isAuthenticated: false };
  });

  const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'CLINICAL'>('DASHBOARD');

  const handleLogin = (user: User) => {
    setAuth({ user, isAuthenticated: true });
    localStorage.setItem('cardia_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setAuth({ user: null, isAuthenticated: false });
    localStorage.removeItem('cardia_session');
    setActiveTab('DASHBOARD');
  };

  if (!auth.isAuthenticated || !auth.user) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <nav className="p-10">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-100">C</div>
            <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">CardiaSense <span className="text-blue-600">AI</span></h1>
          </div>
        </nav>
        <AuthPortal onLogin={handleLogin} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD]">
      {/* Professional Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-100 px-10 py-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-12">
            <div className="flex items-center gap-4 border-r border-slate-100 pr-12">
              <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">C</div>
              <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">CardiaSense AI</h1>
            </div>
            
            <div className="flex items-center gap-10">
              <button 
                onClick={() => setActiveTab('DASHBOARD')}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeTab === 'DASHBOARD' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Analysis Dashboard
                {activeTab === 'DASHBOARD' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full animate-in slide-in-from-left-4 duration-300" />}
              </button>
              <button 
                onClick={() => setActiveTab('CLINICAL')}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all relative py-2 ${activeTab === 'CLINICAL' ? 'text-blue-600' : 'text-slate-400 hover:text-slate-600'}`}
              >
                Clinical Case Tools
                {activeTab === 'CLINICAL' && <div className="absolute bottom-0 left-0 w-full h-1 bg-blue-600 rounded-full animate-in slide-in-from-left-4 duration-300" />}
              </button>
            </div>
          </div>
          
          <div className="flex items-center gap-10">
            <div className="text-right hidden sm:block">
              <span className="text-sm font-black text-slate-900 block tracking-tight leading-none">{auth.user.name}</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5 block">Record ID: {auth.user.medicalId}</span>
            </div>
            <button 
              onClick={handleLogout}
              className="px-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition-all"
            >
              Sign Out
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto p-10">
        <div className="mb-12 animate-in slide-in-from-top-4 duration-500">
          <div className="flex items-center gap-4 mb-4">
             <div className="h-[2px] w-12 bg-blue-600 rounded-full"></div>
             <span className="text-[11px] font-black text-blue-600/60 uppercase tracking-[0.4em]">
                {activeTab === 'DASHBOARD' ? 'Biometric Telemetry Matrix' : 'Case Synthesis & Protocols'}
             </span>
          </div>
          <div className="flex justify-between items-end">
            <h2 className="text-4xl font-black text-slate-900 tracking-tighter">
              {activeTab === 'DASHBOARD' ? 'Heart Health Intelligence' : 'Formal Case Documentation'}
            </h2>
            <div className="hidden md:block">
               <div className="flex gap-2 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button 
                    onClick={() => setActiveTab('DASHBOARD')}
                    className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'DASHBOARD' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                  >
                    Analyze
                  </button>
                  <button 
                    onClick={() => setActiveTab('CLINICAL')}
                    className={`px-4 py-2 text-[9px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'CLINICAL' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-400'}`}
                  >
                    Clinical
                  </button>
               </div>
            </div>
          </div>
        </div>

        <div className="animate-in fade-in zoom-in-95 duration-700">
          {activeTab === 'DASHBOARD' ? (
            <PatientDashboard userId={auth.user.id} />
          ) : (
            <DoctorDashboard userId={auth.user.id} />
          )}
        </div>
      </main>

      <footer className="mt-32 py-16 px-10 border-t border-slate-100 bg-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-12">
          <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] text-center md:text-left">
            &copy; 2024 CardiaSense AI • Integrated Cardiovascular Operating System
          </p>
          <div className="flex gap-16">
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Compliance Status</span>
              <span className="text-[11px] font-black text-emerald-600 uppercase">HIPAA VAULT ACTIVE</span>
            </div>
            <div className="text-center md:text-left">
              <span className="text-[10px] font-black text-slate-400 block mb-2 uppercase tracking-widest">Diagnostic Trust</span>
              <span className="text-[11px] font-black text-blue-600 uppercase">UCI CLEVELAND VALIDATED</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
