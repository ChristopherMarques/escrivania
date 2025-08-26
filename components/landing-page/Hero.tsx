"use client";

import { Button } from "@/components/ui/button";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react";
import { useRef } from "react";
import { HeroProps, StatItem } from "./types";

const stats: StatItem[] = [
  {
    value: "100%",
    label: "Completo",
    icon: BookOpen,
    color: "text-primary",
  },
  {
    value: "50+",
    label: "Funcionalidades",
    icon: Sparkles,
    color: "text-yellow-500",
  },
  {
    value: "24/7",
    label: "Suporte Direto",
    icon: Heart,
    color: "text-primary",
  },
];

export function Hero({
  onSignIn,
  heroInView,
  heroSpring,
  heroScale,
  heroOpacity,
  scrollY,
}: HeroProps) {
  const heroRef = useRef<HTMLElement>(null);
  const { scrollY: internalScrollY, scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  // Use internal scrollY if not provided
  const activeScrollY = scrollY || internalScrollY;

  // Create transforms if not provided
  const activeHeroScale =
    heroScale || useTransform(activeScrollY, [0, 300], [1, 0.8]);
  const activeHeroOpacity =
    heroOpacity || useTransform(activeScrollY, [0, 300], [1, 0.5]);
  const activeHeroSpring =
    heroSpring || useTransform(activeScrollY, [0, 400], [0, -50]);
  const activeHeroInView = heroInView !== undefined ? heroInView : true;

  // Enhanced parallax effects
  const titleY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const buttonY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const statsY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [0, 15]);
  const rotateY = useTransform(scrollYProgress, [0, 1], [0, -5]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };
  return (
    <motion.section
      ref={heroRef}
      className="relative py-24 lg:py-40 overflow-hidden"
      style={{
        y: activeHeroSpring,
        scale: activeHeroScale,
        opacity: activeHeroOpacity,
      }}
    >
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-background via-card/50 to-background"
        style={{
          y: backgroundY,
        }}
      />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <AnimatePresence>
            {activeHeroInView && (
              <motion.div
                className="text-center mb-16"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.h1
                  className="text-6xl lg:text-8xl font-bold mb-8 gradient-text leading-tight"
                  variants={itemVariants}
                  style={{
                    y: titleY,
                  }}
                >
                  Sua História,
                  <br />
                  <motion.span
                    className="relative inline-block gradient-text"
                    initial={{ opacity: 0, x: -50, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.5, type: "spring" as const }}
                  >
                    Nossa Paixão
                    <motion.div
                      className="absolute -bottom-4 left-0 right-0 h-2 gradient-bg rounded-full"
                      initial={{ scaleX: 0, opacity: 0 }}
                      animate={{ scaleX: 1, opacity: 1 }}
                      transition={{ duration: 1.2, delay: 1.2, type: "spring" as const }}
                    />
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-2xl lg:text-3xl text-foreground/80 mb-12 leading-relaxed max-w-4xl mx-auto font-medium"
                  variants={itemVariants}
                  style={{ y: subtitleY }}
                >
                  <span className="font-bold gradient-text text-4xl block mb-4">
                    Crie seu livro completo do zero.
                  </span>
                  Capítulos, cenas, personagens, editor profissional de texto.
                  <br />
                  <span className="font-bold gradient-text text-3xl">
                    Uma plataforma que evolui com você.
                  </span>
                </motion.p>

                <motion.div
                  className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                  variants={itemVariants}
                  style={{ y: buttonY }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: -10 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ delay: 1.0, type: "spring" as const, stiffness: 200 }}
                    whileHover={{
                      scale: 1.05,
                      boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={onSignIn}
                      size="lg"
                      className="gradient-bg hover:opacity-90 text-white px-12 py-6 rounded-lg font-semibold shadow-xl hover:shadow-2xl text-xl"
                    >
                      <motion.span
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                      >
                        Começar a Escrever
                      </motion.span>
                      <motion.div
                        initial={{ x: -10, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ delay: 1.3 }}
                      >
                        <ArrowRight className="ml-3 h-6 w-6" />
                      </motion.div>
                    </Button>
                  </motion.div>

                  <motion.div
                    className="flex items-center gap-3 text-muted-foreground"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.4, type: "spring" as const }}
                  >
                    <motion.div
                      initial={{ rotate: -180, scale: 0 }}
                      animate={{ rotate: 0, scale: 1 }}
                      transition={{ delay: 1.5, type: "spring" as const }}
                    >
                      <Sparkles className="h-6 w-6 text-yellow-500" />
                    </motion.div>
                    <motion.span
                      className="text-lg font-medium"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1.6 }}
                    >
                      Plataforma completa para escritores
                    </motion.span>
                  </motion.div>
                </motion.div>

                {/* Enhanced Stats */}
                <motion.div
                  className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-4xl mx-auto"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                  style={{ y: statsY }}
                >
                  {stats.map((stat, index) => (
                    <motion.div
                      key={index}
                      className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-border"
                      variants={{
                        hidden: {
                          opacity: 0,
                          y: 50,
                          scale: 0.8,
                          rotateY: -15,
                        },
                        visible: {
                          opacity: 1,
                          y: 0,
                          scale: 1,
                          rotateY: 0,
                          transition: {
                            delay: 1.7 + index * 0.2,
                            type: "spring" as const,
                            stiffness: 100,
                          },
                        },
                      }}
                      whileHover={{
                        scale: 1.05,
                        y: -10,
                        rotateY: 5,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{
                          delay: 1.9 + index * 0.2,
                          type: "spring" as const,
                          stiffness: 200,
                        }}
                      >
                        <stat.icon
                          className={`h-12 w-12 mx-auto mb-4 ${stat.color}`}
                        />
                      </motion.div>
                      <motion.div
                        className="text-5xl font-bold gradient-text mb-3"
                        initial={{ opacity: 0, scale: 0.5 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{
                          delay: 2.0 + index * 0.2,
                          type: "spring" as const,
                        }}
                      >
                        {stat.value}
                      </motion.div>
                      <motion.div
                        className="text-xl text-muted-foreground font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 2.1 + index * 0.2 }}
                      >
                        {stat.label}
                      </motion.div>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.section>
  );
}
