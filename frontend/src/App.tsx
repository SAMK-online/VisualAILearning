import { useState } from "react";
import { NewLandingPage } from "./components/NewLandingPage";
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
        <NewLandingPage
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
