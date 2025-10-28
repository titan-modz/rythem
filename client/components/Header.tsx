import { useRythmStore } from "@/hooks/useRythmStore";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const { progress } = useRythmStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 bg-gradient-to-r from-primary via-purple-500 to-secondary text-white shadow-lg">
      <div className="container max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 font-bold text-xl md:text-2xl hover:opacity-90 transition">
          <span className="text-2xl md:text-3xl">🎵</span>
          <span className="hidden sm:inline">RythmAI</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-1">
          <a href="/" className="px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium text-sm">
            Home
          </a>
          <a href="/mood" className="px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium text-sm">
            Mood Check
          </a>
          <a href="/chat" className="px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium text-sm">
            Chatbot
          </a>
          <a href="/tasks" className="px-3 py-2 rounded-lg hover:bg-white/10 transition font-medium text-sm">
            Tasks
          </a>
        </nav>

        {/* Stats */}
        <div className="hidden sm:flex items-center gap-6">
          <div className="text-right">
            <div className="text-2xl font-bold">Level {progress.level}</div>
            <div className="text-xs opacity-90">
              {progress.xp % 100} / 100 XP
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-bold">{progress.currentStreak}🔥</div>
            <div className="text-xs opacity-90">streak</div>
          </div>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden p-2 hover:bg-white/10 rounded-lg transition"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <nav className="md:hidden border-t border-white/20 bg-primary/95 backdrop-blur">
          <div className="container max-w-6xl mx-auto px-4 py-4 space-y-2">
            <a href="/" className="block px-3 py-2 rounded-lg hover:bg-white/10 transition">
              Home
            </a>
            <a href="/mood" className="block px-3 py-2 rounded-lg hover:bg-white/10 transition">
              Mood Check
            </a>
            <a href="/chat" className="block px-3 py-2 rounded-lg hover:bg-white/10 transition">
              Chatbot
            </a>
            <a href="/tasks" className="block px-3 py-2 rounded-lg hover:bg-white/10 transition">
              Tasks
            </a>
            <div className="px-3 py-2 text-sm">
              <div>Level {progress.level} • {progress.currentStreak}🔥 streak</div>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
