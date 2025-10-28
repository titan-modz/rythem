import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { useRythmStore } from "@/hooks/useRythmStore";
import { BarChart3, TrendingUp } from "lucide-react";

interface JournalEntry {
  date: string;
  mood: number; // 1-5
  stress: number; // 1-5
  sleep: number; // hours
  screenTime: number; // hours
  notes: string;
}

const STORAGE_KEY = "rythmAI_journal";

export default function Journal() {
  const { addXP } = useRythmStore();
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [todayEntry, setTodayEntry] = useState<JournalEntry>({
    date: new Date().toDateString(),
    mood: 3,
    stress: 3,
    sleep: 0,
    screenTime: 0,
    notes: "",
  });
  const [showReport, setShowReport] = useState(false);

  // Load from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const loadedEntries = JSON.parse(stored);
        setEntries(loadedEntries);

        // Load today's entry if exists
        const today = new Date().toDateString();
        const todayData = loadedEntries.find((e: JournalEntry) => e.date === today);
        if (todayData) {
          setTodayEntry(todayData);
        }
      }
    } catch (error) {
      console.error("Failed to load journal:", error);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleSaveEntry = () => {
    const today = new Date().toDateString();
    const existingIndex = entries.findIndex((e) => e.date === today);

    if (existingIndex >= 0) {
      const updated = [...entries];
      updated[existingIndex] = { ...todayEntry, date: today };
      setEntries(updated);
    } else {
      setEntries([...entries, { ...todayEntry, date: today }]);
    }

    addXP(15);
    alert("Journal entry saved! You earned 15 XP.");
  };

  // Calculate weekly stats
  const getWeeklyStats = () => {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weekEntries = entries.filter((e) => new Date(e.date) >= weekAgo);

    if (weekEntries.length === 0) return null;

    const avgMood = (weekEntries.reduce((sum, e) => sum + e.mood, 0) / weekEntries.length).toFixed(1);
    const avgStress = (weekEntries.reduce((sum, e) => sum + e.stress, 0) / weekEntries.length).toFixed(1);
    const avgSleep = (weekEntries.reduce((sum, e) => sum + e.sleep, 0) / weekEntries.length).toFixed(1);
    const avgScreenTime = (weekEntries.reduce((sum, e) => sum + e.screenTime, 0) / weekEntries.length).toFixed(1);

    return { avgMood, avgStress, avgSleep, avgScreenTime, dayCount: weekEntries.length };
  };

  const weeklyStats = getWeeklyStats();

  const getMoodEmoji = (mood: number) => {
    if (mood <= 1) return "😞";
    if (mood <= 2) return "😕";
    if (mood === 3) return "😐";
    if (mood === 4) return "🙂";
    return "😄";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center space-y-4 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold text-primary">
            📔 Mind Journal & Score
          </h1>
          <p className="text-lg text-muted-foreground">
            Track your daily mood, stress, sleep, and screen time
          </p>
        </div>

        {!showReport ? (
          <>
            {/* Today's Entry Form */}
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border-2 border-primary/20 mb-8 space-y-6">
              <h2 className="text-2xl font-bold text-primary flex items-center gap-2">
                {getMoodEmoji(todayEntry.mood)} Today's Check-In
              </h2>

              {/* Mood Slider */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold">
                  How's your mood? {getMoodEmoji(todayEntry.mood)}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={todayEntry.mood}
                  onChange={(e) => setTodayEntry({ ...todayEntry, mood: parseInt(e.target.value) })}
                  className="w-full h-3 bg-primary/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Terrible</span>
                  <span>Okay</span>
                  <span>Great!</span>
                </div>
              </div>

              {/* Stress Slider */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold">
                  Stress level? {todayEntry.stress <= 2 ? "🟢" : todayEntry.stress <= 3 ? "🟡" : "🔴"}
                </label>
                <input
                  type="range"
                  min="1"
                  max="5"
                  value={todayEntry.stress}
                  onChange={(e) => setTodayEntry({ ...todayEntry, stress: parseInt(e.target.value) })}
                  className="w-full h-3 bg-secondary/20 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Low</span>
                  <span>Medium</span>
                  <span>High</span>
                </div>
              </div>

              {/* Sleep Input */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold">💤 Hours of sleep last night</label>
                <input
                  type="number"
                  min="0"
                  max="12"
                  step="0.5"
                  value={todayEntry.sleep}
                  onChange={(e) => setTodayEntry({ ...todayEntry, sleep: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-primary outline-none bg-background"
                  placeholder="e.g., 8"
                />
              </div>

              {/* Screen Time Input */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold">📱 Hours of screen time</label>
                <input
                  type="number"
                  min="0"
                  max="24"
                  step="0.5"
                  value={todayEntry.screenTime}
                  onChange={(e) => setTodayEntry({ ...todayEntry, screenTime: parseFloat(e.target.value) })}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-primary outline-none bg-background"
                  placeholder="e.g., 5"
                />
              </div>

              {/* Notes */}
              <div className="space-y-3">
                <label className="block text-lg font-semibold">📝 Notes (optional)</label>
                <textarea
                  value={todayEntry.notes}
                  onChange={(e) => setTodayEntry({ ...todayEntry, notes: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-border rounded-lg focus:border-primary outline-none bg-background resize-none h-20"
                  placeholder="How was your day? Anything on your mind?"
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={handleSaveEntry}
                  className="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
                >
                  Save Entry
                </button>
                {weeklyStats && (
                  <button
                    onClick={() => setShowReport(true)}
                    className="flex-1 px-6 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition flex items-center justify-center gap-2"
                  >
                    <BarChart3 size={20} /> View Weekly Report
                  </button>
                )}
              </div>
            </div>

            {/* Recent Entries */}
            {entries.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-2xl font-bold text-primary">📚 Recent Entries</h3>
                <div className="space-y-3">
                  {entries.slice(-7).reverse().map((entry) => (
                    <div key={entry.date} className="bg-white dark:bg-slate-800 rounded-lg p-4 border-2 border-border">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-foreground">{entry.date}</span>
                        <span className="text-2xl">{getMoodEmoji(entry.mood)}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-muted-foreground">Mood:</span>
                          <p className="font-semibold text-foreground">{entry.mood}/5</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Stress:</span>
                          <p className="font-semibold text-foreground">{entry.stress}/5</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sleep:</span>
                          <p className="font-semibold text-foreground">{entry.sleep}h</p>
                        </div>
                      </div>
                      {entry.notes && (
                        <p className="mt-3 text-sm text-muted-foreground italic">"{entry.notes}"</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        ) : weeklyStats ? (
          <>
            {/* Weekly Report */}
            <div className="max-w-2xl mx-auto space-y-6">
              <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-8 border-2 border-secondary/20 space-y-6">
                <div className="text-center">
                  <h2 className="text-3xl font-bold text-secondary flex items-center justify-center gap-2 mb-2">
                    <TrendingUp size={32} /> Weekly Report
                  </h2>
                  <p className="text-muted-foreground">{weeklyStats.dayCount} days tracked</p>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Average Mood */}
                  <div className="bg-primary/10 rounded-lg p-4 text-center space-y-2">
                    <p className="text-4xl">{getMoodEmoji(Math.round(parseFloat(weeklyStats.avgMood)))}</p>
                    <p className="text-sm text-muted-foreground">Average Mood</p>
                    <p className="text-2xl font-bold text-primary">{weeklyStats.avgMood}/5</p>
                  </div>

                  {/* Average Stress */}
                  <div className="bg-secondary/10 rounded-lg p-4 text-center space-y-2">
                    <p className="text-3xl">
                      {parseFloat(weeklyStats.avgStress) <= 2 ? "🟢" : parseFloat(weeklyStats.avgStress) <= 3 ? "🟡" : "🔴"}
                    </p>
                    <p className="text-sm text-muted-foreground">Average Stress</p>
                    <p className="text-2xl font-bold text-secondary">{weeklyStats.avgStress}/5</p>
                  </div>

                  {/* Sleep */}
                  <div className="bg-accent/10 rounded-lg p-4 text-center space-y-2">
                    <p className="text-3xl">💤</p>
                    <p className="text-sm text-muted-foreground">Avg Sleep</p>
                    <p className="text-2xl font-bold text-accent">{weeklyStats.avgSleep}h</p>
                  </div>

                  {/* Screen Time */}
                  <div className="bg-destructive/10 rounded-lg p-4 text-center space-y-2">
                    <p className="text-3xl">📱</p>
                    <p className="text-sm text-muted-foreground">Avg Screen Time</p>
                    <p className="text-2xl font-bold text-destructive">{weeklyStats.avgScreenTime}h</p>
                  </div>
                </div>

                {/* Insights */}
                <div className="bg-primary/5 border-2 border-primary/30 rounded-lg p-4 space-y-3">
                  <p className="font-semibold text-foreground">💡 Insights:</p>
                  <ul className="text-sm text-foreground space-y-1">
                    {parseFloat(weeklyStats.avgMood) >= 4 && (
                      <li>✓ Your mood is strong! Keep up the positive energy.</li>
                    )}
                    {parseFloat(weeklyStats.avgStress) >= 4 && (
                      <li>⚠️ Stress is elevated. Try our calming games or meditation.</li>
                    )}
                    {parseFloat(weeklyStats.avgSleep) < 7 && (
                      <li>⚠️ Getting less than 7 hours? Your sleep matters for mood!</li>
                    )}
                    {parseFloat(weeklyStats.avgScreenTime) > 6 && (
                      <li>⚠️ High screen time detected. Take screen breaks!</li>
                    )}
                  </ul>
                </div>
              </div>

              <button
                onClick={() => setShowReport(false)}
                className="w-full px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition"
              >
                Back to Entry
              </button>
            </div>
          </>
        ) : null}
      </main>
    </div>
  );
}
