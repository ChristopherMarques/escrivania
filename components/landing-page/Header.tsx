"use client";

import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Menu, X, Feather } from "lucide-react";
import { useState } from "react";
import { HeaderProps } from "./types";

export function Header({ onSignIn }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <motion.header
      className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50 shadow-lg transition-all duration-300"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
    >
      <div className="container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg"
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 150,
              }}
              whileHover={{
                rotate: 15,
                boxShadow: "0 10px 25px rgba(0, 0, 0, 0.2)",
              }}
            >
              <Feather className="w-5 h-5 text-white" />
            </motion.div>
            <motion.span
              className="text-2xl font-bold gradient-text hidden sm:block"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              Escrivania Digital
            </motion.span>
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex items-center space-x-8"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, staggerChildren: 0.05 }}
          >
            {[
              { name: "Recursos", href: "#recursos" },
              { name: "Preços", href: "#precos" },
              { name: "Sobre", href: "#sobre" },
              { name: "Contato", href: "#contato" },
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium relative group"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 + index * 0.05 }}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                }}
              >
                {item.name}
                <motion.div
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-primary to-secondary scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                  layoutId="underline"
                />
              </motion.a>
            ))}
          </motion.nav>

          {/* Desktop CTA */}
          <motion.div
            className="hidden md:flex items-center space-x-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={onSignIn}
                className="gradient-bg hover:opacity-90 text-white px-6 py-2 rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Começar Agora
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <motion.div
              animate={{ rotate: isMenuOpen ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.div>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="md:hidden overflow-hidden"
        initial={false}
        animate={{
          height: isMenuOpen ? "auto" : 0,
          opacity: isMenuOpen ? 1 : 0,
        }}
        transition={{ duration: 0.2, ease: "easeInOut" }}
      >
        <motion.div
          className="px-6 py-4 bg-background/95 backdrop-blur-md border-t border-border/50"
          variants={{
            closed: { opacity: 0, y: -20 },
            open: {
              opacity: 1,
              y: 0,
              transition: {
                staggerChildren: 0.05,
                delayChildren: 0.05,
              },
            },
          }}
          initial="closed"
          animate={isMenuOpen ? "open" : "closed"}
        >
          <motion.nav className="flex flex-col space-y-4">
            {[
              { name: "Recursos", href: "#recursos" },
              { name: "Preços", href: "#precos" },
              { name: "Sobre", href: "#sobre" },
              { name: "Contato", href: "#contato" },
            ].map((item) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-foreground/80 hover:text-foreground transition-colors duration-200 font-medium py-2 border-b border-border/30 last:border-b-0"
                variants={{
                  closed: { opacity: 0, x: -20 },
                  open: { opacity: 1, x: 0 },
                }}
                onClick={(e) => {
                  e.preventDefault();
                  const element = document.querySelector(item.href);
                  if (element) {
                    element.scrollIntoView({
                      behavior: "smooth",
                      block: "start",
                    });
                  }
                  setIsMenuOpen(false);
                }}
                whileHover={{ x: 5 }}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.nav>
          <motion.div
            className="mt-6 pt-4 border-t border-border/30"
            variants={{
              closed: { opacity: 0, y: 20 },
              open: { opacity: 1, y: 0 },
            }}
          >
            <Button
              onClick={() => {
                onSignIn();
                setIsMenuOpen(false);
              }}
              className="w-full gradient-bg hover:opacity-90 text-white py-3 rounded-lg font-semibold shadow-lg"
            >
              Começar Agora
            </Button>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
