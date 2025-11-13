import { useState } from "react";
import { LandingPage } from "./components/LandingPage";
import { VisualizationViewer } from "./components/VisualizationViewer";
import { generateVisualization } from "./services/api";
import type { VisualizationData } from "./types/visualization";

type AppState = "landing" | "viewing";

function App() {
  const [state, setState] = useState<AppState>("landing");
  const [visualizationData, setVisualizationData] =
    useState<VisualizationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateVisualization = async (topic: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await generateVisualization(topic);
      
      // Check if this is a demo redirect (for BST)
      if (data.metadata?.demo_redirect && data.metadata?.demo_url) {
        console.log("Demo redirect detected, opening BST demo");
        // Open the demo in a new tab/window
        const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";
        window.open(`${apiBaseUrl}${data.metadata.demo_url}`, "_blank");
        setIsLoading(false);
        return;
      }
      
      setVisualizationData(data);
      setState("viewing");
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to generate visualization";
      setError(errorMessage);
      console.error("Visualization generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    setState("landing");
    setVisualizationData(null);
    setError(null);
  };

  return (
    <div className="App">
      {state === "landing" ? (
        <LandingPage
          onGenerateVisualization={handleGenerateVisualization}
          isLoading={isLoading}
          error={error}
        />
      ) : visualizationData ? (
        <VisualizationViewer
          data={visualizationData}
          onBack={handleBackToHome}
        />
      ) : null}
    </div>
  );
}

export default App;
