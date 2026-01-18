
import React from 'react';

interface AnalysisGuideProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AnalysisGuide: React.FC<AnalysisGuideProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center p-6 bg-slate-900/90 backdrop-blur-xl animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
        <div className="bg-blue-600 p-10 text-white relative">
          <button 
            onClick={onClose}
            className="absolute top-8 right-8 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition-all"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <h2 className="text-3xl font-black tracking-tighter uppercase mb-2">Understanding Your Analysis</h2>
          <p className="text-blue-100 text-sm font-bold uppercase tracking-widest opacity-80">Patient Interpretation Guide</p>
        </div>

        <div className="p-10 space-y-10 overflow-y-auto max-h-[70vh] custom-scrollbar">
          {/* Section 1: Risk Score */}
          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">The Probability Index (%)</h3>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              This is your overall cardiovascular risk score. It represents the probability (out of 100) that a person with your specific clinical metrics would have heart disease. A higher percentage indicates a stronger correlation with clinical indicators of heart issues.
            </p>
          </section>

          {/* Section 2: SHAP Explanation */}
          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-amber-50 rounded-2xl flex items-center justify-center text-amber-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Risk Drivers (Impact Analysis)</h3>
            </div>
            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
              <p className="text-slate-600 text-sm leading-relaxed">
                The "Feature Attribution" chart shows which factors are influencing your score the most:
              </p>
              <div className="flex gap-4">
                <div className="flex-1 p-4 bg-red-50 rounded-2xl border border-red-100">
                  <span className="text-[10px] font-black text-red-600 uppercase block mb-1">Red Bars</span>
                  <p className="text-xs text-red-700 font-bold">Factors pushing your risk UP (e.g., high BP or age).</p>
                </div>
                <div className="flex-1 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
                  <span className="text-[10px] font-black text-emerald-600 uppercase block mb-1">Green Bars</span>
                  <p className="text-xs text-emerald-700 font-bold">Factors keeping your risk LOWER (e.g., healthy HR).</p>
                </div>
              </div>
            </div>
          </section>

          {/* Section 3: Forecast */}
          <section className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">The 5-Year Outlook</h3>
            </div>
            <p className="text-slate-600 leading-relaxed font-medium">
              This forecast estimates how your heart risk might change over the next 5 years based on current data. It assumes your health parameters remain constant. Upward slopes suggest a need for lifestyle changes or medical intervention to prevent future risk escalation.
            </p>
          </section>
        </div>

        <div className="p-10 border-t border-slate-100 flex justify-end">
          <button 
            onClick={onClose}
            className="px-10 py-4 bg-slate-900 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95"
          >
            Got it, Thank You
          </button>
        </div>
      </div>
    </div>
  );
};
