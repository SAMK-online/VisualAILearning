import React from "react";
import { Compass } from "lucide-react";
import type { PortfolioData, Theme, Font } from "../types/portfolio";
import { THEME_OPTIONS } from "../types/portfolio";

interface PortfolioPreviewProps {
  data: PortfolioData | null;
  themeId: Theme;
  font: Font;
  isLoading: boolean;
}

const FONT_CLASS_MAP: Record<Font, string> = {
  inter: "font-inter",
  lora: "font-lora",
  "source-code-pro": "font-source-code-pro",
};

const FALLBACK_AVATAR =
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=400&q=60";

const getDynamicStyles = (theme: (typeof THEME_OPTIONS)[number]) =>
  ({
    "--portfolio-primary": theme.primary,
    "--portfolio-primary-dark": theme.primaryDarker ?? theme.primary,
    "--portfolio-bg": theme.backgroundLight ?? (theme.isDark ? "#0b1120" : "#f8fafc"),
    "--portfolio-card": theme.cardLight ?? (theme.isDark ? "#111827" : "#ffffff"),
    "--portfolio-muted": theme.isDark ? "rgba(226,232,240,0.7)" : "#475467",
    "--portfolio-text": theme.isDark ? "#e2e8f0" : "#0f172a",
  }) as React.CSSProperties;

const APPROACH_STEPS = [
  {
    label: "Step 01",
    title: "Discovery",
    copy: "Understand goals, constraints, and users. Establish success metrics before execution.",
  },
  {
    label: "Step 02",
    title: "Build & Iterate",
    copy: "Prototype fast, validate assumptions, and harden the solution alongside partners.",
  },
  {
    label: "Step 03",
    title: "Enablement",
    copy: "Document, train, and hand off so the next team can build confidently on the work.",
  },
];

const LoadingState = ({ message }: { message: string }) => (
  <div className="w-full h-[80vh] bg-white/40 backdrop-blur-sm rounded-3xl border border-white/30 shadow-xl flex flex-col items-center justify-center text-center gap-3 text-gray-600">
    <svg
      className="animate-spin h-12 w-12 text-[#81b29a]"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      />
    </svg>
    <h3 className="text-xl font-semibold text-gray-800">Crafting your page…</h3>
    <p className="text-sm text-gray-500">{message}</p>
  </div>
);

const EmptyState = () => (
  <div className="w-full h-[80vh] bg-white/40 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 shadow-inner flex flex-col items-center justify-center gap-3 text-center text-gray-500 px-6">
    <span className="text-3xl">📄</span>
    <p className="text-lg font-semibold text-gray-700">Your portfolio preview will appear here.</p>
    <p className="text-sm">Upload a resume to generate a polished one-page site automatically.</p>
  </div>
);

const SectionTitle = ({ title, eyebrow }: { title: string; eyebrow?: string }) => (
  <div className="flex flex-col gap-2">
    {eyebrow && (
      <span className="text-xs uppercase tracking-[0.3em] text-[var(--portfolio-muted)]">
        {eyebrow}
      </span>
    )}
    <h2 className="text-2xl font-semibold text-[var(--portfolio-text)]">{title}</h2>
  </div>
);

const ExperienceCard = ({
  role,
  company,
  startDate,
  endDate,
  description,
}: PortfolioData["experience"][number]) => (
  <div className="rounded-2xl border border-white/20 bg-[var(--portfolio-card)]/80 shadow-md px-6 py-5 flex flex-col gap-2">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
      <div>
        <p className="text-lg font-semibold text-[var(--portfolio-text)]">{role}</p>
        <p className="text-sm text-[var(--portfolio-muted)]">{company}</p>
      </div>
      <p className="text-xs font-semibold text-[var(--portfolio-muted)] uppercase tracking-wide">
        {startDate} — {endDate}
      </p>
    </div>
    <p className="text-sm leading-relaxed text-[var(--portfolio-muted)]">{description}</p>
  </div>
);

const ProjectCard = ({
  name,
  description,
  technologies,
  demoUrl,
  sourceUrl,
}: PortfolioData["projects"][number]) => (
  <div className="rounded-2xl border border-white/20 bg-[var(--portfolio-card)]/80 shadow-lg p-6 flex flex-col gap-4 transition-transform duration-200 hover:translate-y-[-4px] hover:shadow-2xl">
    <div>
      <h3 className="text-xl font-semibold text-[var(--portfolio-text)]">{name}</h3>
      <p className="text-sm text-[var(--portfolio-muted)] mt-2">{description}</p>
    </div>
    <div className="flex flex-wrap gap-2">
      {technologies.map((tech) => (
        <span
          key={`${name}-${tech}`}
          className="text-xs font-semibold px-3 py-1 rounded-full bg-[var(--portfolio-primary)]/10 text-[var(--portfolio-primary-dark)]"
        >
          {tech}
        </span>
      ))}
    </div>
    <div className="flex gap-4 text-sm font-semibold text-[var(--portfolio-primary-dark)]">
      {demoUrl && (
        <a href={demoUrl} className="flex items-center gap-1 hover:underline" target="_blank" rel="noreferrer">
          Live Demo →
        </a>
      )}
      {sourceUrl && (
        <a href={sourceUrl} className="flex items-center gap-1 hover:underline" target="_blank" rel="noreferrer">
          Source Code →
        </a>
      )}
    </div>
  </div>
);

const PortfolioPreview: React.FC<PortfolioPreviewProps> = ({
  data,
  themeId,
  font,
  isLoading,
}) => {
  const selectedTheme = THEME_OPTIONS.find((t) => t.id === themeId) || THEME_OPTIONS[0];
  const fontClass = FONT_CLASS_MAP[font];
  const dynamicStyles = getDynamicStyles(selectedTheme);

  if (isLoading) {
    return <LoadingState message="We’re distilling your experience into a tailored site." />;
  }

  if (!data) {
    return <EmptyState />;
  }

  const { name, title, summary, email, imageUrl, links, skills, experience, projects } = data;
  const heroImage = imageUrl || FALLBACK_AVATAR;

  const primaryLink = links.find((link) => Boolean(link.url));
  const socialLinks = links
    .filter((link) => link.url)
    .map((link) => (
      <a
        key={`${link.name}-${link.url}`}
        href={link.url}
        target="_blank"
        rel="noreferrer"
        className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center text-[var(--portfolio-text)] hover:text-[var(--portfolio-primary-dark)] transition-colors"
        aria-label={link.name}
      >
        {link.name}
      </a>
    ));

  return (
    <div
      className={`w-full min-h-[80vh] rounded-3xl overflow-hidden shadow-2xl border border-white/20 relative ${fontClass}`}
      style={dynamicStyles}
    >
      <div className="absolute inset-0 bg-[var(--portfolio-bg)]" />
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--portfolio-primary)]/15 via-transparent to-[var(--portfolio-primary-dark)]/10" />
      <div className="relative z-10 max-h-[80vh] overflow-y-auto p-6 sm:p-10 space-y-10">
        {/* Hero */}
        <section className="flex flex-col items-center text-center gap-5">
          <img
            src={heroImage}
            alt={name}
            className="w-28 h-28 rounded-full object-cover ring-4 ring-white/40 shadow-xl"
          />
          <div className="space-y-2">
            <p className="text-xs uppercase tracking-[0.4em] text-[var(--portfolio-muted)]">
              Portfolio Architect AI
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[var(--portfolio-text)]">{name}</h1>
            <p className="text-lg text-[var(--portfolio-muted)]">{title}</p>
          </div>
          <p className="max-w-3xl text-[var(--portfolio-muted)] text-base leading-relaxed">
            {summary ||
              "Tell your technical story with clarity. Use this space to highlight what you’ve built, shipped, or researched."}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href={`mailto:${email}`}
              className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 bg-[var(--portfolio-primary-dark)] text-white text-sm font-semibold shadow-lg hover:opacity-90 transition"
            >
              Contact Me
            </a>
            {primaryLink?.url && (
              <a
                href={primaryLink.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 border border-white/30 text-sm font-semibold text-[var(--portfolio-text)] hover:border-[var(--portfolio-primary)]"
              >
                Visit {primaryLink.name}
              </a>
            )}
          </div>
        {socialLinks.length > 0 && (
          <div className="flex flex-wrap justify-center gap-3 mt-2">{socialLinks}</div>
        )}
      </section>

        {/* Approach */}
        <section className="space-y-6">
          <SectionTitle title="How I Work" eyebrow="Approach" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {APPROACH_STEPS.map((step) => (
              <div
                key={step.label}
                className="rounded-2xl border border-dashed border-white/30 px-6 py-5 bg-[var(--portfolio-card)]/70 flex flex-col gap-3"
              >
                <span className="text-xs uppercase font-bold tracking-[0.4em] text-[var(--portfolio-muted)]">
                  {step.label}
                </span>
                <h3 className="text-xl font-semibold text-[var(--portfolio-text)] flex items-center gap-2">
                  <Compass className="w-5 h-5 text-[var(--portfolio-primary-dark)]" />
                  {step.title}
                </h3>
                <p className="text-sm text-[var(--portfolio-muted)]">{step.copy}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        {skills.length > 0 && (
          <section className="space-y-4">
            <SectionTitle title="Skills & Tools" eyebrow="Capabilities" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="rounded-xl border border-white/20 bg-[var(--portfolio-card)]/80 px-4 py-3 text-sm font-semibold text-[var(--portfolio-text)] shadow-sm"
                >
                  {skill}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="space-y-4">
            <SectionTitle title="Experience" eyebrow="Journey" />
            <div className="space-y-4">
              {experience.map((exp) => (
                <ExperienceCard key={`${exp.company}-${exp.role}-${exp.startDate}`} {...exp} />
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="space-y-4">
            <SectionTitle title="Featured Projects" eyebrow="Impact" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {projects.map((project) => (
                <ProjectCard key={`${project.name}-${project.description}`} {...project} />
              ))}
            </div>
          </section>
        )}

        {/* Footer */}
        <footer className="text-center border-t border-white/20 pt-6">
          <p className="text-sm text-[var(--portfolio-muted)]">
            Ready to collaborate?{" "}
            <a
              className="text-[var(--portfolio-primary-dark)] font-semibold hover:underline"
              href={`mailto:${email}`}
            >
              Let’s chat.
            </a>
          </p>
          <p className="text-xs text-[var(--portfolio-muted)] mt-2">
            © {new Date().getFullYear()} {name}. Designed with Portfolio Architect AI.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default PortfolioPreview;
