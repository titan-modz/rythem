import { RequestHandler } from "express";
import { LlamaMessage } from "@shared/api";

interface LlamaRequest {
  model: string;
  messages: LlamaMessage[];
}

interface LlamaResponse {
  id: string;
  object: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: string;
      content: string;
    };
    finish_reason: string;
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export const handleLlamaCall: RequestHandler = async (req, res) => {
  try {
    const { messages } = req.body as { messages: LlamaMessage[] };

    if (!messages || !Array.isArray(messages)) {
      console.error("Invalid messages format:", req.body);
      return res.status(400).json({ error: "Invalid messages format" });
    }

    const LLAMA_API_URL = "https://api.llama.ai/v1/chat";
    const LLAMA_API_KEY =
      process.env.LLAMA_API_KEY ||
      "sk-or-v1-ca809c2abc3+2199bd19ae716effc00cf73a957834b8816d1c4683cb6234ed36";

    const llamaRequest: LlamaRequest = {
      model: "llama-v1",
      messages,
    };

    console.log("Calling LLaMA API with:", {
      url: LLAMA_API_URL,
      model: llamaRequest.model,
    });

    const response = await fetch(LLAMA_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LLAMA_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(llamaRequest),
    });

    console.log(
      "LLaMA API response status:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      let errorBody = "";
      try {
        errorBody = await response.text();
        console.error(
          `LLaMA API error: ${response.status} ${response.statusText}`,
          errorBody,
        );
      } catch (readError) {
        console.error(
          `LLaMA API error: ${response.status} ${response.statusText}, could not read body`,
        );
      }
      return res.status(500).json({
        error: "Failed to get AI response",
        message:
          "The AI service is currently unavailable. Please try again in a moment.",
        details: `API returned ${response.status}`,
      });
    }

    let data: LlamaResponse;
    try {
      data = await response.json();
    } catch (parseError) {
      console.error("Failed to parse LLaMA API response as JSON:", parseError);
      return res.status(500).json({
        error: "Invalid response format",
        message:
          "The AI service returned an unexpected response. Please try again.",
      });
    }

    console.log("LLaMA API response received successfully");

    const aiResponse =
      data.choices[0]?.message?.content ||
      "I'm here to help. Please try again.";

    res.json({
      response: aiResponse,
      success: true,
    });
  } catch (error) {
    console.error(
      "Error calling LLaMA API:",
      error instanceof Error ? error.message : error,
    );
    res.status(500).json({
      error: "Failed to process your request",
      message:
        "I'm having trouble connecting right now. Please try again in a moment.",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
