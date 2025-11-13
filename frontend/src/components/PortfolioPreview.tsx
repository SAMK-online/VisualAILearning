import React, { useState, useEffect } from 'react';
import { PortfolioData, Theme, Font, THEME_OPTIONS } from '../types/portfolio';

interface PortfolioPreviewProps {
  data: PortfolioData | null;
  themeId: Theme;
  font: Font;
  isLoading: boolean;
}

const getFontClass = (font: Font) => {
    switch(font) {
        case 'lora': return 'font-lora';
        case 'source-code-pro': return 'font-source-code-pro';
        case 'inter':
        default: return 'font-inter';
    }
}

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({ data, themeId, font, isLoading }) => {
  const selectedTheme = THEME_OPTIONS.find(t => t.id === themeId) || THEME_OPTIONS[0];
  const [isDarkMode, setIsDarkMode] = useState(selectedTheme.isDark);

  useEffect(() => {
    setIsDarkMode(selectedTheme.isDark);
  }, [selectedTheme.isDark]);

  const fontClass = getFontClass(font);
  const themeClass = isDarkMode ? 'dark' : '';
  
  if (isLoading) {
      return (
          <div className="w-full h-[80vh] bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 flex flex-col items-center justify-center p-6 text-center">
               <svg className="animate-spin h-12 w-12 text-[#A5C9CA] mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <h3 className="text-xl font-bold text-[#1A202C]">Crafting Your Masterpiece...</h3>
                <p className="text-gray-500 mt-2">The AI is working its magic to design your personal website. Hang tight!</p>
          </div>
      )
  }

  if (!data) {
    return (
      <div className="w-full h-[80vh] bg-white/50 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200/50 flex flex-col items-center justify-center p-6 text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        <h3 className="text-xl font-bold text-gray-400">Your Stage Awaits</h3>
        <p className="text-gray-500 mt-2">Let's create your portfolio! Upload your resume to see the magic happen.</p>
      </div>
    );
  }

  const { name, title, summary, email, imageUrl, links, skills, experience, projects } = data;
  
   const socialLinks = links.map((link, index) => {
        let icon;
        if (link.name.toLowerCase().includes('github')) {
            icon = (
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.418 2.865 8.168 6.839 9.49.5.092.682-.217.682-.482 0-.237-.009-.868-.014-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.031-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.03 1.595 1.03 2.688 0 3.848-2.338 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.001 10.001 0 0022 12c0-5.523-4.477-10-10-10z" />
            </svg>);
        } else if (link.name.toLowerCase().includes('linkedin')) {
            icon = (<svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"></path></svg>);
        } else {
             icon = <span className="material-symbols-outlined text-xl">link</span>;
        }

        return (
            <a key={index} className="text-text-light/80 dark:text-text-dark/80 hover:text-primary transition-colors" href={link.url} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                {icon}
            </a>
        );
    });

  const dynamicStyles = {
    '--color-primary': selectedTheme.primary,
    '--color-primary-darker': selectedTheme.primaryDarker,
    '--color-background-light': selectedTheme.backgroundLight || '#F0F4F8',
    '--color-card-light': selectedTheme.cardLight || '#FFFFFF',
    scrollBehavior: 'smooth',
  } as React.CSSProperties;

  return (
    <div 
      className={`w-full h-[80vh] bg-white rounded-2xl shadow-lg border border-gray-200/50 overflow-y-auto ${fontClass} ${themeClass}`}
      style={dynamicStyles}
    >
      <div className="bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark">
        <div className="relative flex min-h-screen w-full flex-col">
            <div className="flex h-full grow flex-col items-center">
                <div className="flex w-full max-w-6xl flex-col px-4 sm:px-6 lg:px-8">
                    <header className="sticky top-0 z-50 flex items-center justify-between whitespace-nowrap border-b border-border-light/50 dark:border-border-dark/50 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm py-4" id="home">
                        <div className="flex items-center gap-3">
                            <div className="size-6 bg-gradient-to-br from-primary to-primary-darker rounded-md flex items-center justify-center text-white">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.25 6.75 22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3-4.5 12" strokeLinecap="round" strokeLinejoin="round"></path>
                                </svg>
                            </div>
                            <h2 className="text-lg font-bold tracking-tight">{name}</h2>
                        </div>
                        <nav className="hidden md:flex items-center gap-8">
                            <a className="text-sm font-medium hover:text-primary transition-colors" href="#home">Home</a>
                            <a className="text-sm font-medium hover:text-primary transition-colors" href="#skills">Skills</a>
                            <a className="text-sm font-medium hover:text-primary transition-colors" href="#experience">Experience</a>
                            <a className="text-sm font-medium hover:text-primary transition-colors" href="#projects">Projects</a>
                        </nav>
                        <div className="flex items-center gap-3">
                           <button onClick={() => setIsDarkMode(!isDarkMode)} className="flex h-9 w-9 cursor-pointer items-center justify-center overflow-hidden rounded-full bg-card-light dark:bg-card-dark hover:bg-slate-100 dark:hover:bg-opacity-70 transition-colors">
                                <span className="material-symbols-outlined text-xl dark:hidden">dark_mode</span>
                                <span className="material-symbols-outlined text-xl hidden dark:inline">light_mode</span>
                            </button>
                            <a className="hidden sm:flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-9 px-4 bg-gradient-to-r from-primary to-primary-darker text-white text-sm font-bold hover:opacity-90 transition-opacity" href="#contact">
                                <span className="truncate">Contact Me</span>
                            </a>
                        </div>
                    </header>

                    <main className="flex flex-col gap-24 md:gap-32">
                        <section className="relative flex flex-col items-center gap-8 text-center py-24 md:py-32">
                            <div className="absolute inset-0 -z-10 bg-gradient-to-br from-primary/10 via-background-light to-background-light dark:from-primary/5 dark:via-background-dark dark:to-background-dark blur-3xl opacity-50"></div>
                            <div className="flex flex-col items-center gap-6">
                                <div className="relative w-24 h-24 sm:w-28 sm:h-28">
                                    <div className="absolute inset-0 rounded-full bg-cover bg-center shadow-lg" style={{backgroundImage: `url('${imageUrl || 'https://picsum.photos/seed/portfolio/400/400'}')`}}></div>
                                </div>
                                <div className="flex flex-col gap-3">
                                    <h1 className="text-4xl font-black tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl bg-gradient-to-b from-text-light to-text-light/70 dark:from-text-dark dark:to-text-dark/70 bg-clip-text text-transparent">{name}</h1>
                                    <h2 className="text-lg sm:text-xl text-text-light/80 dark:text-text-dark/80">{title}</h2>
                                    <p className="text-base sm:text-lg max-w-3xl mx-auto">{summary}</p>
                                </div>
                            </div>
                            <div className="flex flex-wrap justify-center gap-3">
                                <a className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-12 px-6 bg-gradient-to-r from-primary to-primary-darker text-white text-base font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity" href="#projects">
                                    <span className="truncate">Explore My Work</span>
                                </a>
                                <a className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-full h-12 px-6 bg-card-light dark:bg-card-dark text-text-light dark:text-text-dark text-base font-bold border border-border-light dark:border-border-dark hover:bg-slate-100 dark:hover:bg-opacity-70 transition-colors" href={`mailto:${email}`}>
                                    <span className="truncate">Get In Touch</span>
                                </a>
                            </div>
                        </section>
                        
                        <section className="flex flex-col gap-8" id="skills">
                            <h2 className="text-3xl font-bold tracking-tight text-center">My Tech Stack</h2>
                            <div className="relative w-full overflow-hidden [mask-image:_linear_gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)]">
                                <div className="flex w-max animate-scroll">
                                    <div className="flex items-center gap-6 px-3">
                                        {skills.map(skill => (
                                            <div key={skill} className="flex items-center justify-center h-16 w-32 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-3">
                                                <h3 className="font-semibold text-sm text-center text-text-light dark:text-text-dark">{skill}</h3>
                                            </div>
                                        ))}
                                    </div>
                                    <div aria-hidden="true" className="flex items-center gap-6 px-3">
                                        {skills.map(skill => (
                                            <div key={`${skill}-clone`} className="flex items-center justify-center h-16 w-32 rounded-2xl bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark p-3">
                                                <h3 className="font-semibold text-sm text-center text-text-light dark:text-text-dark">{skill}</h3>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="flex flex-col gap-8" id="experience">
                            <h2 className="text-3xl font-bold tracking-tight text-center">My Journey</h2>
                            <div className="relative flex flex-col gap-12 py-4">
                                <div className="absolute left-1/2 top-0 h-full w-[1px] bg-border-light dark:bg-border-dark -translate-x-1/2"></div>
                                {experience.map((exp, i) => {
                                    const isEven = i % 2 === 0;
                                    const content = (
                                        <div className="p-6 rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark shadow-md">
                                            <p className="text-sm font-semibold text-primary">{exp.startDate} - {exp.endDate}</p>
                                            <h3 className="text-lg font-bold mt-1">{exp.role} at {exp.company}</h3>
                                            <p className="mt-2 text-sm text-text-light/80 dark:text-text-dark/80">{exp.description}</p>
                                        </div>
                                    );
                                    const dot = <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 rounded-full bg-primary ring-4 ring-background-light dark:ring-background-dark"></div>;
                                    
                                    if (isEven) {
                                        return (
                                        <div key={i} className="relative flex items-center justify-start">
                                            <div className="relative w-full md:w-1/2 md:pr-12 text-left md:text-right">{content}</div>
                                            {dot}
                                        </div>);
                                    }
                                    return (
                                        <div key={i} className="relative flex items-center justify-end">
                                            <div className="relative w-full md:w-1/2 md:pl-12 text-left">{content}</div>
                                            {dot}
                                        </div>
                                    );
                                })}
                            </div>
                        </section>
                        
                        <section className="flex flex-col gap-8" id="projects">
                            <h2 className="text-3xl font-bold tracking-tight text-center">Featured Projects</h2>
                            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                {projects.map(project => (
                                    <div key={project.name} className="group h-full flex flex-col overflow-hidden rounded-2xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark transition-all duration-300 hover:shadow-2xl hover:shadow-primary/20 dark:hover:shadow-primary/10 hover:-translate-y-1 hover:scale-[1.02]">
                                         <div className="overflow-hidden">
                                             <div className="w-full h-52 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" style={{backgroundImage: `url('https://picsum.photos/seed/${project.name.replace(/\s/g, '')}/600/400')`}}></div>
                                        </div>
                                        <div className="flex flex-col flex-1 p-6">
                                            <h3 className="text-xl font-bold">{project.name}</h3>
                                            <p className="mt-2 text-sm text-text-light/80 dark:text-text-dark/80 flex-1 line-clamp-3">{project.description}</p>
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {project.technologies.map(tech => <span key={tech} className="text-xs font-semibold px-2.5 py-1 bg-primary/20 text-primary-darker dark:text-primary rounded-full">{tech}</span>)}
                                            </div>
                                            <div className="mt-6 flex items-center gap-4">
                                                {project.demoUrl && <a className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors" href={project.demoUrl} target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-xl">open_in_new</span>Live Demo</a>}
                                                {project.sourceUrl && <a className="flex items-center gap-2 text-sm font-bold hover:text-primary transition-colors" href={project.sourceUrl} target="_blank" rel="noopener noreferrer"><span className="material-symbols-outlined text-xl">code</span>Source Code</a>}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </main>
                    
                    <footer className="flex flex-col items-center gap-6 pt-12 pb-8 text-center mt-24 md:mt-32" id="contact">
                        <div className="flex flex-col gap-3">
                            <h3 className="text-2xl font-bold">Let's Connect</h3>
                            <p className="text-base text-text-light/80 dark:text-text-dark/80 max-w-md">I'm currently available for new opportunities and open to discussing projects. Feel free to reach out!</p>
                            <a className="font-semibold text-primary hover:underline text-lg" href={`mailto:${email}`}>{email}</a>
                        </div>
                        <div className="flex items-center gap-6 mt-4">{socialLinks}</div>
                        <p className="text-sm text-text-light/60 dark:text-text-dark/60 mt-4">© {new Date().getFullYear()} {name}. All Rights Reserved.</p>
                    </footer>
                </div>
            </div>
        </div>
      </div>
       <style>{`
          .material-symbols-outlined { font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
          .line-clamp-3 {
            overflow: hidden;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 3;
        }
      `}</style>
    </div>
  );
};

export default PortfolioPreview;