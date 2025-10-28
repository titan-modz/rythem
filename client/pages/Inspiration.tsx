import { useState } from "react";
import { Header } from "@/components/Header";
import { getInspirationStory } from "@/services/llama";
import { useRythmStore } from "@/hooks/useRythmStore";
import { Loader2, Lightbulb } from "lucide-react";

interface Story {
  id: string;
  title: string;
  content: string;
  lesson: string;
  actionable: string;
  emoji: string;
}

const PRESET_STORIES: Story[] = [
  {
    id: "1",
    title: "The Power of Small Steps",
    content:
      "Maya felt overwhelmed by her goals. Instead of giving up, she decided to do just one small task each day. Day by day, her small actions compounded. Three months later, she was amazed at how far she'd come. She realized that every big achievement starts with tiny, consistent steps.",
    lesson:
      "Progress isn't always about giant leaps. Small, consistent actions lead to amazing results.",
    actionable:
      "Today: Pick ONE small task related to your goal and complete it.",
    emoji: "👣",
  },
  {
    id: "2",
    title: "Turning Failure into Fuel",
    content:
      "Jordan failed his first attempt at getting his driving license. Instead of feeling defeated, he studied harder and practiced more. He learned from his mistakes and passed on the second try. Now he realized that failure wasn't the end—it was just feedback.",
    lesson:
      "Failure is not the opposite of success; it's part of the path to success.",
    actionable:
      "Today: Think of a recent setback and identify one lesson you learned.",
    emoji: "🔥",
  },
  {
    id: "3",
    title: "Finding Strength in Vulnerability",
    content:
      "Sierra always tried to be perfect and never showed her struggles. One day, she opened up to her friend about her anxiety. Her friend shared similar feelings. By being vulnerable, Sierra discovered she wasn't alone, and her friendships became deeper and more real.",
    lesson:
      "It's okay to not be okay. Vulnerability creates genuine connections.",
    actionable: "Today: Share something real with someone you trust.",
    emoji: "💙",
  },
  {
    id: "4",
    title: "The Gift of Helping Others",
    content:
      "Alex was struggling with his own problems and felt stuck. He decided to volunteer at a local shelter. Helping others made him feel purposeful and reminded him that he had value. Interestingly, helping others ended up helping him too.",
    lesson: "Giving to others is also giving to yourself. Purpose heals.",
    actionable:
      "Today: Do one kind act for someone without expecting anything back.",
    emoji: "🤝",
  },
  {
    id: "5",
    title: "Redefining Success",
    content:
      "Casey thought success meant being the best at everything. After burning out, she realized success meant being true to herself. She started pursuing things she actually loved, not what others expected. She became happier and ironically, more successful.",
    lesson:
      "True success is living according to YOUR values, not others' definitions.",
    actionable: "Today: Do something just because YOU want to, not for others.",
    emoji: "⭐",
  },
];

export default function Inspiration() {
  const { addXP } = useRythmStore();
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [generatingStory, setGeneratingStory] = useState(false);
  const [generatedStory, setGeneratedStory] = useState<Story | null>(null);
  const [showActionable, setShowActionable] = useState(false);

  const handleGenerateStory = async () => {
    setGeneratingStory(true);
    try {
      const response = await getInspirationStory();

      // Parse the response to extract title, lesson, and actionable
      const lines = response.split("\n");
      let content = response;
      let lesson = "Reflect on what this story means to you.";
      let actionable = "How can you apply this lesson today?";

      // Try to parse structured response
      if (response.includes("**Lesson:**")) {
        const parts = response.split("**Lesson:**");
        content = parts[0];
        const remaining = parts[1];
        if (remaining.includes("**Action:**")) {
          const lessonParts = remaining.split("**Action:**");
          lesson = lessonParts[0].trim();
          actionable = lessonParts[1].trim();
        } else {
          lesson = remaining.trim();
        }
      }

      setGeneratedStory({
        id: "generated",
        title: "Today's Inspiring Story",
        content: content.trim(),
        lesson,
        actionable,
        emoji: "✨",
      });
      addXP(15);
    } catch (error) {
      console.error("Failed to generate story:", error);
      const fallbackStory: Story = {
        id: "fallback",
        title: "Your Unique Journey",
        content:
          "Every day is a new opportunity to grow. You've already overcome challenges to get here. Your resilience is your strength. Today, remember that progress isn't always visible, but it's happening. Trust yourself and take one small step forward.",
        lesson:
          "Your journey is unique and valuable. Every step, no matter how small, matters.",
        actionable:
          "Today: Do something that makes you proud, no matter how small.",
        emoji: "🌟",
      };
      setGeneratedStory(fallbackStory);
      addXP(15);
    } finally {
      setGeneratingStory(false);
    }
  };

  const handleSelectStory = (story: Story) => {
    setSelectedStory(story);
    setShowActionable(false);
    addXP(10);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            💡 Inspiration & Case Studies
          </h1>
          <p className="text-lg text-muted-foreground">
            Real stories with lessons you can apply to your life today
          </p>
        </div>

        {!selectedStory && !generatedStory ? (
          <>
            {/* Generate New Story Button */}
            <button
              onClick={handleGenerateStory}
              disabled={generatingStory}
              className="w-full mb-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {generatingStory ? (
                <>
                  <Loader2 className="animate-spin" size={20} /> Generating your
                  story...
                </>
              ) : (
                <>
                  <Lightbulb size={20} /> Generate Today's Inspiration
                </>
              )}
            </button>

            {/* Story Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {PRESET_STORIES.map((story) => (
                <button
                  key={story.id}
                  onClick={() => handleSelectStory(story)}
                  className="p-6 rounded-xl bg-white dark:bg-slate-800 border-2 border-border hover:border-primary hover:shadow-lg transition text-left"
                >
                  <span className="text-4xl mb-3 block">{story.emoji}</span>
                  <h3 className="text-xl font-bold text-primary mb-2">
                    {story.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {story.content}
                  </p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-primary font-semibold">
                    Read Story →
                  </div>
                </button>
              ))}
            </div>

            {/* Motivation */}
            <div className="mt-8 bg-accent/10 border-2 border-accent rounded-xl p-6 text-center">
              <p className="font-semibold text-foreground">
                📖 Reading a story earns you 10 XP. Taking action earns you even
                more! 🚀
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Story Display */}
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Story Card */}
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border-2 border-primary/20 space-y-6">
                <div className="text-center">
                  <span className="text-6xl block mb-4">
                    {selectedStory?.emoji || generatedStory?.emoji}
                  </span>
                  <h2 className="text-3xl font-bold text-primary mb-2">
                    {selectedStory?.title || generatedStory?.title}
                  </h2>
                </div>

                {/* Story Content */}
                <div className="space-y-4">
                  <p className="text-lg leading-relaxed text-foreground">
                    {selectedStory?.content || generatedStory?.content}
                  </p>

                  {/* Lesson */}
                  <div className="bg-primary/10 border-2 border-primary/30 rounded-lg p-4 space-y-2">
                    <p className="text-sm font-semibold text-primary">
                      💭 The Lesson:
                    </p>
                    <p className="text-foreground leading-relaxed">
                      {selectedStory?.lesson || generatedStory?.lesson}
                    </p>
                  </div>

                  {/* Actionable */}
                  {showActionable && (
                    <div className="bg-secondary/10 border-2 border-secondary/30 rounded-lg p-4 space-y-2 animate-slide-up">
                      <p className="text-sm font-semibold text-secondary">
                        🎯 Your Action:
                      </p>
                      <p className="text-foreground leading-relaxed">
                        {selectedStory?.actionable ||
                          generatedStory?.actionable}
                      </p>
                    </div>
                  )}
                </div>

                {/* Buttons */}
                <div className="space-y-3">
                  {!showActionable ? (
                    <button
                      onClick={() => setShowActionable(true)}
                      className="w-full px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition"
                    >
                      Show Actionable Step
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        addXP(10);
                        setSelectedStory(null);
                        setGeneratedStory(null);
                        setShowActionable(false);
                      }}
                      className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                    >
                      ✓ I'll Do This Today!
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setSelectedStory(null);
                      setGeneratedStory(null);
                      setShowActionable(false);
                    }}
                    className="w-full px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition"
                  >
                    Back to Stories
                  </button>
                </div>
              </div>

              {showActionable && (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6 text-center space-y-3 animate-slide-up">
                  <p className="text-lg font-bold text-green-600">
                    🌟 Amazing!
                  </p>
                  <p className="text-green-700">
                    Commit to one small action today. You've got this!
                  </p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
