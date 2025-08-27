"use client";

import { useDeviceInfo } from "@/hooks/use-mobile";
import { motion } from "framer-motion";
import { Cloud, Download, FileText, Globe, Share, Zap } from "lucide-react";

const roadmapItems = [
  {
    quarter: "Set 2025",
    title: "Beta Fechada",
    description:
      "Lançamento da versão beta com funcionalidades principais para usuários selecionados",
    icon: Zap,
    status: "in-progress",
    statusText: "Em desenvolvimento",
    statusColor: "yellow",
  },
  {
    quarter: "Q4 2025",
    title: "Export PDF Profissional",
    description:
      "Exporte seus manuscritos em PDF com formatação profissional para editoras",
    icon: FileText,
    status: "planned",
    statusText: "Planejado",
    statusColor: "blue",
  },
  {
    quarter: "Q1 2026",
    title: "Export DOCX",
    description:
      "Compatibilidade total com Microsoft Word para colaboração e submissões",
    icon: Download,
    status: "planned",
    statusText: "Planejado",
    statusColor: "blue",
  },
  {
    quarter: "Q1 2026",
    title: "Integração Google Drive",
    description:
      "Sincronização automática com Google Docs e Drive para backup na nuvem",
    icon: Cloud,
    status: "planned",
    statusText: "Planejado",
    statusColor: "blue",
  },
  {
    quarter: "Q2 2026",
    title: "Colaboração em Tempo Real",
    description: "Trabalhe em equipe com outros escritores simultaneamente",
    icon: Share,
    status: "planned",
    statusText: "Planejado",
    statusColor: "blue",
  },
  {
    quarter: "Q3 2026",
    title: "Assistente de Escrita IA",
    description:
      "Sugestões inteligentes para melhorar seu texto e superar bloqueios criativos",
    icon: Zap,
    status: "planned",
    statusText: "Planejado",
    statusColor: "blue",
  },
  {
    quarter: "Q4 2026",
    title: "Marketplace de Histórias",
    description:
      "Plataforma para publicar e monetizar suas histórias diretamente",
    icon: Globe,
    status: "planned",
    statusText: "Planejado",
    statusColor: "blue",
  },
];

const getStatusBadge = (statusColor: string, statusText: string) => {
  const colorClasses = {
    green: "bg-green-100 text-green-800 border-green-200",
    blue: "bg-blue-100 text-blue-800 border-blue-200",
    yellow: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
        colorClasses[statusColor as keyof typeof colorClasses] ||
        colorClasses.blue
      }`}
    >
      {statusText}
    </span>
  );
};

export function Roadmap() {
  const { isMobile } = useDeviceInfo();

  // Removed parallax effects to prevent jittery animations during scroll

  return (
    <motion.section
      className="py-24 lg:py-32 bg-gradient-to-br from-background via-primary/5 to-background relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: isMobile ? 0.6 : 0.8 }}
    >
      {/* Static Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
      <div className="absolute top-1/3 left-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            className="text-center mb-20"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: isMobile ? 0.5 : 0.8 }}
            viewport={{ once: true }}
          >
            <motion.h2 className="text-4xl lg:text-6xl font-bold mb-8 gradient-text">
              Roadmap 2025/2026
            </motion.h2>
            <motion.p className="text-xl text-foreground/70 leading-relaxed max-w-3xl mx-auto">
              O futuro da escrita digital brasileira está sendo construído
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {roadmapItems.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  key={index}
                  className="relative group"
                  initial={{
                    opacity: 0,
                    y: isMobile ? 15 : 50,
                    scale: isMobile ? 0.98 : 0.9,
                  }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{
                    duration: isMobile ? 0.25 : 0.6,
                    delay: index * (isMobile ? 0.02 : 0.1),
                    type: "spring" as const,
                    stiffness: isMobile ? 100 : 100,
                  }}
                  viewport={{ once: true }}
                >
                  <motion.div
                    className="bg-white/80 dark:bg-card/80 backdrop-blur-sm rounded-2xl p-8 border border-border/50 shadow-lg hover:shadow-2xl transition-all duration-500 h-full"
                    whileHover={
                      isMobile
                        ? {}
                        : {
                            y: -10,
                          }
                    }
                  >
                    {/* Quarter Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="text-xs font-semibold text-primary/70 bg-primary/10 px-2 py-1 rounded-full">
                        {item.quarter}
                      </span>
                    </div>

                    {/* Icon */}
                    <motion.div
                      className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300"
                      whileHover={isMobile ? {} : { rotate: 360 }}
                      transition={{ duration: isMobile ? 0.2 : 0.6 }}
                    >
                      <Icon className="w-8 h-8 text-primary" />
                    </motion.div>

                    {/* Title */}
                    <h3 className="text-xl font-bold mb-4 text-foreground group-hover:text-primary transition-colors duration-300">
                      {item.title}
                    </h3>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 leading-relaxed text-sm">
                      {item.description}
                    </p>

                    {/* Status Badge */}
                    <div className="mt-auto">
                      {getStatusBadge(item.statusColor, item.statusText)}
                    </div>

                    {/* Hover Effect Overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      initial={{ opacity: 0 }}
                      whileHover={{ opacity: 1 }}
                    />
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
