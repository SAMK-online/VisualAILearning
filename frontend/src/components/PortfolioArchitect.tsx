import React, { useState, useCallback } from 'react';
import { PortfolioData, Theme, Font, THEME_OPTIONS } from '../types/portfolio';
import { parseResume as parseResumeService } from '../services/api';
import { fileToBase64 } from '../lib/portfolioUtils';
import PortfolioPreview from './PortfolioPreview';

const PortfolioArchitect: React.FC = () => {
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
    // TODO: Implement HTML generation and download
    alert("Download feature coming soon! Your portfolio preview is displayed below.");
  };

  const themeForPreview: Theme = previewTheme || theme;
  const isPreviewDark = THEME_OPTIONS.find(t => t.id === themeForPreview)?.isDark ?? false;

  return (
    <div className={`min-h-screen bg-[#F0EBE3] text-[#3d405b] p-4 sm:p-6 lg:p-8 ${isPreviewDark ? 'dark' : ''}`}>
      <div className="max-w-7xl mx-auto">
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