export interface LandingPageProps {
  onSignIn: () => void;
}

export interface HeaderProps {
  onSignIn: () => void;
}

export interface HeroProps {
  onSignIn: () => void;
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
  status: "completed" | "in-progress" | "planned";
}

export interface FeaturesProps {
  featuresInView?: boolean;
  featuresSpring?: any;
  featuresRotate?: number;
}

export interface PricingProps {
  pricingSpring?: any;
}

export interface RoadmapProps {
  roadmapInView?: boolean;
  roadmapSpring?: any;
  roadmapScale?: any;
}

export interface CTAProps {
  onSignIn: () => void;
  ctaInView?: boolean;
  ctaSpring?: any;
  ctaRotate?: number;
}
