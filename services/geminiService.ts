
import { GoogleGenAI, Type } from "@google/genai";
import { SafetyStatus, RiskLevel, ScanResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });

export const analyzeLink = async (url: string): Promise<ScanResult> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Look at this link: ${url}. 
    Is it safe? Tell me in very easy English. 
    Give me points on what I should do next.`,
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
        text: `Look at this picture carefully. Tell me what it is using very simple English words. 
        1. Where is this from? (Is it a Chat, Web, or Photo?)
        2. Is it safe or dangerous? 
        3. Describe exactly what you see in the picture. Mention any buttons, text, or logos.
        4. Give me a list of points on what I should do.
        Return as JSON.`
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
          recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          imageOrigin: { type: Type.STRING },
          technicalDetails: { type: Type.STRING }
        },
        required: ["status", "riskLevel", "threatType", "explanation", "recommendations", "imageOrigin", "technicalDetails"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const getSafetyTips = async (): Promise<{ title: string; tips: { text: string; urgent: boolean }[] }> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: "Give me 5 simple safety tips for my phone. Use very easy English. Make each tip a short point. Tell me which ones are very important.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          tips: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                text: { type: Type.STRING },
                urgent: { type: Type.BOOLEAN }
              },
              required: ["text", "urgent"]
            }
          }
        },
        required: ["title", "tips"]
      }
    }
  });
  return JSON.parse(response.text);
};

export const analyzeFileMetadata = async (fileName: string, fileType: string, base64Content?: string): Promise<ScanResult> => {
  const parts: any[] = [{ text: `Is this file safe? Name: "${fileName}", Type: "${fileType}". Use very simple English to explain.` }];
  
  if (base64Content) {
    parts.push({
      inlineData: {
        data: base64Content,
        mimeType: fileType.includes('image') ? fileType : 'image/png'
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
    contents: `Check if this message is nice and safe: "${text}". Use very simple English.`,
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
    contents: `Check if these apps are safe. Use simple English points. Apps: ${JSON.stringify(apps)}.`,
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
