"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect } from "react"

interface SettingsState {
  theme: "light" | "dark" | "system"
  focusMode: boolean
  autoSave: boolean
  wordCountGoal: number
  dailyGoal: number
  fontSize: "small" | "medium" | "large"
  fontFamily: "sans" | "serif" | "mono"
}

type SettingsAction =
  | { type: "SET_THEME"; payload: "light" | "dark" | "system" }
  | { type: "TOGGLE_FOCUS_MODE" }
  | { type: "TOGGLE_AUTO_SAVE" }
  | { type: "SET_WORD_COUNT_GOAL"; payload: number }
  | { type: "SET_DAILY_GOAL"; payload: number }
  | { type: "SET_FONT_SIZE"; payload: "small" | "medium" | "large" }
  | { type: "SET_FONT_FAMILY"; payload: "sans" | "serif" | "mono" }
  | { type: "LOAD_SETTINGS"; payload: SettingsState }

const defaultSettings: SettingsState = {
  theme: "light",
  focusMode: false,
  autoSave: true,
  wordCountGoal: 50000,
  dailyGoal: 500,
  fontSize: "medium",
  fontFamily: "sans",
}

function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload }
    case "TOGGLE_FOCUS_MODE":
      return { ...state, focusMode: !state.focusMode }
    case "TOGGLE_AUTO_SAVE":
      return { ...state, autoSave: !state.autoSave }
    case "SET_WORD_COUNT_GOAL":
      return { ...state, wordCountGoal: action.payload }
    case "SET_DAILY_GOAL":
      return { ...state, dailyGoal: action.payload }
    case "SET_FONT_SIZE":
      return { ...state, fontSize: action.payload }
    case "SET_FONT_FAMILY":
      return { ...state, fontFamily: action.payload }
    case "LOAD_SETTINGS":
      return action.payload
    default:
      return state
  }
}

interface SettingsContextType {
  settings: SettingsState
  setTheme: (theme: "light" | "dark" | "system") => void
  toggleFocusMode: () => void
  toggleAutoSave: () => void
  setWordCountGoal: (goal: number) => void
  setDailyGoal: (goal: number) => void
  setFontSize: (size: "small" | "medium" | "large") => void
  setFontFamily: (family: "sans" | "serif" | "mono") => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, dispatch] = useReducer(settingsReducer, defaultSettings)

  // Load settings from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("escrivania-settings")
      if (stored) {
        const parsedSettings = JSON.parse(stored)
        dispatch({ type: "LOAD_SETTINGS", payload: { ...defaultSettings, ...parsedSettings } })
      }
    } catch (error) {
      console.error("Error loading settings:", error)
    }
  }, [])

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("escrivania-settings", JSON.stringify(settings))
  }, [settings])

  const setTheme = (theme: "light" | "dark" | "system") => {
    dispatch({ type: "SET_THEME", payload: theme })
  }

  const toggleFocusMode = () => {
    dispatch({ type: "TOGGLE_FOCUS_MODE" })
  }

  const toggleAutoSave = () => {
    dispatch({ type: "TOGGLE_AUTO_SAVE" })
  }

  const setWordCountGoal = (goal: number) => {
    dispatch({ type: "SET_WORD_COUNT_GOAL", payload: goal })
  }

  const setDailyGoal = (goal: number) => {
    dispatch({ type: "SET_DAILY_GOAL", payload: goal })
  }

  const setFontSize = (size: "small" | "medium" | "large") => {
    dispatch({ type: "SET_FONT_SIZE", payload: size })
  }

  const setFontFamily = (family: "sans" | "serif" | "mono") => {
    dispatch({ type: "SET_FONT_FAMILY", payload: family })
  }

  return (
    <SettingsContext.Provider
      value={{
        settings,
        setTheme,
        toggleFocusMode,
        toggleAutoSave,
        setWordCountGoal,
        setDailyGoal,
        setFontSize,
        setFontFamily,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
