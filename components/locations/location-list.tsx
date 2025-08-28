"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { Location } from "@/lib/types";
import {
  AlertTriangle,
  Briefcase,
  Building,
  Calendar,
  Car,
  Coffee,
  Edit,
  Eye,
  Filter,
  Grid3X3,
  Home,
  List,
  MapPin,
  Mountain,
  Search,
  Trash2,
  Trees,
  Waves,
} from "lucide-react";
import { useMemo, useState } from "react";

interface LocationListProps {
  locations: Location[];
  onView: (location: Location) => void;
  onEdit: (location: Location) => void;
  onDelete: (location: Location) => void;
}

type ViewMode = "grid" | "list";
type SortBy = "name" | "type" | "createdAt" | "updatedAt";
type SortOrder = "asc" | "desc";

const locationTypes = [
  {
    value: "indoor",
    label: "Interior",
    icon: Home,
    color: "bg-escrivania-blue-100 text-escrivania-blue-700",
    description: "Ambientes fechados",
  },
  {
    value: "outdoor",
    label: "Exterior",
    icon: Trees,
    color: "bg-green-100 text-green-700",
    description: "Ambientes abertos",
  },
  {
    value: "urban",
    label: "Urbano",
    icon: Building,
    color: "bg-gray-100 text-gray-700",
    description: "Áreas urbanas",
  },
  {
    value: "natural",
    label: "Natural",
    icon: Mountain,
    color: "bg-emerald-100 text-emerald-700",
    description: "Ambientes naturais",
  },
  {
    value: "water",
    label: "Aquático",
    icon: Waves,
    color: "bg-cyan-100 text-cyan-700",
    description: "Ambientes aquáticos",
  },
  {
    value: "transport",
    label: "Transporte",
    icon: Car,
    color: "bg-orange-100 text-orange-700",
    description: "Veículos e transporte",
  },
  {
    value: "commercial",
    label: "Comercial",
    icon: Coffee,
    color: "bg-amber-100 text-amber-700",
    description: "Estabelecimentos comerciais",
  },
  {
    value: "institutional",
    label: "Institucional",
    icon: Briefcase,
    color: "bg-purple-100 text-purple-700",
    description: "Instituições e órgãos",
  },
];

export function LocationList({
  locations,
  onView,
  onEdit,
  onDelete,
}: LocationListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [deleteLocation, setDeleteLocation] = useState<Location | null>(null);

  const getLocationTypeInfo = (type: string) => {
    return locationTypes.find((t) => t.value === type) || locationTypes[0];
  };

  const filteredAndSortedLocations = useMemo(() => {
    const filtered = locations.filter((location) => {
      const matchesSearch =
        location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        location.description
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        location.address?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType =
        selectedType === "all" || location.type === selectedType;

      return matchesSearch && matchesType;
    });

    // Ordenação
    filtered.sort((a, b) => {
      let aValue: string | Date;
      let bValue: string | Date;

      switch (sortBy) {
        case "name":
          aValue = a.name;
          bValue = b.name;
          break;
        case "type":
          aValue = a.type || "";
          bValue = b.type || "";
          break;
        case "createdAt":
          aValue = new Date(a.createdAt || "");
          bValue = new Date(b.createdAt || "");
          break;
        case "updatedAt":
          aValue = new Date(a.updatedAt || "");
          bValue = new Date(b.updatedAt || "");
          break;
        default:
          aValue = a.name;
          bValue = b.name;
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [locations, searchTerm, selectedType, sortBy, sortOrder]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteLocation) {
      onDelete(deleteLocation);
      setDeleteLocation(null);
    }
  };

  const LocationCard = ({ location }: { location: Location }) => {
    const typeInfo = getLocationTypeInfo(location.type || "indoor");
    const TypeIcon = typeInfo.icon;

    return (
      <Card className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/60 transition-all duration-200 group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3 flex-1">
              <div className={`p-2 rounded-lg ${typeInfo.color} flex-shrink-0`}>
                <TypeIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                  {location.name}
                </CardTitle>
                <CardDescription className="text-sm text-gray-600 mt-1">
                  <Badge className={`text-xs ${typeInfo.color} mr-2`}>
                    {typeInfo.label}
                  </Badge>
                  {location.address && (
                    <span className="flex items-center mt-1">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location.address}
                    </span>
                  )}
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(location)}
                className="text-escrivania-purple-600 hover:bg-escrivania-purple-50"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(location)}
                className="text-escrivania-blue-600 hover:bg-escrivania-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteLocation(location)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          {location.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-3">
              {location.description}
            </p>
          )}
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
              <Calendar className="w-3 h-3" />
              <span>
                Criado em{" "}
                {formatDate(location.createdAt || new Date().toISOString())}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  };

  const LocationRow = ({ location }: { location: Location }) => {
    const typeInfo = getLocationTypeInfo(location.type || "indoor");
    const TypeIcon = typeInfo.icon;

    return (
      <Card className="bg-white/50 backdrop-blur-sm border-white/30 hover:bg-white/60 transition-all duration-200 group">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 flex-1">
              <div className={`p-2 rounded-lg ${typeInfo.color} flex-shrink-0`}>
                <TypeIcon className="w-5 h-5" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">
                  {location.name}
                </h3>
                <div className="flex items-center space-x-4 mt-1">
                  <Badge className={`text-xs ${typeInfo.color}`}>
                    {typeInfo.label}
                  </Badge>
                  {location.address && (
                    <span className="text-sm text-gray-600 flex items-center">
                      <MapPin className="w-3 h-3 mr-1" />
                      {location.address}
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    Criado em{" "}
                    {formatDate(location.createdAt || new Date().toISOString())}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onView(location)}
                className="text-escrivania-purple-600 hover:bg-escrivania-purple-50"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(location)}
                className="text-escrivania-blue-600 hover:bg-escrivania-blue-50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setDeleteLocation(location)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
          {location.description && (
            <p className="text-sm text-gray-600 mt-3 line-clamp-1">
              {location.description}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-escrivania-purple-50 to-escrivania-blue-50">
      {/* Filters and Search */}
      <div className="p-6 border-b border-white/20 bg-white/30 backdrop-blur-sm">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar locais..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-white/70 border-gray-200 focus:border-escrivania-purple-300"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger className="w-40 bg-white/70 border-gray-200 focus:border-escrivania-purple-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {locationTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      <div className="flex items-center space-x-2">
                        <type.icon className="w-4 h-4" />
                        <span>{type.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [newSortBy, newSortOrder] = value.split("-") as [
                  SortBy,
                  SortOrder,
                ];
                setSortBy(newSortBy);
                setSortOrder(newSortOrder);
              }}
            >
              <SelectTrigger className="w-44 bg-white/70 border-gray-200 focus:border-escrivania-purple-300">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white/90 backdrop-blur-xl border-white/20">
                <SelectItem value="name-asc">Nome (A-Z)</SelectItem>
                <SelectItem value="name-desc">Nome (Z-A)</SelectItem>
                <SelectItem value="type-asc">Tipo (A-Z)</SelectItem>
                <SelectItem value="type-desc">Tipo (Z-A)</SelectItem>
                <SelectItem value="createdAt-desc">Mais recentes</SelectItem>
                <SelectItem value="createdAt-asc">Mais antigos</SelectItem>
              </SelectContent>
            </Select>

            {/* View Mode */}
            <Tabs
              value={viewMode}
              onValueChange={(value) => setViewMode(value as ViewMode)}
            >
              <TabsList className="bg-white/50">
                <TabsTrigger value="grid" className="px-3">
                  <Grid3X3 className="w-4 h-4" />
                </TabsTrigger>
                <TabsTrigger value="list" className="px-3">
                  <List className="w-4 h-4" />
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-600">
            {filteredAndSortedLocations.length} de {locations.length} locais
            {searchTerm && <span className="ml-1">para "{searchTerm}"</span>}
          </p>
          {(searchTerm || selectedType !== "all") && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm("");
                setSelectedType("all");
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {filteredAndSortedLocations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <MapPin className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-500 mb-2">
              {locations.length === 0
                ? "Nenhum local criado ainda"
                : "Nenhum local encontrado"}
            </h3>
            <p className="text-gray-400 text-center max-w-md">
              {locations.length === 0
                ? "Comece criando seu primeiro local para organizar os cenários da sua história."
                : "Tente ajustar os filtros ou termos de busca para encontrar o que procura."}
            </p>
          </div>
        ) : (
          <div
            className={`${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }`}
          >
            {filteredAndSortedLocations.map((location) =>
              viewMode === "grid" ? (
                <LocationCard key={location.id} location={location} />
              ) : (
                <LocationRow key={location.id} location={location} />
              )
            )}
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!deleteLocation}
        onOpenChange={() => setDeleteLocation(null)}
      >
        <DialogContent className="sm:max-w-[400px]">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2 text-red-700">
              <AlertTriangle className="w-5 h-5" />
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir o local{" "}
              <strong>{deleteLocation?.name}</strong>? Esta ação não pode ser
              desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteLocation(null)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirm}>
              <Trash2 className="w-4 h-4 mr-2" />
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
