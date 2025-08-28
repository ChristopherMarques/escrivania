"use client";

import { LocationForm } from "@/components/locations/location-form";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useIntegratedProject } from "@/lib/contexts/integrated-project-context";
import type { Location } from "@/lib/types";
import { MapPin } from "lucide-react";
import { useState } from "react";

interface LocationCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationCreated?: (location: Location) => void;
}

export function LocationCreationModal({
  isOpen,
  onClose,
  onLocationCreated,
}: LocationCreationModalProps) {
  const { addLocation } = useIntegratedProject();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLocationSubmit = async (locationData: Partial<Location>) => {
    setIsSubmitting(true);
    try {
      const newLocation = await addLocation(locationData);
      onLocationCreated?.(newLocation);
      onClose();
    } catch (error) {
      console.error("Erro ao criar local:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-[90vw] lg:max-w-[85vw] xl:max-w-[80vw] 2xl:max-w-[75vw] h-[95vh] max-h-[95vh] p-0 gap-0 bg-gradient-to-br from-background via-background to-secondary/5 border-border shadow-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border bg-gradient-to-r from-secondary/5 to-primary/5">
          <DialogTitle className="flex items-center gap-3 text-xl font-semibold">
            <div className="p-2 bg-gradient-to-br from-secondary to-primary rounded-lg shadow-lg">
              <MapPin className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
              Criar Novo Local
            </span>
          </DialogTitle>
          <DialogDescription className="text-muted-foreground mt-1 text-sm leading-relaxed">
            Adicione um novo local ao seu projeto. Descreva o ambiente,
            atmosfera e características importantes do lugar.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-1 overflow-hidden">
          <LocationForm
            onSubmit={handleLocationSubmit}
            onCancel={onClose}
            isSubmitting={isSubmitting}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
