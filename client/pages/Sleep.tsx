import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useRythmStore } from "@/hooks/useRythmStore";
import { Play, Pause, Volume2 } from "lucide-react";

type SleepMode = "none" | "meditation" | "breathing" | "story";

const MEDITATIONS = [
  {
    id: "m1",
    title: "Body Scan Relaxation",
    duration: "10 min",
    description: "Progressively relax each part of your body",
    content:
      "Get comfortable and close your eyes. Start at the top of your head. Feel any tension and let it go... Move down through your forehead, eyes, cheeks. Let them relax completely...",
  },
  {
    id: "m2",
    title: "Ocean Waves",
    duration: "8 min",
    description: "Imagine yourself on a peaceful beach",
    content:
      "Picture yourself on a beautiful beach. Feel the warm sand beneath you. Listen to the gentle sound of waves... Breathe in the salty air. With each wave, all your worries wash away...",
  },
  {
    id: "m3",
    title: "Forest Breathing",
    duration: "12 min",
    description: "Breathe with nature in a peaceful forest",
    content:
      "Imagine you're walking through a calm forest. Tall trees surround you. Breathe in the fresh forest air... With each breath, you become more peaceful and calm...",
  },
];

const BREATHING_EXERCISES = [
  {
    id: "b1",
    name: "4-7-8 Breathing",
    description: "Inhale for 4, hold for 7, exhale for 8",
    inhale: 4,
    hold: 7,
    exhale: 8,
    cycles: 5,
  },
  {
    id: "b2",
    name: "Box Breathing",
    description: "Equal breathing pattern for balance",
    inhale: 4,
    hold: 4,
    exhale: 4,
    cycles: 5,
  },
];

export default function Sleep() {
  const { addXP } = useRythmStore();
  const [selectedMode, setSelectedMode] = useState<SleepMode>("none");
  const [selectedMeditation, setSelectedMeditation] = useState<string | null>(
    null,
  );
  const [selectedBreathing, setSelectedBreathing] = useState<string | null>(
    null,
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [timer, setTimer] = useState(0);

  // Auto-off timer countdown
  useEffect(() => {
    if (!isPlaying || timer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          setIsPlaying(false);
          addXP(25);
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  const handleMeditationStart = (meditationId: string) => {
    setSelectedMode("meditation");
    setSelectedMeditation(meditationId);
    setIsPlaying(true);
    setTimer(10 * 60); // 10 minutes
  };

  const handleBreathingStart = (breathingId: string) => {
    setSelectedMode("breathing");
    setSelectedBreathing(breathingId);
    setIsPlaying(true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const meditation = MEDITATIONS.find((m) => m.id === selectedMeditation);
  const breathing = BREATHING_EXERCISES.find((b) => b.id === selectedBreathing);

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-indigo-800 to-indigo-900 text-white">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            😴 Sleep Aid & Night Mode
          </h1>
          <p className="text-lg opacity-90">
            Wind down with guided meditation and breathing exercises
          </p>
        </div>

        {selectedMode === "none" ? (
          <>
            {/* Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Meditation */}
              <button
                onClick={() => setSelectedMode("meditation")}
                className="p-8 rounded-2xl bg-white/10 backdrop-blur border-2 border-white/30 hover:border-white/60 transition"
              >
                <div className="text-6xl mb-4">🧘</div>
                <h2 className="text-2xl font-bold mb-2">Meditation</h2>
                <p className="text-sm opacity-90">
                  Guided meditations to calm your mind
                </p>
              </button>

              {/* Breathing */}
              <button
                onClick={() => setSelectedMode("breathing")}
                className="p-8 rounded-2xl bg-white/10 backdrop-blur border-2 border-white/30 hover:border-white/60 transition"
              >
                <div className="text-6xl mb-4">🫁</div>
                <h2 className="text-2xl font-bold mb-2">Breathing</h2>
                <p className="text-sm opacity-90">
                  Breathing techniques for relaxation
                </p>
              </button>
            </div>

            {/* Tips */}
            <div className="bg-white/10 backdrop-blur border-2 border-white/30 rounded-xl p-6 text-center space-y-3">
              <p className="text-lg font-semibold">💡 Sleep Tips</p>
              <ul className="text-sm opacity-90 space-y-1">
                <li>✓ Keep your bedroom cool and dark</li>
                <li>✓ Avoid screens 30 minutes before bed</li>
                <li>✓ Try these exercises 15-30 minutes before sleep</li>
                <li>✓ You'll earn XP for completing sessions!</li>
              </ul>
            </div>
          </>
        ) : selectedMode === "meditation" && !selectedMeditation ? (
          <>
            {/* Meditation Selection */}
            <div className="space-y-4 mb-8">
              {MEDITATIONS.map((med) => (
                <button
                  key={med.id}
                  onClick={() => handleMeditationStart(med.id)}
                  className="w-full p-6 rounded-xl bg-white/10 backdrop-blur border-2 border-white/30 hover:border-white/60 hover:bg-white/20 transition text-left"
                >
                  <h3 className="text-xl font-bold mb-1">{med.title}</h3>
                  <p className="text-sm opacity-75 mb-2">{med.description}</p>
                  <span className="text-xs opacity-60 bg-white/10 px-3 py-1 rounded-full inline-block">
                    {med.duration}
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedMode("none")}
              className="w-full px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition"
            >
              Back
            </button>
          </>
        ) : selectedMode === "meditation" &&
          selectedMeditation &&
          meditation ? (
          <>
            {/* Meditation Player */}
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center space-y-6 border-2 border-white/30">
                <h2 className="text-3xl font-bold">{meditation.title}</h2>

                {/* Timer */}
                <div className="text-6xl font-bold">{formatTime(timer)}</div>

                {/* Content */}
                <div className="bg-white/5 rounded-lg p-6 text-left space-y-3 max-h-40 overflow-y-auto">
                  <p className="text-sm leading-relaxed opacity-90">
                    {meditation.content}
                  </p>
                </div>

                {/* Controls */}
                <div className="flex gap-4 justify-center">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition flex items-center gap-2"
                  >
                    {isPlaying ? (
                      <>
                        <Pause size={20} /> Pause
                      </>
                    ) : (
                      <>
                        <Play size={20} /> Play
                      </>
                    )}
                  </button>
                  <button
                    onClick={() => {
                      setSelectedMeditation(null);
                      setIsPlaying(false);
                      setTimer(0);
                    }}
                    className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-semibold transition"
                  >
                    Exit
                  </button>
                </div>

                <div className="flex items-center justify-center gap-2 text-sm opacity-75">
                  <Volume2 size={16} /> Auto-off after session
                </div>
              </div>

              {!isPlaying && timer === 0 && (
                <div className="bg-green-500/20 border-2 border-green-400 rounded-xl p-6 text-center space-y-2 animate-slide-up">
                  <p className="text-2xl font-bold">🌙 Good night!</p>
                  <p className="text-sm">
                    You earned 25 XP for completing this session.
                  </p>
                </div>
              )}
            </div>
          </>
        ) : selectedMode === "breathing" && !selectedBreathing ? (
          <>
            {/* Breathing Selection */}
            <div className="space-y-4 mb-8">
              {BREATHING_EXERCISES.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => handleBreathingStart(ex.id)}
                  className="w-full p-6 rounded-xl bg-white/10 backdrop-blur border-2 border-white/30 hover:border-white/60 hover:bg-white/20 transition text-left"
                >
                  <h3 className="text-xl font-bold mb-1">{ex.name}</h3>
                  <p className="text-sm opacity-75">{ex.description}</p>
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedMode("none")}
              className="w-full px-6 py-3 bg-white/20 text-white rounded-lg font-semibold hover:bg-white/30 transition"
            >
              Back
            </button>
          </>
        ) : selectedMode === "breathing" && selectedBreathing && breathing ? (
          <>
            {/* Breathing Exercise */}
            <div className="max-w-2xl mx-auto">
              <div className="bg-white/10 backdrop-blur rounded-2xl p-8 text-center space-y-8 border-2 border-white/30">
                <h2 className="text-3xl font-bold">{breathing.name}</h2>

                <div className="space-y-6">
                  <div className="grid grid-cols-3 gap-4">
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs opacity-75 mb-2">Inhale</p>
                      <p className="text-3xl font-bold">{breathing.inhale}s</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs opacity-75 mb-2">Hold</p>
                      <p className="text-3xl font-bold">{breathing.hold}s</p>
                    </div>
                    <div className="bg-white/10 rounded-lg p-4">
                      <p className="text-xs opacity-75 mb-2">Exhale</p>
                      <p className="text-3xl font-bold">{breathing.exhale}s</p>
                    </div>
                  </div>

                  <p className="text-sm opacity-75">
                    Cycles: {breathing.cycles}
                  </p>

                  <div className="text-sm opacity-75 bg-white/5 rounded-lg p-4">
                    <p>
                      Perform this breathing pattern {breathing.cycles} times
                      before bed. Focus on smooth, steady breaths.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setSelectedBreathing(null);
                    addXP(15);
                  }}
                  className="px-6 py-3 bg-white/20 hover:bg-white/30 rounded-lg font-semibold transition"
                >
                  Complete Exercise
                </button>
              </div>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
