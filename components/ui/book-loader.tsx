"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface BookLoaderProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  showText?: boolean;
  text?: string;
}

const sizeConfig = {
  sm: {
    container: "w-8 h-8",
    svg: "w-6 h-6",
    text: "text-sm",
    strokeWidth: 2,
  },
  md: {
    container: "w-12 h-12",
    svg: "w-8 h-8",
    text: "text-base",
    strokeWidth: 2,
  },
  lg: {
    container: "w-16 h-16",
    svg: "w-12 h-12",
    text: "text-lg",
    strokeWidth: 1.5,
  },
  xl: {
    container: "w-24 h-24",
    svg: "w-16 h-16",
    text: "text-xl",
    strokeWidth: 1.5,
  },
};

const BookLoader: React.FC<BookLoaderProps> = ({
  size = "md",
  className,
  showText = false,
  text = "Carregando...",
}) => {
  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className
      )}
    >
      {/* Container do loader */}
      <div
        className={cn(
          "relative flex items-center justify-center",
          config.container
        )}
      >
        {/* SVG do livro com animações */}
        <motion.svg
          className={cn(config.svg, "text-[var(--primary)]")}
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={config.strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          animate={{
            rotateY: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {/* Linha central do livro */}
          <motion.path
            d="M12 7v14"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />

          {/* Páginas do livro */}
          <motion.path
            d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.3,
            }}
          />
        </motion.svg>

        {/* Círculo de progresso */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-transparent"
          style={{
            borderTopColor: "var(--primary)",
            borderRightColor: "var(--primary)",
          }}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 1,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Partículas flutuantes */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              backgroundColor: "var(--primary)",
              top: "50%",
              left: "50%",
            }}
            animate={{
              x: [0, Math.cos((i * 120 * Math.PI) / 180) * 16],
              y: [0, Math.sin((i * 120 * Math.PI) / 180) * 16],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.4,
            }}
          />
        ))}
      </div>

      {/* Texto opcional */}
      {showText && (
        <motion.p
          className={cn(config.text, "font-medium")}
          style={{ color: "var(--primary)" }}
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Componente com texto
const BookLoaderWithText: React.FC<Omit<BookLoaderProps, "showText">> = (
  props
) => {
  return <BookLoader {...props} showText={true} />;
};

// Componente para tela cheia
const FullPageBookLoader: React.FC<BookLoaderProps> = ({
  size = "xl",
  text = "Carregando sua biblioteca...",
  ...props
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
      <BookLoader size={size} showText={true} text={text} {...props} />
    </div>
  );
};

// Hook para controle programático
const useBookLoader = () => {
  const [isLoading, setIsLoading] = React.useState(false);

  const startLoading = React.useCallback(() => {
    setIsLoading(true);
  }, []);

  const stopLoading = React.useCallback(() => {
    setIsLoading(false);
  }, []);

  const withLoading = React.useCallback(
    async <T,>(asyncFn: () => Promise<T>): Promise<T> => {
      setIsLoading(true);
      try {
        const result = await asyncFn();
        return result;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return {
    isLoading,
    startLoading,
    stopLoading,
    withLoading,
    LoaderComponent: BookLoader,
  };
};

export { BookLoader, BookLoaderWithText, FullPageBookLoader, useBookLoader };

export default BookLoader;
