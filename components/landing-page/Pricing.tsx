"use client";

import { useDeviceInfo } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Check, Crown, Feather, Sparkles, Star, Zap } from "lucide-react";
import { useRef } from "react";

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  icon: any;
  popular?: boolean;
  buttonText: string;
  buttonVariant: "default" | "premium";
}

interface PricingProps {
  pricingSpring?: any;
}

const pricingPlans: PricingPlan[] = [
  {
    name: "Gratuito",
    price: "R$ 0",
    period: "/mês",
    description: "Perfeito para começar sua jornada de escrita",
    features: [
      "Editor de texto básico",
      "Até 3 projetos",
      "Salvamento local",
      "Exportação em PDF",
      "Suporte por email",
    ],
    icon: Feather,
    buttonText: "Começar Grátis",
    buttonVariant: "default",
  },
  {
    name: "Pro",
    price: "Em breve",
    period: "",
    description: "Para escritores profissionais e produtivos",
    features: [
      "Editor avançado com IA",
      "Projetos ilimitados",
      "Sincronização na nuvem",
      "Gestão de personagens",
      "Estatísticas detalhadas",
      "Colaboração em tempo real",
      "Exportação em múltiplos formatos",
      "Suporte prioritário",
      "Backup automático",
      "Ambiente imersivo",
    ],
    icon: Crown,
    popular: true,
    buttonText: "Em Desenvolvimento",
    buttonVariant: "premium",
  },
];

export function Pricing({ pricingSpring }: PricingProps) {
  const containerRef = useRef<HTMLDivElement>(null);
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

  const cardVariants = {
    hidden: {
      opacity: 0,
      y: isMobile ? 40 : 80,
      scale: isMobile ? 0.95 : 0.9,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        stiffness: isMobile ? 80 : 120,
        damping: isMobile ? 20 : 15,
      },
    },
  };

  return (
    <motion.section
      ref={containerRef}
      className="py-24 lg:py-32 relative overflow-hidden"
      style={{
        y: pricingSpring,
      }}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/10" />

      {/* Decorative Elements */}
      <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-secondary/10 rounded-full blur-xl" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            className="flex items-center justify-center gap-2 mb-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            <Sparkles className="h-8 w-8 text-primary" />
            <h2 className="text-4xl lg:text-5xl font-bold gradient-text">
              Planos e Preços
            </h2>
          </motion.div>
          <motion.p
            className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            viewport={{ once: true }}
          >
            Escolha o plano ideal para sua jornada de escrita. Comece grátis e
            evolua conforme suas necessidades crescem.
          </motion.p>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {pricingPlans.map((plan, index) => {
            const isPopular = plan.popular;

            return (
              <motion.div
                key={index}
                className={`relative group p-8 bg-card/90 backdrop-blur-sm rounded-2xl border transition-all duration-300 hover:shadow-2xl ${
                  isPopular
                    ? "border-primary/50 shadow-lg scale-105 lg:scale-110"
                    : "border-border hover:border-primary/30"
                }`}
                variants={cardVariants}
                whileHover={
                  isMobile
                    ? {}
                    : {
                        y: -10,
                        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                      }
                }
              >
                {/* Popular Badge */}
                {isPopular && (
                  <motion.div
                    className="absolute -top-4 left-1/2 transform -translate-x-1/2"
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                    viewport={{ once: true }}
                  >
                    <div className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full text-sm font-semibold flex items-center gap-2">
                      <Star className="h-4 w-4" />
                      Mais Popular
                    </div>
                  </motion.div>
                )}

                {/* Plan Header */}
                <motion.div
                  className="text-center mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className={`inline-flex p-4 rounded-2xl mb-4 ${
                      isPopular ? "gradient-bg" : "bg-primary/10"
                    }`}
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    transition={{
                      delay: 0.4 + index * 0.1,
                      type: "spring",
                      stiffness: 200,
                      damping: 15,
                    }}
                    viewport={{ once: true }}
                  >
                    <plan.icon
                      className={`h-8 w-8 ${
                        isPopular ? "text-white" : "text-primary"
                      }`}
                    />
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1 mb-2">
                    <span className="text-4xl font-bold gradient-text">
                      {plan.price}
                    </span>
                    {plan.period && (
                      <span className="text-muted-foreground">
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className="text-muted-foreground">{plan.description}</p>
                </motion.div>

                {/* Features List */}
                <motion.div
                  className="space-y-4 mb-8"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  {plan.features.map((feature, featureIndex) => (
                    <motion.div
                      key={featureIndex}
                      className="flex items-center gap-3"
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{
                        delay: 0.6 + index * 0.1 + featureIndex * 0.05,
                      }}
                      viewport={{ once: true }}
                    >
                      <div
                        className={`flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center ${
                          isPopular ? "bg-primary" : "bg-primary/20"
                        }`}
                      >
                        <Check
                          className={`h-3 w-3 ${
                            isPopular ? "text-white" : "text-primary"
                          }`}
                        />
                      </div>
                      <span className="text-foreground">{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* CTA Button */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <motion.button
                    className={`w-full py-4 px-6 rounded-xl font-semibold transition-all duration-300 flex items-center justify-center gap-2 ${
                      plan.buttonVariant === "premium"
                        ? "gradient-bg text-white hover:shadow-lg hover:scale-105"
                        : "bg-primary/10 text-primary hover:bg-primary hover:text-white border border-primary/20 hover:border-primary"
                    }`}
                    whileHover={{ scale: isMobile ? 1 : 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={plan.buttonText === "Em Desenvolvimento"}
                  >
                    {plan.buttonVariant === "premium" && (
                      <Zap className="h-5 w-5" />
                    )}
                    {plan.buttonText}
                  </motion.button>
                </motion.div>

                {/* Hover Effect Overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  initial={{ opacity: 0 }}
                  whileHover={{ opacity: 1 }}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Info */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Todos os planos incluem atualizações gratuitas e suporte técnico.
            Cancele a qualquer momento, sem taxas ou complicações.
          </p>
        </motion.div>
      </div>
    </motion.section>
  );
}
