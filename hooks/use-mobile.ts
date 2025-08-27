"use client";

import * as React from "react";

export type DeviceType =
  | "mobile"
  | "tablet"
  | "notebook"
  | "macbook"
  | "desktop";

export interface DeviceInfo {
  type: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isNotebook: boolean;
  isMacbook: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  isPortrait: boolean;
  isLandscape: boolean;
  isRetina: boolean;
}

const BREAKPOINTS = {
  mobile: 767,
  tablet: 1023,
  notebook: 1366, // Ajustado para notebooks menores
  macbook: 1440, // MacBook Pro M1 13" (1440x900)
  desktop: 1680, // Desktops grandes
} as const;

function getDeviceType(width: number): DeviceType {
  if (width <= BREAKPOINTS.mobile) return "mobile";
  if (width <= BREAKPOINTS.tablet) return "tablet";
  if (width <= BREAKPOINTS.notebook) return "notebook";
  if (width <= BREAKPOINTS.macbook) return "macbook";
  return "desktop";
}

function getDeviceInfo(width: number, height: number): DeviceInfo {
  const type = getDeviceType(width);
  const isPortrait = height > width;
  const isLandscape = width > height;
  const isRetina = typeof window !== "undefined" && window.devicePixelRatio > 1;

  return {
    type,
    isMobile: type === "mobile",
    isTablet: type === "tablet",
    isNotebook: type === "notebook",
    isMacbook: type === "macbook",
    isDesktop: type === "desktop",
    width,
    height,
    isPortrait,
    isLandscape,
    isRetina,
  };
}

export function useDeviceInfo(): DeviceInfo {
  // Always start with SSR-safe default values
  const [deviceInfo, setDeviceInfo] = React.useState<DeviceInfo>(
    getDeviceInfo(1024, 768) // Default fallback for SSR
  );

  React.useEffect(() => {
    const updateDeviceInfo = () => {
      setDeviceInfo(getDeviceInfo(window.innerWidth, window.innerHeight));
    };

    // Initial update on client
    updateDeviceInfo();

    // Listen for resize events
    window.addEventListener("resize", updateDeviceInfo);
    window.addEventListener("orientationchange", updateDeviceInfo);

    return () => {
      window.removeEventListener("resize", updateDeviceInfo);
      window.removeEventListener("orientationchange", updateDeviceInfo);
    };
  }, []);

  return deviceInfo;
}

// Legacy hook for backward compatibility
export function useIsMobile(breakpoint = 768) {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.width < breakpoint;
}

// Specific device hooks
export function useIsMobileDevice() {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.isMobile;
}

export function useIsTablet() {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.isTablet;
}

export function useIsNotebook() {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.isNotebook;
}

export function useIsMacbook() {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.isMacbook;
}

export function useIsDesktop() {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.isDesktop;
}

// Orientation hooks
export function useIsPortrait() {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.isPortrait;
}

export function useIsLandscape() {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.isLandscape;
}

// Retina display hook
export function useIsRetina() {
  const deviceInfo = useDeviceInfo();
  return deviceInfo.isRetina;
}
