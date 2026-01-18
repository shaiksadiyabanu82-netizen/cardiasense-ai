
import React, { useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthPortalProps {
  onLogin: (user: User) => void;
}

export const AuthPortal: React.FC<AuthPortalProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.PATIENT);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Load user registry from localStorage
    const usersJson = localStorage.getItem('cardia_users');
    const users: User[] = usersJson ? JSON.parse(usersJson) : [];

    if (isLogin) {
      // Logic for Sign In
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        // In a real app, we'd check the password too. Here we simulate success.
        onLogin(existingUser);
      } else {
        // Support the demo clinical account
        if (email === 'clinical@cardiasense.in') {
          const demoUser: User = {
            id: 'demo-clinical',
            name: 'Dr. Rajesh Sharma',
            email: 'clinical@cardiasense.in',
            role: UserRole.CLINICAL,
            medicalId: 'CS-DEMO-01'
          };
          onLogin(demoUser);
        } else {
          setError('User profile not found. Please register.');
        }
      }
    } else {
      // Logic for Registration
      if (users.some(u => u.email === email)) {
        setError('This email is already registered.');
        return;
      }

      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name: name,
        email: email,
        role: role,
        medicalId: `CS-${Math.floor(Math.random() * 100000)}`
      };

      users.push(newUser);
      localStorage.setItem('cardia_users', JSON.stringify(users));
      onLogin(newUser);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-[32px] shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-500">
        <div className="bg-slate-900 p-10 text-center text-white relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/20 to-transparent pointer-events-none" />
          <div className="w-16 h-16 bg-white rounded-2xl mx-auto mb-6 flex items-center justify-center text-slate-900 font-black text-2xl shadow-xl relative z-10">C</div>
          <h2 className="text-3xl font-black mb-2 relative z-10">CardiaSense <span className="text-blue-400">AI</span></h2>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest relative z-10">Clinical Intelligence Hub</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-10 space-y-6">
          <div className="flex bg-slate-100 p-1 rounded-2xl mb-4">
            <button 
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              Sign In
            </button>
            <button 
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${!isLogin ? 'bg-white shadow-sm text-blue-600' : 'text-slate-400'}`}
            >
              Register
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-red-600 text-[10px] font-bold uppercase tracking-widest text-center animate-in slide-in-from-top-2">
              {error}
            </div>
          )}

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
              <input 
                required
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 ring-blue-100 outline-none transition-all"
              />
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Medical Email</label>
            <input 
              required
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 ring-blue-100 outline-none transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Security Key</label>
            <input 
              required
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 ring-blue-100 outline-none transition-all"
            />
          </div>

          {!isLogin && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Access Protocol</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-sm focus:ring-2 ring-blue-100 outline-none transition-all appearance-none"
              >
                <option value={UserRole.PATIENT}>Patient Record</option>
                <option value={UserRole.CLINICAL}>Clinical Specialist</option>
              </select>
            </div>
          )}

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-blue-600 transition-all shadow-xl shadow-slate-200 mt-4"
          >
            {isLogin ? 'Enter Secure Session' : 'Create Clinical ID'}
          </button>
          
          <p className="text-center text-[9px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
            Data persists locally for your security.<br/>
            Demo Specialist: clinical@cardiasense.in
          </p>
        </form>
      </div>
    </div>
  );
};
