
import React, { useState, useEffect } from 'react';
import { ReportPreview } from './ReportPreview';
import { ClinicalMetadata, PredictionResult, SymptomAnalysis, SearchResult } from '../types';
import { analyzeSymptomsNLP, searchClinicalResearch } from '../services/geminiService';

interface DoctorDashboardProps {
  userId: string;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ userId }) => {
  const [showPreview, setShowPreview] = useState(false);
  const [latestResult, setLatestResult] = useState<PredictionResult | null>(null);
  const [patientName, setPatientName] = useState('Authenticated Patient');
  const [patientAge, setPatientAge] = useState(45);
  const [voiceText, setVoiceText] = useState('');
  const [symptomAnalysis, setSymptomAnalysis] = useState<SymptomAnalysis | null>(null);
  const [nlpLoading, setNlpLoading] = useState(false);
  
  // Search feature states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState<SearchResult | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);

  const [metadata] = useState<ClinicalMetadata>({
    physicianName: "Dr. Rajesh Sharma",
    qualifications: "MD, DM (Cardiology), AIIMS",
    clinicName: "CardiaSense AI Hub"
  });

  useEffect(() => {
    const storageKey = `cardia_history_${userId}`;
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.length > 0) {
        const topResult = parsed[0];
        setLatestResult(topResult);
        setPatientAge(topResult.inputs.age);
      }
    }

    const session = localStorage.getItem('cardia_session');
    if (session) {
      const user = JSON.parse(session);
      setPatientName(user.name);
    }
  }, [userId]);

  const handleNlpAnalysis = async () => {
    if (!voiceText.trim()) return;
    setNlpLoading(true);
    try {
      const result = await analyzeSymptomsNLP(voiceText);
      setSymptomAnalysis(result);
    } catch (err) {
      console.error("NLP Analysis failed", err);
    } finally {
      setNlpLoading(false);
    }
  };

  const handleClinicalSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    setSearchLoading(true);
    try {
      const res = await searchClinicalResearch(searchQuery);
      setSearchResult(res);
    } catch (err) {
      console.error("Search failed", err);
    } finally {
      setSearchLoading(false);
    }
  };

  const triggerReport = () => {
    setShowPreview(true);
  };

  return (
    <div className="space-y-12 relative animate-in fade-in duration-1000">
      
      {/* Search Grounding Section */}
      <div className="bg-slate-900 p-10 rounded-[44px] shadow-2xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/10 blur-[100px] pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center text-white">
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h4 className="text-xl font-black text-white uppercase tracking-tight">Clinical Research Grounding</h4>
          </div>
          <form onSubmit={handleClinicalSearch} className="flex gap-4">
            <input 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search latest Cardiology guidelines, trials or journals..."
              className="flex-grow bg-white/10 border border-white/20 rounded-2xl px-6 py-4 text-white placeholder:text-white/30 outline-none focus:ring-2 ring-blue-500 transition-all"
            />
            <button 
              disabled={searchLoading}
              className="px-10 py-4 bg-blue-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-blue-500 transition-all disabled:opacity-50"
            >
              {searchLoading ? 'Searching...' : 'Search Google Scholar'}
            </button>
          </form>

          {searchResult && (
            <div className="mt-10 p-8 bg-white/5 border border-white/10 rounded-3xl animate-in slide-in-from-top-4">
              <p className="text-white/80 leading-relaxed text-sm mb-6">{searchResult.answer}</p>
              <div className="space-y-2">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-3">Verified Sources:</p>
                <div className="flex flex-wrap gap-3">
                  {searchResult.sources.map((src, i) => (
                    <a key={i} href={src.uri} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-white/10 rounded-full text-[10px] font-bold text-white hover:bg-white/20 transition-all flex items-center gap-2">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" strokeWidth={2}/></svg>
                      {src.title}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white p-14 rounded-[56px] border border-slate-200 shadow-sm flex flex-col md:flex-row justify-between items-center gap-12 print:hidden transition-all hover:border-blue-600/10">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center gap-3 px-4 py-1.5 bg-blue-50 rounded-full mb-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse"></div>
            <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest">Diagnostic Report Engine</span>
          </div>
          <h3 className="text-4xl font-black text-slate-900 tracking-tighter leading-tight">Formal Diagnostic PDF</h3>
          <p className="text-base font-medium text-slate-500 max-w-sm">
            {latestResult 
              ? `Verification file for ${patientName} is ready for download. Generate a formal medical document for official records.` 
              : 'Complete a biometric analysis in the dashboard to unlock clinical reporting tools.'}
          </p>
        </div>
        
        <button 
          disabled={!latestResult}
          onClick={triggerReport}
          className="px-16 py-7 bg-blue-600 text-white rounded-[32px] font-black text-[13px] uppercase tracking-[0.3em] hover:bg-slate-900 transition-all shadow-2xl shadow-blue-200 disabled:opacity-20 active:scale-95 flex items-center gap-5 group"
        >
          <svg className="w-8 h-8 group-hover:animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Clinical Report
        </button>
      </div>

      {showPreview && latestResult && (
        <ReportPreview 
          patientId={latestResult.id.toUpperCase()}
          patientName={patientName}
          patientAge={patientAge}
          clinicalSummary={latestResult.clinicalSummary}
          riskLevel={latestResult.riskLevel}
          date={new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
          riskScore={latestResult.riskScore}
          inputs={latestResult.inputs}
          recommendations={latestResult.treatmentSuggestions?.map(t => t.description) || []}
          metadata={metadata}
          onClose={() => setShowPreview(false)}
          onPrint={() => window.print()}
        />
      )}

      <div className="grid md:grid-cols-2 gap-12 print:hidden">
        <div className="bg-white p-14 rounded-[64px] border border-slate-200 shadow-sm flex flex-col group/tool transition-all hover:shadow-xl">
          <div className="mb-14">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"/></svg>
                </div>
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Case Intake</h4>
             </div>
             <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.3em]">Neural Clinical Capture</p>
          </div>
          <textarea 
            value={voiceText}
            onChange={(e) => setVoiceText(e.target.value)}
            placeholder="Document patient complaints or clinical observations here..."
            className="w-full h-64 p-12 bg-slate-50 border border-slate-200 rounded-[44px] text-base font-medium focus:ring-[8px] ring-blue-50 outline-none resize-none transition-all mb-12 placeholder:text-slate-300 shadow-inner"
          />
          <button 
            onClick={handleNlpAnalysis}
            disabled={nlpLoading || !voiceText.trim()}
            className="w-full py-7 bg-slate-900 text-white rounded-[32px] font-black text-[12px] uppercase tracking-[0.4em] hover:bg-blue-600 transition-all disabled:opacity-40 active:scale-95 shadow-lg"
          >
            {nlpLoading ? 'Analyzing Case...' : 'Synthesize Narrative'}
          </button>
          {symptomAnalysis && (
            <div className="mt-14 p-12 bg-blue-50/50 rounded-[48px] border border-blue-100 animate-in slide-in-from-bottom-6">
               <p className="text-lg font-bold text-slate-700 leading-relaxed italic border-l-[8px] border-blue-400 pl-12">
                 "{symptomAnalysis.summary}"
               </p>
            </div>
          )}
        </div>

        <div className="bg-white p-14 rounded-[64px] border border-slate-200 shadow-sm flex flex-col group/tool transition-all hover:shadow-xl">
          <div className="mb-14">
             <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                   <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </div>
                <h4 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Active Protocols</h4>
             </div>
            <p className="text-[12px] text-slate-400 font-bold uppercase tracking-[0.3em]">AI-Derived Guidelines</p>
          </div>
          <div className="space-y-8 flex-grow custom-scrollbar pr-4 overflow-y-auto max-h-[600px]">
            {latestResult?.treatmentSuggestions?.map((item, i) => (
              <div key={i} className="p-12 rounded-[48px] bg-slate-50 border border-slate-100 hover:bg-white transition-all duration-700 hover:shadow-lg">
                <p className="text-xl font-black text-slate-900 uppercase tracking-tight leading-none mb-6">{item.medication}</p>
                <p className="text-base font-bold text-slate-500 leading-relaxed">{item.description}</p>
              </div>
            )) || <p className="text-center py-24 text-slate-400 italic font-black uppercase tracking-widest text-xs opacity-40">Awaiting data synthesis</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
