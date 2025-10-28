/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * LLaMA API message type
 */
export interface LlamaMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

/**
 * Mood check response
 */
export interface MoodCheckResponse {
  mood: string;
  response: string;
  xpEarned: number;
  timestamp: number;
}

/**
 * User progress and gamification data
 */
export interface UserProgress {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  badges: string[];
  redemptionPoints: number;
  tasksCompleted: number;
}
