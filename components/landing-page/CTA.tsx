"use client";

import { Button } from "@/components/ui/button";
import { useDeviceInfo } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Heart, Users } from "lucide-react";
import { StatItem } from "./types";

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

export function CTA({ onSignIn }: { onSignIn: () => void }) {
  const { isMobile } = useDeviceInfo();

  return (
    <motion.section
      className="py-24 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-primary/5 relative overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.8 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-primary/10" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 className="text-4xl lg:text-6xl font-bold mb-8 gradient-text">
              Comece Sua Jornada Literária
            </motion.h2>
            <motion.p className="text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto mb-12">
              Junte-se a centenas de escritores que já estão criando suas
              histórias na Escrivania Digital
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <motion.div
                whileHover={!isMobile ? { scale: 1.05 } : {}}
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
          >
            {finalStats.map((stat, index) => {
              return (
                <motion.div
                  key={index}
                  className="text-center p-8 bg-card/80 backdrop-blur-sm rounded-lg shadow-xl hover:shadow-2xl transition-all duration-300 border border-border min-h-[200px] flex flex-col justify-center"
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  whileHover={
                    !isMobile
                      ? {
                          y: -10,
                        }
                      : {}
                  }
                  transition={{
                    delay: 0.5 + index * (isMobile ? 0.05 : 0.1),
                    type: "spring" as const,
                    stiffness: isMobile ? 200 : 300,
                    duration: isMobile ? 0.4 : 0.6,
                  }}
                  viewport={{ once: true }}
                >
                  {/* Hover Overlay */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-primary/10 to-primary/5 rounded-lg opacity-0"
                    whileHover={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                  />

                  <div className="relative z-10">
                    <stat.icon
                      className={`h-12 w-12 mx-auto mb-4 ${stat.color}`}
                    />
                    <div className="text-3xl sm:text-4xl lg:text-5xl font-bold gradient-text mb-3  w-full">
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
