
import React, { useRef, useState } from 'react';
import { ClinicalMetadata, PatientData } from '../types';

interface ReportPreviewProps {
  patientId: string;
  patientName: string;
  patientAge: number;
  clinicalSummary: string;
  date: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  inputs?: PatientData;
  recommendations?: string[];
  metadata: ClinicalMetadata;
  onClose: () => void;
  onPrint: () => void;
}

export const ReportPreview: React.FC<ReportPreviewProps> = ({ 
  patientId, 
  patientName,
  patientAge,
  clinicalSummary,
  date, 
  riskScore,
  riskLevel,
  inputs,
  recommendations,
  onClose
}) => {
  const [isDownloading, setIsDownloading] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);
  
  const currentTime = new Date().toLocaleTimeString('en-US', { 
    hour: '2-digit', 
    minute: '2-digit',
    second: '2-digit',
    hour12: true 
  });

  const displayName = patientName || "Authenticated Patient";
  const displayAge = patientAge || "N/A";

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!reportRef.current || isDownloading) return;
    
    setIsDownloading(true);
    
    const element = reportRef.current;
    const opt = {
      margin: [10, 10, 10, 10],
      filename: `CardiaSense_AI_Report_${displayName.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { 
        scale: 2, 
        useCORS: true, 
        letterRendering: true,
        backgroundColor: '#FFFFFF',
        logging: false
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    try {
      // Accessing global html2pdf injected via script tag for maximum compatibility
      const exporter = (window as any).html2pdf;
      
      if (!exporter) {
        throw new Error("CardiaSense PDF Engine failed to initialize globally.");
      }

      await exporter().from(element).set(opt).save();
    } catch (error) {
      console.error('PDF Generation Error:', error);
      alert('CardiaSense AI: Report generation encountered a protocol error. Please verify browser permissions.');
    } finally {
      setIsDownloading(true); // Keep state for a moment for feedback
      setTimeout(() => setIsDownloading(false), 2000);
    }
  };

  const renderClinicalInputs = () => {
    if (!inputs) return "N/A";
    const parts = [
      `Age: ${inputs.age}`,
      `Gender (1:M, 0:F): ${inputs.sex}`,
      `Chest Pain Type: ${inputs.cp}`,
      `Resting BP: ${inputs.trestbps}`,
      `Cholesterol: ${inputs.chol}`,
      `Fasting Blood Sugar: ${inputs.fbs}`,
      `Resting ECG: ${inputs.restecg}`,
      `Max Heart Rate: ${inputs.thalach}`,
      `Exercise Angina: ${inputs.exang}`,
      `ST Depression: ${inputs.oldpeak}`,
      `ST Slope: ${inputs.slope}`,
      `Major Vessels: ${inputs.ca}`,
      `Thalassemia: ${inputs.thal}`
    ];
    return parts.join(' | ');
  };

  return (
    <div className="fixed inset-0 z-[9999] flex flex-col bg-slate-900/98 backdrop-blur-3xl animate-in fade-in duration-300 overflow-hidden pointer-events-auto">
      
      {/* HEADER ACTION BAR */}
      <div className="px-10 py-6 border-b border-slate-800 flex justify-between items-center bg-slate-900 text-white shrink-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl">C</div>
          <div>
            <h2 className="text-sm font-black uppercase tracking-widest">Diagnostic Report Preview</h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CardiaSense AI • Secure Clinical Access</p>
          </div>
        </div>
        
        <div className="flex gap-4">
          <button 
            type="button"
            onClick={(e) => { 
              e.preventDefault(); 
              e.stopPropagation(); 
              onClose(); 
            }} 
            className="px-8 py-3.5 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] hover:text-white transition-all rounded-xl hover:bg-white/5 active:scale-90 cursor-pointer pointer-events-auto select-none"
          >
            Discard Preview
          </button>
          <button 
            type="button"
            onClick={handleDownload}
            disabled={isDownloading}
            className="px-12 py-3.5 bg-blue-600 text-white text-[11px] font-black uppercase tracking-[0.2em] rounded-xl shadow-2xl shadow-blue-500/20 hover:bg-blue-500 transition-all flex items-center gap-4 active:scale-95 disabled:opacity-50 cursor-pointer pointer-events-auto select-none"
          >
            {isDownloading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                Compiling...
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Download PDF
              </>
            )}
          </button>
        </div>
      </div>

      {/* DOCUMENT VIEWPORT */}
      <div className="flex-grow overflow-y-auto p-4 sm:p-12 bg-slate-800/20 custom-scrollbar pointer-events-auto">
        <div 
          ref={reportRef} 
          className="bg-white w-full max-w-[210mm] mx-auto p-16 md:p-24 shadow-2xl min-h-[297mm] text-slate-900 font-sans border border-slate-100 mb-20"
          style={{ color: '#0f172a' }}
        >
          <div className="space-y-12">
            
            {/* Clinical Header */}
            <div className="space-y-4">
              <h1 className="text-4xl font-normal text-blue-600 tracking-tight">CardiaSense AI Diagnostic Report</h1>
              <div className="text-[14px] text-slate-500 font-medium">
                Reference ID: <span className="font-bold text-slate-900">{patientId}</span> | Timestamp: {date}, {currentTime}
              </div>
              <div className="h-[1px] w-full bg-slate-200" />
            </div>

            {/* PATIENT IDENTITY (PROMINENT) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 pt-4">
              <div className="space-y-2">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Patient Name</span>
                <h2 className="text-[48px] font-black text-slate-900 tracking-tighter leading-none">{displayName}</h2>
              </div>
              <div className="space-y-2 md:text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Patient Age</span>
                <h2 className="text-[48px] font-black text-slate-900 tracking-tighter leading-none">{displayAge} <span className="text-xl text-slate-400 font-bold uppercase tracking-widest">Yrs</span></h2>
              </div>
            </div>

            {/* Biometric String */}
            <div className="space-y-6 pt-10">
              <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-widest">Clinical Metrics Trace:</h3>
              <div className="text-[13px] leading-relaxed text-slate-600 bg-slate-50 border border-slate-100 p-8 rounded-2xl font-medium tracking-tight">
                {renderClinicalInputs()}
              </div>
            </div>

            {/* ML Findings */}
            <div className="space-y-6 pt-6">
              <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-widest">Random Forest Analysis:</h3>
              <div className={`text-[48px] font-black tracking-tighter ${riskScore > 60 ? 'text-red-600' : 'text-emerald-500'}`}>
                Risk Score: {riskScore.toFixed(2)}%
              </div>
            </div>

            {/* Narrative Findings */}
            <div className="space-y-6 pt-6">
              <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-widest">Clinical Narrative:</h3>
              <p className="text-[17px] leading-relaxed text-slate-700 font-medium whitespace-pre-line bg-white">
                {clinicalSummary}
              </p>
            </div>

            {/* Recommendations */}
            <div className="space-y-6 pt-6">
              <h3 className="text-[16px] font-black text-slate-900 uppercase tracking-widest">Clinical Recommendations:</h3>
              <ul className="space-y-4">
                {recommendations && recommendations.length > 0 ? (
                  recommendations.map((rec, i) => (
                    <li key={i} className="flex gap-4 text-[16px] text-slate-700 font-bold items-start">
                      <span className="text-slate-300 font-black text-2xl leading-none pt-0.5">•</span>
                      <span>{rec}</span>
                    </li>
                  ))
                ) : (
                  <li className="text-[16px] text-slate-400 italic">Standard cardiovascular monitoring protocol is recommended. No acute deviations identified.</li>
                )}
              </ul>
            </div>

            {/* Regulatory Footer */}
            <div className="pt-24 opacity-40">
              <div className="border-t border-slate-200 pt-8 flex justify-between text-[10px] font-black uppercase tracking-[0.3em]">
                <div className="flex flex-col gap-1">
                  <span>CardiaSense AI Operating System</span>
                  <span className="text-slate-400">Validated Node: {patientId}</span>
                </div>
                <div className="text-right flex flex-col gap-1">
                  <span>Authorized Clinical Export</span>
                  <span className="text-slate-400">TRANS-CERT-ID: {Date.now().toString(16).toUpperCase()}</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
