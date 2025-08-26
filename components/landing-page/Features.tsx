"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import {
  BarChart3,
  Brain,
  Cloud,
  Download,
  FileText,
  Layers,
  Music,
  Save,
  Share2,
  Shield,
  Smartphone,
  Sparkles,
} from "lucide-react";
import { useRef } from "react";
import { FeatureItem, FeaturesProps } from "./types";

const features: FeatureItem[] = [
  {
    icon: FileText,
    title: "Editor Profissional",
    description:
      "Editor de texto rico com formatação avançada, estilos personalizados e ferramentas de escrita profissional.",
  },
  {
    icon: Layers,
    title: "Organização Hierárquica",
    description:
      "Organize seu projeto em capítulos, cenas e seções com uma estrutura visual intuitiva.",
  },
  {
    icon: Brain,
    title: "Gestão de Personagens",
    description:
      "Crie fichas detalhadas de personagens com relacionamentos, arcos narrativos e desenvolvimento.",
  },
  {
    icon: Save,
    title: "Salvamento Automático",
    description:
      "Nunca perca seu trabalho com salvamento automático em tempo real e histórico de versões.",
  },
  {
    icon: Cloud,
    title: "Sincronização na Nuvem",
    description:
      "Acesse seus projetos de qualquer dispositivo com sincronização automática e segura.",
  },
  {
    icon: BarChart3,
    title: "Estatísticas de Escrita",
    description:
      "Acompanhe seu progresso com métricas detalhadas de palavras, páginas e metas diárias.",
  },
  {
    icon: Music,
    title: "Ambiente Imersivo",
    description:
      "Sons ambientes e modo foco para criar o ambiente perfeito para sua escrita.",
  },
  {
    icon: Share2,
    title: "Colaboração",
    description:
      "Compartilhe projetos com beta readers e colaboradores com controle de permissões.",
  },
  {
    icon: Download,
    title: "Exportação Flexível",
    description:
      "Exporte seus trabalhos em múltiplos formatos: PDF, DOCX, EPUB e mais.",
  },
  {
    icon: Smartphone,
    title: "Multiplataforma",
    description:
      "Interface responsiva que funciona perfeitamente em desktop, tablet e mobile.",
  },
  {
    icon: Shield,
    title: "Segurança Total",
    description:
      "Seus textos protegidos com criptografia de ponta e backups automáticos.",
  },
  {
    icon: Sparkles,
    title: "Solicite Funcionalidades",
    description:
      "Precisa de algo específico? Nossa equipe desenvolve funcionalidades baseadas no seu feedback.",
  },
];

export function Features({
  featuresInView,
  featuresSpring,
  featuresRotate,
}: FeaturesProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const titleY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const cardY = useTransform(scrollYProgress, [0, 1], [0, -50]);
  const scaleProgress = useTransform(
    scrollYProgress,
    [0, 0.3, 0.7, 1],
    [0.8, 1, 1, 1.05]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 60,
      scale: 0.8,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100,
        damping: 12,
      },
    },
  };

  return (
    <motion.section
      ref={containerRef}
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        y: featuresSpring,
        scale: scaleProgress,
      }}
    >
      {/* Parallax Background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10"
        style={{ y: backgroundY }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.h2
            className="text-4xl lg:text-5xl font-bold mb-6 gradient-text"
            style={{ y: titleY }}
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Funcionalidades Poderosas
          </motion.h2>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            style={{ y: subtitleY }}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Descubra todas as ferramentas que tornarão sua jornada de escrita
            mais produtiva, organizada e inspiradora. Cada funcionalidade foi
            pensada para escritores como você.
          </motion.p>
        </div>

        <div className="relative">
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
          >
            {features.map((feature, index) => {
              return (
                <motion.div
                  key={index}
                  className="group p-8 bg-card/80 backdrop-blur-sm rounded-lg border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-xl"
                  variants={itemVariants}
                  whileHover={{
                    scale: 1.05,
                    y: -15,
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    y: cardY,
                  }}
                >
                  <motion.div
                    className="flex items-center gap-4 mb-6"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <motion.div
                      className="p-3 gradient-bg rounded-lg group-hover:scale-110 transition-transform duration-300"
                      initial={{ scale: 0, rotate: -180 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      transition={{
                        delay: 0.7 + index * 0.1,
                        type: "spring" as const,
                        stiffness: 200,
                      }}
                      viewport={{ once: true }}
                    >
                      <feature.icon className="h-6 w-6 text-white" />
                    </motion.div>
                    <motion.h3
                      className="text-xl font-semibold text-foreground group-hover:gradient-text transition-all duration-300"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.8 + index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      {feature.title}
                    </motion.h3>
                  </motion.div>
                  <motion.p
                    className="text-muted-foreground leading-relaxed group-hover:text-foreground/80 transition-colors duration-300"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    {feature.description}
                  </motion.p>

                  {/* Hover Effect Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                  />
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}
