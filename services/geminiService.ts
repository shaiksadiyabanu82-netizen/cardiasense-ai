
import { GoogleGenAI, Type } from "@google/genai";
import { PatientData, PredictionResult, SymptomAnalysis, SearchResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzePatientRisk = async (data: PatientData): Promise<Omit<PredictionResult, 'id' | 'userId' | 'timestamp' | 'inputs'>> => {
  const prompt = `Act as a senior cardiologist and machine learning expert. Analyze these patient metrics:
    Age: ${data.age}, Sex: ${data.sex === 1 ? 'Male' : 'Female'}, Chest Pain: ${data.cp}, 
    BP: ${data.trestbps}, Cholesterol: ${data.chol}, FBS: ${data.fbs}, 
    ECG: ${data.restecg}, MaxHR: ${data.thalach}, Ex.Angina: ${data.exang}, 
    Oldpeak: ${data.oldpeak}, Slope: ${data.slope}, CA: ${data.ca}, Thal: ${data.thal}.
    
    Instructions:
    1. Calculate a riskScore (0-100).
    2. Determine riskLevel (LOW/MODERATE/HIGH).
    3. Write a clinicalSummary (A formal medical paragraph).
    4. Provide feature attribution (SHAP values): An array of 5 features that impacted the score most. 
       Use 'impact' values between -1 (reduces risk) and 1 (increases risk).
    5. Provide a 5-year longitudinal forecast: An array of 5 years starting from 2024 with estimated risk % increases.
    6. Provide treatmentSuggestions (array of 3 items with medication, sensitivity, and description).
    
    Return the response strictly as JSON.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          riskScore: { type: Type.NUMBER },
          riskLevel: { type: Type.STRING, enum: ["LOW", "MODERATE", "HIGH"] },
          clinicalSummary: { type: Type.STRING },
          explanation: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { 
                feature: { type: Type.STRING }, 
                impact: { type: Type.NUMBER } 
              }
            }
          },
          forecast: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { year: { type: Type.NUMBER }, risk: { type: Type.NUMBER } }
            }
          },
          treatmentSuggestions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: { 
                medication: { type: Type.STRING }, 
                sensitivity: { type: Type.STRING }, 
                description: { type: Type.STRING } 
              }
            }
          }
        },
        required: ["riskScore", "riskLevel", "clinicalSummary", "explanation", "forecast", "treatmentSuggestions"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const searchClinicalResearch = async (query: string): Promise<SearchResult> => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Find latest medical research or clinical guidelines for: ${query}. Focus on heart disease and cardiovascular health.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      title: chunk.web?.title || 'Medical Source',
      uri: chunk.web?.uri || '#'
    })) || [];

  return {
    answer: response.text || "No research findings found.",
    sources: sources
  };
};

export const analyzeSymptomsNLP = async (text: string): Promise<SymptomAnalysis> => {
  const prompt = `Analyze these heart-related symptoms using medical NLP: "${text}". 
  Provide a professional clinical summary, a list of detected symptoms, and an interpretation accuracy score (0-1).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          summary: { type: Type.STRING },
          accuracy: { type: Type.NUMBER },
          detectedSymptoms: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["summary", "accuracy", "detectedSymptoms"]
      }
    }
  });

  return JSON.parse(response.text || '{}');
};

export const analyzeDiagnosticImage = async (base64Data: string, type: 'ECG' | 'XRAY'): Promise<string> => {
  const prompt = `Analyze this medical ${type} image for any signs of cardiovascular abnormalities or heart disease biomarkers. Provide detailed clinical findings.`;
  
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: {
      parts: [
        { inlineData: { data: base64Data.split(',')[1], mimeType: "image/png" } },
        { text: prompt }
      ]
    }
  });
  return response.text || "Analysis failed.";
};
