import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Sparkles,
  Zap,
  Brain,
  Search,
  Loader2,
  AlertCircle,
  Briefcase,
} from "lucide-react";
import { getExamples } from "../services/api";
import type { Example } from "../types/visualization";
import { cn } from "../lib/utils";

interface LandingPageProps {
  onGenerateVisualization: (topic: string) => void;
  isLoading: boolean;
  error: string | null;
}

export function LandingPage({
  onGenerateVisualization,
  isLoading,
  error,
}: LandingPageProps) {
  const [topic, setTopic] = useState("");
  const [examples, setExamples] = useState<Example[]>([]);

  useEffect(() => {
    // Load examples on mount
    getExamples().then((data) => setExamples(data.examples));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerateVisualization(topic.trim());
    }
  };

  const handleExampleClick = (exampleTopic: string) => {
    setTopic(exampleTopic);
    onGenerateVisualization(exampleTopic);
  };

  return (
    <div className="min-h-screen bg-[#121212] text-[#EAEAEA]">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#4A90E2] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#4A90E2] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-72 h-72 bg-[#4A90E2] rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-pulse-slow animation-delay-4000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Brain className="w-12 h-12 text-[#4A90E2]" />
            <h1 className="text-5xl md:text-6xl font-black text-white tracking-tight">
              Visual Learning
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-white font-semibold max-w-3xl mx-auto">
            Master Software Engineering Visually - Powered by AI
          </p>
          <p className="text-[#A0A0A0] mt-4 max-w-2xl mx-auto text-lg">
            Transform complex CS concepts, algorithms, and system designs into interactive visualizations
            that make learning intuitive and engaging.
          </p>

          {/* Portfolio Architect Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8"
          >
            <a
              href="https://portfolio-architect-ai.vercel.app"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-[#4A90E2] to-[#357ABD] text-white font-bold text-lg rounded-lg shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              <Briefcase className="w-6 h-6" />
              Create Your Portfolio with AI
            </a>
            <p className="text-[#A0A0A0] text-sm mt-3">
              Upload your resume and get a stunning portfolio website in seconds
            </p>
          </motion.div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-5xl mx-auto"
        >
          <div className="card bg-white/95 backdrop-blur-lg border border-white/10 text-center shadow-xl">
            <Sparkles className="w-10 h-10 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2 text-gray-900">AI-Powered</h3>
            <p className="text-gray-700 text-sm">
              Advanced AI generates custom visualizations for any topic
            </p>
          </div>
          <div className="card bg-white/95 backdrop-blur-lg border border-white/10 text-center shadow-xl">
            <Zap className="w-10 h-10 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2 text-gray-900">Interactive</h3>
            <p className="text-gray-700 text-sm">
              Step through animations and explore concepts dynamically
            </p>
          </div>
          <div className="card bg-white/95 backdrop-blur-lg border border-white/10 text-center shadow-xl">
            <Brain className="w-10 h-10 text-[#4A90E2] mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2 text-gray-900">Learn Faster</h3>
            <p className="text-gray-700 text-sm">
              Visual learning helps you understand and remember better
            </p>
          </div>
        </motion.div>

        {/* Topic Input */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-3xl mx-auto mb-12"
        >
          <div className="card bg-white/95 backdrop-blur-lg border border-white/10 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-900">
              What do you want to learn today?
            </h2>

            <form onSubmit={handleSubmit} className="relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  placeholder="e.g., Binary Search Tree, Merge Sort, Load Balancer, TCP/IP Stack..."
                  className="w-full px-4 py-3 pl-12 border-2 border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-[#4A90E2]/50 focus:border-[#4A90E2] text-lg text-gray-900 placeholder-gray-500"
                  disabled={isLoading}
                />
              </div>

              <button
                type="submit"
                disabled={!topic.trim() || isLoading}
                className={cn(
                  "w-full mt-4 btn-primary text-lg py-4 flex items-center justify-center gap-2",
                  isLoading && "opacity-75 cursor-not-allowed"
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Generating Visualization...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Generate Visualization
                  </>
                )}
              </button>
            </form>

            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-red-300">
                    Oops! Something went wrong
                  </p>
                  <p className="text-red-200 text-sm mt-1">{error}</p>
                </div>
              </motion.div>
            )}

            {/* Loading estimate */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4 text-center text-gray-700 text-sm"
              >
                <p className="font-medium">This usually takes 5-15 seconds...</p>
                <p className="mt-1">
                  Our AI is analyzing your topic and creating a perfect
                  visualization
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Example Topics */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="max-w-6xl mx-auto"
        >
          <h3 className="text-xl font-semibold text-center mb-6 text-white">
            Or try one of these examples:
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {examples.map((category, idx) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.7 + idx * 0.1 }}
                className="card bg-white/95 backdrop-blur-lg border border-white/10 shadow-lg"
              >
                <h4 className="font-bold text-lg mb-3 text-[#4A90E2]">
                  {category.category}
                </h4>
                <div className="space-y-2">
                  {category.topics.map((example) => (
                    <button
                      key={example}
                      onClick={() => handleExampleClick(example)}
                      disabled={isLoading}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg bg-white border border-gray-200 hover:border-[#4A90E2] hover:bg-blue-50 transition-all duration-200 text-sm text-gray-800 hover:text-[#4A90E2] font-medium",
                        isLoading && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      {example}
                    </button>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="text-center mt-16 text-[#A0A0A0] text-sm"
        >
          <p>
            Powered by AI • Built with React, TypeScript, and FastAPI
          </p>
        </motion.div>
      </div>
    </div>
  );
}
