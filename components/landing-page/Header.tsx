"use client";

import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { Feather, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { HeaderProps } from "./types";

export function Header({ onSignIn }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const { scrollY } = useScroll();

  // Transformações baseadas no scroll
  const headerHeight = useTransform(
    scrollY,
    [0, 100],
    isMobile ? [80, 64] : [88, 72]
  );

  const borderRadius = useTransform(
    scrollY,
    [0, 100],
    isMobile ? [0, 12] : [0, 16]
  );
  const backdropBlur = useTransform(scrollY, [0, 50, 100], [8, 15, 25]);
  const marginX = useTransform(
    scrollY,
    [0, 100],
    isMobile ? [8, 16] : [16, 32]
  );
  const paddingY = useTransform(
    scrollY,
    [0, 100],
    isMobile ? [16, 12] : [20, 16]
  );
  const scale = useTransform(scrollY, [0, 50, 100], [1, 1.02, 0.98]);
  const bubbleScale = useTransform(scrollY, [0, 50, 100], [1, 1.05, 0.98]);

  const logoRotate = useTransform(scrollY, [0, 50, 100], [0, 5, 0]);
  const logoScale = useTransform(scrollY, [0, 50, 100], [1, 1.1, 1]);
  const navItemsY = useTransform(scrollY, [0, 50, 100], [0, -3, 0]);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const unsubscribe = scrollY.on("change", (latest) => {
      setIsScrolled(latest > 50);
    });

    return () => unsubscribe();
  }, [scrollY]);

  // Scroll suave para âncoras
  const handleAnchorClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const targetId = href.substring(1);
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  // Voltar ao topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // Construir className dinamicamente
  let headerClasses =
    "fixed top-0 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-500 w-full max-w-7xl";

  if (isScrolled) {
    headerClasses +=
      " bg-background/80 backdrop-blur-xl border border-border/30 shadow-2xl";
  } else {
    headerClasses += " bg-transparent backdrop-blur-sm";
  }

  return (
    <motion.header
      className={headerClasses}
      style={{
        borderRadius: isScrolled ? borderRadius : 0,
        marginTop: isScrolled ? (isMobile ? 8 : 16) : 0,
        paddingLeft: isScrolled ? marginX : 16,
        paddingRight: isScrolled ? marginX : 16,
        background: isScrolled ? "rgba(255, 255, 255, 0.1)" : "transparent",
        backdropFilter: isScrolled
          ? `blur(${backdropBlur}px) saturate(180%)`
          : "blur(8px)",
        WebkitBackdropFilter: isScrolled
          ? `blur(${backdropBlur}px) saturate(180%)`
          : "blur(8px)",
        border: isScrolled ? "1px solid rgba(255, 255, 255, 0.2)" : "none",
      }}
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
    >
      <motion.div
        className="container mx-auto px-4 md:px-6"
        style={{
          paddingTop: paddingY,
          paddingBottom: paddingY,
          scale: scale,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.button
            className="flex items-center space-x-3 cursor-pointer bg-transparent border-none"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollToTop}
          >
            <motion.div
              className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center shadow-lg"
              style={{
                rotate: logoRotate,
                scale: logoScale,
              }}
              initial={{ rotate: -90, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 200,
                damping: 15,
              }}
            >
              <motion.div
                animate={{
                  rotate: isScrolled ? [0, 10, -10, 0] : 0,
                }}
                transition={{
                  duration: 0.6,
                  ease: "easeInOut",
                  repeat: isScrolled ? 1 : 0,
                }}
              >
                <Feather className="w-5 h-5 text-white" />
              </motion.div>
            </motion.div>
            <motion.span
              className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Escrivania
            </motion.span>
          </motion.button>

          {/* Desktop Navigation */}
          <motion.nav
            className="hidden md:flex items-center space-x-8"
            style={{ y: navItemsY }}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            {[
              { name: "Sobre", href: "#sobre" },
              { name: "Recursos", href: "#recursos" },
              { name: "Preços", href: "#precos" },
              { name: "Roadmap", href: "#roadmap" },
              { name: "Contato", href: "#contato" },
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium"
                whileHover={{
                  scale: 1.05,
                  color: "hsl(var(--primary))",
                  y: -2,
                }}
                whileTap={{ scale: 0.95 }}
                onClick={(e) => handleAnchorClick(e, item.href)}
                initial={{ opacity: 0, y: -20 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: isScrolled ? [1, 1.02, 1] : 1,
                }}
                transition={{
                  delay: 0.5 + index * 0.1,
                  duration: 0.3,
                  scale: {
                    duration: 0.4,
                    delay: isScrolled ? index * 0.05 : 0,
                    ease: "easeOut",
                  },
                }}
              >
                {item.name}
              </motion.a>
            ))}
          </motion.nav>

          {/* Desktop CTA */}
          <motion.div
            className="hidden md:flex items-center"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <motion.div
              style={{ scale: bubbleScale }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <Button
                onClick={onSignIn}
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 px-6 py-2.5"
              >
                Começar Agora
              </Button>
            </motion.div>
          </motion.div>

          {/* Mobile Menu Button */}
          <motion.button
            className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors duration-200"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, rotate: -90 }}
            animate={{ opacity: 1, rotate: 0 }}
            transition={{ delay: 0.7, duration: 0.3 }}
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </motion.button>
        </div>

        {/* Mobile Menu */}
        <motion.div
          className="md:hidden overflow-hidden"
          initial={false}
          animate={{
            height: isMenuOpen ? "auto" : 0,
            opacity: isMenuOpen ? 1 : 0,
          }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
        >
          <motion.div
            className="py-4 space-y-4 border-t border-border/20 mt-4 bg-background/95 backdrop-blur-xl rounded-lg mx-2 px-4"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(20px) saturate(180%)",
              WebkitBackdropFilter: "blur(20px) saturate(180%)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
            initial={false}
            animate={{
              y: isMenuOpen ? 0 : -20,
            }}
            transition={{ duration: 0.3, delay: isMenuOpen ? 0.1 : 0 }}
          >
            {[
              { name: "Sobre", href: "#sobre" },
              { name: "Recursos", href: "#recursos" },
              { name: "Preços", href: "#precos" },
              { name: "Roadmap", href: "#roadmap" },
              { name: "Contato", href: "#contato" },
            ].map((item, index) => (
              <motion.a
                key={item.name}
                href={item.href}
                className="block text-muted-foreground hover:text-foreground transition-colors duration-200 font-medium py-2"
                onClick={(e) => {
                  handleAnchorClick(e, item.href);
                  setIsMenuOpen(false);
                }}
                initial={{ opacity: 0, x: -20 }}
                animate={{
                  opacity: isMenuOpen ? 1 : 0,
                  x: isMenuOpen ? 0 : -20,
                }}
                transition={{
                  duration: 0.3,
                  delay: isMenuOpen ? 0.2 + index * 0.1 : 0,
                }}
              >
                {item.name}
              </motion.a>
            ))}

            <motion.div
              className="flex flex-col space-y-3 pt-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{
                opacity: isMenuOpen ? 1 : 0,
                y: isMenuOpen ? 0 : 20,
              }}
              transition={{
                duration: 0.3,
                delay: isMenuOpen ? 0.6 : 0,
              }}
            >
              <motion.div
                style={{ scale: bubbleScale }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              >
                <Button
                  onClick={() => {
                    onSignIn();
                    setIsMenuOpen(false);
                  }}
                  className="justify-center w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white font-medium shadow-lg hover:shadow-xl transition-all duration-200 py-3 text-base"
                >
                  Começar Agora
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>
    </motion.header>
  );
}
