// Pre-written empathetic responses for when LLaMA API is unavailable
// These are carefully crafted to be supportive and helpful for teens

export const moodResponses: Record<string, { response: string; tip: string }> =
  {
    happy: {
      response:
        "That's wonderful that you're feeling happy! 😊 This is a great moment to celebrate. Hold onto this feeling and remember what made you feel this way.",
      tip: "Tip: Take a moment to appreciate what brought you joy. Gratitude amplifies happiness!",
    },
    sad: {
      response:
        "It's okay to feel sad. 💙 Your emotions are valid, and feeling down sometimes is a natural part of being human. You're not alone in this.",
      tip: "Tip: Try the 5-4-3-2-1 grounding technique: Name 5 things you see, 4 you touch, 3 you hear, 2 you smell, 1 you taste.",
    },
    anxious: {
      response:
        "Anxiety can feel overwhelming, but remember: you've gotten through every difficult moment before. 💪 Let's bring you back to the present.",
      tip: "Tip: Try box breathing - breathe in for 4, hold for 4, out for 4, hold for 4. Repeat 5 times.",
    },
    angry: {
      response:
        "Anger is telling you something matters to you. 🔥 It's a valid feeling. Take a moment to honor it before deciding your next step.",
      tip: "Tip: Take 5 deep breaths. Write down what made you angry. Sometimes clarity comes with space.",
    },
    empty: {
      response:
        "That numb, empty feeling can be tough to sit with. 🌙 Know that this feeling isn't permanent—it's your mind's way of processing.",
      tip: "Tip: Do something small that usually brings you comfort: tea, music, a favorite place. Small acts matter.",
    },
  };

export const chatResponses = [
  "That sounds really important to you. I'm listening. 💙",
  "I hear you. That must have been challenging. What would help you right now?",
  "You're showing real strength by opening up about this. Keep going. 💪",
  "That's a lot to carry. Have you talked to someone you trust about this?",
  "It makes sense that you feel this way. Your feelings are valid.",
  "What's one small thing that made today a little better?",
  "Remember, you don't have to figure everything out right now. One step at a time.",
  "I'm here for you. Tell me more about what's on your mind.",
];

export const inspirationStories = [
  {
    title: "The Power of Small Steps",
    content:
      "Maya felt overwhelmed by her goals. Instead of giving up, she decided to do just one small task each day. Day by day, her small actions compounded. Three months later, she was amazed at how far she'd come. She realized that every big achievement starts with tiny, consistent steps.",
    lesson:
      "Progress isn't always about giant leaps. Small, consistent actions lead to amazing results.",
    actionable:
      "Today: Pick ONE small task related to your goal and complete it.",
  },
  {
    title: "Turning Failure into Fuel",
    content:
      "Jordan failed his first attempt at getting his driving license. Instead of feeling defeated, he studied harder and practiced more. He learned from his mistakes and passed on the second try. Now he realized that failure wasn't the end—it was just feedback.",
    lesson:
      "Failure is not the opposite of success; it's part of the path to success.",
    actionable:
      "Today: Think of a recent setback and identify one lesson you learned.",
  },
  {
    title: "Finding Strength in Vulnerability",
    content:
      "Sierra always tried to be perfect and never showed her struggles. One day, she opened up to her friend about her anxiety. Her friend shared similar feelings. By being vulnerable, Sierra discovered she wasn't alone, and her friendships became deeper and more real.",
    lesson:
      "It's okay to not be okay. Vulnerability creates genuine connections.",
    actionable: "Today: Share something real with someone you trust.",
  },
  {
    title: "The Gift of Helping Others",
    content:
      "Alex was struggling with his own problems and felt stuck. He decided to volunteer at a local shelter. Helping others made him feel purposeful and reminded him that he had value. Interestingly, helping others ended up helping him too.",
    lesson: "Giving to others is also giving to yourself. Purpose heals.",
    actionable:
      "Today: Do one kind act for someone without expecting anything back.",
  },
];

export function getRandomChatResponse(): string {
  return chatResponses[Math.floor(Math.random() * chatResponses.length)];
}

export function getRandomStory() {
  return inspirationStories[
    Math.floor(Math.random() * inspirationStories.length)
  ];
}
