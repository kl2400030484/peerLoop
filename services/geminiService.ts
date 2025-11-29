import { GoogleGenAI, Type } from "@google/genai";
import { RubricCriteria } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Constants for models
const MODEL_TEXT_FAST = 'gemini-2.5-flash';
const MODEL_TEXT_SMART = 'gemini-2.5-flash'; // Using flash for responsiveness in this demo

export const generateRubric = async (title: string, description: string): Promise<RubricCriteria[]> => {
  try {
    const prompt = `Create a grading rubric for a student assignment titled "${title}". 
    The description is: "${description}".
    Generate 3 to 5 distinct criteria.
    Return a JSON object with a "criteria" field containing an array of objects, each having "title", "description", and "maxPoints" (integer between 5 and 20).`;

    const response = await ai.models.generateContent({
      model: MODEL_TEXT_SMART,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            criteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  description: { type: Type.STRING },
                  maxPoints: { type: Type.INTEGER },
                },
                required: ["title", "description", "maxPoints"]
              }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return [];
    
    const parsed = JSON.parse(text);
    return parsed.criteria.map((c: any, index: number) => ({
      ...c,
      id: `generated-${Date.now()}-${index}`
    }));
  } catch (error) {
    console.error("Failed to generate rubric:", error);
    return [];
  }
};

export const analyzeFeedbackTone = async (feedbackText: string, rubricContext: string): Promise<{ constructive: boolean; suggestions: string; score: number }> => {
  try {
    const prompt = `Analyze the following peer review feedback given by a student to another student.
    
    Assignment Context/Rubric Summary: ${rubricContext}

    Feedback to analyze: "${feedbackText}"

    Evaluate if the feedback is constructive, specific, and helpful. 
    Return a JSON object with:
    - "constructive": boolean (true if helpful/specific, false if vague or rude)
    - "score": integer 0-100 (quality of feedback)
    - "suggestions": string (advice to the reviewer on how to improve their feedback, keep it brief).`;

    const response = await ai.models.generateContent({
      model: MODEL_TEXT_FAST,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            constructive: { type: Type.BOOLEAN },
            score: { type: Type.INTEGER },
            suggestions: { type: Type.STRING },
          },
          required: ["constructive", "score", "suggestions"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from AI");
    
    return JSON.parse(text);
  } catch (error) {
    console.error("Failed to analyze feedback:", error);
    return {
      constructive: true, // Default to true to not block user on error
      score: 50,
      suggestions: "Could not analyze feedback at this time. Please review manually."
    };
  }
};

export const summarizeProjectChat = async (messages: string[]): Promise<string> => {
  if (messages.length === 0) return "No discussion yet.";

  try {
    const prompt = `Summarize the following discussion between students collaborating on a project. Highlight key decisions and pending tasks.\n\n${messages.join('\n')}`;
    
    const response = await ai.models.generateContent({
      model: MODEL_TEXT_FAST,
      contents: prompt,
    });

    return response.text || "Could not generate summary.";
  } catch (error) {
    return "Summary unavailable.";
  }
};
