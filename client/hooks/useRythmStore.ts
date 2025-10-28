import { useState, useEffect } from "react";

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedAt?: number;
}

export interface UserProgress {
  xp: number;
  level: number;
  currentStreak: number;
  longestStreak: number;
  moodCheckIns: Array<{
    mood: string;
    timestamp: number;
    response?: string;
  }>;
  badges: Badge[];
  redemptionPoints: number;
  tasksCompleted: number;
  lastActivityTime?: number;
}

const DEFAULT_PROGRESS: UserProgress = {
  xp: 0,
  level: 1,
  currentStreak: 0,
  longestStreak: 0,
  moodCheckIns: [],
  badges: [],
  redemptionPoints: 0,
  tasksCompleted: 0,
};

const STORAGE_KEY = "rythmAI_progress";

export function useRythmStore() {
  const [progress, setProgress] = useState<UserProgress>(DEFAULT_PROGRESS);
  const [isLoading, setIsLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setProgress(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Failed to load progress:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save to localStorage whenever progress changes
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoading]);

  const addXP = (amount: number) => {
    setProgress((prev) => {
      const newXP = prev.xp + amount;
      const xpPerLevel = 100;
      const newLevel = Math.floor(newXP / xpPerLevel) + 1;

      return {
        ...prev,
        xp: newXP,
        level: newLevel,
      };
    });
  };

  const recordMoodCheckIn = (mood: string, response?: string) => {
    setProgress((prev) => {
      const now = Date.now();
      const newCheckIns = [
        ...prev.moodCheckIns,
        { mood, timestamp: now, response },
      ];

      // Keep only last 30 days
      const thirtyDaysAgo = now - 30 * 24 * 60 * 60 * 1000;
      const recentCheckIns = newCheckIns.filter(
        (c) => c.timestamp > thirtyDaysAgo
      );

      return {
        ...prev,
        moodCheckIns: recentCheckIns,
        lastActivityTime: now,
      };
    });

    addXP(10); // Reward for mood check-in
  };

  const addBadge = (badge: Badge) => {
    setProgress((prev) => {
      if (prev.badges.some((b) => b.id === badge.id)) {
        return prev; // Badge already exists
      }
      return {
        ...prev,
        badges: [...prev.badges, { ...badge, unlockedAt: Date.now() }],
      };
    });
  };

  const updateStreak = () => {
    setProgress((prev) => {
      const today = new Date().toDateString();
      const lastCheck =
        prev.moodCheckIns.length > 0
          ? new Date(prev.moodCheckIns[prev.moodCheckIns.length - 1].timestamp).toDateString()
          : null;

      let newStreak = prev.currentStreak;

      if (lastCheck === today) {
        // Already checked in today
        return prev;
      }

      const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
      if (lastCheck === yesterday) {
        newStreak = prev.currentStreak + 1;
      } else {
        newStreak = 1;
      }

      return {
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(newStreak, prev.longestStreak),
      };
    });
  };

  const addRedemptionPoints = (points: number) => {
    setProgress((prev) => {
      const newPoints = prev.redemptionPoints + points;

      // Check for redemption badges
      if (newPoints >= 7 && !prev.badges.some((b) => b.id === "reborn-mind")) {
        addBadge({
          id: "reborn-mind",
          name: "Reborn Mind",
          description: "7 days of redemption progress",
          icon: "✨",
        });
      }

      if (newPoints >= 30 && !prev.badges.some((b) => b.id === "character-growth")) {
        addBadge({
          id: "character-growth",
          name: "Character Growth Champion",
          description: "30 days of redemption progress",
          icon: "🌟",
        });
      }

      return {
        ...prev,
        redemptionPoints: newPoints,
      };
    });

    addXP(15); // Reward for redemption
  };

  const completeTask = () => {
    setProgress((prev) => ({
      ...prev,
      tasksCompleted: prev.tasksCompleted + 1,
    }));
    addXP(5);
  };

  const reset = () => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  };

  return {
    progress,
    isLoading,
    addXP,
    recordMoodCheckIn,
    addBadge,
    updateStreak,
    addRedemptionPoints,
    completeTask,
    reset,
  };
}
