import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Brain, Loader2, ListChecks } from "lucide-react";
import { cn } from "../lib/utils";

interface VisualizerLandingProps {
  onGenerateVisualization: (topic: string) => void;
  onBack: () => void;
  isLoading: boolean;
  error: string | null;
}

const SAMPLE_TOPICS = [
  "Binary Search Tree",
  "Merge Sort Animation",
  "Load Balancer Architecture",
  "Neural Network Basics",
  "TCP/IP Protocol Stack",
];

export function VisualizerLanding({
  onGenerateVisualization,
  onBack,
  isLoading,
  error,
}: VisualizerLandingProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!topic.trim() || isLoading) return;
    onGenerateVisualization(topic.trim());
  };

  const handleSampleClick = (sample: string) => {
    if (isLoading) return;
    setTopic(sample);
    onGenerateVisualization(sample);
  };

  return (
    <div className="min-h-screen bg-[#050915] text-white">
      <div className="max-w-5xl mx-auto px-4 py-10 space-y-10">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Overview
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="space-y-4 text-center"
        >
          <p className="text-xs uppercase tracking-[0.4em] text-white/60">Visual Learner</p>
          <h1 className="text-4xl sm:text-5xl font-bold">Generate an interactive explanation</h1>
          <p className="text-lg text-white/70 max-w-2xl mx-auto">
            Enter any computer science concept or choose from the quick suggestions below. When you
            search for “Binary Search Tree”, we will open the fully interactive BST demo.
          </p>
        </motion.div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4 backdrop-blur">
          <form onSubmit={handleSubmit} className="space-y-4">
            <label className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Topic or concept
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g. Binary Search Tree traversal"
                className="flex-1 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-base outline-none focus:ring-2 focus:ring-[#639aff]"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={!topic.trim() || isLoading}
                className={cn(
                  "inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 bg-[#1337ec] font-semibold transition-colors",
                  isLoading ? "opacity-75 cursor-not-allowed" : "hover:bg-[#2747ff]"
                )}
              >
                {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
                Generate Visualization
              </button>
            </div>
          </form>
          {error && (
            <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-100">
              {error}
            </div>
          )}
        </div>

        <section className="space-y-3">
          <p className="text-sm uppercase tracking-[0.4em] text-white/60">Quick starts</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SAMPLE_TOPICS.map((sample) => (
              <button
                key={sample}
                onClick={() => handleSampleClick(sample)}
                disabled={isLoading}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-left transition-colors",
                  isLoading ? "opacity-60 cursor-not-allowed" : "hover:bg-white/10"
                )}
              >
                <ListChecks className="w-5 h-5 text-[#9de1ff]" />
                <span className="font-semibold">{sample}</span>
              </button>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
