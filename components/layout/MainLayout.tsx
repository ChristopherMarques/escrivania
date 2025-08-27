"use client";

import {
  CTA,
  Features,
  Header,
  Hero,
  Pricing,
  Roadmap,
  ValueProposition,
} from "@/components/landing-page";
import { useAuth } from "@/contexts/AuthContext";
import { useWindowSize } from "@/hooks/use-window-size";
import { motion, useInView, useSpring } from "framer-motion";
import { BookOpen, Feather, Heart, Shield } from "lucide-react";
import { useRef } from "react";

export function MainLayout() {
  const { signIn } = useAuth();
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;
  const isTablet = width ? width >= 768 && width < 1024 : false;

  // Refs para animações
  const featuresRef = useRef(null);
  const pricingRef = useRef(null);
  const roadmapRef = useRef(null);
  const ctaRef = useRef(null);

  // Configurações de animação responsivas
  const animationMargin = isMobile ? "-50px" : isTablet ? "-75px" : "-100px";
  const animationConfig = {
    stiffness: isMobile ? 60 : 100,
    damping: isMobile ? 40 : 30,
  };

  // Hooks de animação otimizados para mobile
  const pricingInView = useInView(pricingRef, {
    once: true,
    margin: animationMargin,
  });

  const pricingSpring = useSpring(pricingInView ? 1 : 0, animationConfig);

  // Landing Page
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Blobs - Reduzidos no mobile */}
      {!isMobile && (
        <>
          <div className="gradient-blob gradient-blob-1" />
          <div className="gradient-blob gradient-blob-2" />
          <div className="gradient-blob gradient-blob-3" />
        </>
      )}

      {/* Header */}
      <Header onSignIn={signIn} />

      {/* Hero Section - Otimizado para mobile */}
      <div className={`${isMobile ? "min-h-[85vh]" : "min-h-screen"}`}>
        <Hero onSignIn={signIn} />
      </div>

      {/* Value Proposition Section */}
      <section id="sobre">
        <ValueProposition />
      </section>

      {/* Real Features Section */}
      <section id="recursos" ref={featuresRef}>
        <Features />
      </section>

      {/* Pricing Section */}
      <section id="precos" ref={pricingRef}>
        <Pricing pricingSpring={pricingSpring} />
      </section>

      {/* Roadmap Section */}
      <section id="roadmap" ref={roadmapRef}>
        <Roadmap />
      </section>

      {/* CTA Section */}
      <section id="cta" ref={ctaRef}>
        <CTA onSignIn={signIn} />
      </section>

      {/* Footer - Responsivo otimizado */}
      <footer
        id="contato"
        className={`${isMobile ? "py-8" : "py-16"} border-t border-border bg-card/50`}
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div
              className={`grid grid-cols-1 ${isMobile ? "gap-8" : isTablet ? "sm:grid-cols-2 gap-10" : "md:grid-cols-4 gap-12"}`}
            >
              <div
                className={`${isMobile ? "col-span-1" : isTablet ? "sm:col-span-2" : "md:col-span-2"}`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 gradient-bg rounded-lg">
                    <Feather
                      className={`${isMobile ? "h-5 w-5" : "h-6 w-6"} text-white`}
                    />
                  </div>
                  <div>
                    <h3
                      className={`${isMobile ? "text-lg" : "text-xl"} font-bold gradient-text`}
                    >
                      Escrivania Digital
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      De brasileiros, para brasileiros
                    </p>
                  </div>
                </div>
                <p
                  className={`text-muted-foreground leading-relaxed mb-6 ${isMobile ? "text-sm" : ""}`}
                >
                  A plataforma de escrita criativa feita especialmente para
                  escritores brasileiros. Transforme suas ideias em histórias
                  inesquecíveis.
                </p>
                <div className="flex gap-4 justify-center sm:justify-start">
                  {[Heart, BookOpen, Shield].map((Icon, index) => (
                    <motion.div
                      key={index}
                      className={`p-2 bg-muted rounded-lg hover:bg-primary/20 transition-colors cursor-pointer ${isMobile ? "touch-manipulation" : ""}`}
                      whileHover={isMobile ? {} : { scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className={`${isMobile ? "text-center" : ""}`}>
                <h4
                  className={`font-semibold mb-4 text-foreground ${isMobile ? "text-base" : ""}`}
                >
                  Produto
                </h4>
                <ul className={`space-y-3 ${isMobile ? "space-y-2" : ""}`}>
                  {["Funcionalidades", "Roadmap", "Preços", "Suporte"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className={`text-muted-foreground hover:text-foreground transition-colors ${isMobile ? "text-sm touch-manipulation block py-1" : ""}`}
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div className={`${isMobile ? "text-center" : ""}`}>
                <h4
                  className={`font-semibold mb-4 text-foreground ${isMobile ? "text-base" : ""}`}
                >
                  Empresa
                </h4>
                <ul className={`space-y-3 ${isMobile ? "space-y-2" : ""}`}>
                  {["Sobre", "Blog", "Carreiras", "Contato"].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className={`text-muted-foreground hover:text-foreground transition-colors ${isMobile ? "text-sm touch-manipulation block py-1" : ""}`}
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div
              className={`border-t border-border ${isMobile ? "mt-8 pt-6" : "mt-12 pt-8"} text-center`}
            >
              <p
                className={`text-muted-foreground ${isMobile ? "text-sm" : ""}`}
              >
                © 2024 Escrivania Digital. Feito com{" "}
                <Heart className="inline h-4 w-4 text-red-500 mx-1" /> no
                Brasil.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default MainLayout;
