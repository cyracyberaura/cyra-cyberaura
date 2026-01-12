
import { GoogleGenAI, Type } from "@google/genai";
import { SafetyStatus, RiskLevel, ScanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeLink = async (url: string): Promise<ScanResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this URL for potential cybersecurity threats: ${url}. 
    Provide a professional security assessment including phishing detection, malware presence, and scam likelihood.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: Object.values(SafetyStatus) },
          riskLevel: { type: Type.STRING, enum: Object.values(RiskLevel) },
          threatType: { type: Type.STRING },
          explanation: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["status", "riskLevel", "threatType", "explanation", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const scanImage = async (base64Data: string, mimeType: string): Promise<ScanResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: [
      {
        inlineData: {
          data: base64Data,
          mimeType: mimeType
        }
      },
      {
        text: "Analyze this image (likely a screenshot or document) for cybersecurity threats. Check for phishing indicators, fake login forms, suspicious URLs in text, or fraudulent branding. Return a security report in JSON."
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: Object.values(SafetyStatus) },
          riskLevel: { type: Type.STRING, enum: Object.values(RiskLevel) },
          threatType: { type: Type.STRING },
          explanation: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["status", "riskLevel", "threatType", "explanation", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const analyzeFileMetadata = async (fileName: string, fileType: string, base64Content?: string): Promise<ScanResult> => {
  const parts: any[] = [{ text: `Predict behavior and potential threats for a file with name: "${fileName}" and type: "${fileType}".` }];
  
  if (base64Content) {
    parts.push({
      inlineData: {
        data: base64Content,
        mimeType: fileType.includes('image') ? fileType : 'image/png' // Fallback for visual check if applicable
      }
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts },
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: Object.values(SafetyStatus) },
          riskLevel: { type: Type.STRING, enum: Object.values(RiskLevel) },
          threatType: { type: Type.STRING },
          explanation: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["status", "riskLevel", "threatType", "explanation", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const moderateComment = async (text: string): Promise<{ isAllowed: boolean; reason?: string }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Moderate this community comment for a cybersecurity app: "${text}". 
    Check for spam, abuse, phishing links, or misinformation.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          isAllowed: { type: Type.BOOLEAN },
          reason: { type: Type.STRING }
        },
        required: ["isAllowed"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const performOneClickCheck = async (apps: any[]): Promise<ScanResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze this device summary for overall risk. 
    Apps: ${JSON.stringify(apps)}. Consider permissions, unknown sources, and background usage.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          status: { type: Type.STRING, enum: Object.values(SafetyStatus) },
          riskLevel: { type: Type.STRING, enum: Object.values(RiskLevel) },
          threatType: { type: Type.STRING },
          explanation: { type: Type.STRING },
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } }
        },
        required: ["status", "riskLevel", "threatType", "explanation", "recommendations"]
      }
    }
  });

  return JSON.parse(response.text);
};
