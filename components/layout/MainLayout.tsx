"use client";

import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard";
import {
  CTA,
  Features,
  Header,
  Hero,
  Roadmap,
  ValueProposition,
} from "@/components/landing-page";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useProject } from "@/contexts/ProjectContext";
import { motion, useInView, useSpring, useTransform } from "framer-motion";
import {
  BookOpen,
  Feather,
  Heart,
  LogOut,
  Moon,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import { useTheme } from "next-themes";
import React, { useRef } from "react";

interface MainLayoutProps {
  children?: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const { state } = useProject();
  const { user, signIn, signOut } = useAuth();
  const { theme, setTheme } = useTheme();

  // Refs para animações
  const featuresRef = useRef(null);
  const roadmapRef = useRef(null);
  const ctaRef = useRef(null);

  // Hooks de animação
  const featuresInView = useInView(featuresRef, {
    once: true,
    margin: "-100px",
  });
  const roadmapInView = useInView(roadmapRef, { once: true, margin: "-100px" });
  const ctaInView = useInView(ctaRef, { once: true, margin: "-100px" });

  const featuresSpring = useSpring(featuresInView ? 1 : 0, {
    stiffness: 100,
    damping: 30,
  });
  const roadmapSpring = useSpring(roadmapInView ? 1 : 0, {
    stiffness: 100,
    damping: 30,
  });
  const ctaSpring = useSpring(ctaInView ? 1 : 0, {
    stiffness: 100,
    damping: 30,
  });

  const roadmapScale = useTransform(roadmapSpring, [0, 1], [0.8, 1]);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  const getUserInitials = (name?: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Se o usuário estiver logado, mostrar o dashboard
  if (user) {
    return (
      <div className="min-h-screen bg-background">
        {/* Simple Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-xl">
          <div className="flex h-16 items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <motion.div
                className="p-2 gradient-bg rounded-lg"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-6 w-6 text-white" />
              </motion.div>
              <div>
                <h1 className="text-xl font-bold gradient-text">
                  Escrivania Digital
                </h1>
                <p className="text-sm text-muted-foreground">
                  Hub Criativo para Escritores
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 rounded-lg"
              >
                <Moon className="h-4 w-4" />
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="relative h-10 w-10 rounded-lg"
                  >
                    <Avatar className="h-10 w-10">
                      <AvatarImage src="" alt={user.name || "Usuário"} />
                      <AvatarFallback className="gradient-bg text-white">
                        {getUserInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.name || "Usuário"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email || "email@exemplo.com"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => console.log("Perfil")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Perfil</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sair</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Main Content - Dashboard */}
        <main className="flex-1">
          <ProjectDashboard />
        </main>
      </div>
    );
  }

  // Landing Page para usuários não logados
  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="gradient-blob gradient-blob-1" />
      <div className="gradient-blob gradient-blob-2" />
      <div className="gradient-blob gradient-blob-3" />

      {/* Header */}
      <Header onSignIn={signIn} theme={theme} setTheme={setTheme} />

      {/* Hero Section */}
      <Hero onSignIn={signIn} />

      {/* Value Proposition Section */}
      <ValueProposition />

      {/* Real Features Section */}
      <div ref={featuresRef}>
        <Features
          featuresInView={featuresInView}
          featuresSpring={featuresSpring}
          featuresRotate={0}
        />
      </div>

      {/* Roadmap Section */}
      <div ref={roadmapRef}>
        <Roadmap
          roadmapInView={roadmapInView}
          roadmapSpring={roadmapSpring}
          roadmapScale={roadmapScale}
        />
      </div>

      {/* CTA Section */}
      <div ref={ctaRef}>
        <CTA
          onSignIn={signIn}
          ctaInView={ctaInView}
          ctaSpring={ctaSpring}
          ctaRotate={0}
        />
      </div>

      {/* Footer */}
      <footer className="py-16 border-t border-border bg-card/50">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
              <div className="md:col-span-2">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 gradient-bg rounded-lg">
                    <Feather className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold gradient-text">
                      Escrivania Digital
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      De brasileiros, para brasileiros
                    </p>
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  A plataforma de escrita criativa feita especialmente para
                  escritores brasileiros. Transforme suas ideias em histórias
                  inesquecíveis.
                </p>
                <div className="flex gap-4">
                  {[Heart, BookOpen, Shield].map((Icon, index) => (
                    <motion.div
                      key={index}
                      className="p-2 bg-muted rounded-lg hover:bg-primary/20 transition-colors cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-foreground">Produto</h4>
                <ul className="space-y-3">
                  {["Funcionalidades", "Roadmap", "Preços", "Suporte"].map(
                    (item) => (
                      <li key={item}>
                        <a
                          href="#"
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {item}
                        </a>
                      </li>
                    )
                  )}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold mb-4 text-foreground">Empresa</h4>
                <ul className="space-y-3">
                  {["Sobre", "Blog", "Carreiras", "Contato"].map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-muted-foreground hover:text-foreground transition-colors"
                      >
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-border mt-12 pt-8 text-center">
              <p className="text-muted-foreground">
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
