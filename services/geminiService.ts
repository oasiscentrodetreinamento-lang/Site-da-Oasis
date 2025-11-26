import { GoogleGenAI, Type } from "@google/genai";
import { UserPreferences, WorkoutPlan } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateWorkoutPlan = async (prefs: UserPreferences): Promise<WorkoutPlan | null> => {
  if (!apiKey) {
    console.error("API Key not found");
    return null;
  }

  const prompt = `Crie uma sessão de treino personalizada e detalhada em Português do Brasil para um usuário com os seguintes detalhes:
  Objetivo: ${prefs.goal}
  Nível de Experiência: ${prefs.level}
  Equipamento Disponível: ${prefs.equipment}
  Duração: ${prefs.duration} minutos.
  
  Por favor, forneça um plano estruturado incluindo um nome criativo, nível de dificuldade, aquecimento, exercícios específicos com séries/repetições e desaquecimento. Responda APENAS em Português do Brasil.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            planName: { type: Type.STRING },
            difficulty: { type: Type.STRING },
            duration: { type: Type.STRING },
            warmup: { type: Type.STRING },
            exercises: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  sets: { type: Type.STRING },
                  reps: { type: Type.STRING },
                  notes: { type: Type.STRING }
                },
                required: ["name", "sets", "reps", "notes"]
              }
            },
            cooldown: { type: Type.STRING }
          },
          required: ["planName", "difficulty", "warmup", "exercises", "cooldown", "duration"]
        }
      }
    });

    const text = response.text;
    if (!text) return null;
    
    return JSON.parse(text) as WorkoutPlan;

  } catch (error) {
    console.error("Error generating workout plan:", error);
    return null;
  }
};