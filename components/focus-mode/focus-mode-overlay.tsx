"use client";

import { TiptapEditor } from "@/components/editor/tiptap-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Settings, Timer, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useState } from "react";

interface FocusModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  onChange: (content: any) => void;
  characters: any[];
  locations: any[];
}

const FOCUS_ENVIRONMENTS = [
  {
    id: "minimal",
    name: "Minimalista",
    bg: "bg-gray-50",
    accent: "bg-gray-200",
  },
  {
    id: "forest",
    name: "Floresta",
    bg: "bg-gradient-to-br from-green-100 to-emerald-50",
    accent: "bg-green-200",
  },
  {
    id: "ocean",
    name: "Oceano",
    bg: "bg-gradient-to-br from-blue-100 to-cyan-50",
    accent: "bg-blue-200",
  },
  {
    id: "sunset",
    name: "Pôr do Sol",
    bg: "bg-gradient-to-br from-orange-100 to-pink-50",
    accent: "bg-orange-200",
  },
  {
    id: "night",
    name: "Noite",
    bg: "bg-gradient-to-br from-slate-800 to-slate-900",
    accent: "bg-slate-600",
  },
  {
    id: "coffee",
    name: "Café",
    bg: "bg-gradient-to-br from-amber-100 to-yellow-50",
    accent: "bg-amber-200",
  },
];

const AMBIENT_SOUNDS = [
  { id: "none", name: "Silêncio", icon: VolumeX },
  { id: "rain", name: "Chuva", icon: Volume2 },
  { id: "forest", name: "Floresta", icon: Volume2 },
  { id: "ocean", name: "Oceano", icon: Volume2 },
  { id: "cafe", name: "Café", icon: Volume2 },
  { id: "fireplace", name: "Lareira", icon: Volume2 },
];

export function FocusModeOverlay({
  isOpen,
  onClose,
  content,
  onChange,
  characters,
  locations,
}: FocusModeOverlayProps) {
  const [environment, setEnvironment] = useState("minimal");
  const [ambientSound, setAmbientSound] = useState("none");
  const [soundVolume, setSoundVolume] = useState([50]);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [targetTime, setTargetTime] = useState(25); // Pomodoro default

  const currentEnv =
    FOCUS_ENVIRONMENTS.find((env) => env.id === environment) ||
    FOCUS_ENVIRONMENTS[0];
  const currentSound =
    AMBIENT_SOUNDS.find((sound) => sound.id === ambientSound) ||
    AMBIENT_SOUNDS[0];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive && sessionTimer < targetTime * 60) {
      interval = setInterval(() => {
        setSessionTimer((prev) => prev + 1);
      }, 1000);
    } else if (sessionTimer >= targetTime * 60) {
      setIsTimerActive(false);
      // Could add notification here
    }
    return () => clearInterval(interval);
  }, [isTimerActive, sessionTimer, targetTime]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const toggleTimer = () => {
    if (isTimerActive) {
      setIsTimerActive(false);
    } else {
      setIsTimerActive(true);
      if (sessionTimer === 0) {
        setSessionTimer(0);
      }
    }
  };

  const resetTimer = () => {
    setSessionTimer(0);
    setIsTimerActive(false);
  };

  if (!isOpen) return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${currentEnv.bg} transition-all duration-500`}
    >
      {/* Top Bar */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-black/10 backdrop-blur-sm">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800"
            >
              <X className="w-4 h-4 mr-2" />
              Sair do Foco
            </Button>

            {/* Timer Display */}
            <div className="flex items-center space-x-2 bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
              <Timer className="w-4 h-4" />
              <span className="font-mono text-sm">
                {formatTime(sessionTimer)}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTimer}
                className="h-6 px-2 text-xs"
              >
                {isTimerActive ? "Pausar" : "Iniciar"}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetTimer}
                className="h-6 px-2 text-xs"
              >
                Reset
              </Button>
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-600 hover:text-gray-800"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-16 right-4 z-20 w-80 lg:w-96 xl:w-[28rem] 2xl:w-[32rem]">
          <Card className="bg-white/90 backdrop-blur-sm border-white/30">
            <CardContent className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6">
              <div>
                <label className="text-sm lg:text-base xl:text-lg font-medium mb-2 lg:mb-3 block">
                  Ambiente
                </label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger className="lg:h-12 xl:h-14 lg:text-base xl:text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FOCUS_ENVIRONMENTS.map((env) => (
                      <SelectItem key={env.id} value={env.id}>
                        {env.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm lg:text-base xl:text-lg font-medium mb-2 lg:mb-3 block">
                  Som Ambiente
                </label>
                <Select value={ambientSound} onValueChange={setAmbientSound}>
                  <SelectTrigger className="lg:h-12 xl:h-14 lg:text-base xl:text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {AMBIENT_SOUNDS.map((sound) => (
                      <SelectItem key={sound.id} value={sound.id}>
                        <div className="flex items-center space-x-2">
                          <sound.icon className="w-4 h-4" />
                          <span>{sound.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {ambientSound !== "none" && (
                <div>
                  <label className="text-sm lg:text-base xl:text-lg font-medium mb-2 lg:mb-3 block">
                    Volume
                  </label>
                  <Slider
                    value={soundVolume}
                    onValueChange={setSoundVolume}
                    max={100}
                    step={1}
                    className="w-full lg:h-6 xl:h-8"
                  />
                </div>
              )}

              <div>
                <label className="text-sm lg:text-base xl:text-lg font-medium mb-2 lg:mb-3 block">
                  Sessão (minutos)
                </label>
                <Select
                  value={targetTime.toString()}
                  onValueChange={(value) =>
                    setTargetTime(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="lg:h-12 xl:h-14 lg:text-base xl:text-lg">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="25">25 min (Pomodoro)</SelectItem>
                    <SelectItem value="45">45 min</SelectItem>
                    <SelectItem value="60">60 min</SelectItem>
                    <SelectItem value="90">90 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Editor Area */}
      <div className="pt-20 pb-8 px-4 sm:px-8 lg:px-12 xl:px-16 h-full flex items-center justify-center">
        <div className="w-full max-w-4xl lg:max-w-5xl xl:max-w-6xl 2xl:max-w-7xl h-full">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl h-full p-4 sm:p-6 lg:p-8 xl:p-10 2xl:p-12 border border-white/30">
            <TiptapEditor
              content={content}
              onChange={onChange}
              // Remove characters prop since it's not defined in TiptapEditorProps
              // Removed locations prop as it's not defined in TiptapEditorProps interface
              className="h-full focus-mode"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
