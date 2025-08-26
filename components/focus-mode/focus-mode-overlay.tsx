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
import { useEffect, useRef, useState } from "react";

interface FocusModeOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  content: any;
  onChange: (content: any) => void;
  characters: any[];
  locations: any[];
  autoSaveStatus?: {
    statusText: string;
    statusColor: string;
  };
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
  autoSaveStatus,
}: FocusModeOverlayProps) {
  const [environment, setEnvironment] = useState("minimal");
  const [ambientSound, setAmbientSound] = useState("none");
  const [soundVolume, setSoundVolume] = useState([50]);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionTimer, setSessionTimer] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [targetTime, setTargetTime] = useState(25); // Pomodoro default
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentEnv =
    FOCUS_ENVIRONMENTS.find((env) => env.id === environment) ||
    FOCUS_ENVIRONMENTS[0];
  const currentSound =
    AMBIENT_SOUNDS.find((sound) => sound.id === ambientSound) ||
    AMBIENT_SOUNDS[0];

  // Audio management
  useEffect(() => {
    if (ambientSound === "none") {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      return;
    }

    // Create audio element for the selected sound
    const audio = new Audio(`/sounds/${ambientSound}.mp3`);
    audio.loop = true;
    audio.volume = soundVolume[0] / 100;
    audioRef.current = audio;

    // Play the audio
    audio.play().catch((error) => {
      console.log("Audio playback failed:", error);
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [ambientSound]);

  // Update volume when slider changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = soundVolume[0] / 100;
    }
  }, [soundVolume]);

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

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
          {/* Left side - Exit button */}
          <div className="flex items-center flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <X className="w-4 h-4 mr-2" />
              Sair do Foco
            </Button>
          </div>

          {/* Center - Timer and Auto-save Status */}
          <div className="flex items-center space-x-4 flex-1 justify-center max-w-2xl mx-4">
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
            
            {/* Auto-save Status */}
            {autoSaveStatus && (
              <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1">
                <div className={`text-xs font-medium ${autoSaveStatus.statusColor}`}>
                  {autoSaveStatus.statusText}
                </div>
              </div>
            )}
          </div>

          {/* Right side - Settings button */}
          <div className="flex items-center flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowSettings(!showSettings)}
              className="text-gray-700 hover:text-gray-900 bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
          </div>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <div className="absolute top-20 right-4 z-20 w-80 lg:w-96 xl:w-[28rem] 2xl:w-[32rem] animate-in slide-in-from-top-2 duration-200">
          <Card className="bg-white/95 backdrop-blur-md border-white/50 shadow-2xl">
            <CardContent className="p-4 lg:p-6 xl:p-8 space-y-4 lg:space-y-6">
              <div>
                <label className="text-sm lg:text-base xl:text-lg font-semibold mb-2 lg:mb-3 block text-gray-800">
                  🎨 Ambiente Visual
                </label>
                <Select value={environment} onValueChange={setEnvironment}>
                  <SelectTrigger className="lg:h-12 xl:h-14 lg:text-base xl:text-lg border-2 hover:border-gray-400">
                    <SelectValue placeholder="Selecione um ambiente" />
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
                <label className="text-sm lg:text-base xl:text-lg font-semibold mb-2 lg:mb-3 block text-gray-800">
                  🔊 Som Ambiente
                </label>
                <Select value={ambientSound} onValueChange={setAmbientSound}>
                  <SelectTrigger className="lg:h-12 xl:h-14 lg:text-base xl:text-lg border-2 hover:border-gray-400">
                    <SelectValue placeholder="Selecione um som" />
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
                  <label className="text-sm lg:text-base xl:text-lg font-semibold mb-2 lg:mb-3 block text-gray-800">
                    🔉 Volume ({soundVolume[0]}%)
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
                <label className="text-sm lg:text-base xl:text-lg font-semibold mb-2 lg:mb-3 block text-gray-800">
                  ⏱️ Duração da Sessão
                </label>
                <Select
                  value={targetTime.toString()}
                  onValueChange={(value) =>
                    setTargetTime(Number.parseInt(value))
                  }
                >
                  <SelectTrigger className="lg:h-12 xl:h-14 lg:text-base xl:text-lg border-2 hover:border-gray-400">
                    <SelectValue placeholder="Selecione a duração" />
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
      <div className="pt-20 pb-8 px-2 sm:px-4 lg:px-6 h-full flex items-center justify-center">
        <div className="w-full max-w-none h-[80vh] min-h-[600px]" style={{width: '90vw'}}>
          <div className="bg-background/95 backdrop-blur-sm rounded-lg shadow-2xl h-full p-4 sm:p-6 lg:p-8 border border-border/50">
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
