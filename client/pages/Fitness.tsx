import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useRythmStore } from "@/hooks/useRythmStore";
import { Play, Check, Zap } from "lucide-react";

interface Exercise {
  id: string;
  name: string;
  emoji: string;
  reps: string;
  description: string;
  difficulty: "easy" | "medium" | "hard";
}

const EXERCISES: Exercise[] = [
  { id: "1", name: "Pushups", emoji: "💪", reps: "10-20", description: "Upper body strength", difficulty: "medium" },
  { id: "2", name: "Squats", emoji: "🦵", reps: "15-25", description: "Leg strength", difficulty: "medium" },
  { id: "3", name: "Stretching", emoji: "🧘", reps: "5 min", description: "Improve flexibility", difficulty: "easy" },
  { id: "4", name: "Plank", emoji: "📍", reps: "30-60 sec", description: "Core strength", difficulty: "hard" },
  { id: "5", name: "Jumping Jacks", emoji: "🤸", reps: "20-30", description: "Cardio workout", difficulty: "medium" },
  { id: "6", name: "Running", emoji: "🏃", reps: "10-15 min", description: "Cardio endurance", difficulty: "hard" },
  { id: "7", name: "Lunges", emoji: "🚶", reps: "10 each leg", description: "Leg and glute work", difficulty: "medium" },
  { id: "8", name: "Yoga Flow", emoji: "🧘", reps: "15 min", description: "Flexibility and calm", difficulty: "easy" },
];

const STORAGE_KEY = "rythmAI_fitness";

interface FitnessData {
  completedToday: string[]; // exercise ids completed today
  lastSessionDate: string;
  currentStreak: number;
}

export default function Fitness() {
  const { addXP } = useRythmStore();
  const [fitnessData, setFitnessData] = useState<FitnessData>({
    completedToday: [],
    lastSessionDate: "",
    currentStreak: 0,
  });
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [totalCalories, setTotalCalories] = useState(0);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setFitnessData(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load fitness data:", error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(fitnessData));
  }, [fitnessData]);

  const isExerciseCompletedToday = (exerciseId: string): boolean => {
    const today = new Date().toDateString();
    return fitnessData.lastSessionDate === today && fitnessData.completedToday.includes(exerciseId);
  };

  const handleCompleteExercise = (exercise: Exercise) => {
    const today = new Date().toDateString();
    const isCompleted = isExerciseCompletedToday(exercise.id);

    let newStreak = fitnessData.currentStreak;

    // Update streak if first exercise of the day
    if (fitnessData.completedToday.length === 0 && fitnessData.lastSessionDate !== today) {
      if (fitnessData.lastSessionDate !== "") {
        const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
        if (fitnessData.lastSessionDate === yesterday) {
          newStreak += 1;
        } else {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }
    }

    const newCompleted = isCompleted
      ? fitnessData.completedToday.filter((id) => id !== exercise.id)
      : [...fitnessData.completedToday, exercise.id];

    setFitnessData({
      completedToday: newCompleted,
      lastSessionDate: today,
      currentStreak: newStreak,
    });

    if (!isCompleted) {
      const xp = exercise.difficulty === "hard" ? 20 : exercise.difficulty === "medium" ? 15 : 10;
      const cal = exercise.difficulty === "hard" ? 50 : exercise.difficulty === "medium" ? 35 : 20;
      addXP(xp);
      setTotalCalories(totalCalories + cal);
    }

    setSelectedExercise(null);
  };

  const completedCount = fitnessData.completedToday.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            💪 Fitness Lite
          </h1>
          <p className="text-lg text-muted-foreground">
            Quick exercises to keep you active and energized
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-primary/20 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{completedCount}</div>
            <div className="text-sm text-muted-foreground">Exercises Today</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-secondary/20 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">{fitnessData.currentStreak}🔥</div>
            <div className="text-sm text-muted-foreground">Day Streak</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-accent/20 text-center">
            <div className="text-3xl font-bold text-accent mb-2">~{totalCalories}</div>
            <div className="text-sm text-muted-foreground">Calories Burned</div>
          </div>
        </div>

        {/* Exercise Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          {EXERCISES.map((exercise) => {
            const completed = isExerciseCompletedToday(exercise.id);
            return (
              <button
                key={exercise.id}
                onClick={() => setSelectedExercise(selectedExercise?.id === exercise.id ? null : exercise)}
                className={`p-6 rounded-xl border-2 transition-all text-left ${
                  completed
                    ? "bg-primary/10 border-primary"
                    : "bg-white dark:bg-slate-800 border-border hover:border-primary hover:shadow-lg"
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className="text-4xl">{exercise.emoji}</span>
                  {completed && <Check size={24} className="text-primary" />}
                </div>
                <h3 className="font-bold text-lg mb-1">{exercise.name}</h3>
                <p className="text-sm text-muted-foreground mb-2">{exercise.reps}</p>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded ${
                      exercise.difficulty === "hard"
                        ? "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200"
                        : exercise.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200"
                          : "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200"
                    }`}
                  >
                    {exercise.difficulty}
                  </span>
                  <span className="text-xs text-muted-foreground ml-auto">
                    {exercise.difficulty === "hard" ? "+20 XP" : exercise.difficulty === "medium" ? "+15 XP" : "+10 XP"}
                  </span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Modal for selected exercise */}
        {selectedExercise && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-8 space-y-6 animate-slide-up">
              <button
                onClick={() => setSelectedExercise(null)}
                className="text-2xl font-bold ml-auto"
              >
                ✕
              </button>

              <div className="text-center space-y-4">
                <span className="text-8xl block">{selectedExercise.emoji}</span>
                <h2 className="text-3xl font-bold text-primary">{selectedExercise.name}</h2>
                <p className="text-muted-foreground">{selectedExercise.description}</p>

                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <div className="text-sm font-semibold text-foreground">
                    Reps: <span className="text-primary text-lg">{selectedExercise.reps}</span>
                  </div>
                  <div className="text-sm font-semibold text-foreground">
                    Difficulty:{" "}
                    <span
                      className={`text-lg ${
                        selectedExercise.difficulty === "hard"
                          ? "text-red-600"
                          : selectedExercise.difficulty === "medium"
                            ? "text-yellow-600"
                            : "text-green-600"
                      }`}
                    >
                      {selectedExercise.difficulty}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleCompleteExercise(selectedExercise)}
                className={`w-full py-4 rounded-lg font-bold text-white transition ${
                  isExerciseCompletedToday(selectedExercise.id)
                    ? "bg-muted text-muted-foreground"
                    : "bg-primary hover:bg-primary/90"
                }`}
              >
                {isExerciseCompletedToday(selectedExercise.id) ? (
                  <span className="flex items-center justify-center gap-2">
                    <Check size={20} /> Completed!
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <Play size={20} /> Start Exercise
                  </span>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Motivation */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 rounded-xl p-6 text-center">
          <p className="text-lg font-semibold text-foreground">
            {completedCount === 0 ? "🎯 Pick an exercise to get started!" : `Great work! You've completed ${completedCount} exercise${completedCount !== 1 ? "s" : ""} today!`}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Regular movement keeps your mind and body healthy! 💚
          </p>
        </div>
      </main>
    </div>
  );
}
