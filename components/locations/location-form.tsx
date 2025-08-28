"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import type { Location } from "@/lib/types";
import {
  Briefcase,
  Building,
  Camera,
  Car,
  Clock,
  Coffee,
  Home,
  Lightbulb,
  Mountain,
  Palette,
  Save,
  Trees,
  Upload,
  Waves,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface LocationFormProps {
  location?: Location;
  onSave: (location: Partial<Location>) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode: "create" | "edit";
}

const locationTypes = [
  {
    value: "indoor",
    label: "Interior",
    icon: Home,
    color: "bg-secondary/20 text-secondary-foreground",
    description: "Ambientes fechados como casas, escritórios, lojas",
  },
  {
    value: "outdoor",
    label: "Exterior",
    icon: Trees,
    color: "bg-green-100 text-green-700",
    description: "Ambientes abertos como parques, praças, jardins",
  },
  {
    value: "urban",
    label: "Urbano",
    icon: Building,
    color: "bg-muted text-muted-foreground",
    description: "Áreas urbanas como ruas, avenidas, bairros",
  },
  {
    value: "natural",
    label: "Natural",
    icon: Mountain,
    color: "bg-emerald-100 text-emerald-700",
    description: "Ambientes naturais como florestas, montanhas, campos",
  },
  {
    value: "water",
    label: "Aquático",
    icon: Waves,
    color: "bg-cyan-100 text-cyan-700",
    description: "Ambientes aquáticos como praias, rios, lagos",
  },
  {
    value: "transport",
    label: "Transporte",
    icon: Car,
    color: "bg-orange-100 text-orange-700",
    description: "Veículos e meios de transporte",
  },
  {
    value: "commercial",
    label: "Comercial",
    icon: Coffee,
    color: "bg-amber-100 text-amber-700",
    description: "Estabelecimentos comerciais como lojas, restaurantes",
  },
  {
    value: "institutional",
    label: "Institucional",
    icon: Briefcase,
    color: "bg-primary/20 text-primary-foreground",
    description: "Instituições como escolas, hospitais, órgãos públicos",
  },
];

const timeOfDayOptions = [
  { value: "dawn", label: "Madrugada", description: "00:00 - 06:00" },
  { value: "morning", label: "Manhã", description: "06:00 - 12:00" },
  { value: "afternoon", label: "Tarde", description: "12:00 - 18:00" },
  { value: "evening", label: "Noite", description: "18:00 - 24:00" },
  { value: "any", label: "Qualquer horário", description: "Flexível" },
];

const weatherOptions = [
  { value: "sunny", label: "Ensolarado", description: "Céu claro e sol" },
  { value: "cloudy", label: "Nublado", description: "Céu com nuvens" },
  { value: "rainy", label: "Chuvoso", description: "Chuva ou garoa" },
  { value: "stormy", label: "Tempestuoso", description: "Tempestade" },
  { value: "foggy", label: "Nebuloso", description: "Neblina ou névoa" },
  { value: "any", label: "Qualquer clima", description: "Flexível" },
];

export function LocationForm({
  location,
  onSave,
  onCancel,
  isLoading = false,
  mode,
}: LocationFormProps) {
  const [formData, setFormData] = useState<Partial<Location>>({
    name: "",
    type: "indoor",
    description: "",
    address: "",
    atmosphere: {
      mood: "",
      lighting: "",
      sounds: "",
      smells: "",
      temperature: "",
      colors: "",
    },
    details: {
      size: "",
      layout: "",
      furniture: "",
      decorations: "",
      specialFeatures: "",
    },
    context: {
      timeOfDay: "any",
      weather: "any",
      season: "",
      crowdLevel: "",
      accessibility: "",
    },
    imageUrl: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (location && mode === "edit") {
      setFormData({
        ...location,
        atmosphere: location.atmosphere || {
          mood: "",
          lighting: "",
          sounds: "",
          smells: "",
          temperature: "",
          colors: "",
        },
        details: location.details || {
          size: "",
          layout: "",
          furniture: "",
          decorations: "",
          specialFeatures: "",
        },
        context: location.context || {
          timeOfDay: "any",
          weather: "any",
          season: "",
          crowdLevel: "",
          accessibility: "",
        },
      });
    }
  }, [location, mode]);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Nome é obrigatório";
    }

    if (!formData.type) {
      newErrors.type = "Tipo é obrigatório";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  const updateFormData = (updates: Partial<Location>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
    // Limpar erros relacionados aos campos atualizados
    const updatedFields = Object.keys(updates);
    setErrors((prev) => {
      const newErrors = { ...prev };
      updatedFields.forEach((field) => {
        delete newErrors[field];
      });
      return newErrors;
    });
  };

  const updateAtmosphere = (updates: Partial<Location["atmosphere"]>) => {
    updateFormData({
      atmosphere: {
        ...formData.atmosphere,
        ...updates,
      },
    });
  };

  const updateDetails = (updates: Partial<Location["details"]>) => {
    updateFormData({
      details: {
        ...formData.details,
        ...updates,
      },
    });
  };

  const updateContext = (updates: Partial<Location["context"]>) => {
    updateFormData({
      context: {
        ...formData.context,
        ...updates,
      },
    });
  };

  const getLocationTypeInfo = (type: string) => {
    return locationTypes.find((t) => t.value === type) || locationTypes[0];
  };

  const selectedTypeInfo = getLocationTypeInfo(formData.type || "indoor");
  const TypeIcon = selectedTypeInfo.icon;

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-background via-background to-secondary/5">
      {/* Header */}
      <div className="p-4 lg:p-6 border-b border-border bg-gradient-to-r from-secondary/5 to-primary/5 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-4 sm:space-y-0">
          <div className="flex-1">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground">
              {mode === "create" ? "Novo Local" : "Editar Local"}
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              {mode === "create"
                ? "Crie um novo local para sua história"
                : "Edite as informações do local"}
            </p>
          </div>
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={onCancel}
              disabled={isLoading}
              className="flex-1 sm:flex-none"
            >
              <X className="w-4 h-4 mr-2" />
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isLoading}
              className="shadow-lg flex-1 sm:flex-none"
            >
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>
      </div>

      {/* Location Basic Info */}
      <div className="p-4 lg:p-6 border-b border-white/20 bg-white/30 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-start space-y-4 lg:space-y-0 lg:space-x-6">
          <div className="flex flex-col items-center space-y-3 lg:flex-shrink-0">
            <div
              className={`p-3 lg:p-4 rounded-xl ${selectedTypeInfo.color} ring-4 ring-white/50`}
            >
              <TypeIcon className="w-6 h-6 lg:w-8 lg:h-8" />
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">
                <Upload className="w-3 h-3 mr-1" />
                Upload
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                <Camera className="w-3 h-3 mr-1" />
                Foto
              </Button>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  Nome do Local *
                </Label>
                <Input
                  id="name"
                  value={formData.name || ""}
                  onChange={(e) => updateFormData({ name: e.target.value })}
                  placeholder="Ex: Café da Esquina"
                  className={`mt-1 ${
                    errors.name
                      ? "border-destructive focus:border-destructive"
                      : ""
                  }`}
                />
                {errors.name && (
                  <p className="text-xs text-red-600 mt-1">{errors.name}</p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="type"
                  className="text-sm font-medium text-gray-700"
                >
                  Tipo de Local *
                </Label>
                <Select
                  value={formData.type || ""}
                  onValueChange={(value) => updateFormData({ type: value })}
                >
                  <SelectTrigger
                    className={`mt-1 ${
                      errors.type
                        ? "border-destructive focus:border-destructive"
                        : ""
                    }`}
                  >
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                  <SelectContent>
                    {locationTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center space-x-2">
                            <Icon className="w-4 h-4" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">
                                {type.description}
                              </div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
                {errors.type && (
                  <p className="text-xs text-red-600 mt-1">{errors.type}</p>
                )}
              </div>
            </div>

            <div>
              <Label
                htmlFor="address"
                className="text-sm font-medium text-gray-700"
              >
                Endereço/Localização
              </Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => updateFormData({ address: e.target.value })}
                placeholder="Ex: Rua das Flores, 123 - Centro"
                className="mt-1"
              />
            </div>

            <div>
              <Label
                htmlFor="description"
                className="text-sm font-medium text-gray-700"
              >
                Descrição Geral
              </Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) =>
                  updateFormData({ description: e.target.value })
                }
                placeholder="Descreva o local, sua importância na história e características gerais..."
                className="mt-1 min-h-[100px] lg:min-h-[120px]"
              />
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
              <Clock className="w-4 h-4" />
              <span>Contexto</span>
            </TabsTrigger>
          </TabsList>

          <div className="flex-1 p-4 lg:p-6">
            <TabsContent value="atmosphere" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="lg:col-span-2">
                  <Label
                    htmlFor="mood"
                    className="text-sm font-medium text-gray-700"
                  >
                    Clima/Humor do Local
                  </Label>
                  <Textarea
                    id="mood"
                    value={formData.atmosphere?.mood || ""}
                    onChange={(e) => updateAtmosphere({ mood: e.target.value })}
                    placeholder="Ex: Acolhedor e nostálgico, com um toque de melancolia..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Descreva a sensação geral que o local transmite
                  </p>
                </div>

                <div>
                  <Label
                    htmlFor="lighting"
                    className="text-sm font-medium text-gray-700"
                  >
                    Iluminação
                  </Label>
                  <Textarea
                    id="lighting"
                    value={formData.atmosphere?.lighting || ""}
                    onChange={(e) =>
                      updateAtmosphere({ lighting: e.target.value })
                    }
                    placeholder="Ex: Luz suave de velas, penumbra aconchegante..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="colors"
                    className="text-sm font-medium text-gray-700"
                  >
                    Cores Predominantes
                  </Label>
                  <Textarea
                    id="colors"
                    value={formData.atmosphere?.colors || ""}
                    onChange={(e) =>
                      updateAtmosphere({ colors: e.target.value })
                    }
                    placeholder="Ex: Tons terrosos, madeira escura, detalhes dourados..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="sounds"
                    className="text-sm font-medium text-gray-700"
                  >
                    Sons Característicos
                  </Label>
                  <Textarea
                    id="sounds"
                    value={formData.atmosphere?.sounds || ""}
                    onChange={(e) =>
                      updateAtmosphere({ sounds: e.target.value })
                    }
                    placeholder="Ex: Murmúrio de conversas, música jazz baixa..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="smells"
                    className="text-sm font-medium text-gray-700"
                  >
                    Aromas e Cheiros
                  </Label>
                  <Textarea
                    id="smells"
                    value={formData.atmosphere?.smells || ""}
                    onChange={(e) =>
                      updateAtmosphere({ smells: e.target.value })
                    }
                    placeholder="Ex: Café recém-passado, madeira envelhecida..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label
                    htmlFor="temperature"
                    className="text-sm font-medium text-gray-700"
                  >
                    Temperatura e Sensações Táteis
                  </Label>
                  <Textarea
                    id="temperature"
                    value={formData.atmosphere?.temperature || ""}
                    onChange={(e) =>
                      updateAtmosphere({ temperature: e.target.value })
                    }
                    placeholder="Ex: Ambiente aquecido, brisa fresca, superfícies rugosas..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="details" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="size"
                    className="text-sm font-medium text-gray-700"
                  >
                    Tamanho e Dimensões
                  </Label>
                  <Textarea
                    id="size"
                    value={formData.details?.size || ""}
                    onChange={(e) => updateDetails({ size: e.target.value })}
                    placeholder="Ex: Espaço íntimo com cerca de 20 mesas, pé-direito alto..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="layout"
                    className="text-sm font-medium text-gray-700"
                  >
                    Layout e Organização
                  </Label>
                  <Textarea
                    id="layout"
                    value={formData.details?.layout || ""}
                    onChange={(e) => updateDetails({ layout: e.target.value })}
                    placeholder="Ex: Entrada principal à direita, balcão ao fundo, mesas espalhadas..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="furniture"
                    className="text-sm font-medium text-gray-700"
                  >
                    Mobiliário
                  </Label>
                  <Textarea
                    id="furniture"
                    value={formData.details?.furniture || ""}
                    onChange={(e) =>
                      updateDetails({ furniture: e.target.value })
                    }
                    placeholder="Ex: Mesas de madeira rústica, cadeiras estofadas, sofás de couro..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="decorations"
                    className="text-sm font-medium text-gray-700"
                  >
                    Decoração e Ornamentos
                  </Label>
                  <Textarea
                    id="decorations"
                    value={formData.details?.decorations || ""}
                    onChange={(e) =>
                      updateDetails({ decorations: e.target.value })
                    }
                    placeholder="Ex: Quadros vintage nas paredes, plantas suspensas, estantes com livros..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div className="lg:col-span-2">
                  <Label
                    htmlFor="specialFeatures"
                    className="text-sm font-medium text-gray-700"
                  >
                    Características Especiais
                  </Label>
                  <Textarea
                    id="specialFeatures"
                    value={formData.details?.specialFeatures || ""}
                    onChange={(e) =>
                      updateDetails({ specialFeatures: e.target.value })
                    }
                    placeholder="Ex: Lareira antiga, piano de cauda, vista para o jardim..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="context" className="space-y-6 mt-0">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <Label
                    htmlFor="timeOfDay"
                    className="text-sm font-medium text-gray-700"
                  >
                    Horário Típico de Uso
                  </Label>
                  <Select
                    value={formData.context?.timeOfDay || "any"}
                    onValueChange={(value) =>
                      updateContext({ timeOfDay: value })
                    }
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                      {timeOfDayOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">
                              {option.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label
                    htmlFor="weather"
                    className="text-sm font-medium text-gray-700"
                  >
                    Clima Típico
                  </Label>
                  <Select
                    value={formData.context?.weather || "any"}
                    onValueChange={(value) => updateContext({ weather: value })}
                  >
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                      {weatherOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <div>
                            <div className="font-medium">{option.label}</div>
                            <div className="text-xs text-gray-500">
                              {option.description}
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="lg:col-span-2">
                  <Label
                    htmlFor="season"
                    className="text-sm font-medium text-gray-700"
                  >
                    Estação do Ano
                  </Label>
                  <Input
                    id="season"
                    value={formData.context?.season || ""}
                    onChange={(e) => updateContext({ season: e.target.value })}
                    placeholder="Ex: Verão, Inverno, ou qualquer estação"
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="crowdLevel"
                    className="text-sm font-medium text-gray-700"
                  >
                    Nível de Movimento
                  </Label>
                  <Textarea
                    id="crowdLevel"
                    value={formData.context?.crowdLevel || ""}
                    onChange={(e) =>
                      updateContext({ crowdLevel: e.target.value })
                    }
                    placeholder="Ex: Sempre lotado, movimento moderado, local reservado..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="accessibility"
                    className="text-sm font-medium text-gray-700"
                  >
                    Acessibilidade e Acesso
                  </Label>
                  <Textarea
                    id="accessibility"
                    value={formData.context?.accessibility || ""}
                    onChange={(e) =>
                      updateContext({ accessibility: e.target.value })
                    }
                    placeholder="Ex: Acesso fácil, entrada por escadas, local privado..."
                    className="mt-2 min-h-[120px] lg:min-h-[140px]"
                  />
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
