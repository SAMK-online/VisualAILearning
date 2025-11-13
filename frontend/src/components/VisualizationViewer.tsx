import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  SkipBack,
  SkipForward,
  Home,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type { VisualizationData } from "../types/visualization";
import { cn } from "../lib/utils";
import { VisualizationCanvas } from "./VisualizationCanvas";
import { TreeOptionsPanel } from "./TreeOptionsPanel";
import { TreeInfoPanel } from "./TreeInfoPanel";
import { TreeChatbot } from "./TreeChatbot";

interface VisualizationViewerProps {
  data: VisualizationData;
  onBack: () => void;
}

export function VisualizationViewer({
  data,
  onBack,
}: VisualizationViewerProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [zoom, setZoom] = useState(1);

  // Tree-specific state
  const [treeType, setTreeType] = useState("bst");
  const [traversalMode, setTraversalMode] = useState("inorder");
  const [showChatbot, setShowChatbot] = useState(false);

  const totalSteps = data.steps.length;
  const hasSteps = totalSteps > 0;
  const isTreeVisualization = data.visualization_type === "tree";

  // Reset animation when traversal mode changes
  useEffect(() => {
    if (isTreeVisualization) {
      setCurrentStep(0);
      setIsPlaying(false);
    }
  }, [traversalMode, isTreeVisualization]);

  // Auto-play animation
  useEffect(() => {
    if (!isPlaying || !hasSteps) return;

    const currentStepData = data.steps[currentStep];
    const duration = (currentStepData.duration / speed) * 1000; // Convert to ms and apply speed

    const timer = setTimeout(() => {
      if (currentStep < totalSteps - 1) {
        setCurrentStep((prev) => prev + 1);
      } else {
        setIsPlaying(false); // Stop at the end
      }
    }, duration);

    return () => clearTimeout(timer);
  }, [isPlaying, currentStep, hasSteps, totalSteps, speed, data.steps]);

  const handlePlayPause = () => {
    if (!hasSteps) return;
    if (currentStep >= totalSteps - 1 && !isPlaying) {
      setCurrentStep(0); // Restart from beginning
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
      setIsPlaying(false);
    }
  };

  const handleStepBackward = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      setIsPlaying(false);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setIsPlaying(false);
  };

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + 0.2, 3));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - 0.2, 0.5));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-blue-900 text-white">
      <div className="container mx-auto px-4 py-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
          >
            <Home className="w-5 h-5" />
            Back to Home
          </button>

          <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6">
            <h1 className="text-3xl font-bold mb-2">{data.title}</h1>
            <p className="text-gray-300">{data.description}</p>

            {data.metadata && (
              <div className="mt-4 flex flex-wrap gap-3">
                {data.metadata.difficulty && (
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm capitalize">
                    {data.metadata.difficulty}
                  </span>
                )}
                {data.metadata.category && (
                  <span className="px-3 py-1 bg-blue-500/30 rounded-full text-sm capitalize">
                    {data.metadata.category.replace("_", " ")}
                  </span>
                )}
                {data.metadata.estimated_time && (
                  <span className="px-3 py-1 bg-green-500/30 rounded-full text-sm">
                    ~{data.metadata.estimated_time} min
                  </span>
                )}
              </div>
            )}
          </div>
        </motion.div>

        {/* Main Content */}
        <div className={cn(
          "grid gap-6",
          isTreeVisualization
            ? "grid-cols-1 lg:grid-cols-4"
            : "grid-cols-1 lg:grid-cols-3"
        )}>
          {/* Tree Options Panel (only for tree visualizations) */}
          {isTreeVisualization && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-1"
            >
              <TreeOptionsPanel
                treeType={treeType}
                traversalMode={traversalMode}
                onTreeTypeChange={setTreeType}
                onTraversalModeChange={setTraversalMode}
                onShowChatbot={() => setShowChatbot(true)}
              />
            </motion.div>
          )}

          {/* Visualization Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              isTreeVisualization ? "lg:col-span-2" : "lg:col-span-2"
            )}
          >
            <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6">
              <div className="relative">
                <VisualizationCanvas
                  data={data}
                  currentStep={currentStep}
                  zoom={zoom}
                />

                {/* Zoom Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button
                    onClick={handleZoomIn}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-lg border border-white/20 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-white/10 hover:bg-white/20 rounded-lg backdrop-blur-lg border border-white/20 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Controls */}
              {hasSteps && (
                <div className="mt-6 space-y-4">
                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm text-gray-300">
                      <span>
                        Step {currentStep + 1} of {totalSteps}
                      </span>
                      <span>Speed: {speed}x</span>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-2">
                      <motion.div
                        className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full"
                        initial={{ width: 0 }}
                        animate={{
                          width: `${((currentStep + 1) / totalSteps) * 100}%`,
                        }}
                        transition={{ duration: 0.3 }}
                      />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={handleReset}
                      disabled={currentStep === 0 && !isPlaying}
                      className={cn(
                        "p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title="Reset"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleStepBackward}
                      disabled={currentStep === 0}
                      className={cn(
                        "p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title="Previous Step"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handlePlayPause}
                      className="p-4 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
                      title={isPlaying ? "Pause" : "Play"}
                    >
                      {isPlaying ? (
                        <Pause className="w-6 h-6" />
                      ) : (
                        <Play className="w-6 h-6" />
                      )}
                    </button>

                    <button
                      onClick={handleStepForward}
                      disabled={currentStep >= totalSteps - 1}
                      className={cn(
                        "p-3 rounded-lg bg-white/10 hover:bg-white/20 border border-white/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title="Next Step"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    {/* Speed Control */}
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white cursor-pointer"
                    >
                      <option value={0.5}>0.5x</option>
                      <option value={1}>1x</option>
                      <option value={1.5}>1.5x</option>
                      <option value={2}>2x</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Explanation/Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1"
          >
            {isTreeVisualization ? (
              <TreeInfoPanel
                treeType={treeType}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            ) : (
              <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-lg p-6 sticky top-6">
                <h3 className="text-xl font-semibold mb-4">Explanation</h3>

                <AnimatePresence mode="wait">
                  {hasSteps ? (
                    <motion.div
                      key={currentStep}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4"
                    >
                      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                        <p className="text-sm text-gray-400 mb-2">
                          Step {currentStep + 1}
                        </p>
                        <p className="text-gray-200">
                          {data.steps[currentStep].description}
                        </p>
                      </div>

                      {/* Key Concepts */}
                      {data.metadata?.key_concepts &&
                        data.metadata.key_concepts.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-2 text-sm text-gray-300">
                              Key Concepts
                            </h4>
                            <div className="flex flex-wrap gap-2">
                              {data.metadata.key_concepts.map((concept) => (
                                <span
                                  key={concept}
                                  className="px-2 py-1 bg-white/10 rounded text-xs"
                                >
                                  {concept}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                    </motion.div>
                  ) : (
                    <p className="text-gray-400">
                      This visualization doesn't have step-by-step animations.
                      Explore the components above!
                    </p>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tree Chatbot (only for tree visualizations) */}
        {isTreeVisualization && (
          <TreeChatbot
            isOpen={showChatbot}
            onClose={() => setShowChatbot(false)}
            currentTree={treeType}
            currentTraversal={traversalMode}
          />
        )}
      </div>
    </div>
  );
}
