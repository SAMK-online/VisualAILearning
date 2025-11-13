import { motion } from "framer-motion";
import {
  Brain,
  AlertCircle,
  Sparkles,
  Layers,
  LineChart,
  ShieldCheck,
  Clock3,
  BookOpen,
  CheckCircle2,
} from "lucide-react";

interface NewLandingPageProps {
  onOpenVisualizer: () => void;
  onOpenPortfolioArchitect: () => void;
  isLoading: boolean;
  error: string | null;
}

const FEATURE_CARDS = [
  {
    title: "Interactive Visual Storytelling",
    description:
      "Step-by-step animations, guided narration, and playback controls keep every learner engaged.",
    icon: Sparkles,
    bullets: ["Tree, graph, flow, timeline, process views", "Highlight-driven explanations"],
  },
  {
    title: "AI-Crafted Content",
    description:
      "Purpose-built prompts for computer science topics ensure each visualization tells the right story.",
    icon: Brain,
    bullets: ["OpenAI GPT-4 & Anthropic Claude", "Consistent JSON schema output"],
  },
  {
    title: "Learner Support System",
    description:
      "Integrated notes, contextual chat, and traversal explainers turn curiosity into mastery.",
    icon: BookOpen,
    bullets: ["Tree-focused tutor", "Downloadable notes per topic"],
  },
];

const WORKFLOW_STEPS = [
  {
    title: "Describe a Topic",
    copy: "Pick from curated examples or start with your favorite algorithm, system, or concept.",
  },
  {
    title: "AI Builds the Visual",
    copy: "The backend orchestrates prompt engineering, validation, and streaming to the client.",
  },
  {
    title: "Interact & Learn",
    copy: "Use playback, zoom, chat, and notes to explore the visualization at your pace.",
  },
  {
    title: "Share or Iterate",
    copy: "Capture notes, rerun topics, or export concepts for team demos and classrooms.",
  },
];

export function NewLandingPage({
  onOpenVisualizer,
  onOpenPortfolioArchitect,
  isLoading,
  error,
}: NewLandingPageProps) {
  return (
    <div className="relative flex min-h-screen w-full flex-col animated-gradient overflow-x-hidden text-white">
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
          <div className="hidden sm:flex items-center gap-8 text-sm font-medium">
            <button
              onClick={onOpenVisualizer}
              className="text-white/80 hover:text-white transition-colors cursor-pointer"
            >
              Visual Learner
            </button>
            <a className="text-white/80 hover:text-white transition-colors" href="#features">
              Product
            </a>
          <a className="text-white/80 hover:text-white transition-colors" href="#workflow">
            Workflow
          </a>
          <a className="text-white/80 hover:text-white transition-colors" href="#topics">
            Topics
          </a>
          <button
            onClick={onOpenPortfolioArchitect}
            className="text-white/80 hover:text-white transition-colors cursor-pointer"
          >
            Portfolio Architect
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-24 pb-16">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-10 md:px-20 lg:px-32 space-y-20">
          {/* Hero Section */}
          <motion.section
            id="visual-learning"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-col gap-8 text-center"
          >
            <p className="uppercase tracking-[0.3em] text-xs text-white/70">AI-Powered Education</p>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-[-0.03em]">
              Learn complex systems through cinematic visualizations.
            </h1>
            <p className="text-white/80 text-lg max-w-3xl mx-auto">
              Visual Learning Platform turns dense documentation into living diagrams. Pair
              step-by-step animations with AI tutoring, interactive controls, and persistent notes to
              help teams, students, and candidates master technical narratives faster.
            </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenVisualizer}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-[#1337ec] text-white font-semibold transition-colors hover:scale-105"
            >
              <Layers className="w-5 h-5" />
              Open Visual Learner
            </button>
            <button
              onClick={onOpenPortfolioArchitect}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 bg-white/10 border border-white/20 font-semibold hover:bg-white/20 transition-colors"
            >
              <Layers className="w-5 h-5" />
              Explore Portfolio Architect
            </button>
          </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
              {[
                { label: "Topics Visualized", value: "1,200+" },
                { label: "Interactive Elements", value: "30+" },
                { label: "Avg. Session Time", value: "12 min" },
                { label: "AI Tutors", value: "GPT-4 & Claude" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-2xl border border-white/15 bg-white/5 backdrop-blur-sm px-4 py-5"
                >
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-xs uppercase tracking-wide text-white/60 mt-1">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.section>

          {/* Feature Grid */}
          <section id="features" className="space-y-8">
            <div className="text-center space-y-4">
              <p className="text-[#7dd3fc] font-semibold tracking-[0.2em] text-xs uppercase">
                Why It Works
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold">Product pillars that feel handcrafted</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Every surface is designed for clarity—interactive visuals, contextual AI, and
                frictionless note taking keep learners in flow.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {FEATURE_CARDS.map((card) => (
                <div
                  key={card.title}
                  className="rounded-3xl border border-white/15 bg-white/5 backdrop-blur-sm p-6 flex flex-col gap-4"
                >
                  <card.icon className="w-10 h-10 text-[#7dd3fc]" />
                  <div>
                    <h3 className="text-xl font-semibold">{card.title}</h3>
                    <p className="text-white/70 text-sm mt-2">{card.description}</p>
                  </div>
                  <ul className="text-sm text-white/80 space-y-2">
                    {card.bullets.map((bullet) => (
                      <li key={bullet} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#22d3ee] mt-0.5" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* Workflow */}
          <section id="workflow" className="space-y-8">
            <div className="flex flex-col gap-3 text-center">
              <p className="text-[#c084fc] font-semibold tracking-[0.2em] text-xs uppercase">
                Workflow
              </p>
              <h2 className="text-3xl font-bold">From prompt to polished lesson in minutes</h2>
              <p className="text-white/70 max-w-2xl mx-auto">
                Our FastAPI backend handles AI orchestration, while the React client renders
                visualization canvases, playback controllers, and interactive tutors.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {WORKFLOW_STEPS.map((step, index) => (
                <div
                  key={step.title}
                  className="rounded-2xl border border-white/15 bg-white/5 p-6 flex gap-4"
                >
                  <div className="text-[#22d3ee] text-3xl font-black leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </div>
                  <div>
                    <h3 className="font-semibold text-xl">{step.title}</h3>
                    <p className="text-white/70 text-sm mt-2">{step.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Assurance Row */}
          <section className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                title: "Frictionless controls",
                copy: "Playback, zoom, traversal switches, and keyboard support.",
                icon: LineChart,
              },
              {
                title: "Enterprise-friendly",
                copy: "Secure API keys, rate limiting, CORS controls, and structured logs.",
                icon: ShieldCheck,
              },
              {
                title: "Always up-to-date",
                copy: "Tailwind + Vite frontends, responsive design, and instant reloads.",
                icon: Clock3,
              },
            ].map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-white/15 bg-white/5 p-5 flex gap-4 items-start"
              >
                <item.icon className="w-8 h-8 text-[#7ee8fa]" />
                <div>
                  <h3 className="font-semibold text-lg">{item.title}</h3>
                  <p className="text-white/70 text-sm mt-1">{item.copy}</p>
                </div>
              </div>
            ))}
          </section>

          {/* CTA Topics */}
          <section id="topics" className="space-y-6">
            <div className="flex flex-col items-center text-center gap-3">
              <p className="text-[#fdba74] font-semibold tracking-[0.2em] text-xs uppercase">
                Ready to explore?
              </p>
              <h2 className="text-3xl font-bold">Pick a topic and we will craft the lesson</h2>
              <p className="text-white/70 max-w-2xl">
                Choose a concept below once you enter the Visual Learner workspace.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["Data Structures", "Binary Search Tree, AVL Tree, Hash Tables"],
                ["Algorithms", "Merge Sort, Dijkstra, Dynamic Programming"],
                ["Systems", "Load Balancers, Caching Layers, Queueing"],
                ["AI & ML", "Neural Networks, Transformers, Vector DBs"],
              ].map(([title, description]) => (
                <div
                  key={title}
                  className="rounded-2xl border border-white/15 bg-white/5 px-5 py-4 text-left"
                >
                  <p className="font-semibold">{title}</p>
                  <p className="text-sm text-white/70 mt-1">{description}</p>
                </div>
              ))}
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/40 rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-300 mt-1" />
                <div>
                  <p className="font-semibold text-red-200">Something went wrong</p>
                  <p className="text-red-100 text-sm">{error}</p>
                </div>
              </div>
            )}

            {isLoading && (
              <p className="text-center text-sm text-white/70">
                Preparing Visual Learner workspace...
              </p>
            )}
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="flex flex-col gap-6 px-5 py-10 text-center w-full max-w-6xl mx-auto mt-auto text-white/80">
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
