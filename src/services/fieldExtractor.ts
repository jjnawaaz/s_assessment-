import { ExtractedFields } from "../types/extractedFields";
import { llmClient } from "./llmClient";
import { buildExtractionPrompt } from "../prompts/extractFieldsPrompt";

export async function extractFieldsFromText(
  rawText: string,
): Promise<ExtractedFields> {
  const prompt = buildExtractionPrompt(rawText);

  const response = await llmClient.responses.create({
    model: process.env.LLM_MODEL || "llama-3.3-70b-versatile",
    temperature: 0,
    input: [
      {
        role: "system",
        content:
          "You are a deterministic JSON extraction engine. Output JSON only.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  const outputText = response.output_text;
  const cleaned = outputText
    .replace(/```json/i, "")
    .replace(/```/g, "")
    .trim();

  if (!outputText) {
    throw new Error("LLM returned empty output");
  }

  try {
    return JSON.parse(cleaned) as ExtractedFields;
  } catch (err) {
    console.error("LLM RAW OUTPUT:", outputText);
    throw new Error("Failed to parse LLM JSON output");
  }
}
