/**
 * TypeScript types for visualization data structures
 * Matches the backend Pydantic models
 */

export type VisualizationType =
  | "tree"
  | "graph"
  | "flowchart"
  | "animation"
  | "comparison"
  | "timeline"
  | "process";

export type InteractiveElementType = "button" | "slider" | "toggle" | "input";

export interface VisualComponent {
  id: string;
  type: string; // node, edge, shape, text, arrow
  properties: {
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    color?: string;
    label?: string;
    [key: string]: any;
  };
  content?: string;
  connections: string[];
}

export interface AnimationStep {
  step_number: number;
  description: string;
  duration: number; // in seconds
  changes: Array<{
    component_id?: string;
    property?: string;
    from?: any;
    to?: any;
    [key: string]: any;
  }>;
  highlight: string[]; // IDs of components to highlight
}

export interface InteractiveElement {
  id: string;
  type: InteractiveElementType;
  label: string;
  action: string;
  properties: Record<string, any>;
}

export interface VisualizationData {
  success: boolean;
  topic: string;
  title: string;
  description: string;
  visualization_type: VisualizationType;
  components: VisualComponent[];
  steps: AnimationStep[];
  interactive_elements: InteractiveElement[];
  metadata: {
    difficulty?: "beginner" | "intermediate" | "advanced";
    category?:
      | "computer_science"
      | "biology"
      | "physics"
      | "math"
      | "history"
      | "other";
    estimated_time?: number;
    key_concepts?: string[];
    [key: string]: any;
  };
}

export interface VisualizationRequest {
  topic: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  details?: string;
}

export interface Example {
  category: string;
  topics: string[];
}

export interface ExamplesResponse {
  examples: Example[];
}
