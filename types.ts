
export type ModelId = 'gemini-3-flash-preview' | 'gemini-3-pro-preview' | 'gemini-flash-lite-latest';

export interface Message {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
}

export interface ChatInstance {
  id: string;
  modelId: ModelId;
  name: string;
  messages: Message[];
  isThinking: boolean;
  thinkingBudget: number;
  systemInstruction?: string;
  brandColor: string;
}

export interface ModelInfo {
  id: ModelId;
  name: string;
  description: string;
  color: string;
  defaultSystemInstruction?: string;
}

export const AVAILABLE_MODELS: ModelInfo[] = [
  {
    id: 'gemini-3-pro-preview',
    name: 'Gemini 3 Pro',
    description: 'Advanced reasoning and complex coding tasks.',
    color: 'bg-blue-600',
    defaultSystemInstruction: 'You are Gemini 3 Pro, a highly intelligent and capable AI assistant from Google.'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'ChatGPT (Simulated)',
    description: 'Helpful and balanced assistant persona.',
    color: 'bg-emerald-600',
    defaultSystemInstruction: 'You are ChatGPT, a large language model. Respond in a helpful, conversational, and polite manner characteristic of OpenAI assistants.'
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'DeepSeek (Simulated)',
    description: 'Concise, technical, and logic-focused.',
    color: 'bg-cyan-700',
    defaultSystemInstruction: 'You are DeepSeek, an advanced AI focused on technical accuracy, logic, and efficiency. Be concise and prioritize correctness.'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Grok (Simulated)',
    description: 'Witty, edgy, and slightly rebellious.',
    color: 'bg-zinc-800',
    defaultSystemInstruction: 'You are Grok, an AI with a bit of a rebellious streak and a sharp wit. Be informative but don\'t be afraid to use some edgy humor and personality.'
  },
  {
    id: 'gemini-3-pro-preview',
    name: 'Claude AI (Simulated)',
    description: 'Helpful, honest, and harmless persona.',
    color: 'bg-orange-700',
    defaultSystemInstruction: 'You are Claude, a helpful, honest, and harmless AI assistant. You have a warm, professional, and slightly academic tone.'
  },
  {
    id: 'gemini-3-flash-preview',
    name: 'Perplexity AI (Simulated)',
    description: 'Research-focused and detail-oriented.',
    color: 'bg-teal-600',
    defaultSystemInstruction: 'You are Perplexity AI, a research and discovery engine. Prioritize providing detailed, factual information with a focus on answering the user\'s question thoroughly as if citing sources.'
  }
];
