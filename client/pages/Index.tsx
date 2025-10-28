import { Header } from "@/components/Header";
import { useRythmStore } from "@/hooks/useRythmStore";
import { ArrowRight, Heart, Zap, Brain, Target, Music, MessageCircle, Lightbulb } from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
  color: string;
  coming?: boolean;
}

const features: Feature[] = [
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Mood Check",
    description: "Check in with your feelings and get personalized support and grounding tips",
    href: "/mood",
    color: "from-pink-400 to-rose-400",
  },
  {
    icon: <MessageCircle className="w-6 h-6" />,
    title: "AI Chatbot",
    description: "Chat with our empathetic AI about life, school, stress, and motivation",
    href: "/chat",
    color: "from-blue-400 to-cyan-400",
  },
  {
    icon: <Target className="w-6 h-6" />,
    title: "Daily Tasks",
    description: "Complete daily habits and earn XP: make bed, drink water, gratitude, walks",
    href: "/tasks",
    color: "from-orange-400 to-yellow-400",
  },
  {
    icon: <Zap className="w-6 h-6" />,
    title: "Fitness Lite",
    description: "Quick exercises with reminders and streak tracking to build momentum",
    href: "/fitness",
    color: "from-purple-400 to-pink-400",
  },
  {
    icon: <Brain className="w-6 h-6" />,
    title: "Calm Games",
    description: "Tap-to-breathe, color match, focus timer with soothing nature sounds",
    href: "/games",
    color: "from-green-400 to-teal-400",
  },
  {
    icon: <Music className="w-6 h-6" />,
    title: "Sleep Aid",
    description: "Calm stories, meditation, guided breathing, and soothing soundscapes",
    href: "/sleep",
    color: "from-indigo-400 to-blue-400",
  },
  {
    icon: <Lightbulb className="w-6 h-6" />,
    title: "Inspiration",
    description: "Short inspirational stories with lessons and actionable tips",
    href: "/inspiration",
    color: "from-yellow-300 to-orange-400",
  },
  {
    icon: <Heart className="w-6 h-6" />,
    title: "Mind Journal",
    description: "Track mood, stress, sleep, and get weekly AI-powered progress reports",
    href: "/journal",
    color: "from-rose-400 to-pink-400",
  },
];

export default function Index() {
  const { progress } = useRythmStore();
  const [selectedBadgeId, setSelectedBadgeId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/5 via-secondary/5 to-transparent py-12 md:py-20">
        <div className="container max-w-6xl mx-auto px-4 space-y-8 md:space-y-12">
          {/* Welcome Message */}
          <div className="text-center space-y-4 animate-fade-in">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight">
              Your personal AI wellness companion
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              RythmAI helps teens build healthy habits, manage emotions, and find their rhythm through gamified wellness, AI support, and mindful practices.
            </p>
          </div>

          {/* Stats Showcase */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6 max-w-2xl mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center border-2 border-primary/20">
              <div className="text-4xl font-bold text-primary mb-2">Level {progress.level}</div>
              <div className="text-sm text-muted-foreground">Current Level</div>
              <div className="mt-2 text-xs bg-primary/10 text-primary px-3 py-1 rounded-full inline-block">
                {progress.xp % 100}/100 XP
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center border-2 border-secondary/20">
              <div className="text-4xl font-bold text-secondary mb-2">{progress.currentStreak}🔥</div>
              <div className="text-sm text-muted-foreground">Check-in Streak</div>
              <div className="mt-2 text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full inline-block">
                Best: {progress.longestStreak}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 text-center border-2 border-accent/20">
              <div className="text-4xl font-bold text-accent mb-2">{progress.badges.length}</div>
              <div className="text-sm text-muted-foreground">Badges Earned</div>
              <div className="mt-2 text-xs bg-accent/10 text-accent px-3 py-1 rounded-full inline-block">
                More coming!
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Badges Section */}
      {progress.badges.length > 0 && (
        <section className="py-8 md:py-12 border-t border-border">
          <div className="container max-w-6xl mx-auto px-4">
            <h2 className="text-2xl md:text-3xl font-bold text-primary mb-6">Your Achievements</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
              {progress.badges.map((badge) => (
                <button
                  key={badge.id}
                  onClick={() => setSelectedBadgeId(selectedBadgeId === badge.id ? null : badge.id)}
                  className="group relative bg-white dark:bg-slate-800 rounded-xl p-4 border-2 border-accent/30 hover:border-accent hover:shadow-lg transition-all"
                >
                  <div className="text-4xl mb-2 text-center group-hover:scale-110 transition-transform">
                    {badge.icon}
                  </div>
                  <div className="text-xs font-semibold text-center text-primary">{badge.name}</div>
                  {selectedBadgeId === badge.id && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap z-10">
                      {badge.description}
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Features Grid */}
      <section className="py-12 md:py-20 border-t border-border">
        <div className="container max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Explore Your Wellness Nodes
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each node is designed to support different aspects of your mental wellness journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {features.map((feature) => (
              <a
                key={feature.title}
                href={feature.href}
                className={`group relative overflow-hidden rounded-2xl border-2 transition-all duration-300 ${
                  feature.coming
                    ? "border-muted/50 bg-muted/20 opacity-60 cursor-not-allowed"
                    : "border-primary/30 bg-white dark:bg-slate-800 hover:border-primary hover:shadow-xl hover:scale-105"
                }`}
              >
                {/* Gradient Background */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                />

                {/* Content */}
                <div className="relative p-6 md:p-8 space-y-4">
                  <div
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white bg-gradient-to-br ${feature.color}`}
                  >
                    {feature.icon}
                  </div>

                  <div className="space-y-2">
                    <h3 className="text-lg md:text-xl font-bold text-foreground flex items-center gap-2">
                      {feature.title}
                      {feature.coming && (
                        <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                          Coming
                        </span>
                      )}
                    </h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </div>

                  {!feature.coming && (
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm group-hover:gap-3 transition-all">
                      Get Started <ArrowRight size={16} />
                    </div>
                  )}
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 md:py-20 bg-primary/5 border-t border-border">
        <div className="container max-w-6xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-4">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              How RythmAI Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-primary to-primary/80 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                1
              </div>
              <h3 className="text-lg font-bold text-foreground">Check In Daily</h3>
              <p className="text-muted-foreground">
                Share your mood and thoughts to receive personalized AI support and actionable tips
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-secondary to-secondary/80 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                2
              </div>
              <h3 className="text-lg font-bold text-foreground">Build Habits</h3>
              <p className="text-muted-foreground">
                Complete daily tasks, exercises, and wellness activities to earn XP and badges
              </p>
            </div>

            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-accent to-accent/80 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                3
              </div>
              <h3 className="text-lg font-bold text-foreground">Level Up</h3>
              <p className="text-muted-foreground">
                Unlock achievements, maintain streaks, and watch your mental wellness grow
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 border-t border-border">
        <div className="container max-w-4xl mx-auto px-4 text-center space-y-6">
          <div className="space-y-3">
            <h2 className="text-3xl md:text-4xl font-bold text-primary">
              Ready to start your wellness journey?
            </h2>
            <p className="text-lg text-muted-foreground">
              Your first mood check-in awaits. Build your streak, earn badges, and discover your rhythm.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <a
              href="/mood"
              className="px-8 py-4 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all text-center"
            >
              Start Your First Check-In
            </a>
            <a
              href="/chat"
              className="px-8 py-4 bg-white dark:bg-slate-800 text-primary border-2 border-primary rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all text-center"
            >
              Chat with AI
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border py-8 md:py-12">
        <div className="container max-w-6xl mx-auto px-4 text-center text-sm text-muted-foreground space-y-4">
          <p>
            🎵 RythmAI - Your AI-powered mental wellness companion for teens
          </p>
          <p className="text-xs">
            ⚠️ Note: RythmAI is a supportive tool, not a replacement for professional mental health care. 
            If you're in crisis, please reach out to a mental health professional or call 988 (Suicide & Crisis Lifeline).
          </p>
          <div className="flex justify-center gap-6 text-xs pt-4">
            <a href="#" className="hover:text-primary transition">Privacy</a>
            <a href="#" className="hover:text-primary transition">Terms</a>
            <a href="#" className="hover:text-primary transition">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
