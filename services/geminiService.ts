
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
        text: `Analyze this image for cybersecurity threats and technical origin. 
        1. Identify the Source: Is this a screenshot of a browser download? A social media app? A fake login page? Look for browser UI elements, download bars, or system notifications.
        2. Detect Threats: Check for phishing links in text, suspicious QR codes, or fraudulent branding.
        3. Technical Details: Note visible metadata or UI patterns.
        Return a detailed report in JSON format.`
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
          imageOrigin: { type: Type.STRING, description: "Likely source of the image (e.g., Browser Download, WhatsApp Screenshot, etc.)" },
          technicalDetails: { type: Type.STRING, description: "Technical visual observations like resolution patterns or UI chrome." }
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
    contents: "Provide 5 specific, high-quality mobile security tips for a user's phone. Focus on permissions, public Wi-Fi, app updates, and phishing trends. Identify 2 as 'urgent'.",
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
