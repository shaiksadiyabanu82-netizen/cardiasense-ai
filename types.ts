
export enum UserRole {
  PATIENT = 'PATIENT',
  CLINICAL = 'CLINICAL'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  medicalId?: string;
  avatar?: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

export interface PatientData {
  age: number;
  sex: number; // 1: male, 0: female
  cp: number; // chest pain type
  trestbps: number; // resting blood pressure
  chol: number; // serum cholestoral
  fbs: number; // fasting blood sugar
  restecg: number; // resting electrocardiographic results
  thalach: number; // maximum heart rate achieved
  exang: number; // exercise induced angina
  oldpeak: number; // ST depression induced by exercise
  slope: number; // slope of peak exercise ST segment
  ca: number; // number of major vessels
  thal: number; // thal: 3 = normal; 6 = fixed defect; 7 = reversable defect
}

export interface PredictionResult {
  id: string;
  userId: string;
  timestamp: string;
  riskScore: number;
  riskLevel: 'LOW' | 'MODERATE' | 'HIGH';
  clinicalSummary: string;
  inputs: PatientData; 
  explanation: {
    feature: string;
    impact: number;
  }[];
  forecast: {
    year: number;
    risk: number;
  }[];
  treatmentSuggestions: {
    medication: string;
    sensitivity: string;
    description: string;
  }[];
}

export interface SymptomAnalysis {
  summary: string;
  accuracy: number;
  detectedSymptoms: string[];
}

export interface SearchResult {
  answer: string;
  sources: { title: string; uri: string }[];
}

export interface Hospital {
  name: string;
  address: string;
  distance: string;
  link: string;
}

export interface ClinicalMetadata {
  physicianName: string;
  qualifications: string;
  clinicName: string;
}
