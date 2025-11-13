/**
 * API service for communicating with the FastAPI backend
 */
import axios from "axios";
import type {
  VisualizationData,
  VisualizationRequest,
  ExamplesResponse,
  ErrorResponse,
} from "../types/visualization";

// Configure base URL - defaults to localhost:8000 in development
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000, // 30 second timeout for AI generation
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * Generate a visualization for a given topic
 */
export async function generateVisualization(
  topic: string
): Promise<VisualizationData> {
  try {
    const request: VisualizationRequest = { topic };

    const response = await api.post<VisualizationData>(
      "/api/generate-visualization",
      request
    );

    if (!response.data.success) {
      throw new Error("Visualization generation failed");
    }

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new Error("Rate limit exceeded. Please try again in a minute.");
      }

      const errorData = error.response?.data as ErrorResponse | undefined;
      throw new Error(
        errorData?.error || error.message || "Failed to generate visualization"
      );
    }

    throw error;
  }
}

/**
 * Get example topics
 */
export async function getExamples(): Promise<ExamplesResponse> {
  try {
    const response = await api.get<ExamplesResponse>("/api/examples");
    return response.data;
  } catch (error) {
    console.error("Failed to fetch examples:", error);
    // Return fallback examples if API fails
    return {
      examples: [
        {
          category: "Computer Science",
          topics: [
            "Binary Search Tree",
            "Merge Sort Algorithm",
            "How Hash Tables Work",
          ],
        },
        {
          category: "Biology",
          topics: ["How Photosynthesis Works", "Cell Division (Mitosis)"],
        },
        {
          category: "Physics",
          topics: ["Newton's Laws of Motion", "Electric Circuit Flow"],
        },
      ],
    };
  }
}

/**
 * Health check
 */
export async function healthCheck(): Promise<boolean> {
  try {
    const response = await api.get("/health");
    return response.status === 200;
  } catch (error) {
    return false;
  }
}

export default api;
