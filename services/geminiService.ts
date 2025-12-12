import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the API client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeSecurityData = async (
  logData: string, 
  images: File[]
): Promise<AnalysisResult> => {
  
  const model = "gemini-2.5-flash";

  // Prepare Schema
  const schema = {
    type: Type.OBJECT,
    properties: {
      riskScore: { type: Type.NUMBER, description: "A score from 0 to 100 indicating overall security risk." },
      riskLevel: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"], description: "Overall risk level categorization." },
      summary: { type: Type.STRING, description: "Executive summary of the analysis." },
      anomalies: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            timestamp: { type: Type.STRING },
            eventType: { type: Type.STRING },
            severity: { type: Type.STRING, enum: ["Low", "Medium", "High", "Critical"] },
            description: { type: Type.STRING },
            sourceIp: { type: Type.STRING }
          }
        }
      },
      suggestions: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            action: { type: Type.STRING },
            reason: { type: Type.STRING },
            priority: { type: Type.STRING, enum: ["Immediate", "High", "Normal"] },
            type: { type: Type.STRING, enum: ["Network", "System", "Policy"] }
          }
        }
      },
      threatDistribution: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING, description: "Category of threat (e.g., Auth, Network, Malware)" },
            value: { type: Type.NUMBER, description: "Count or intensity" }
          }
        }
      }
    },
    required: ["riskScore", "riskLevel", "summary", "anomalies", "suggestions", "threatDistribution"]
  };

  // Convert images to base64 if present
  const imageParts = await Promise.all(
    images.map(async (file) => {
      const base64Data = await fileToGenerativePart(file);
      return {
        inlineData: {
          data: base64Data,
          mimeType: file.type,
        },
      };
    })
  );

  const prompt = `
    Analyze the following system logs and/or network diagrams for security breaches, anomalies, and potential threats.
    
    LOG DATA:
    ${logData}

    INSTRUCTIONS:
    1. Identify any suspicious activities (brute force, unauthorized access, data exfiltration, anomalies).
    2. Assign a risk score (0-100) and level.
    3. List specific anomalies found with timestamps.
    4. Provide actionable suggestions to mitigate these risks.
    5. Categorize threats for visualization.
    
    Return the response strictly in JSON format matching the schema.
  `;

  const contents = {
    parts: [
      { text: prompt },
      ...imageParts
    ]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: contents,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
        temperature: 0.2, // Low temperature for analytical precision
      },
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text) as AnalysisResult;

  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
};

async function fileToGenerativePart(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      resolve(base64String);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}