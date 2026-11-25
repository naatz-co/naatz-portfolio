/** Page background tokens (mirrors --c-bg-* in global.css; also used for <meta name="theme-color">). */
export const pageBg = {
  home: 'rgb(242, 242, 242)',
  light: 'rgb(253, 253, 253)',
  dark: 'rgb(22, 22, 22)',
  white: 'rgb(255, 255, 255)',
  black: 'rgb(0, 0, 0)',
} as const;

// Every case study lives at the root: naatz.co/<slug>
// Old Framer URLs (/projects/<slug>) are 301-redirected in vercel.json.

export interface Project {
  slug: string;
  /** Card title on the home page */
  title: string;
  /** Card subtitle on the home page */
  summary: string;
  /** <title> tag (the " • Nathalia Garcia" suffix is added automatically) */
  seoTitle: string;
  /** Meta description, ~150 characters */
  seoDescription: string;
  /** Card / social image (file name inside public/images) */
  cover: string;
  coverAlt: string;
  /** Page background */
  bg: string;
  theme: 'light' | 'dark';
  year: string;
  role: string;
}

export const projects: Project[] = [
  {
    slug: 'ocalendar',
    title: 'ocalendar - Event discovery platform',
    summary: 'From 310 to 10,000+ users in 30 days',
    seoTitle: 'ocalendar – Event discovery platform case study',
    seoDescription:
      'How I designed and launched ocalendar, an event discovery platform for São Paulo, and grew it from 310 to 10,000+ users in 30 days.',
    cover: 'SildzOslWjiuO13oOeWwRFskBM.jpg',
    coverAlt: 'ocalendar app on an iPhone showing upcoming events in São Paulo',
    bg: pageBg.dark,
    theme: 'dark',
    year: '2024',
    role: 'Product Design, Brand Design, Business Strategy & SEO',
  },
  {
    slug: 'metabase-activation',
    title: 'Metabase - Onboarding experience',
    summary: '70% to 78% retention by improving the flow',
    seoTitle: 'Metabase Activation Flow – Onboarding case study',
    seoDescription:
      'Redesigning Metabase’s setup flow to simplify onboarding for non-technical users: 12-week retention went from 70% to 78%.',
    cover: '3sLqHDmGspqv6PivTjk42OWr6PE.png',
    coverAlt: 'Metabase “We’re setting up your Metabase” screen with a progress bar',
    bg: pageBg.light,
    theme: 'light',
    year: '2022',
    role: 'Product Designer (UI/UX, Animation)',
  },
  {
    slug: 'loft-james-platform',
    title: 'James - Real estate platform',
    summary: 'A platform where 2 days of work became 1.5 hours',
    seoTitle: 'James Platform – Real estate data case study',
    seoDescription:
      'As a Product Designer at Loft, I redesigned the data import process of James, a real estate data platform, so Operations could work autonomously.',
    cover: 'EScmyVYqkBI3MVOC1Kbxv7Crkbo.jpg',
    coverAlt: 'James platform “Edit location” screen with a map of buildings',
    bg: pageBg.dark,
    theme: 'dark',
    year: '2020',
    role: 'Product Designer',
  },
  {
    slug: 'inyou-app',
    title: 'InYou - Habit tracker app',
    summary: 'From DNA insights to daily habits',
    seoTitle: 'InYou – Habit tracker app case study',
    seoDescription:
      'Founding Designer at InYou, a habit tracker that combines DNA analysis with lifestyle habits to help people reach their health goals.',
    cover: 'G2joQblLhM9kaxit9uwfQMCk90.png',
    coverAlt: 'InYou habit tracker app on an iPhone',
    bg: pageBg.light,
    theme: 'light',
    year: '2020',
    role: 'Product Design, Branding',
  },
  {
    slug: 'loft-renovation-hub',
    title: 'Renovation Hub - Back-office cost control',
    summary: '91% adoption rate by centralizing renovation data',
    seoTitle: 'Loft Renovation Hub – Back-office case study',
    seoDescription:
      'I was the only Product Designer on Loft Renovation Hub, a back-office platform that centralized renovation budgets and costs in a single source.',
    cover: 'gjEPCHWLFUEst3PqSsXGK3bQiy4.png',
    coverAlt: 'Renovation Hub budget table interface',
    bg: pageBg.light,
    theme: 'light',
    year: '2020',
    role: 'Product Design',
  },
  {
    slug: 'olos-automation',
    title: 'Olos Automation – Motion design',
    summary: 'Motion design for an automation feature',
    seoTitle: 'Olos Automation – Motion design',
    seoDescription:
      'Motion design and illustration for Olos’ “Automação de Estratégia” explainer video, showing how the feature automates actions on the platform.',
    cover: 'upmcNRHRx1EQ4VtCQqUh92JZvA.png',
    coverAlt: 'Isometric illustration of a tablet for the Olos automation video',
    bg: pageBg.white,
    theme: 'light',
    year: '2017',
    role: 'Motion Design & Illustration',
  },
];

export const site = {
  name: 'Nathalia Garcia',
  url: 'https://www.naatz.co',
  title: 'Nathalia Garcia • Product Designer',
  description:
    'Nathalia Garcia is a Product Designer with 10+ years of experience in B2B and B2B2C, with skills in Visual Design, Motion Design, Growth, SEO, and Branding.',
  socialImage: 'VADMgL6TToEMrbOoqLbcalVBQ.png',
  linkedin: 'https://www.linkedin.com/in/naatz/',
  ga: 'G-C780SCJL4W',
};
