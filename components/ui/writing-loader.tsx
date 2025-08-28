"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookLoader,
  BookLoaderWithText,
  FullPageBookLoader,
  useBookLoader,
} from "./book-loader";

type LoaderSize = "sm" | "md" | "lg";

interface WritingLoaderProps {
  size?: LoaderSize;
  className?: string;
  text?: string;
}

interface FullPageWritingLoaderProps {
  text?: string;
  className?: string;
}

// Componente principal usando o novo BookLoader
export function WritingLoader({
  size = "md",
  className,
  text,
}: WritingLoaderProps) {
  if (text) {
    return <BookLoaderWithText text={text} size={size} className={className} />;
  }

  return <BookLoader size={size} className={className} />;
}

// Componente com texto
export function WritingLoaderWithText({
  text = "Carregando...",
  size = "md",
  className,
}: WritingLoaderProps) {
  return <BookLoaderWithText text={text} size={size} className={className} />;
}

// Componente de página completa
export function FullPageWritingLoader({
  text = "Preparando sua experiência de escrita...",
  className,
}: FullPageWritingLoaderProps) {
  return <FullPageBookLoader text={text} className={className} />;
}

// Componente de loader com animação pulsante
export function AnimatedWritingLoader({
  size = "md",
  className,
  text,
  interval = 2000,
}: WritingLoaderProps & { interval?: number }) {
  const [isVisible, setIsVisible] = React.useState(true);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setIsVisible((prev) => !prev);
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: isVisible ? 1 : 0.5, scale: isVisible ? 1 : 0.9 }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className={className}
    >
      <WritingLoader size={size} text={text} />
    </motion.div>
  );
}

// Hook para usar o loader em contextos específicos
export function useWritingLoader() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [loadingText, setLoadingText] = React.useState("Carregando...");

  const showLoader = (text?: string) => {
    if (text) setLoadingText(text);
    setIsLoading(true);
  };

  const hideLoader = () => {
    setIsLoading(false);
  };

  const LoaderComponent = () => {
    if (!isLoading) return null;

    return <FullPageWritingLoader text={loadingText} />;
  };

  return {
    isLoading,
    showLoader,
    hideLoader,
    LoaderComponent,
  };
}

// Exportações dos componentes individuais para uso direto
export { BookLoader, BookLoaderWithText, FullPageBookLoader, useBookLoader };

// Exportação de tipos
export type { LoaderSize, WritingLoaderProps };
