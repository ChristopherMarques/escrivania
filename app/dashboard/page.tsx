"use client";

import { ProjectDashboard } from "@/components/dashboard/ProjectDashboard";
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
import { ProjectProvider } from "@/contexts/ProjectContext";
import { motion } from "framer-motion";
import { LogOut, Moon, Sparkles, User } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, signOut } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
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

  return (
    <ProjectProvider>
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Subtle Background Blobs for Dashboard */}
        <div className="absolute top-20 left-10 w-96 h-96 bg-gradient-to-br from-escrivania-purple-500/8 to-escrivania-blue-500/8 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-gradient-to-br from-escrivania-blue-500/6 to-escrivania-purple-500/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-escrivania-purple-500/4 to-escrivania-blue-500/4 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "4s" }}
        />

        {/* Header */}
        <header className="border-b border-border bg-card/80 backdrop-blur-xl relative z-10">
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
                      <AvatarImage src="" alt={user?.name || "Usuário"} />
                      <AvatarFallback className="gradient-bg text-white">
                        {getUserInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name || "Usuário"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "email@exemplo.com"}
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
        <main className="flex-1 relative z-10">
          <ProjectDashboard />
        </main>
      </div>
    </ProjectProvider>
  );
}
