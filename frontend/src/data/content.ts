export type IconKey = 'chat' | 'bolt' | 'shield' | 'code' | 'eye' | 'brain';

export interface NavLink {
  label: string;
  href: string;
}

export interface Feature {
  icon: IconKey;
  title: string;
  description: string;
}

export interface Mode {
  icon: IconKey;
  title: string;
  description: string;
  badge: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface FooterLinkGroup {
  heading: string;
  links: NavLink[];
}

export const navLinks: NavLink[] = [
  { label: 'Features', href: '#features' },
  { label: 'Modes', href: '#modes' },
  { label: 'FAQ', href: '#faq' },
];

export const features: Feature[] = [
  {
    icon: 'chat',
    title: 'Natural Conversation',
    description: 'Talk to ClawX like you would a colleague — it understands context, nuance, and intent without rigid commands.',
  },
  {
    icon: 'bolt',
    title: 'Lightning Fast',
    description: 'Powered by optimized inference, ClawX delivers responses in milliseconds so your workflow never stalls.',
  },
  {
    icon: 'shield',
    title: 'Privacy First',
    description: 'Your data stays yours. End-to-end encryption and zero-retention modes keep conversations private by default.',
  },
  {
    icon: 'code',
    title: 'Code Awareness',
    description: 'Drop in a repo or snippet and ClawX understands the structure, suggests fixes, and explains the logic.',
  },
  {
    icon: 'brain',
    title: 'Context Memory',
    description: 'ClawX remembers your preferences and ongoing projects, so you never have to re-explain yourself.',
  },
  {
    icon: 'eye',
    title: 'Vision Enabled',
    description: 'Share screenshots, diagrams, or photos and ClawX can analyze, describe, and act on visual content.',
  },
];

export const modes: Mode[] = [
  {
    icon: 'chat',
    title: 'Chat Mode',
    description: 'A fluid conversational interface for brainstorming, drafting, and quick answers. Perfect for everyday tasks.',
    badge: 'Default',
  },
  {
    icon: 'code',
    title: 'Code Mode',
    description: 'A focused workspace with syntax highlighting, inline diffs, and one-click apply suggestions for your codebase.',
    badge: 'For Developers',
  },
  {
    icon: 'eye',
    title: 'Vision Mode',
    description: 'Upload images and get instant analysis — extract text, identify objects, or generate captions and descriptions.',
    badge: 'Multimodal',
  },
];

export const faqs: FAQItem[] = [
  {
    question: 'What is ClawX?',
    answer: 'ClawX is an AI-powered co-pilot that helps you with writing, coding, research, and visual analysis — all through a single, intuitive interface. Think of it as a smart teammate available 24/7.',
  },
  {
    question: 'How much does ClawX cost?',
    answer: 'ClawX offers a free tier with generous daily limits, plus Pro and Team plans with unlimited usage, priority access, and advanced features. You can start free and upgrade anytime.',
  },
  {
    question: 'Is my data private and secure?',
    answer: 'Absolutely. All conversations are encrypted in transit and at rest. We offer a zero-retention mode for sensitive work, and we never sell or share your data with third parties.',
  },
  {
    question: 'Can ClawX work with my existing tools?',
    answer: 'Yes. ClawX integrates with popular IDEs, browsers, and productivity tools through extensions and an API. Code Mode works seamlessly with GitHub repositories and local projects.',
  },
  {
    question: 'What models power ClawX?',
    answer: 'ClawX uses a combination of state-of-the-art language and vision models, automatically selecting the best one for each task. You can also pin a specific model in Pro settings.',
  },
  {
    question: 'Do I need to install anything?',
    answer: 'No installation required. ClawX runs entirely in your browser. Optional browser extensions and IDE plugins are available for a tighter workflow integration.',
  },
];

export const footerLinkGroups: FooterLinkGroup[] = [
  {
    heading: 'Product',
    links: [
      { label: 'Features', href: '#features' },
      { label: 'Modes', href: '#modes' },
      { label: 'Pricing', href: '#' },
      { label: 'Changelog', href: '#' },
    ],
  },
  {
    heading: 'Resources',
    links: [
      { label: 'Documentation', href: '#' },
      { label: 'API Reference', href: '#' },
      { label: 'Guides', href: '#' },
      { label: 'Blog', href: '#' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About', href: '#' },
      { label: 'Careers', href: '#' },
      { label: 'Privacy', href: '#' },
      { label: 'Terms', href: '#' },
    ],
  },
];

export const siteContent = {
  navLinks,
  features,
  modes,
  faqs,
  footerLinkGroups,
} as const;
