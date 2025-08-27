"use client";

import { useDeviceInfo } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { BookOpen, Edit3, Heart, Sparkles, Users } from "lucide-react";
import { FeatureItem } from "./types";

const features: FeatureItem[] = [
  {
    icon: BookOpen,
    title: "Estrutura Completa",
    description:
      "Organize capítulos, cenas e personagens em uma estrutura hierárquica intuitiva",
  },
  {
    icon: Edit3,
    title: "Editor Profissional",
    description:
      "Editor de texto rico com todas as ferramentas que um escritor precisa",
  },
  {
    icon: Users,
    title: "Gestão de Personagens",
    description:
      "Crie fichas detalhadas e acompanhe o desenvolvimento de cada personagem",
  },
  {
    icon: Sparkles,
    title: "Funcionalidades Sob Demanda",
    description:
      "Precisa de algo específico? Nossa equipe desenvolve funcionalidades baseadas no seu feedback",
  },
];

const collaborativeFeatures = [
  "💡 Sugira novas funcionalidades",
  "🚀 Veja suas ideias implementadas",
  "🤝 Participe do desenvolvimento",
  "📈 Plataforma que evolui com você",
];

export function ValueProposition() {
  const { isMobile } = useDeviceInfo();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: isMobile ? 0.1 : 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? 20 : 50,
      scale: isMobile ? 0.95 : 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: isMobile ? 80 : 100,
        damping: isMobile ? 20 : 12,
      },
    },
  };

  return (
    <motion.section className="py-24 lg:py-32 bg-gradient-to-br from-primary/5 via-background to-primary/5 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.h2
              className="text-4xl lg:text-6xl font-bold mb-8 gradient-text"
              variants={{
                hidden: { opacity: 0, y: 50, scale: 0.8 },
                visible: {
                  opacity: 1,
                  y: 0,
                  scale: 1,
                  transition: {
                    type: "spring" as const,
                    stiffness: 100,
                    duration: 0.8,
                  },
                },
              }}
            >
              Tudo que você precisa para escrever seu livro
            </motion.h2>
            <motion.p
              className="text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: {
                    delay: 0.2,
                    duration: 0.6,
                  },
                },
              }}
            >
              Uma plataforma completa que cresce com suas necessidades
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div
              className="space-y-8"
              variants={{
                hidden: { opacity: 0, x: -50 },
                visible: {
                  opacity: 1,
                  x: 0,
                  transition: {
                    type: "spring" as const,
                    stiffness: 100,
                    staggerChildren: 0.1,
                    delayChildren: 0.2,
                  },
                },
              }}
            >
              <motion.div className="space-y-6" variants={containerVariants}>
                {features.map((item, index) => (
                  <motion.div
                    key={index}
                    className="flex items-start gap-4 p-6 bg-card/50 backdrop-blur-sm rounded-lg border border-border hover:bg-card/80 transition-all duration-300"
                    variants={{
                      hidden: {
                        opacity: 0,
                        y: isMobile ? 15 : 30,
                        x: isMobile ? 0 : -20,
                        scale: isMobile ? 0.95 : 0.9,
                      },
                      visible: {
                        opacity: 1,
                        y: 0,
                        x: 0,
                        scale: 1,
                        transition: {
                          type: "spring" as const,
                          stiffness: isMobile ? 60 : 100,
                          damping: isMobile ? 20 : 12,
                          delay: index * (isMobile ? 0.05 : 0.1),
                        },
                      },
                    }}
                    whileHover={
                      isMobile
                        ? {}
                        : {
                            x: 5,
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          }
                    }
                  >
                    <motion.div
                      className="p-3 gradient-bg rounded-lg flex-shrink-0"
                      initial={{ scale: 0, rotate: isMobile ? 0 : -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.4 + index * (isMobile ? 0.05 : 0.1),
                        type: "spring" as const,
                        stiffness: isMobile ? 100 : 200,
                        damping: isMobile ? 20 : 15,
                      }}
                      viewport={{ once: true }}
                    >
                      <item.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, x: isMobile ? 0 : -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.5 + index * (isMobile ? 0.03 : 0.1),
                      }}
                      viewport={{ once: true }}
                    >
                      <motion.h3
                        className="text-xl font-semibold mb-2 text-foreground"
                        initial={{ opacity: 0, y: isMobile ? 5 : 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.6 + index * (isMobile ? 0.03 : 0.1),
                        }}
                        viewport={{ once: true }}
                      >
                        {item.title}
                      </motion.h3>
                      <motion.p
                        className="text-muted-foreground leading-relaxed"
                        initial={{ opacity: 0, y: isMobile ? 5 : 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{
                          delay: 0.7 + index * (isMobile ? 0.03 : 0.1),
                        }}
                        viewport={{ once: true }}
                      >
                        {item.description}
                      </motion.p>
                    </motion.div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div
              className="relative"
              variants={{
                hidden: { opacity: 0, x: 50, scale: 0.9 },
                visible: {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    type: "spring" as const,
                    stiffness: 100,
                    delay: 0.4,
                    staggerChildren: 0.1,
                    delayChildren: 0.6,
                  },
                },
              }}
            >
              <motion.div
                className="relative p-8 bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl border border-primary/20"
                whileHover={{
                  boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ type: "spring" as const, stiffness: 300 }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  viewport={{ once: true }}
                />
                <motion.div
                  className="relative z-10"
                  variants={containerVariants}
                >
                  <motion.div
                    className="text-center mb-8"
                    variants={itemVariants}
                  >
                    <motion.div
                      className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-4"
                      initial={{ scale: 0, rotate: isMobile ? 0 : -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.7,
                        type: "spring" as const,
                        stiffness: isMobile ? 100 : 200,
                        damping: isMobile ? 20 : 15,
                      }}
                      viewport={{ once: true }}
                      whileHover={isMobile ? {} : {}}
                    >
                      <Heart className="h-5 w-5 text-primary" />
                      <span className="text-primary font-semibold">
                        Diferencial Único
                      </span>
                    </motion.div>
                    <motion.h3
                      className="text-3xl font-bold gradient-text mb-4"
                      initial={{
                        opacity: 0,
                        y: isMobile ? 10 : 20,
                        scale: isMobile ? 0.95 : 0.9,
                      }}
                      whileInView={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: 0.8,
                        type: "spring" as const,
                        stiffness: isMobile ? 60 : 100,
                        damping: isMobile ? 20 : 15,
                      }}
                      viewport={{ once: true }}
                    >
                      Desenvolvimento Colaborativo
                    </motion.h3>
                    <motion.p
                      className="text-lg text-foreground/80 leading-relaxed"
                      initial={{ opacity: 0, y: isMobile ? 10 : 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.9,
                        duration: isMobile ? 0.4 : 0.6,
                      }}
                      viewport={{ once: true }}
                    >
                      Somos a única plataforma onde você pode solicitar
                      funcionalidades diretamente para nossa equipe de
                      desenvolvimento.
                    </motion.p>
                  </motion.div>

                  <motion.div
                    className="space-y-4"
                    variants={{
                      hidden: { opacity: 0 },
                      visible: {
                        opacity: 1,
                        transition: {
                          staggerChildren: 0.1,
                          delayChildren: 1.0,
                        },
                      },
                    }}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    {collaborativeFeatures.map((feature, index) => (
                      <motion.div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-background/50 rounded-lg"
                        variants={{
                          hidden: {
                            opacity: 0,
                            x: isMobile ? -10 : -30,
                            scale: isMobile ? 0.95 : 0.8,
                          },
                          visible: {
                            opacity: 1,
                            x: 0,
                            scale: 1,
                            transition: {
                              type: "spring" as const,
                              stiffness: isMobile ? 60 : 100,
                              damping: isMobile ? 20 : 15,
                            },
                          },
                        }}
                        whileHover={
                          isMobile
                            ? {}
                            : {
                                x: 5,
                                backgroundColor: "rgba(255, 255, 255, 0.1)",
                              }
                        }
                      >
                        <motion.span
                          className="text-lg"
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          transition={{
                            delay: 1.1 + index * (isMobile ? 0.05 : 0.1),
                          }}
                          viewport={{ once: true }}
                        >
                          {feature}
                        </motion.span>
                      </motion.div>
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
