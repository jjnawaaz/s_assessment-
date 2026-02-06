import OpenAI from "openai";

export const llmClient = new OpenAI({
  apiKey: process.env.GROK_API_KEY,
  baseURL: process.env.GROK_API_URL,
});
