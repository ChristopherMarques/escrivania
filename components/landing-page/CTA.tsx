"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { ArrowRight, BookOpen, Heart, Users } from "lucide-react";
import { CTAProps, StatItem } from "./types";

const finalStats: StatItem[] = [
  {
    value: "100%",
    label: "Brasileiro",
    icon: Heart,
    color: "text-primary",
  },
  {
    value: "Ilimitados",
    label: "Projetos",
    icon: BookOpen,
    color: "text-primary",
  },
  {
    value: "24/7",
    label: "Suporte",
    icon: Users,
    color: "text-primary",
  },
];

export function CTA({ onSignIn, ctaInView, ctaSpring, ctaRotate }: CTAProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  
  const titleY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const subtitleY = useTransform(scrollYProgress, [0, 1], [50, -50]);
  const buttonY = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const statsY = useTransform(scrollYProgress, [0, 1], [20, -20]);
  const backgroundY = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const scaleProgress = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.85, 1, 1, 1.03]);

  
  return (
    <motion.section
      ref={containerRef}
      className="py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden"
      style={{
        y: ctaSpring,
        scale: scaleProgress,
      }}
    >
      {/* Parallax Background Elements */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10"
        style={{ y: backgroundY }}
      />
      <motion.div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], [50, -100]) }}
      />
      <motion.div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
        style={{ y: useTransform(scrollYProgress, [0, 1], [-50, 100]) }}
      />
      <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="text-center mb-16"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
            >
              <motion.h2 
                className="text-4xl lg:text-6xl font-bold mb-8 gradient-text"
                style={{ y: titleY, transformStyle: "preserve-3d" }}
              >
                Comece Sua Jornada Literária
              </motion.h2>
              <motion.p 
                className="text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto mb-12"
                style={{ y: subtitleY }}
              >
                Junte-se a centenas de escritores que já estão criando suas histórias na Escrivania Digital
              </motion.p>

            <motion.div
                className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                viewport={{ once: true }}
                style={{ y: buttonY }}
              >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={onSignIn}
                  size="lg"
                  className="gradient-bg hover:opacity-90 text-white px-12 py-6 rounded-lg font-semibold shadow-xl hover:shadow-2xl text-xl"
                >
                  Começar Agora
                  <ArrowRight className="ml-3 h-6 w-6" />
                </Button>
              </motion.div>

              <motion.p
                className="text-muted-foreground text-lg"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                viewport={{ once: true }}
              >
                Sem compromisso • Comece em segundos
              </motion.p>
            </motion.div>
          </motion.div>

          {/* Final Stats */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            viewport={{ once: true }}
            style={{ y: statsY }}
          >
            {finalStats.map((stat, index) => {
              const cardY = useTransform(scrollYProgress, [0, 1], [10 + index * 5, -(10 + index * 5)]);
              
              return (
                <motion.div
                  key={index}
                  className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-border min-h-[200px] flex flex-col justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={{ 
                    scale: 1.05, 
                    y: -10
                  }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" as const, stiffness: 300 }}
                  viewport={{ once: true }}
                  style={{ y: cardY }}
                >
                {/* Hover Overlay */}
                 <motion.div
                   className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg opacity-0"
                   whileHover={{ opacity: 1 }}
                   transition={{ duration: 0.3 }}
                 />
                 
                 <div className="relative z-10">
                   <stat.icon className={`h-12 w-12 mx-auto mb-4 ${stat.color}`} />
                   <div className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3 break-words">
                     {stat.value}
                   </div>
                   <div className="text-lg sm:text-xl text-muted-foreground font-medium">
                     {stat.label}
                   </div>
                 </div>
               </motion.div>
             );
             })}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
}