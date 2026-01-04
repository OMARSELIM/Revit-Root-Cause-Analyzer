import { GoogleGenAI, Type } from "@google/genai";
import { WarningGroup, AnalysisResult, RootCause } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeRootCauses = async (warnings: WarningGroup[]): Promise<AnalysisResult> => {
  const totalWarnings = warnings.reduce((acc, curr) => acc + curr.count, 0);
  
  // Prepare a concise summary for the prompt to save tokens
  // We send the warning message and its frequency.
  const warningSummary = warnings.map(w => `- "${w.message}" (Count: ${w.count})`).join('\n');

  const prompt = `
    You are an expert BIM Manager and Revit API Developer. 
    I will provide a list of Revit warnings with their frequency counts.
    
    Your task is NOT to just list them. You must analyze them to find the **ROOT CAUSE**.
    
    Group these warnings into semantic categories based on the underlying systemic issue (e.g., "Sloppy Modeling", "Constraint Conflicts", "Family Definition Errors", "Duplicate Data").
    
    For each root cause group:
    1. Identify the severity (Critical, Moderate, Low).
    2. Explain WHY this is happening (the deep dive).
    3. Suggest a RADICAL, SYSTEMIC SOLUTION. Don't just say "fix the element". Suggest workflow changes, Dynamo scripts, or training topics that solve it forever.
    4. List which specific warning messages from the input belong to this root cause.

    Data to analyze:
    ${warningSummary}
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: prompt,
    config: {
      responseMimeType: 'application/json',
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          rootCauses: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING, description: "Short title of the root cause" },
                severity: { type: Type.STRING, enum: ["Critical", "Moderate", "Low"] },
                description: { type: Type.STRING, description: "Detailed explanation of why this happens" },
                radicalSolution: { type: Type.STRING, description: "Systemic solution or workflow change" },
                workflowImpact: { type: Type.STRING, description: "How fixing this improves the project (e.g. Performance, Accuracy)" },
                affectedWarningTypes: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  description: "The exact warning messages from the input that fall under this cause"
                }
              }
            }
          }
        }
      }
    }
  });

  const text = response.text || "{}";
  const data = JSON.parse(text);

  return {
    rootCauses: data.rootCauses || [],
    totalWarnings,
    analyzedAt: new Date().toISOString()
  };
};
