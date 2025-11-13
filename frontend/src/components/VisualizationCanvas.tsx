import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import type { VisualizationData, VisualComponent } from "../types/visualization";

interface VisualizationCanvasProps {
  data: VisualizationData;
  currentStep: number;
  zoom: number;
}

export function VisualizationCanvas({
  data,
  currentStep,
  zoom,
}: VisualizationCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  // Update canvas dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width } = containerRef.current.getBoundingClientRect();
        setDimensions({
          width: width,
          height: Math.min(600, width * 0.75),
        });
      }
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  // Render visualization
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, dimensions.width, dimensions.height);

    // Apply zoom
    ctx.save();
    ctx.scale(zoom, zoom);

    // Render based on visualization type
    switch (data.visualization_type) {
      case "tree":
        renderTree(ctx, data, currentStep, dimensions);
        break;
      case "graph":
        renderGraph(ctx, data, currentStep, dimensions);
        break;
      case "flowchart":
        renderFlowchart(ctx, data, currentStep, dimensions);
        break;
      case "animation":
      case "process":
      case "timeline":
        renderProcess(ctx, data, currentStep, dimensions);
        break;
      default:
        renderGeneric(ctx, data, currentStep, dimensions);
    }

    ctx.restore();
  }, [data, currentStep, dimensions, zoom]);

  return (
    <div ref={containerRef} className="w-full">
      <motion.canvas
        ref={canvasRef}
        width={dimensions.width}
        height={dimensions.height}
        className="w-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-lg shadow-inner border border-white/10"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  );
}

// Helper function to render tree visualizations
function renderTree(
  ctx: CanvasRenderingContext2D,
  data: VisualizationData,
  currentStep: number,
  dimensions: { width: number; height: number }
) {
  const highlightedIds = new Set(
    data.steps[currentStep]?.highlight || []
  );

  // Draw connections first (edges) - only for nodes with valid coordinates
  data.components.forEach((component) => {
    // Skip if component doesn't have valid coordinates or is not a node type
    if (component.type !== "node" || !component.properties.x || !component.properties.y) {
      return;
    }

    if (component.connections.length > 0) {
      const startX = component.properties.x;
      const startY = component.properties.y;

      component.connections.forEach((targetId) => {
        const target = data.components.find((c) => c.id === targetId);
        // Only draw if target exists, is a node, and has valid coordinates
        if (target && target.type === "node" && target.properties.x && target.properties.y) {
          const endX = target.properties.x;
          const endY = target.properties.y;

          // Make edges more visible with better colors and thickness
          const isHighlightedEdge = highlightedIds.has(component.id) || highlightedIds.has(targetId);
          ctx.strokeStyle = isHighlightedEdge ? "#f59e0b" : "#94a3b8";
          ctx.lineWidth = isHighlightedEdge ? 4 : 3;
          ctx.lineCap = "round";

          ctx.beginPath();
          ctx.moveTo(startX, startY);
          ctx.lineTo(endX, endY);
          ctx.stroke();
        }
      });
    }
  });

  // Draw nodes - only components with type "node" and valid coordinates
  data.components.forEach((component) => {
    // Skip non-node components or nodes without valid coordinates
    if (component.type !== "node" || !component.properties.x || !component.properties.y) {
      return;
    }

    const x = component.properties.x;
    const y = component.properties.y;
    const radius = component.properties.width || 40;
    const isHighlighted = highlightedIds.has(component.id);

    // Draw node circle with better colors
    ctx.fillStyle = component.properties.color || (isHighlighted ? "#f59e0b" : "#3b82f6");
    ctx.strokeStyle = isHighlighted ? "#fbbf24" : "#1e293b";
    ctx.lineWidth = isHighlighted ? 5 : 3;

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Draw label - prioritize the label property over content
    const labelText = component.properties.label || component.content || "";
    if (labelText) {
      ctx.fillStyle = "#ffffff";
      ctx.font = `bold ${isHighlighted ? 24 : 20}px Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Add text shadow for better readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.8)";
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 1;

      ctx.fillText(labelText, x, y);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }
  });
}

// Helper function to render graph visualizations
function renderGraph(
  ctx: CanvasRenderingContext2D,
  data: VisualizationData,
  currentStep: number,
  dimensions: { width: number; height: number }
) {
  // Similar to tree but with different layout
  renderTree(ctx, data, currentStep, dimensions);
}

// Helper function to render flowchart visualizations
function renderFlowchart(
  ctx: CanvasRenderingContext2D,
  data: VisualizationData,
  currentStep: number,
  dimensions: { width: number; height: number }
) {
  const highlightedIds = new Set(data.steps[currentStep]?.highlight || []);

  // Draw connections with arrows
  data.components.forEach((component) => {
    if (component.connections.length > 0) {
      const startX = component.properties.x || 0;
      const startY = component.properties.y || 0;

      component.connections.forEach((targetId) => {
        const target = data.components.find((c) => c.id === targetId);
        if (target) {
          const endX = target.properties.x || 0;
          const endY = target.properties.y || 0;

          // Draw arrow
          drawArrow(ctx, startX, startY, endX, endY, highlightedIds.has(component.id));
        }
      });
    }
  });

  // Draw boxes
  data.components.forEach((component) => {
    const x = component.properties.x || 0;
    const y = component.properties.y || 0;
    const width = component.properties.width || 120;
    const height = component.properties.height || 60;
    const isHighlighted = highlightedIds.has(component.id);

    // Draw box with better colors
    ctx.fillStyle = component.properties.color || (isHighlighted ? "#f59e0b" : "#3b82f6");
    ctx.strokeStyle = isHighlighted ? "#fbbf24" : "#1e293b";
    ctx.lineWidth = isHighlighted ? 5 : 3;

    ctx.fillRect(x - width / 2, y - height / 2, width, height);
    ctx.strokeRect(x - width / 2, y - height / 2, width, height);

    // Draw label with better text
    const labelText = component.properties.label || component.content || "";
    if (labelText) {
      ctx.fillStyle = "#ffffff";
      ctx.font = `${isHighlighted ? "bold 16px" : "bold 14px"} Inter, sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      // Add text shadow for better readability
      ctx.shadowColor = "rgba(0, 0, 0, 0.5)";
      ctx.shadowBlur = 2;

      // Word wrap
      const words = labelText.split(" ");
      const maxWidth = width - 20;
      let line = "";
      let yOffset = y - (words.length > 3 ? 20 : 0);
      const lineHeight = 20;

      words.forEach((word) => {
        const testLine = line + word + " ";
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth && line) {
          ctx.fillText(line.trim(), x, yOffset);
          line = word + " ";
          yOffset += lineHeight;
        } else {
          line = testLine;
        }
      });
      ctx.fillText(line.trim(), x, yOffset);

      // Reset shadow
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
    }
  });
}

// Helper function to render process/animation/timeline visualizations
function renderProcess(
  ctx: CanvasRenderingContext2D,
  data: VisualizationData,
  currentStep: number,
  dimensions: { width: number; height: number }
) {
  renderFlowchart(ctx, data, currentStep, dimensions);
}

// Generic fallback renderer
function renderGeneric(
  ctx: CanvasRenderingContext2D,
  data: VisualizationData,
  currentStep: number,
  dimensions: { width: number; height: number }
) {
  renderFlowchart(ctx, data, currentStep, dimensions);
}

// Helper to draw arrows
function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  highlighted: boolean
) {
  const headLength = 15;
  const angle = Math.atan2(toY - fromY, toX - fromX);

  ctx.strokeStyle = highlighted ? "#a855f7" : "#6b7280";
  ctx.fillStyle = highlighted ? "#a855f7" : "#6b7280";
  ctx.lineWidth = highlighted ? 3 : 2;

  // Draw line
  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  // Draw arrowhead
  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.closePath();
  ctx.fill();
}
