import React, { useState, useCallback } from 'react';
import { ArrowLeft } from 'lucide-react';
import type { PortfolioData, Theme, Font } from '../types/portfolio';
import { THEME_OPTIONS } from '../types/portfolio';
import { parseResume as parseResumeService } from '../services/api';
import { fileToBase64 } from '../lib/portfolioUtils';
import PortfolioPreview from './PortfolioPreview';

interface PortfolioArchitectProps {
  onBack?: () => void;
}

const FONT_EMBED_MAP: Record<Font, { href: string; family: string }> = {
  inter: {
    href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap",
    family: "'Inter', sans-serif",
  },
  lora: {
    href: "https://fonts.googleapis.com/css2?family=Lora:wght@400;500;700&display=swap",
    family: "'Lora', serif",
  },
  "source-code-pro": {
    href: "https://fonts.googleapis.com/css2?family=Source+Code+Pro:wght@400;600&display=swap",
    family: "'Source Code Pro', monospace",
  },
};

const escapeHtml = (value?: string | null) =>
  (value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

const buildPortfolioHTML = (data: PortfolioData, themeId: Theme, font: Font) => {
  const theme = THEME_OPTIONS.find((t) => t.id === themeId) || THEME_OPTIONS[0];
  const fontEmbed = FONT_EMBED_MAP[font];
  const heroImage =
    data.imageUrl ||
    "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=60";

  const skills = data.skills
    .map(
      (skill) =>
        `<div class="skill-card">${escapeHtml(skill)}</div>`
    )
    .join("");

  const experience = data.experience
    .map(
      (exp) => `
      <div class="card">
        <div class="card-header">
          <div>
            <h3>${escapeHtml(exp.role)}</h3>
            <p class="muted">${escapeHtml(exp.company)}</p>
          </div>
          <span class="muted timeframe">${escapeHtml(exp.startDate)} – ${escapeHtml(exp.endDate)}</span>
        </div>
        <p class="muted">${escapeHtml(exp.description)}</p>
      </div>`
    )
    .join("");

  const projects = data.projects
    .map(
      (project) => `
      <div class="card">
        <h3>${escapeHtml(project.name)}</h3>
        <p class="muted">${escapeHtml(project.description)}</p>
        <div class="chip-row">
          ${project.technologies
            .map((tech) => `<span class="chip">${escapeHtml(tech)}</span>`)
            .join("")}
        </div>
        <div class="actions">
          ${project.demoUrl ? `<a href="${project.demoUrl}" target="_blank">Live Demo →</a>` : ""}
          ${project.sourceUrl ? `<a href="${project.sourceUrl}" target="_blank">Source Code →</a>` : ""}
        </div>
      </div>`
    )
    .join("");

  const links = data.links
    .filter((link) => link.url)
    .map(
      (link) =>
        `<a href="${link.url}" target="_blank">${escapeHtml(link.name)}</a>`
    )
    .join(" · ");

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${escapeHtml(data.name)} - Portfolio</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="${fontEmbed.href}" rel="stylesheet">
    <style>
      :root {
        --primary: ${theme.primary};
        --primary-dark: ${theme.primaryDarker ?? theme.primary};
        --bg: ${theme.backgroundLight ?? "#f8fafc"};
        --card: ${theme.cardLight ?? "#ffffff"};
        --text: ${theme.isDark ? "#f8fafc" : "#0f172a"};
        --muted: ${theme.isDark ? "rgba(226,232,240,0.7)" : "#475467"};
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: ${fontEmbed.family};
        background: var(--bg);
        color: var(--text);
        line-height: 1.6;
        padding: 32px;
      }
      .page {
        max-width: 960px;
        margin: 0 auto;
        background: var(--bg);
      }
      header {
        text-align: center;
        margin-bottom: 40px;
      }
      header img {
        width: 96px;
        height: 96px;
        border-radius: 999px;
        object-fit: cover;
        border: 4px solid rgba(255,255,255,0.6);
        box-shadow: 0 10px 30px rgba(0,0,0,0.15);
      }
      h1 { margin-bottom: 4px; font-size: 2.25rem; }
      .muted { color: var(--muted); font-size: 0.95rem; }
      section { margin-bottom: 32px; }
      .card {
        background: var(--card);
        border: 1px solid rgba(255,255,255,0.2);
        border-radius: 20px;
        padding: 20px;
        margin-bottom: 16px;
        box-shadow: 0 12px 30px rgba(15,23,42,0.08);
      }
      .card-header {
        display: flex;
        justify-content: space-between;
        gap: 12px;
        align-items: flex-start;
      }
      .chip-row {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-top: 12px;
      }
      .chip {
        padding: 4px 12px;
        border-radius: 999px;
        background: var(--primary);
        color: #0f172a;
        font-size: 0.8rem;
        font-weight: 600;
      }
      .skill-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
        gap: 12px;
      }
      .skill-card {
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.2);
        padding: 14px 16px;
        background: var(--card);
        font-weight: 600;
      }
      .actions {
        margin-top: 12px;
        display: flex;
        gap: 16px;
        font-weight: 600;
      }
      a { color: var(--primary-dark); text-decoration: none; }
      a:hover { text-decoration: underline; }
    </style>
  </head>
  <body>
    <div class="page">
      <header>
        <img src="${heroImage}" alt="${escapeHtml(data.name)}" />
        <h1>${escapeHtml(data.name)}</h1>
        <p class="muted">${escapeHtml(data.title)}</p>
        <p>${escapeHtml(data.summary)}</p>
        <p class="muted">${links}</p>
      </header>

      ${
        data.skills.length
          ? `<section>
              <h2>Skills & Tools</h2>
              <div class="skill-grid">${skills}</div>
            </section>`
          : ""
      }

      ${
        data.experience.length
          ? `<section>
              <h2>Experience</h2>
              ${experience}
            </section>`
          : ""
      }

      ${
        data.projects.length
          ? `<section>
              <h2>Projects</h2>
              ${projects}
            </section>`
          : ""
      }

      <footer class="muted" style="text-align:center; margin-top:40px;">
        <p>Ready to collaborate? <a href="mailto:${data.email}">${data.email}</a></p>
        <p>© ${new Date().getFullYear()} ${escapeHtml(data.name)}</p>
      </footer>
    </div>
  </body>
  </html>`;
};

const PortfolioArchitect: React.FC<PortfolioArchitectProps> = ({ onBack }) => {
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [portfolioData, setPortfolioData] = useState<PortfolioData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [theme, setTheme] = useState<Theme>(THEME_OPTIONS[0].id);
  const [previewTheme, setPreviewTheme] = useState<Theme | null>(null);
  const [font, setFont] = useState<Font>('inter');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setResumeFile(e.target.files[0]);
      setPortfolioData(null);
      setError(null);
    }
  };

  const handleParseResume = useCallback(async () => {
    if (!resumeFile) {
      setError('Please upload a resume file first.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const base64Data = await fileToBase64(resumeFile);
      const mimeType = resumeFile.type;
      const parsedData = await parseResumeService(base64Data, mimeType);
      setPortfolioData(parsedData);
      // FIX: Added curly braces to the catch block to fix a syntax error and resolve all cascading scope issues.
    } catch (err) {
      console.error(err);
      setError("Whoops! The AI had trouble reading that file. Could you try a different one? PDFs and DOCX files usually work best.");
    } finally {
      setIsLoading(false);
    }
  }, [resumeFile]);
  
  const handleDownload = () => {
    if (!portfolioData) {
      alert("Please generate a portfolio first.");
      return;
    }

    const htmlContent = buildPortfolioHTML(portfolioData, theme, font);
    const blob = new Blob([htmlContent], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeName = portfolioData.name ? portfolioData.name.replace(/\s+/g, "_").toLowerCase() : "portfolio";

    link.href = url;
    link.download = `${safeName}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const themeForPreview: Theme = previewTheme || theme;
  const isPreviewDark = THEME_OPTIONS.find(t => t.id === themeForPreview)?.isDark ?? false;

  return (
    <div className={`min-h-screen bg-[#F0EBE3] text-[#3d405b] p-4 sm:p-6 lg:p-8 ${isPreviewDark ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-[#3d405b] hover:text-[#81b29a] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>
        )}
        <header className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold text-[#81b29a] tracking-tight">Portfolio Architect AI</h1>
            <p className="mt-2 text-lg text-[#3d405b]/80">Your resume is the blueprint. Let's build your masterpiece.</p>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 bg-white/50 backdrop-blur-sm p-6 rounded-2xl shadow-lg border border-gray-200/50">
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-[#3d405b]">1. Start with Your Resume</h2>
                <p className="text-sm text-gray-500 mt-1">Just drop in your PDF or DOCX file.</p>
                <div className="mt-4">
                  <label htmlFor="resume-upload" className="block text-sm font-medium text-gray-700 mb-2">Resume File</label>
                  <input id="resume-upload" type="file" onChange={handleFileChange} accept=".pdf,.doc,.docx" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e07a5f]/20 file:text-[#e07a5f] hover:file:bg-[#e07a5f]/30 transition-colors cursor-pointer"/>
                </div>
              </div>

              <button
                onClick={handleParseResume}
                disabled={!resumeFile || isLoading}
                className="w-full bg-[#81b29a] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#6a9e82] transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center shadow-md"
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Brewing up your design...
                  </>
                ) : '✨ Create My Portfolio'}
              </button>
              
              {error && <p className="text-red-600 bg-red-100 p-3 rounded-md text-sm">{error}</p>}

              {portfolioData && (
                <div className="space-y-4 pt-4 border-t border-gray-200">
                   <h2 className="text-xl font-bold text-[#3d405b]">2. Make It Yours</h2>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Pick a Vibe</label>
                    <div className="flex flex-wrap gap-3" onMouseLeave={() => setPreviewTheme(null)}>
                      {THEME_OPTIONS.map((themeOption) => (
                        <button
                          key={themeOption.id}
                          type="button"
                          title={themeOption.name}
                          onClick={() => setTheme(themeOption.id)}
                          onMouseEnter={() => setPreviewTheme(themeOption.id)}
                          className={`w-8 h-8 rounded-full cursor-pointer transition-transform transform hover:scale-110 focus:outline-none ${theme === themeOption.id ? 'ring-2 ring-offset-2 ring-[#81b29a]' : ''}`}
                          style={{ backgroundColor: themeOption.primary }}
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <label htmlFor="font-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Choose Your Style</label>
                    <select id="font-select" value={font} onChange={(e) => setFont(e.target.value as Font)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-gray-50 border-gray-300 text-[#3d405b] focus:outline-none focus:ring-1 focus:ring-[#81b29a] focus:border-[#81b29a] sm:text-sm rounded-lg shadow-sm cursor-pointer dark:bg-[#162233] dark:text-[#E2E8F0] dark:border-[#2D3748]">
                      <option value="inter">Inter (Modern)</option>
                      <option value="lora">Lora (Elegant)</option>
                      <option value="source-code-pro">Source Code Pro (Techy)</option>
                    </select>
                  </div>
                   <h2 className="text-xl font-bold text-[#3d405b] pt-4">3. Go Live!</h2>
                   <button
                        onClick={handleDownload}
                        disabled={!portfolioData}
                        className="w-full bg-[#e07a5f] text-white font-bold py-3 px-4 rounded-lg hover:bg-[#d06a4f] transition-transform transform hover:scale-105 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:scale-100 shadow-md"
                    >
                    Launch My Site!
                    </button>
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-8">
            <PortfolioPreview data={portfolioData} themeId={themeForPreview} font={font} isLoading={isLoading} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default PortfolioArchitect;
