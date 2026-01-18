
import React, { useState, useEffect } from 'react';
import { PatientData, PredictionResult } from '../types';
import { analyzePatientRisk } from '../services/geminiService';
import { RiskForecastChart, ExplainabilityChart } from './PredictiveChart';
import { VisionAnalyzer } from './VisionAnalyzer';
import { AnalysisGuide } from './AnalysisGuide';

interface PatientDashboardProps {
  userId: string;
}

const INITIAL_DATA: PatientData = {
  age: 45, sex: 1, cp: 1, trestbps: 120, chol: 240, fbs: 0, 
  restecg: 0, thalach: 150, exang: 0, oldpeak: 1.0, slope: 1, ca: 0, thal: 2
};

const VALIDATION_RULES: Record<keyof PatientData, { min: number, max: number, label: string }> = {
  age: { min: 20, max: 110, label: 'Age (Years)' },
  sex: { min: 0, max: 1, label: 'Sex (0:F, 1:M)' },
  cp: { min: 0, max: 3, label: 'Chest Pain Type (0-3)' },
  trestbps: { min: 80, max: 200, label: 'Resting BP (mmHg)' },
  chol: { min: 100, max: 600, label: 'Cholesterol (mg/dl)' },
  fbs: { min: 0, max: 1, label: 'FBS > 120 (0/1)' },
  restecg: { min: 0, max: 2, label: 'Rest ECG (0-2)' },
  thalach: { min: 60, max: 220, label: 'Max HR' },
  exang: { min: 0, max: 1, label: 'Ex. Angina (0/1)' },
  oldpeak: { min: 0, max: 7, label: 'ST Dep. (0-7)' },
  slope: { min: 0, max: 2, label: 'ST Slope (0-2)' },
  ca: { min: 0, max: 4, label: 'Major Vessels (0-4)' },
  thal: { min: 0, max: 3, label: 'Thalassemia (0-3)' },
};

export const PatientDashboard: React.FC<PatientDashboardProps> = ({ userId }) => {
  const [data, setData] = useState<PatientData>(INITIAL_DATA);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    const storageKey = `cardia_history_${userId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      setHistory(parsed);
      if (parsed.length > 0) setResult(parsed[0]);
    } else {
      setHistory([]);
      setResult(null);
    }
  }, [userId]);

  const calculate = async () => {
    setLoading(true);
    try {
      const res = await analyzePatientRisk(data);
      const fullRes: PredictionResult = { 
        ...res, 
        id: Math.random().toString(36).substr(2, 9),
        userId: userId,
        timestamp: new Date().toISOString(),
        inputs: { ...data }
      };
      setResult(fullRes);
      const storageKey = `cardia_history_${userId}`;
      const newHistory = [fullRes, ...history].slice(0, 15);
      setHistory(newHistory);
      localStorage.setItem(storageKey, JSON.stringify(newHistory));
    } catch (err) {
      console.error("Analysis failed", err);
    } finally {
      setLoading(false);
    }
  };

  const getRiskColor = (level?: string) => {
    switch(level) {
      case 'HIGH': return 'bg-red-600 text-white';
      case 'MODERATE': return 'bg-amber-500 text-white';
      case 'LOW': return 'bg-emerald-600 text-white';
      default: return 'bg-slate-900 text-white';
    }
  };

  const getRiskStatusText = (level?: string) => {
    switch(level) {
      case 'HIGH': return 'Critical: High Risk Detected';
      case 'MODERATE': return 'Warning: Moderate Risk Profile';
      case 'LOW': return 'Stable: Low Risk Baseline';
      default: return 'Awaiting Analysis';
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <AnalysisGuide isOpen={isGuideOpen} onClose={() => setIsGuideOpen(false)} />

      <div className={`w-full p-8 rounded-[32px] transition-all duration-500 shadow-xl overflow-hidden relative group ${getRiskColor(result?.riskLevel)}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:scale-110 transition-transform duration-700" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <h2 className="text-4xl font-black tracking-tighter uppercase">{getRiskStatusText(result?.riskLevel)}</h2>
            <div className="flex items-center gap-4 justify-center md:justify-start">
               <p className="text-[11px] font-black uppercase tracking-[0.4em] opacity-80">
                  Diagnostic Intelligence Engine • {result ? new Date(result.timestamp).toLocaleTimeString() : 'N/A'}
               </p>
               <button 
                  onClick={() => setIsGuideOpen(true)}
                  className="bg-white/20 hover:bg-white/40 text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-white/20 transition-all flex items-center gap-2"
               >
                  <span className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
                  Guide: How to read this?
               </button>
            </div>
          </div>
          <div className="bg-black/20 backdrop-blur-md px-10 py-5 rounded-2xl border border-white/20 text-center min-w-[180px]">
            <span className="text-4xl font-black block">{result?.riskScore || '--'}%</span>
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Probability Index</span>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 xl:col-span-3 space-y-6">
          <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm sticky top-32">
            <div className="flex justify-between items-center mb-10 border-b border-slate-50 pb-5">
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-widest">Biometric Inputs</h3>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
            </div>
            
            <div className="space-y-6">
              {(Object.keys(VALIDATION_RULES) as Array<keyof PatientData>).map((key) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <label>{VALIDATION_RULES[key].label}</label>
                    <span className="text-slate-900 font-black">{data[key]}</span>
                  </div>
                  <input 
                    type="range"
                    min={VALIDATION_RULES[key].min}
                    max={VALIDATION_RULES[key].max}
                    step={key === 'oldpeak' ? 0.1 : 1}
                    value={data[key]}
                    onChange={(e) => setData({...data, [key]: parseFloat(e.target.value)})}
                    className="w-full h-1.5 bg-slate-100 rounded-full appearance-none cursor-pointer accent-blue-600"
                  />
                </div>
              ))}
            </div>

            <button 
              onClick={calculate}
              disabled={loading}
              className="w-full mt-10 py-5 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.25em] shadow-xl shadow-blue-100 hover:bg-slate-900 hover:scale-[1.02] transition-all disabled:opacity-50"
            >
              {loading ? 'Synthesizing Data...' : 'Generate New Prediction'}
            </button>
          </div>
        </div>

        <div className="lg:col-span-8 xl:col-span-9 space-y-8">
          <div className="grid md:grid-cols-12 gap-8">
            <div className="md:col-span-7 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative group">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-slate-900 text-[11px] font-black uppercase tracking-[0.2em]">Longitudinal Forecast</h4>
                <button onClick={() => setIsGuideOpen(true)} className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity underline">What is this chart?</button>
              </div>
              <RiskForecastChart data={result?.forecast || []} />
            </div>
            
            <div className="md:col-span-5 bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm flex flex-col">
              <h4 className="text-slate-900 text-[11px] font-black uppercase tracking-[0.2em] mb-10">Patient History Registry</h4>
              <div className="space-y-3 overflow-y-auto max-h-[340px] pr-2 custom-scrollbar">
                {history.map((log) => (
                  <button 
                    key={log.id} 
                    onClick={() => setResult(log)}
                    className={`w-full flex items-center justify-between p-5 rounded-2xl border transition-all ${
                      result?.id === log.id 
                      ? 'bg-slate-900 border-slate-900 shadow-lg scale-[1.02]' 
                      : 'bg-slate-50 border-slate-100 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-left">
                      <div className={`text-[11px] font-black uppercase tracking-widest ${result?.id === log.id ? 'text-white' : 'text-slate-900'}`}>
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className={`text-[9px] font-bold opacity-60 uppercase mt-1 ${result?.id === log.id ? 'text-slate-400' : 'text-slate-400'}`}>
                        Risk Level: {log.riskLevel}
                      </div>
                    </div>
                    <div className={`text-lg font-black ${result?.id === log.id ? 'text-blue-400' : (log.riskScore > 60 ? 'text-red-600' : 'text-slate-900')}`}>
                      {log.riskScore}%
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-1 gap-8">
            <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm relative group">
              <div className="flex justify-between items-center mb-10">
                <h4 className="text-slate-900 text-[11px] font-black uppercase tracking-[0.2em]">Clinical Feature Attribution (SHAP)</h4>
                <button onClick={() => setIsGuideOpen(true)} className="text-[9px] font-black text-blue-600 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity underline">Why these bars?</button>
              </div>
              <ExplainabilityChart data={result?.explanation || []} />
            </div>
          </div>

          <VisionAnalyzer />
        </div>
      </div>
    </div>
  );
};
