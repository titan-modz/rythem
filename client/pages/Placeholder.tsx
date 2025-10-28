import { Header } from "@/components/Header";
import { ArrowLeft } from "lucide-react";

interface PlaceholderProps {
  title: string;
  description: string;
  icon: string;
  color: string;
}

export function Placeholder({ title, description, icon, color }: PlaceholderProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-slate-50 dark:from-background dark:to-slate-900">
      <Header />

      <main className="container max-w-4xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center space-y-8">
          {/* Icon */}
          <div className={`text-8xl mb-6 animate-pulse`}>{icon}</div>

          {/* Title and Description */}
          <div className="space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold text-primary">{title}</h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {description}
            </p>
          </div>

          {/* Status */}
          <div className={`inline-block bg-gradient-to-r ${color} text-white px-6 py-3 rounded-full font-semibold`}>
            ✨ Coming Soon
          </div>

          {/* Call to Action */}
          <div className="space-y-4 pt-8">
            <p className="text-muted-foreground">
              This feature is under development. We're working hard to bring you more wellness tools!
            </p>
            <p className="text-sm text-muted-foreground">
              Want to request features or give feedback? Let us know in the chat or contact us directly.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <a
              href="/"
              className="px-8 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              <ArrowLeft size={20} />
              Back to Home
            </a>
            <a
              href="/mood"
              className="px-8 py-3 bg-secondary text-white rounded-lg font-semibold hover:bg-secondary/90 transition-colors inline-flex items-center justify-center gap-2"
            >
              📊 Try Mood Check
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
