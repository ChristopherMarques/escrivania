"use client";

import { Button } from "@/components/ui/button";
import { useDeviceInfo } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Heart, Sparkles } from "lucide-react";
import { StatItem } from "./types";

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

interface HeroProps {
  onSignIn: () => void;
}

export function Hero({ onSignIn }: HeroProps) {
  const { isMobile } = useDeviceInfo();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
        delayChildren: isMobile ? 0.1 : 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: isMobile ? 30 : 60, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: isMobile ? 60 : 100,
        damping: isMobile ? 20 : 12,
      },
    },
  };
  return (
    <motion.section
      className="relative py-16 sm:py-20 lg:py-40 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/50 to-background" />

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-12 sm:mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl lg:text-8xl font-bold mb-6 sm:mb-8 gradient-text leading-tight"
              variants={itemVariants}
            >
              Sua História,
              <br />
              <motion.span
                className="relative inline-block gradient-text"
                initial={{ opacity: 0, x: isMobile ? -20 : -50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                transition={{
                  duration: isMobile ? 0.6 : 0.8,
                  delay: 0.5,
                  type: "spring" as const,
                  stiffness: isMobile ? 100 : 150,
                }}
              >
                Nossa Paixão
                <motion.div
                  className="absolute -bottom-2 sm:-bottom-3 lg:-bottom-4 left-0 right-0 h-1 sm:h-1.5 lg:h-2 gradient-bg rounded-full"
                  initial={{ scaleX: 0, opacity: 0 }}
                  animate={{ scaleX: 1, opacity: 1 }}
                  transition={{
                    duration: isMobile ? 0.8 : 1.2,
                    delay: 1.0,
                    type: "spring" as const,
                  }}
                />
              </motion.span>
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl md:text-2xl lg:text-3xl text-foreground/80 mb-8 sm:mb-10 lg:mb-12 leading-relaxed max-w-4xl mx-auto font-medium px-2"
              variants={itemVariants}
            >
              <span className="font-bold gradient-text text-2xl sm:text-3xl md:text-4xl block mb-3 sm:mb-4">
                Crie seu livro completo do zero.
              </span>
              <span className="text-base sm:text-lg md:text-xl lg:text-2xl block mb-2">
                Capítulos, cenas, personagens, editor profissional de texto.
              </span>
              <span className="font-bold gradient-text text-xl sm:text-2xl md:text-3xl">
                Uma plataforma que evolui com você.
              </span>
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-10 sm:mb-12 lg:mb-16"
              variants={itemVariants}
            >
              <motion.div
                initial={{ scale: 0, rotate: isMobile ? 0 : -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  delay: 1.0,
                  type: "spring" as const,
                  stiffness: isMobile ? 150 : 200,
                }}
                whileHover={
                  isMobile
                    ? {}
                    : {
                        scale: 1.05,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      }
                }
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onSignIn}
                  size="lg"
                  className="gradient-bg hover:opacity-90 text-white px-8 sm:px-10 lg:px-12 py-4 sm:py-5 lg:py-6 rounded-lg font-semibold shadow-xl hover:shadow-2xl text-lg sm:text-xl"
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
                className="flex items-center gap-2 sm:gap-3 text-muted-foreground px-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4, type: "spring" as const }}
              >
                <motion.div
                  initial={{ rotate: isMobile ? 0 : -180, scale: 0 }}
                  animate={{ rotate: 0, scale: 1 }}
                  transition={{ delay: 1.5, type: "spring" as const }}
                >
                  <Sparkles className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500" />
                </motion.div>
                <motion.span
                  className="text-base sm:text-lg font-medium text-center"
                  initial={{ opacity: 0, x: isMobile ? -10 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6 }}
                >
                  Plataforma completa para escritores
                </motion.span>
              </motion.div>
            </motion.div>

            {/* Enhanced Stats */}
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8 lg:gap-12 max-w-4xl mx-auto px-2"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  className="text-center p-4 sm:p-6 lg:p-8 bg-card/80 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-border"
                  variants={{
                    hidden: {
                      opacity: 0,
                      y: isMobile ? 30 : 50,
                      scale: isMobile ? 0.9 : 0.8,
                    },
                    visible: {
                      opacity: 1,
                      y: 0,
                      scale: 1,
                      transition: {
                        delay: 1.7 + index * (isMobile ? 0.1 : 0.2),
                        type: "spring" as const,
                        stiffness: isMobile ? 80 : 100,
                      },
                    },
                  }}
                  whileHover={
                    isMobile
                      ? {}
                      : {
                          scale: 1.05,
                          y: -10,
                          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                        }
                  }
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.div
                    initial={{ scale: 0, rotate: isMobile ? 0 : -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 1.9 + index * (isMobile ? 0.1 : 0.2),
                      type: "spring" as const,
                      stiffness: isMobile ? 150 : 200,
                    }}
                  >
                    <stat.icon
                      className={`h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 mx-auto mb-3 sm:mb-4 ${stat.color}`}
                    />
                  </motion.div>
                  <motion.div
                    className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-2 sm:mb-3"
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{
                      delay: 2.0 + index * (isMobile ? 0.1 : 0.2),
                      type: "spring" as const,
                    }}
                  >
                    {stat.value}
                  </motion.div>
                  <motion.div
                    className="text-sm sm:text-base lg:text-xl text-muted-foreground font-medium"
                    initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 2.1 + index * (isMobile ? 0.1 : 0.2) }}
                  >
                    {stat.label}
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
