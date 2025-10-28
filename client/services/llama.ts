import {
  moodResponses,
  chatResponses,
  getRandomStory,
  getRandomChatResponse,
} from "./responses";

export interface LlamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function callLlamaAPI(messages: LlamaMessage[]): Promise<string> {
  let responseText = "";

  try {
    console.log("Calling /api/llama with", messages.length, "messages");

    const response = await fetch("/api/llama", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ messages }),
    });

    console.log("Server response status:", response.status);

    // Read the response body as text once
    try {
      responseText = await response.text();
      console.log("Response body:", responseText.substring(0, 100));
    } catch (readError) {
      console.error("Failed to read response body:", readError);
      // If we can't read the body, throw and let fallback handle it
      throw new Error("Could not read server response");
    }

    // Parse the text as JSON
    let data: any;
    try {
      if (!responseText) {
        throw new Error("Empty response body");
      }
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error(
        "Failed to parse response as JSON, response was:",
        responseText,
      );
      throw new Error("Server returned invalid response format");
    }

    // Check if the response was successful
    if (!response.ok) {
      console.error("Server error details:", data);
      throw new Error(data.message || `Server error: ${response.status}`);
    }

    console.log("Successfully received AI response");
    return data.response || "I'm here to help. Please try again.";
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error calling LLaMA API:", errorMessage);
    throw error;
  }
}

// Mood check - uses pre-written empathetic responses
export async function getMoodResponse(mood: string): Promise<string> {
  try {
    // Try external API first if available
    const systemPrompt =
      "You are an empathetic, supportive AI giving motivational advice and grounding tips to teens. Keep your response brief, friendly, and actionable. Include one short grounding tip.";
    return await callLlamaAPI([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: `I'm feeling ${mood} right now. Can you help me feel better?`,
      },
    ]);
  } catch (error) {
    console.log(
      "LLaMA API unavailable, using pre-written response for mood:",
      mood,
    );
    // Fallback to pre-written responses
    const moodKey = mood.toLowerCase() as keyof typeof moodResponses;
    const moodData = moodResponses[moodKey] || moodResponses.empty;
    return `${moodData.response}\n\n${moodData.tip}`;
  }
}

// Crisis support prompt
export async function getCrisisResponse(userMessage: string): Promise<string> {
  try {
    const systemPrompt =
      "You are an empathetic, caring AI supporting teens in crisis. Always respond with compassion. Include breathing exercises, comforting words, and encourage them to reach out for professional help. Include crisis hotline information.";
    return await callLlamaAPI([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ]);
  } catch (error) {
    console.log("LLaMA API unavailable, using pre-written response for crisis");
    return `I hear that you're going through something really difficult right now. 💙\n\nPlease know: You matter, and help is available.\n\n**Crisis Resources:**\n- National Suicide Prevention Lifeline: 988 (call or text)\n- Crisis Text Line: Text HOME to 741741\n- International: findahelpline.com\n\nYou don't have to face this alone. Please reach out to someone you trust or call one of these numbers now.`;
  }
}

// General chatbot prompt
export async function getChatResponse(userMessage: string): Promise<string> {
  try {
    const systemPrompt =
      "You are an empathetic, motivational AI for teens. Provide friendly, actionable advice about life, school, stress, and motivation. Keep responses concise and supportive.";
    return await callLlamaAPI([
      { role: "system", content: systemPrompt },
      { role: "user", content: userMessage },
    ]);
  } catch (error) {
    console.log("LLaMA API unavailable, using pre-written response for chat");
    return getRandomChatResponse();
  }
}

// Redemption path prompt
export async function getRedemptionResponse(
  confession: string,
): Promise<string> {
  try {
    const systemPrompt =
      "Respond empathetically to a confession. Suggest 1 positive action for today. Encourage transformation and growth. Avoid judgment, keep a friendly tone.";
    return await callLlamaAPI([
      { role: "system", content: systemPrompt },
      { role: "user", content: confession },
    ]);
  } catch (error) {
    console.log(
      "LLaMA API unavailable, using pre-written response for redemption",
    );
    return `Thank you for being honest with yourself. That takes real courage. 💙\n\nWhat happened doesn't define you. What matters now is that you're thinking about change.\n\n**Your action for today:** Do one small thing that aligns with the person you want to be.\n\nTransformation happens one choice at a time. You've got this!`;
  }
}

// Inspiration prompt
export async function getInspirationStory(): Promise<string> {
  try {
    const systemPrompt =
      "Generate a short, inspiring story (3-4 sentences) for a teen with a practical lesson and actionable tip.";
    return await callLlamaAPI([
      { role: "system", content: systemPrompt },
      {
        role: "user",
        content: "Tell me an inspiring story to motivate me today.",
      },
    ]);
  } catch (error) {
    console.log("LLaMA API unavailable, using pre-written inspiration story");
    const story = getRandomStory();
    return `${story.content}\n\n**Lesson:** ${story.lesson}\n\n**Action:** ${story.actionable}`;
  }
}
