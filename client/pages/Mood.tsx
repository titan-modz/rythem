import { useState } from "react";
import { getMoodResponse } from "@/services/llama";
import { useRythmStore } from "@/hooks/useRythmStore";
import { Header } from "@/components/Header";
import { Loader2 } from "lucide-react";

interface Mood {
  emoji: string;
  label: string;
  value: string;
  color: string;
}

const MOODS: Mood[] = [
  {
    emoji: "😊",
    label: "Happy",
    value: "happy",
    color: "from-yellow-300 to-yellow-400",
  },
  {
    emoji: "😢",
    label: "Sad",
    value: "sad",
    color: "from-blue-300 to-blue-400",
  },
  {
    emoji: "😰",
    label: "Anxious",
    value: "anxious",
    color: "from-orange-300 to-orange-400",
  },
  {
    emoji: "😠",
    label: "Angry",
    value: "angry",
    color: "from-red-300 to-red-400",
  },
  {
    emoji: "😶",
    label: "Empty",
    value: "empty",
    color: "from-gray-300 to-gray-400",
  },
];

export default function Mood() {
  const { recordMoodCheckIn, updateStreak, addXP } = useRythmStore();
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [response, setResponse] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showResponse, setShowResponse] = useState(false);

  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood.value);
    setLoading(true);
    setShowResponse(false);

    try {
      const aiResponse = await getMoodResponse(mood.label.toLowerCase());
      setResponse(aiResponse);
      setShowResponse(true);

      // Record the check-in
      recordMoodCheckIn(mood.value, aiResponse);
      updateStreak();
      addXP(10);
    } catch (error) {
      // Should rarely happen now with fallback responses, but just in case
      console.error("Failed to get mood response:", error);
      const fallbackResponse = `I'm here to support you! You're feeling ${mood.label.toLowerCase()} right now. Remember to breathe deeply and be kind to yourself. 💙\n\nGrounding tip: Try the 5-4-3-2-1 technique: Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. This brings you back to the present moment.`;
      setResponse(fallbackResponse);
      setShowResponse(true);
      recordMoodCheckIn(mood.value, fallbackResponse);
      updateStreak();
      addXP(10);
    } finally {
      setLoading(false);
    }
  };

  const handleNewCheckIn = () => {
    setSelectedMood(null);
    setResponse("");
    setShowResponse(false);
  };

  const selectedMoodData = MOODS.find((m) => m.value === selectedMood);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {!showResponse ? (
          <div className="space-y-8 animate-fade-in">
            <div className="text-center space-y-4">
              <h1 className="text-3xl md:text-4xl font-bold text-primary">
                How are you feeling?
              </h1>
              <p className="text-lg text-muted-foreground">
                Select your current mood to get personalized support and tips
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
              {MOODS.map((mood) => (
                <button
                  key={mood.value}
                  onClick={() => handleMoodSelect(mood)}
                  disabled={loading}
                  className={`group relative flex flex-col items-center justify-center gap-3 py-6 px-4 rounded-2xl transition-all duration-300 ${
                    selectedMood === mood.value
                      ? `bg-gradient-to-br ${mood.color} text-white shadow-xl scale-105`
                      : "bg-white dark:bg-slate-800 text-foreground hover:shadow-lg hover:scale-105 border-2 border-border"
                  } ${loading && selectedMood !== mood.value ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <span className="text-5xl md:text-6xl transition-transform group-hover:scale-110">
                    {mood.emoji}
                  </span>
                  <span className="font-semibold text-sm md:text-base">
                    {mood.label}
                  </span>
                  {loading && selectedMood === mood.value && (
                    <Loader2
                      className="absolute animate-spin text-current"
                      size={20}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-8 animate-slide-up">
            {/* Mood Confirmation */}
            <div className="text-center">
              <div className="inline-flex items-center gap-3 bg-gradient-to-r from-primary/10 to-secondary/10 px-6 py-3 rounded-full border border-primary/30">
                <span className="text-3xl">{selectedMoodData?.emoji}</span>
                <span className="text-lg font-semibold text-primary">
                  You're feeling {selectedMoodData?.label.toLowerCase()}
                </span>
              </div>
            </div>

            {/* AI Response Card */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 md:p-8 border-2 border-primary/20">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <span className="text-3xl">💙</span>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold text-primary mb-3">
                      Your personalized support:
                    </h2>
                    <p className="text-foreground leading-relaxed whitespace-pre-wrap">
                      {response}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleNewCheckIn}
                className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors"
              >
                Check in again
              </button>
              <a
                href="/"
                className="px-8 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-colors text-center"
              >
                Return to home
              </a>
            </div>

            {/* Tips Section */}
            <div className="bg-accent/10 border-2 border-accent rounded-xl p-6 text-center">
              <p className="text-sm text-foreground">
                ✨ Remember: You've earned 10 XP for checking in! Keep building
                positive habits.
              </p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
