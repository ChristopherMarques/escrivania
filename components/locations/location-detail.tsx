"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Location } from "@/lib/types";
import {
  ArrowLeft,
  Briefcase,
  Building,
  Calendar,
  Car,
  Clock,
  Cloud,
  CloudRain,
  Coffee,
  Edit,
  Eye,
  Home,
  Lightbulb,
  MapPin,
  Mountain,
  Navigation,
  Palette,
  Sun,
  Thermometer,
  Trash2,
  Trees,
  Users,
  Volume2,
  Waves,
  Zap,
} from "lucide-react";
import { useState } from "react";

interface LocationDetailProps {
  location: Location;
  onEdit: () => void;
  onDelete: () => void;
  onBack: () => void;
  isDeleting?: boolean;
}

const locationTypes = {
  indoor: {
    label: "Interior",
    icon: Home,
    color: "bg-escrivania-blue-100 text-escrivania-blue-700",
    description: "Ambientes fechados",
  },
  outdoor: {
    label: "Exterior",
    icon: Trees,
    color: "bg-green-100 text-green-700",
    description: "Ambientes abertos",
  },
  urban: {
    label: "Urbano",
    icon: Building,
    color: "bg-gray-100 text-gray-700",
    description: "Áreas urbanas",
  },
  natural: {
    label: "Natural",
    icon: Mountain,
    color: "bg-emerald-100 text-emerald-700",
    description: "Ambientes naturais",
  },
  water: {
    label: "Aquático",
    icon: Waves,
    color: "bg-cyan-100 text-cyan-700",
    description: "Ambientes aquáticos",
  },
  transport: {
    label: "Transporte",
    icon: Car,
    color: "bg-orange-100 text-orange-700",
    description: "Veículos e transporte",
  },
  commercial: {
    label: "Comercial",
    icon: Coffee,
    color: "bg-amber-100 text-amber-700",
    description: "Estabelecimentos comerciais",
  },
  institutional: {
    label: "Institucional",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-700",
    description: "Instituições",
  },
};

const timeOfDayLabels = {
  dawn: "Madrugada",
  morning: "Manhã",
  afternoon: "Tarde",
  evening: "Noite",
  any: "Qualquer horário",
};

const weatherLabels = {
  sunny: "Ensolarado",
  cloudy: "Nublado",
  rainy: "Chuvoso",
  stormy: "Tempestuoso",
  foggy: "Nebuloso",
  any: "Qualquer clima",
};

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  stormy: Zap,
  foggy: Eye,
  any: Cloud,
};

export function LocationDetail({
  location,
  onEdit,
  onDelete,
  onBack,
  isDeleting = false,
}: LocationDetailProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const typeInfo =
    locationTypes[location.type as keyof typeof locationTypes] ||
    locationTypes.indoor;
  const TypeIcon = typeInfo.icon;
  const WeatherIcon =
    weatherIcons[location.context?.weather as keyof typeof weatherIcons] ||
    Cloud;

  const handleDelete = () => {
    onDelete();
    setShowDeleteDialog(false);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-escrivania-purple-50 to-escrivania-blue-50">
      {/* Header */}
      <div className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={onBack}
              className="border-gray-200 hover:bg-gray-50"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {location.name}
              </h1>
              <div className="flex items-center space-x-2 mt-1">
                <Badge className={typeInfo.color}>
                  <TypeIcon className="w-3 h-3 mr-1" />
                  {typeInfo.label}
                </Badge>
                {location.address && (
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-3 h-3 mr-1" />
                    {location.address}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={onEdit}
              className="border-gray-200 hover:bg-gray-50"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(true)}
              className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </div>
        </div>
      </div>

      {/* Location Image and Basic Info */}
      <div className="p-6 border-b border-white/20 bg-white/30 backdrop-blur-sm">
        <div className="flex items-start space-x-6">
          <div className="flex flex-col items-center space-y-3">
            <div
              className={`p-6 rounded-xl ${typeInfo.color} ring-4 ring-white/50`}
            >
              <TypeIcon className="w-12 h-12" />
            </div>
            {location.imageUrl && (
              <img
                src={location.imageUrl}
                alt={location.name}
                className="w-24 h-24 rounded-lg object-cover border-2 border-white/50"
              />
            )}
          </div>

          <div className="flex-1 space-y-4">
            {location.description && (
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Descrição
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {location.description}
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {location.context?.timeOfDay &&
                location.context.timeOfDay !== "any" && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {
                        timeOfDayLabels[
                          location.context
                            .timeOfDay as keyof typeof timeOfDayLabels
                        ]
                      }
                    </span>
                  </div>
                )}
              {location.context?.weather &&
                location.context.weather !== "any" && (
                  <div className="flex items-center space-x-2 text-sm">
                    <WeatherIcon className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-700">
                      {
                        weatherLabels[
                          location.context.weather as keyof typeof weatherLabels
                        ]
                      }
                    </span>
                  </div>
                )}
              {location.context?.season && (
                <div className="flex items-center space-x-2 text-sm">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-700">
                    {location.context.season}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <div>Criado em: {formatDate(location.createdAt)}</div>
              {location.updatedAt &&
                location.updatedAt !== location.createdAt && (
                  <div>Atualizado em: {formatDate(location.updatedAt)}</div>
                )}
            </div>
          </div>
        </div>
      </div>

      {/* Location Details Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="atmosphere" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-3 bg-white/50 mx-6 mt-4">
            <TabsTrigger
              value="atmosphere"
              className="flex items-center space-x-2"
            >
              <Palette className="w-4 h-4" />
              <span>Atmosfera</span>
            </TabsTrigger>
            <TabsTrigger
              value="details"
              className="flex items-center space-x-2"
            >
              <Lightbulb className="w-4 h-4" />
              <span>Detalhes</span>
            </TabsTrigger>
            <TabsTrigger
              value="context"
              className="flex items-center space-x-2"
            >
              <Navigation className="w-4 h-4" />
              <span>Contexto</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6">
            <TabsContent value="atmosphere" className="space-y-6 mt-0">
              <div className="grid gap-6">
                {location.atmosphere?.mood && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg flex items-center space-x-2">
                        <Palette className="w-5 h-5 text-escrivania-purple-600" />
                        <span>Clima e Humor</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 leading-relaxed">
                        {location.atmosphere.mood}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {location.atmosphere?.lighting && (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Sun className="w-4 h-4 text-yellow-600" />
                          <span>Iluminação</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {location.atmosphere.lighting}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {location.atmosphere?.colors && (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Palette className="w-4 h-4 text-pink-600" />
                          <span>Cores</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {location.atmosphere.colors}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {location.atmosphere?.sounds && (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Volume2 className="w-4 h-4 text-blue-600" />
                          <span>Sons</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {location.atmosphere.sounds}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {location.atmosphere?.smells && (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Coffee className="w-4 h-4 text-amber-600" />
                          <span>Aromas</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {location.atmosphere.smells}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {location.atmosphere?.temperature && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Thermometer className="w-4 h-4 text-red-600" />
                        <span>Temperatura e Sensações</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {location.atmosphere.temperature}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-0">
              <div className="grid gap-6">
                {location.details?.size && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Building className="w-4 h-4 text-gray-600" />
                        <span>Tamanho e Dimensões</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {location.details.size}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {location.details?.layout && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-indigo-600" />
                        <span>Layout e Organização</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {location.details.layout}
                      </p>
                    </CardContent>
                  </Card>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {location.details?.furniture && (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Home className="w-4 h-4 text-brown-600" />
                          <span>Mobiliário</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {location.details.furniture}
                        </p>
                      </CardContent>
                    </Card>
                  )}

                  {location.details?.decorations && (
                    <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                      <CardHeader className="pb-3">
                        <CardTitle className="text-base flex items-center space-x-2">
                          <Palette className="w-4 h-4 text-purple-600" />
                          <span>Decoração</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 text-sm leading-relaxed">
                          {location.details.decorations}
                        </p>
                      </CardContent>
                    </Card>
                  )}
                </div>

                {location.details?.specialFeatures && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Lightbulb className="w-4 h-4 text-yellow-600" />
                        <span>Características Especiais</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {location.details.specialFeatures}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            <TabsContent value="context" className="space-y-6 mt-0">
              <div className="grid gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {location.context?.timeOfDay &&
                    location.context.timeOfDay !== "any" && (
                      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-600" />
                            <span>Horário de Uso</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 text-sm">
                            {
                              timeOfDayLabels[
                                location.context
                                  .timeOfDay as keyof typeof timeOfDayLabels
                              ]
                            }
                          </p>
                        </CardContent>
                      </Card>
                    )}

                  {location.context?.weather &&
                    location.context.weather !== "any" && (
                      <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                        <CardHeader className="pb-3">
                          <CardTitle className="text-base flex items-center space-x-2">
                            <WeatherIcon className="w-4 h-4 text-sky-600" />
                            <span>Clima Típico</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-gray-700 text-sm">
                            {
                              weatherLabels[
                                location.context
                                  .weather as keyof typeof weatherLabels
                              ]
                            }
                          </p>
                        </CardContent>
                      </Card>
                    )}
                </div>

                {location.context?.season && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-green-600" />
                        <span>Estação do Ano</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm">
                        {location.context.season}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {location.context?.crowdLevel && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Users className="w-4 h-4 text-orange-600" />
                        <span>Nível de Movimento</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {location.context.crowdLevel}
                      </p>
                    </CardContent>
                  </Card>
                )}

                {location.context?.accessibility && (
                  <Card className="bg-white/60 backdrop-blur-sm border-white/20">
                    <CardHeader className="pb-3">
                      <CardTitle className="text-base flex items-center space-x-2">
                        <Navigation className="w-4 h-4 text-purple-600" />
                        <span>Acessibilidade</span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {location.context.accessibility}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="bg-white/90 backdrop-blur-xl border-white/20">
          <DialogHeader>
            <DialogTitle className="text-red-600">
              Confirmar Exclusão
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o local "{location.name}"?
              <br />
              <span className="text-red-600 font-medium">
                Esta ação não pode ser desfeita.
              </span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Excluindo..." : "Excluir"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
