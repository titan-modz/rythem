import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useRythmStore } from "@/hooks/useRythmStore";
import { CheckCircle2, Circle } from "lucide-react";

interface Task {
  id: string;
  name: string;
  description: string;
  icon: string;
  xp: number;
  type: "daily" | "weekly";
}

const DAILY_TASKS: Task[] = [
  { id: "d1", name: "Make Your Bed", description: "Start your day with a tidy space", icon: "🛏️", xp: 10, type: "daily" },
  { id: "d2", name: "Drink Water", description: "Stay hydrated - aim for 8 glasses", icon: "💧", xp: 10, type: "daily" },
  { id: "d3", name: "Gratitude Practice", description: "Write down 3 things you're grateful for", icon: "🙏", xp: 15, type: "daily" },
  { id: "d4", name: "5-Minute Walk", description: "Get some fresh air and movement", icon: "🚶", xp: 15, type: "daily" },
];

const WEEKLY_TASKS: Task[] = [
  { id: "w1", name: "Organize Your Space", description: "Tidy up your room or workspace", icon: "🧹", xp: 25, type: "weekly" },
  { id: "w2", name: "Screen Break", description: "Spend 1 hour without screens", icon: "📱", xp: 25, type: "weekly" },
  { id: "w3", name: "Help Someone", description: "Do something kind for someone else", icon: "🤝", xp: 30, type: "weekly" },
  { id: "w4", name: "Learn 3 Words", description: "Learn new vocabulary or concept", icon: "📚", xp: 20, type: "weekly" },
];

const STORAGE_KEY = "rythmAI_tasks";

interface CompletedTasks {
  [taskId: string]: number; // timestamp of completion
}

export default function Tasks() {
  const { addXP } = useRythmStore();
  const [completedTasks, setCompletedTasks] = useState<CompletedTasks>({});
  const [todayXP, setTodayXP] = useState(0);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setCompletedTasks(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load tasks:", error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(completedTasks));
  }, [completedTasks]);

  const isTaskCompletedToday = (taskId: string, type: "daily" | "weekly"): boolean => {
    const timestamp = completedTasks[taskId];
    if (!timestamp) return false;

    const completedDate = new Date(timestamp).toDateString();
    const today = new Date().toDateString();

    if (type === "daily") {
      return completedDate === today;
    } else {
      // Weekly - completed this week
      const completed = new Date(timestamp);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      return completed > weekAgo;
    }
  };

  const handleTaskToggle = (task: Task) => {
    if (isTaskCompletedToday(task.id, task.type)) {
      // Uncomplete
      const { [task.id]: _, ...rest } = completedTasks;
      setCompletedTasks(rest);
      setTodayXP(Math.max(0, todayXP - task.xp));
    } else {
      // Complete
      setCompletedTasks((prev) => ({
        ...prev,
        [task.id]: Date.now(),
      }));
      setTodayXP(todayXP + task.xp);
      addXP(task.xp);
    }
  };

  const dailyCompleted = DAILY_TASKS.filter((t) => isTaskCompletedToday(t.id, "daily")).length;
  const weeklyCompleted = WEEKLY_TASKS.filter((t) => isTaskCompletedToday(t.id, "weekly")).length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            ✅ Daily & Weekly Tasks
          </h1>
          <p className="text-lg text-muted-foreground">
            Complete tasks to earn XP and build positive habits
          </p>
        </div>

        {/* XP Earned Today */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-primary/20 text-center">
            <div className="text-3xl font-bold text-primary mb-2">{todayXP}</div>
            <div className="text-sm text-muted-foreground">XP Earned Today</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-secondary/20 text-center">
            <div className="text-3xl font-bold text-secondary mb-2">
              {dailyCompleted}/{DAILY_TASKS.length}
            </div>
            <div className="text-sm text-muted-foreground">Daily Tasks Done</div>
          </div>
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 border-2 border-accent/20 text-center">
            <div className="text-3xl font-bold text-accent mb-2">
              {weeklyCompleted}/{WEEKLY_TASKS.length}
            </div>
            <div className="text-sm text-muted-foreground">Weekly Tasks Done</div>
          </div>
        </div>

        {/* Daily Tasks */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📅</span>
            <h2 className="text-2xl font-bold text-foreground">Daily Tasks</h2>
          </div>
          <div className="space-y-3">
            {DAILY_TASKS.map((task) => {
              const completed = isTaskCompletedToday(task.id, "daily");
              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskToggle(task)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    completed
                      ? "bg-primary/10 border-primary text-primary"
                      : "bg-white dark:bg-slate-800 border-border hover:border-primary"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {completed ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <Circle size={24} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{task.icon}</span>
                        <h3 className="font-semibold">{task.name}</h3>
                        <span className="ml-auto text-sm font-bold bg-primary/20 text-primary px-3 py-1 rounded-full">
                          +{task.xp} XP
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Weekly Tasks */}
        <section className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-2xl">📊</span>
            <h2 className="text-2xl font-bold text-foreground">Weekly Tasks</h2>
          </div>
          <div className="space-y-3">
            {WEEKLY_TASKS.map((task) => {
              const completed = isTaskCompletedToday(task.id, "weekly");
              return (
                <button
                  key={task.id}
                  onClick={() => handleTaskToggle(task)}
                  className={`w-full p-4 rounded-lg border-2 transition-all text-left ${
                    completed
                      ? "bg-secondary/10 border-secondary text-secondary"
                      : "bg-white dark:bg-slate-800 border-border hover:border-secondary"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="mt-1">
                      {completed ? (
                        <CheckCircle2 size={24} />
                      ) : (
                        <Circle size={24} className="text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{task.icon}</span>
                        <h3 className="font-semibold">{task.name}</h3>
                        <span className="ml-auto text-sm font-bold bg-secondary/20 text-secondary px-3 py-1 rounded-full">
                          +{task.xp} XP
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Motivation */}
        <div className="bg-gradient-to-r from-primary/20 to-secondary/20 border-2 border-primary/30 rounded-xl p-6 text-center">
          <p className="text-lg font-semibold text-foreground">
            🎯 {dailyCompleted === DAILY_TASKS.length ? "Amazing! All daily tasks done today!" : "Keep going! Complete your daily tasks!"}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Building habits takes time. Every completed task is a step forward! 💪
          </p>
        </div>
      </main>
    </div>
  );
}
