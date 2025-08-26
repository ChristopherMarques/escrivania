export interface LandingPageProps {
  onSignIn: () => void;
}

export interface HeaderProps {
  onSignIn: () => void;
  theme: string | undefined;
  setTheme: (theme: string) => void;
}

export interface HeroProps {
  onSignIn: () => void;
  heroInView?: boolean;
  heroSpring?: any;
  heroScale?: any;
  heroOpacity?: any;
  scrollY?: any;
}

export interface ValuePropositionProps {
  // Props específicas se necessário
}

export interface FeaturesProps {
  featuresInView: boolean;
  featuresSpring: any;
  featuresRotate: any;
}

export interface RoadmapProps {
  roadmapInView: boolean;
  roadmapSpring: any;
  roadmapScale: any;
}

export interface CTAProps {
  onSignIn: () => void;
  ctaInView: boolean;
  ctaSpring: any;
  ctaRotate: any;
}

export interface StatItem {
  value: string;
  label: string;
  icon: any;
  color: string;
}

export interface FeatureItem {
  icon: any;
  title: string;
  description: string;
}

export interface RoadmapItem {
  quarter: string;
  title: string;
  description: string;
  features: string[];
  status: 'completed' | 'in-progress' | 'planned';
}