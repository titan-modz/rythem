import { useState, useRef, useEffect } from "react";
import { Header } from "@/components/Header";
import { getChatResponse } from "@/services/llama";
import { useRythmStore } from "@/hooks/useRythmStore";
import { Send, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
}

export default function Chat() {
  const { addXP } = useRythmStore();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "initial",
      role: "assistant",
      content:
        "Hi there! 👋 I'm here to chat about life, school, stress, motivation, and anything on your mind. What's up?",
      timestamp: Date.now(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!inputValue.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: inputValue,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setLoading(true);

    try {
      const response = await getChatResponse(inputValue);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: response,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      addXP(5);
    } catch (error) {
      console.error("Chat error:", error);
      const fallbackResponse =
        "I'm here to listen! That sounds important. What would help you feel better right now? 💙";
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: "assistant",
        content: fallbackResponse,
        timestamp: Date.now(),
      };
      setMessages((prev) => [...prev, errorMessage]);
      addXP(5);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900 flex flex-col">
      <Header />

      <main className="flex-1 flex flex-col container max-w-4xl mx-auto px-4 py-8">
        {/* Chat Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl md:text-4xl font-bold text-primary mb-2">
            💬 Chat with RythmAI
          </h1>
          <p className="text-muted-foreground">
            Ask me about life, school, stress, motivation, or anything else on
            your mind
          </p>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                <div
                  className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-3 ${
                    message.role === "user"
                      ? "bg-primary text-white rounded-br-none"
                      : "bg-muted text-foreground rounded-bl-none"
                  }`}
                >
                  <p className="text-sm md:text-base leading-relaxed">
                    {message.content}
                  </p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-bl-none px-4 py-3">
                  <Loader2 className="animate-spin text-primary" size={20} />
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Chat Input */}
          <form
            onSubmit={handleSendMessage}
            className="border-t border-border p-4 bg-background dark:bg-slate-900"
          >
            <div className="flex gap-3">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                disabled={loading}
                className="flex-1 px-4 py-3 rounded-lg border-2 border-border focus:border-primary outline-none bg-white dark:bg-slate-800 transition"
              />
              <button
                type="submit"
                disabled={loading || !inputValue.trim()}
                className="px-4 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                <Send size={20} />
              </button>
            </div>
          </form>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-secondary/10 border-2 border-secondary rounded-xl p-4 text-center text-sm">
          <p className="text-foreground">
            💡 <strong>Tip:</strong> Each message earns you 5 XP! Keep the
            conversation going.
          </p>
        </div>
      </main>
    </div>
  );
}
