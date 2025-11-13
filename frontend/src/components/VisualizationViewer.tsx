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
  MessageCircle,
} from "lucide-react";
import type { VisualizationData } from "../types/visualization";
import { cn } from "../lib/utils";
import { VisualizationCanvas } from "./VisualizationCanvas";
import { TreeOptionsPanel } from "./TreeOptionsPanel";
import { TreeInfoPanel } from "./TreeInfoPanel";
import { TreeChatbot } from "./TreeChatbot";
import { VisualizationChatbot } from "./VisualizationChatbot";
import { LearningNotes } from "./LearningNotes";
import { EducationalInfo } from "./EducationalInfo";

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

  // Universal chatbot state (for non-tree visualizations)
  const [showUniversalChatbot, setShowUniversalChatbot] = useState(false);

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
    <div className="min-h-screen bg-[#121212] text-white">
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

          <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6 flex items-start justify-between">
            <div className="flex-1">
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

            {/* Ask AI Button (for non-tree visualizations) */}
            {!isTreeVisualization && (
              <button
                onClick={() => setShowUniversalChatbot(!showUniversalChatbot)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
              >
                <MessageCircle className="w-5 h-5" />
                Ask AI
              </button>
            )}
          </div>
        </motion.div>

        {/* Main Content - 3 Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: Visualization Canvas */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2"
          >
            {/* Tree Options Panel (only for tree visualizations) */}
            {isTreeVisualization && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
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

            <div className="bg-[#1a1a1a] border border-gray-700 rounded-lg p-6">
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
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-5 h-5" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg border border-gray-600 transition-colors"
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
                        "p-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title="Reset"
                    >
                      <RotateCcw className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handleStepBackward}
                      disabled={currentStep === 0}
                      className={cn(
                        "p-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title="Previous Step"
                    >
                      <SkipBack className="w-5 h-5" />
                    </button>

                    <button
                      onClick={handlePlayPause}
                      className="p-4 rounded-lg bg-blue-600 hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
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
                        "p-3 rounded-lg bg-gray-800 hover:bg-gray-700 border border-gray-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      )}
                      title="Next Step"
                    >
                      <SkipForward className="w-5 h-5" />
                    </button>

                    {/* Speed Control */}
                    <select
                      value={speed}
                      onChange={(e) => setSpeed(Number(e.target.value))}
                      className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white cursor-pointer"
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

          {/* Right Column: Chatbot + Educational Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Chatbot */}
            {!isTreeVisualization && (
              <VisualizationChatbot
                topic={data.topic}
                visualizationType={data.visualization_type}
                metadata={data.metadata}
                isOpen={showUniversalChatbot}
                onClose={() => setShowUniversalChatbot(!showUniversalChatbot)}
              />
            )}

            {isTreeVisualization ? (
              <TreeInfoPanel
                treeType={treeType}
                currentStep={currentStep}
                totalSteps={totalSteps}
              />
            ) : (
              <EducationalInfo data={data} currentStep={currentStep} />
            )}
          </motion.div>
        </div>

        {/* Learning Notes Section - Full Width */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <LearningNotes topic={data.topic} />
        </motion.div>

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
