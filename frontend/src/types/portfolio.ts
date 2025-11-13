export interface PortfolioData {
  name: string;
  title: string;
  summary: string;
  email: string;
  imageUrl?: string;
  links: {
    name: 'GitHub' | 'LinkedIn' | 'Twitter' | string;
    url: string;
  }[];
  skills: string[];
  experience: {
    role: string;
    company: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  projects: {
    name: string;
    description: string;
    technologies: string[];
    demoUrl?: string;
    sourceUrl?: string;
  }[];
}

export type Theme = 'pastel-blue' | 'pastel-mint' | 'pastel-lavender' | 'deep-ocean' | 'pastel-teal' | 'pastel-gold' | 'charcoal' | 'pastel-pink';

export type Font = 'inter' | 'lora' | 'source-code-pro';

export interface ThemeOption {
  id: Theme;
  name: string;
  primary: string;
  primaryDarker: string;
  isDark: boolean;
  backgroundLight?: string;
  cardLight?: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  { id: 'pastel-blue', name: 'Pastel Blue', primary: '#A5C9CA', primaryDarker: '#395B64', isDark: false, backgroundLight: '#F5F7FA', cardLight: '#FFFFFF' },
  { id: 'pastel-mint', name: 'Pastel Mint', primary: '#C8E6C9', primaryDarker: '#4CAF50', isDark: false, backgroundLight: '#F6FFF8', cardLight: '#FFFFFF' },
  { id: 'pastel-lavender', name: 'Pastel Lavender', primary: '#D1C4E9', primaryDarker: '#673AB7', isDark: false, backgroundLight: '#FCFAFF', cardLight: '#FFFFFF' },
  { id: 'deep-ocean', name: 'Deep Ocean', primary: '#80DEEA', primaryDarker: '#0097A7', isDark: true },
  { id: 'pastel-teal', name: 'Pastel Teal', primary: '#B2DFDB', primaryDarker: '#00796B', isDark: false, backgroundLight: '#F4FDFF', cardLight: '#FFFFFF' },
  { id: 'pastel-gold', name: 'Pastel Gold', primary: '#FFECB3', primaryDarker: '#FFA000', isDark: false, backgroundLight: '#FFFDF5', cardLight: '#FFFFFF' },
  { id: 'charcoal', name: 'Charcoal', primary: '#90A4AE', primaryDarker: '#546E7A', isDark: true },
  { id: 'pastel-pink', name: 'Pastel Pink', primary: '#F8BBD0', primaryDarker: '#C2185B', isDark: false, backgroundLight: '#FFF8FA', cardLight: '#FFFFFF' },
];

