import { useState } from "react";
import { Header } from "@/components/Header";
import { useRythmStore } from "@/hooks/useRythmStore";
import { RotateCcw } from "lucide-react";

type GameType = "breathe" | "colors" | "none";

const COLORS = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#C7CEEA", "#FFA07A"];

export default function Games() {
  const { addXP } = useRythmStore();
  const [selectedGame, setSelectedGame] = useState<GameType>("none");
  const [breathePhase, setBreathePhase] = useState<"breathe-in" | "hold" | "breathe-out">("breathe-in");
  const [breatheCount, setBreatheCount] = useState(0);
  const [colorScore, setColorScore] = useState(0);
  const [colorMatches, setColorMatches] = useState(0);

  // Tap-to-Breathe game
  const handleBreatheStart = () => {
    setSelectedGame("breathe");
    setBreathePhase("breathe-in");
    setBreatheCount(0);
  };

  const handleBreatheClick = () => {
    if (breathePhase === "breathe-in") {
      setBreathePhase("hold");
    } else if (breathePhase === "hold") {
      setBreathePhase("breathe-out");
    } else {
      setBreatheCount(breatheCount + 1);
      setBreathePhase("breathe-in");
      if (breatheCount + 1 === 5) {
        addXP(20);
        setSelectedGame("none");
      }
    }
  };

  const handleBreatheReset = () => {
    setBreathePhase("breathe-in");
    setBreatheCount(0);
  };

  // Color Match game
  const [colorGame, setColorGame] = useState({
    target: COLORS[Math.floor(Math.random() * COLORS.length)],
    selected: null as string | null,
    round: 1,
  });

  const handleColorSelect = (color: string) => {
    if (color === colorGame.target) {
      setColorMatches(colorMatches + 1);
      setColorScore(colorScore + 10);
      addXP(10);
      setTimeout(() => {
        setColorGame({
          target: COLORS[Math.floor(Math.random() * COLORS.length)],
          selected: null,
          round: colorGame.round + 1,
        });
      }, 500);
    } else {
      setColorGame({ ...colorGame, selected: color });
    }
  };

  const handleColorGameStart = () => {
    setSelectedGame("colors");
    setColorScore(0);
    setColorMatches(0);
    setColorGame({
      target: COLORS[Math.floor(Math.random() * COLORS.length)],
      selected: null,
      round: 1,
    });
  };

  const handleColorGameReset = () => {
    setColorScore(0);
    setColorMatches(0);
    setColorGame({
      target: COLORS[Math.floor(Math.random() * COLORS.length)],
      selected: null,
      round: 1,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            🎮 Calming Mini-Games
          </h1>
          <p className="text-lg text-muted-foreground">
            Relax and have fun with games designed for your wellness
          </p>
        </div>

        {selectedGame === "none" ? (
          <>
            {/* Game Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Tap-to-Breathe */}
              <button
                onClick={handleBreatheStart}
                className="p-8 rounded-2xl bg-gradient-to-br from-blue-400 to-cyan-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="text-6xl mb-4">🫁</div>
                <h2 className="text-2xl font-bold mb-2">Tap-to-Breathe</h2>
                <p className="text-sm opacity-90">
                  Follow guided breathing exercise. Click through 5 breathing cycles to complete.
                </p>
              </button>

              {/* Color Match */}
              <button
                onClick={handleColorGameStart}
                className="p-8 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all"
              >
                <div className="text-6xl mb-4">🎨</div>
                <h2 className="text-2xl font-bold mb-2">Color Match</h2>
                <p className="text-sm opacity-90">
                  Match the target color by clicking the correct box. See how many you can match!
                </p>
              </button>
            </div>

            {/* Coming Soon */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 border-2 border-accent text-center space-y-4">
              <p className="text-lg font-semibold text-foreground">
                More games coming soon! 🚀
              </p>
              <p className="text-muted-foreground">
                Focus timer with nature sounds, meditation guides, and more relaxation tools
              </p>
            </div>
          </>
        ) : selectedGame === "breathe" ? (
          <>
            {/* Breathing Game */}
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 text-center space-y-8">
                <h2 className="text-3xl font-bold text-primary">Guided Breathing</h2>

                <div className="space-y-4">
                  <p className="text-lg text-muted-foreground">
                    Round {breatheCount + 1} of 5
                  </p>

                  <button
                    onClick={handleBreatheClick}
                    className={`w-full py-16 rounded-2xl transition-all transform ${
                      breathePhase === "breathe-in"
                        ? "bg-blue-500 scale-110 animate-pulse-scale"
                        : breathePhase === "hold"
                          ? "bg-green-500 scale-100"
                          : "bg-purple-500 scale-90"
                    } text-white`}
                  >
                    <div className="text-4xl font-bold">
                      {breathePhase === "breathe-in"
                        ? "BREATHE IN"
                        : breathePhase === "hold"
                          ? "HOLD"
                          : "BREATHE OUT"}
                    </div>
                  </button>

                  <div className="text-sm text-muted-foreground space-y-2">
                    <p>
                      {breathePhase === "breathe-in"
                        ? "Inhale slowly for 4 counts"
                        : breathePhase === "hold"
                          ? "Hold your breath for 4 counts"
                          : "Exhale slowly for 4 counts"}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={handleBreatheReset}
                    className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={20} /> Reset
                  </button>
                  <button
                    onClick={() => setSelectedGame("none")}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                  >
                    Exit Game
                  </button>
                </div>
              </div>

              {breatheCount === 5 && (
                <div className="bg-green-50 dark:bg-green-900/20 border-2 border-green-500 rounded-xl p-6 text-center space-y-3 animate-slide-up">
                  <p className="text-2xl font-bold text-green-600">🎉 Great job!</p>
                  <p className="text-green-700">You completed 5 breathing cycles! You earned 20 XP.</p>
                </div>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Color Match Game */}
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-primary mb-2">Color Match</h2>
                  <p className="text-lg text-muted-foreground">Score: {colorScore} | Matches: {colorMatches}</p>
                </div>

                {/* Target Color */}
                <div className="text-center space-y-3">
                  <p className="text-muted-foreground">Find this color:</p>
                  <div
                    className="w-32 h-32 rounded-2xl mx-auto shadow-lg animate-pulse"
                    style={{ backgroundColor: colorGame.target }}
                  />
                </div>

                {/* Color Options */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {COLORS.map((color, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleColorSelect(color)}
                      className={`h-24 rounded-lg transition-all transform ${
                        colorGame.selected === color && color !== colorGame.target ? "scale-95 opacity-50" : "hover:scale-110"
                      } shadow-md`}
                      style={{ backgroundColor: color }}
                      title={color}
                    >
                      {color === colorGame.target && colorGame.selected === color && (
                        <span className="text-3xl">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                {/* Control Buttons */}
                <div className="flex gap-4">
                  <button
                    onClick={handleColorGameReset}
                    className="flex-1 px-6 py-3 bg-muted text-foreground rounded-lg font-semibold hover:bg-muted/80 transition flex items-center justify-center gap-2"
                  >
                    <RotateCcw size={20} /> Reset
                  </button>
                  <button
                    onClick={() => setSelectedGame("none")}
                    className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                  >
                    Exit Game
                  </button>
                </div>
              </div>

              {colorMatches > 0 && (
                <div className="bg-purple-50 dark:bg-purple-900/20 border-2 border-purple-500 rounded-xl p-6 text-center space-y-2">
                  <p className="text-2xl font-bold text-purple-600">🎨 Nice work!</p>
                  <p className="text-purple-700">You've matched {colorMatches} colors and earned {colorScore} XP!</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
