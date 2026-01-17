
import { GoogleGenAI, GenerateContentResponse, Chat } from "@google/genai";
import { Message, ModelId } from "../types";

/**
 * Creates a new Gemini chat instance.
 * Thinking config is supported for Gemini 3 and 2.5 series models.
 */
export const createGeminiChat = (modelId: ModelId, thinkingBudget: number = 0, systemInstruction?: string): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const config: any = {
    temperature: 0.7,
  };

  if (thinkingBudget > 0) {
    config.thinkingConfig = { thinkingBudget };
  }

  if (systemInstruction) {
    config.systemInstruction = systemInstruction;
  }

  return ai.chats.create({
    model: modelId,
    config,
  });
};

/**
 * Sends a message to the Gemini model and returns the response text.
 */
export const sendMessageToGemini = async (
  chat: Chat,
  message: string
): Promise<string> => {
  try {
    const response: GenerateContentResponse = await chat.sendMessage({ message });
    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return `Error: ${error instanceof Error ? error.message : "An unknown error occurred"}`;
  }
};
