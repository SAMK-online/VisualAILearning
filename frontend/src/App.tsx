import { useState } from "react";
import { NewLandingPage } from "./components/NewLandingPage";
import { VisualizationViewer } from "./components/VisualizationViewer";
import PortfolioArchitect from "./components/PortfolioArchitect";
import { generateVisualization } from "./services/api";
import type { VisualizationData } from "./types/visualization";

type AppState = "landing" | "viewing" | "portfolio-architect";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

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

      const demoUrl = data.metadata?.demo_url;
      const shouldRedirectToDemo =
        data.metadata?.demo_redirect && typeof demoUrl === "string" && demoUrl.length > 0;

      if (shouldRedirectToDemo) {
        const targetUrl = demoUrl.startsWith("http")
          ? demoUrl
          : `${API_BASE_URL}${demoUrl}`;
        window.location.href = targetUrl;
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

  const handleOpenPortfolioArchitect = () => {
    setState("portfolio-architect");
  };

  return (
    <div className="App">
      {state === "landing" ? (
        <NewLandingPage
          onGenerateVisualization={handleGenerateVisualization}
          onOpenPortfolioArchitect={handleOpenPortfolioArchitect}
          isLoading={isLoading}
          error={error}
        />
      ) : state === "portfolio-architect" ? (
        <PortfolioArchitect onBack={handleBackToHome} />
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
