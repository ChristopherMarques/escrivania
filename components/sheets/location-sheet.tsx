"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TiptapEditor } from "@/components/editor/tiptap-editor"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { MapPin, Upload, Trash2, ImageIcon } from "lucide-react"
import type { ILocation } from "@/lib/types"

interface LocationSheetProps {
  location: ILocation
  onUpdate: (location: ILocation) => void
  onDelete: (locationId: string) => void
}

export function LocationSheet({ location, onUpdate, onDelete }: LocationSheetProps) {
  const [isAddPinOpen, setIsAddPinOpen] = useState(false)
  const [newPinName, setNewPinName] = useState("")
  const [newPinDescription, setNewPinDescription] = useState("")
  const [newPinPosition, setNewPinPosition] = useState<{ x: number; y: number } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  const updateLocation = (updates: Partial<ILocation>) => {
    onUpdate({ ...location, ...updates, updatedAt: new Date().toISOString() })
  }

  const handleMapUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string
        updateLocation({ mapImageUrl: imageUrl })
      }
      reader.readAsDataURL(file)
    }
  }

  const handleMapClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return

    const rect = mapRef.current.getBoundingClientRect()
    const x = ((event.clientX - rect.left) / rect.width) * 100
    const y = ((event.clientY - rect.top) / rect.height) * 100

    setNewPinPosition({ x, y })
    setIsAddPinOpen(true)
  }

  const addPin = () => {
    if (!newPinName.trim() || !newPinPosition) return

    const newPin = {
      id: `pin-${Date.now()}`,
      x: newPinPosition.x,
      y: newPinPosition.y,
      name: newPinName,
      description: newPinDescription,
    }

    const updatedPins = [...(location.pins || []), newPin]
    updateLocation({ pins: updatedPins })

    setNewPinName("")
    setNewPinDescription("")
    setNewPinPosition(null)
    setIsAddPinOpen(false)
  }

  const removePin = (pinId: string) => {
    const updatedPins = (location.pins || []).filter((pin) => pin.id !== pinId)
    updateLocation({ pins: updatedPins })
  }

  return (
    <div className="h-full flex flex-col">
      {/* Location Header */}
      <div className="p-6 border-b border-white/20 bg-white/40 backdrop-blur-sm">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center justify-between mb-2">
              <Input
                value={location.name}
                onChange={(e) => updateLocation({ name: e.target.value })}
                className="text-xl font-bold bg-transparent border-none p-0 h-auto focus-visible:ring-0"
                placeholder="Nome do Local"
              />
              <Button
                variant="outline"
                size="sm"
                onClick={() => onDelete(location.id)}
                className="text-red-600 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <Textarea
              value={location.description}
              onChange={(e) => updateLocation({ description: e.target.value })}
              placeholder="Descrição breve do local..."
              className="mt-2 bg-white/50 border-gray-200 focus:border-purple-300 min-h-[80px]"
            />
          </div>
        </div>
      </div>

      {/* Location Tabs */}
      <div className="flex-1 overflow-auto">
        <Tabs defaultValue="description" className="h-full flex flex-col">
          <TabsList className="grid w-full grid-cols-4 bg-white/50 mx-6 mt-4">
            <TabsTrigger value="description">Descrição</TabsTrigger>
            <TabsTrigger value="history">História</TabsTrigger>
            <TabsTrigger value="culture">Cultura</TabsTrigger>
            <TabsTrigger value="map">Mapa</TabsTrigger>
          </TabsList>

          <div className="flex-1 p-6">
            <TabsContent value="description" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Descrição Detalhada</h3>
                <TiptapEditor
                  content={location.description}
                  onChange={(content) => updateLocation({ description: content })}
                  placeholder="Descreva o local em detalhes: aparência, atmosfera, características marcantes..."
                  className="min-h-[400px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="history" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">História do Local</h3>
                <TiptapEditor
                  content={location.history || ""}
                  onChange={(content) => updateLocation({ history: content })}
                  placeholder="Conte a história deste local: como foi fundado, eventos importantes, mudanças ao longo do tempo..."
                  className="min-h-[400px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="culture" className="mt-0">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Cultura e Sociedade</h3>
                <TiptapEditor
                  content={location.culture || ""}
                  onChange={(content) => updateLocation({ culture: content })}
                  placeholder="Descreva a cultura local: costumes, tradições, hierarquia social, economia..."
                  className="min-h-[400px]"
                />
              </div>
            </TabsContent>

            <TabsContent value="map" className="space-y-6 mt-0">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Mapa Interativo</h3>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Upload Mapa
                </Button>
              </div>

              <input ref={fileInputRef} type="file" accept="image/*" onChange={handleMapUpload} className="hidden" />

              {location.mapImageUrl ? (
                <div className="space-y-4">
                  <div
                    ref={mapRef}
                    className="relative bg-gray-100 rounded-lg overflow-hidden cursor-crosshair border-2 border-dashed border-gray-300 hover:border-purple-300 transition-colors"
                    onClick={handleMapClick}
                    style={{ aspectRatio: "16/9" }}
                  >
                    <img
                      src={location.mapImageUrl || "/placeholder.svg"}
                      alt={`Mapa de ${location.name}`}
                      className="w-full h-full object-cover"
                    />

                    {/* Map Pins */}
                    {(location.pins || []).map((pin) => (
                      <div
                        key={pin.id}
                        className="absolute transform -translate-x-1/2 -translate-y-full group"
                        style={{ left: `${pin.x}%`, top: `${pin.y}%` }}
                      >
                        <div className="relative">
                          <MapPin className="w-6 h-6 text-red-500 drop-shadow-lg cursor-pointer hover:text-red-600" />
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <Card className="w-48 bg-white/90 backdrop-blur-sm border-white/20 shadow-lg">
                              <CardHeader className="pb-2">
                                <div className="flex items-center justify-between">
                                  <CardTitle className="text-sm">{pin.name}</CardTitle>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      removePin(pin.id)
                                    }}
                                    className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                  >
                                    <Trash2 className="w-3 h-3" />
                                  </Button>
                                </div>
                              </CardHeader>
                              {pin.description && (
                                <CardContent className="pt-0">
                                  <p className="text-xs text-gray-600">{pin.description}</p>
                                </CardContent>
                              )}
                            </Card>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="absolute inset-0 bg-black/0 hover:bg-black/5 transition-colors flex items-center justify-center">
                      <div className="bg-white/80 backdrop-blur-sm rounded-lg px-3 py-2 text-sm text-gray-600 opacity-0 hover:opacity-100 transition-opacity">
                        Clique para adicionar um marcador
                      </div>
                    </div>
                  </div>

                  {/* Pin List */}
                  {(location.pins || []).length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Marcadores no Mapa</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {(location.pins || []).map((pin) => (
                          <Card key={pin.id} className="bg-white/50 backdrop-blur-sm border-white/30">
                            <CardHeader className="pb-2">
                              <div className="flex items-center justify-between">
                                <CardTitle className="text-sm flex items-center">
                                  <MapPin className="w-4 h-4 text-red-500 mr-2" />
                                  {pin.name}
                                </CardTitle>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removePin(pin.id)}
                                  className="h-6 w-6 p-0 text-red-600 hover:bg-red-50"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </div>
                            </CardHeader>
                            {pin.description && (
                              <CardContent className="pt-0">
                                <p className="text-xs text-gray-600">{pin.description}</p>
                              </CardContent>
                            )}
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                  <ImageIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhum mapa carregado</p>
                  <p className="text-sm">Faça upload de uma imagem para criar um mapa interativo</p>
                </div>
              )}
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Add Pin Dialog */}
      <Dialog open={isAddPinOpen} onOpenChange={setIsAddPinOpen}>
        <DialogContent className="sm:max-w-[425px] bg-white/90 backdrop-blur-xl border-white/20">
          <DialogHeader>
            <DialogTitle>Adicionar Marcador</DialogTitle>
            <DialogDescription>Adicione um ponto de interesse no mapa.</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="pin-name">Nome do Local</Label>
              <Input
                id="pin-name"
                value={newPinName}
                onChange={(e) => setNewPinName(e.target.value)}
                placeholder="Ex: Taverna do Dragão Dourado"
                className="bg-white/50 border-gray-200 focus:border-purple-300"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="pin-description">Descrição (Opcional)</Label>
              <Textarea
                id="pin-description"
                value={newPinDescription}
                onChange={(e) => setNewPinDescription(e.target.value)}
                placeholder="Breve descrição do local..."
                className="bg-white/50 border-gray-200 focus:border-purple-300"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddPinOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={addPin}
              disabled={!newPinName.trim()}
              className="bg-gradient-to-r from-purple-500 to-blue-400 hover:from-purple-600 hover:to-blue-500 text-white"
            >
              Adicionar Marcador
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
