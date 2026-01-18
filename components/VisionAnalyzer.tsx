
import React, { useState } from 'react';
import { analyzeDiagnosticImage } from '../services/geminiService';

export const VisionAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setAnalysis(''); // Clear previous analysis on new upload
      setFile(selected);
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result as string);
      reader.readAsDataURL(selected);
    }
  };

  const runAnalysis = async () => {
    if (!preview) return;
    setLoading(true);
    setAnalysis('');
    try {
      const result = await analyzeDiagnosticImage(preview, 'ECG');
      setAnalysis(result);
    } catch (err) {
      setAnalysis("Error analyzing image.");
    } finally {
      setLoading(false);
    }
  };

  // Determine if the image is ready for analysis (uploaded but not yet analyzed/analyzing)
  const isReadyForAnalysis = preview && !analysis && !loading;

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
        Diagnostics Scanner (X-Ray/ECG)
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className={`block w-full cursor-pointer border-2 rounded-xl p-8 hover:bg-slate-50 transition-all text-center relative overflow-hidden ${
            isReadyForAnalysis ? 'border-blue-500 ring-4 ring-blue-100 animate-pulse' : 'border-dashed border-slate-300'
          }`}>
            <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
            {preview ? (
              <div className="relative group">
                <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-lg shadow-sm" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-lg flex items-center justify-center">
                  <span className="text-white opacity-0 group-hover:opacity-100 text-xs font-bold bg-black/50 px-2 py-1 rounded">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="text-slate-400">
                <svg className="w-12 h-12 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Click to upload medical image
              </div>
            )}
          </label>
          <button 
            onClick={runAnalysis}
            disabled={!preview || loading}
            className={`w-full mt-4 py-2.5 rounded-xl font-semibold transition-all shadow-md ${
              loading 
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                : isReadyForAnalysis 
                  ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-blue-200'
                  : 'bg-slate-900 text-white hover:bg-slate-800'
            }`}
          >
            {loading ? 'Processing...' : analysis ? 'Re-run Analysis' : 'Run Vision Analysis'}
          </button>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 min-h-[200px] flex flex-col relative">
          <p className="text-sm font-medium text-slate-500 mb-2 uppercase tracking-wide">Clinical Findings:</p>
          <div className="flex-grow overflow-y-auto">
            {loading ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50/80 backdrop-blur-[1px] z-10 rounded-xl">
                <div className="w-10 h-10 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                <p className="text-sm font-bold text-blue-600 animate-pulse">Gemini is analyzing pixels...</p>
                <p className="text-[10px] text-slate-400 mt-1 italic">Detecting patterns & biomarkers</p>
              </div>
            ) : analysis ? (
              <div className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed animate-in fade-in duration-500">
                {analysis}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mb-2">
                  <svg className="w-6 h-6 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p className="text-xs text-slate-400 italic">No analysis performed yet. Upload an ECG or X-Ray to begin.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
