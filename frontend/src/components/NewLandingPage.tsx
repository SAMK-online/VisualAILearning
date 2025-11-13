import { useState } from "react";
import { motion } from "framer-motion";
import { Brain, Search, Loader2, AlertCircle } from "lucide-react";
import { cn } from "../lib/utils";

interface NewLandingPageProps {
  onGenerateVisualization: (topic: string) => void;
  onOpenPortfolioArchitect: () => void;
  isLoading: boolean;
  error: string | null;
}

export function NewLandingPage({
  onGenerateVisualization,
  onOpenPortfolioArchitect,
  isLoading,
  error,
}: NewLandingPageProps) {
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (topic.trim() && !isLoading) {
      onGenerateVisualization(topic.trim());
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col animated-gradient overflow-x-hidden">
      <style>{`
        .animated-gradient {
          background: linear-gradient(-45deg, #101322, #0d1b3e, #1c0f2a, #101322);
          background-size: 400% 400%;
          animation: gradient 15s ease infinite;
        }
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between whitespace-nowrap px-4 sm:px-10 md:px-20 lg:px-40 py-4 bg-black/30 backdrop-blur-md border-b border-solid border-white/10">
        <div className="flex items-center gap-4 text-white">
          <Brain className="w-8 h-8 text-[#1337ec]" />
          <h2 className="text-white text-xl font-bold leading-tight tracking-[-0.015em]">
            Visual Learning
          </h2>
        </div>
        <div className="flex flex-1 justify-end gap-8">
          <div className="hidden sm:flex items-center gap-9">
            <a
              className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal"
              href="#visual-learning"
            >
              Visual Learning
            </a>
            <button
              onClick={onOpenPortfolioArchitect}
              className="text-white/80 hover:text-white transition-colors text-sm font-medium leading-normal cursor-pointer"
            >
              Portfolio Architect
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex flex-col justify-center items-center pt-20">
        <div className="w-full max-w-6xl px-4 sm:px-10 md:px-20 lg:px-40">
          {/* Hero Section */}
          <motion.div
            id="visual-learning"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex min-h-[480px] flex-col gap-6 items-center justify-center text-center py-16"
          >
            <div className="flex flex-col gap-4 max-w-3xl">
              <h1 className="text-white text-5xl font-black leading-tight tracking-[-0.033em] sm:text-6xl md:text-7xl">
                Your Future, Focused.
              </h1>
              <h2 className="text-white/80 text-base font-normal leading-normal max-w-xl mx-auto sm:text-lg">
                Master software engineering concepts through AI-powered interactive visualizations.
                Transform complex CS topics into intuitive learning experiences.
              </h2>
            </div>

            {/* Search Input */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-full max-w-2xl mt-8"
            >
              <form onSubmit={handleSubmit} className="relative">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g., Binary Search Tree, Merge Sort, Load Balancer, TCP/IP Stack..."
                    className="w-full px-4 py-4 pl-12 border-2 border-white/20 rounded-lg bg-black/30 backdrop-blur-md focus:outline-none focus:ring-2 focus:ring-[#1337ec] focus:border-[#1337ec] text-lg text-white placeholder-gray-400"
                    disabled={isLoading}
                  />
                </div>

                <button
                  type="submit"
                  disabled={!topic.trim() || isLoading}
                  className={cn(
                    "w-full mt-4 flex items-center justify-center gap-2 h-12 px-5 bg-[#1337ec] text-white text-base font-bold leading-normal tracking-[0.015em] rounded-lg transition-transform",
                    isLoading ? "opacity-75 cursor-not-allowed" : "hover:scale-105"
                  )}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Generating Visualization...
                    </>
                  ) : (
                    <>
                      <Brain className="w-5 h-5" />
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
                    <p className="font-semibold text-red-300">Oops! Something went wrong</p>
                    <p className="text-red-200 text-sm mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              {/* Loading Message */}
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-center text-white/80 text-sm"
                >
                  <p className="font-medium">This usually takes 5-15 seconds...</p>
                  <p className="mt-1">
                    Our AI is analyzing your topic and creating a perfect visualization
                  </p>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-6 px-5 py-10 text-center w-full max-w-6xl mx-auto mt-auto">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:justify-around">
          <a
            className="text-[#9da1b9] text-base font-normal leading-normal min-w-40 hover:text-white transition-colors"
            href="#"
          >
            About Us
          </a>
          <a
            className="text-[#9da1b9] text-base font-normal leading-normal min-w-40 hover:text-white transition-colors"
            href="#"
          >
            Contact
          </a>
          <a
            className="text-[#9da1b9] text-base font-normal leading-normal min-w-40 hover:text-white transition-colors"
            href="#"
          >
            Privacy Policy
          </a>
          <a
            className="text-[#9da1b9] text-base font-normal leading-normal min-w-40 hover:text-white transition-colors"
            href="#"
          >
            Terms of Service
          </a>
        </div>

        <div className="flex flex-wrap justify-center gap-6">
          <a className="text-[#9da1b9] hover:text-white transition-colors" href="#">
            <svg
              fill="currentColor"
              height="24"
              viewBox="0 0 16 16"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z"></path>
            </svg>
          </a>
          <a className="text-[#9da1b9] hover:text-white transition-colors" href="#">
            <svg
              fill="currentColor"
              height="24"
              viewBox="0 0 16 16"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.325 0-1.936.724-2.26 1.284h.018V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z"></path>
            </svg>
          </a>
          <a className="text-[#9da1b9] hover:text-white transition-colors" href="#">
            <svg
              fill="currentColor"
              height="24"
              viewBox="0 0 16 16"
              width="24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.012 8.012 0 0 0 16 8c0-4.42-3.58-8-8-8z"></path>
            </svg>
          </a>
        </div>

        <p className="text-[#9da1b9] text-sm font-normal leading-normal">
          © 2024 Visual Learning. Powered by AI.
        </p>
      </footer>
    </div>
  );
}
