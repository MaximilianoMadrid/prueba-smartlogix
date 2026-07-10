"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  Truck,
  Package,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MapPin,
  Calendar,
  ChevronRight,
  ExternalLink,
  Plane,
  Ship,
  MoreHorizontal,
  Eye,
  Printer,
  RefreshCcw,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"

// Mapeo de estados del backend al frontend
const statusConfig: Record<string, { label: string; icon: any; className: string; progress: number }> = {
  PREPARANDO:    { label: "Preparando",   icon: Package,      className: "bg-chart-2/10 text-chart-2",   progress: 15 },
  DESPACHADO:    { label: "Despachado",   icon: Truck,        className: "bg-primary/10 text-primary",   progress: 50 },
  EN_TRANSITO:   { label: "En Tránsito",  icon: Truck,        className: "bg-primary/10 text-primary",   progress: 65 },
  ENTREGADO:     { label: "Entregado",    icon: CheckCircle2, className: "bg-success/10 text-success",   progress: 100 },
  CANCELADO:     { label: "Cancelado",    icon: AlertTriangle,className: "bg-destructive/10 text-destructive", progress: 0 },
}

const carrierIcons: Record<string, React.ReactNode> = {
  FedEx: <Plane className="h-4 w-4" />,
  UPS:   <Truck className="h-4 w-4" />,
  DHL:   <Plane className="h-4 w-4" />,
  USPS:  <Truck className="h-4 w-4" />,
  Chilexpress: <Truck className="h-4 w-4" />,
  Starken: <Truck className="h-4 w-4" />,
}

interface Envio {
  id: number
  pedidoId: number
  emailCliente: string
  direccionDestino: string
  carrier: string
  numeroSeguimiento: string
  estado: string
  tipoEnvio: string
  createdAt: string
  updatedAt: string
}

export function ShipmentsPage() {
  const { token } = useAuth()
  const [shipments, setShipments] = useState<Envio[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [carrierFilter, setCarrierFilter] = useState<string>("all")
  const [selectedShipment, setSelectedShipment] = useState<Envio | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const fetchShipments = () => {
    if (!token) return
    fetch('http://localhost:8080/api/envios', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setShipments(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchShipments()
  }, [token])

  const carriers = [...new Set(shipments.map((s) => s.carrier))]

  const filteredShipments = shipments.filter((shipment) => {
    const matchesSearch =
      String(shipment.id).includes(searchQuery.toLowerCase()) ||
      shipment.numeroSeguimiento.toLowerCase().includes(searchQuery.toLowerCase()) ||
      shipment.emailCliente.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || shipment.estado === statusFilter
    const matchesCarrier = carrierFilter === "all" || shipment.carrier === carrierFilter
    return matchesSearch && matchesStatus && matchesCarrier
  })

  const openShipmentDetails = (shipment: Envio) => {
    setSelectedShipment(shipment)
    setDetailsOpen(true)
  }

  const preparandoCount  = shipments.filter(s => s.estado === "PREPARANDO").length
  const enTransitoCount  = shipments.filter(s => s.estado === "EN_TRANSITO" || s.estado === "DESPACHADO").length
  const entregadoCount   = shipments.filter(s => s.estado === "ENTREGADO").length
  const canceladoCount   = shipments.filter(s => s.estado === "CANCELADO").length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Envíos</h1>
          <p className="text-muted-foreground">Rastrea y gestiona todos los envíos entre transportistas.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2" onClick={fetchShipments}>
            <RefreshCcw className="h-4 w-4" />
            Sincronizar Todo
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
              <Package className="h-6 w-6 text-chart-2" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Preparando</p>
              <p className="text-2xl font-bold text-foreground">{preparandoCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="h-6 w-6 text-primary" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">En Tránsito</p>
              <p className="text-2xl font-bold text-foreground">{enTransitoCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-success/10">
              <CheckCircle2 className="h-6 w-6 text-success" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Entregados</p>
              <p className="text-2xl font-bold text-foreground">{entregadoCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Cancelados</p>
              <p className="text-2xl font-bold text-foreground">{canceladoCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Buscar por ID, seguimiento o email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-secondary border-0"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-44 bg-secondary border-0">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estados</SelectItem>
                <SelectItem value="PREPARANDO">Preparando</SelectItem>
                <SelectItem value="DESPACHADO">Despachado</SelectItem>
                <SelectItem value="EN_TRANSITO">En Tránsito</SelectItem>
                <SelectItem value="ENTREGADO">Entregado</SelectItem>
                <SelectItem value="CANCELADO">Cancelado</SelectItem>
              </SelectContent>
            </Select>
            <Select value={carrierFilter} onValueChange={setCarrierFilter}>
              <SelectTrigger className="w-36 bg-secondary border-0">
                <SelectValue placeholder="Transportista" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {carriers.map((carrier) => (
                  <SelectItem key={carrier} value={carrier}>{carrier}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Shipments List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">Cargando envíos...</p>
        </div>
      ) : filteredShipments.length === 0 ? (
        <div className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">No hay envíos registrados.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {filteredShipments.map((shipment) => {
            const status = statusConfig[shipment.estado] ?? statusConfig.PREPARANDO
            const StatusIcon = status.icon
            return (
              <Card
                key={shipment.id}
                className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer"
                onClick={() => openShipmentDetails(shipment)}
              >
                <CardContent className="p-6">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    {/* Left */}
                    <div className="flex items-start gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        {carrierIcons[shipment.carrier] ?? <Truck className="h-4 w-4" />}
                      </div>
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">#{shipment.id}</span>
                          <Badge variant="secondary" className={status.className}>
                            <StatusIcon className="mr-1 h-3 w-3" />
                            {status.label}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{shipment.emailCliente}</p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span>{shipment.carrier}</span>
                          <span>•</span>
                          <span>{shipment.numeroSeguimiento}</span>
                          <span>•</span>
                          <span>{shipment.tipoEnvio}</span>
                        </div>
                      </div>
                    </div>

                    {/* Center - Route */}
                    <div className="flex items-center gap-3 text-sm">
                      <div className="text-right">
                        <p className="font-medium text-foreground">Pedido #{shipment.pedidoId}</p>
                        <p className="text-xs text-muted-foreground">Origen</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        <div className="relative h-1 w-24 rounded-full bg-secondary">
                          <div
                            className="absolute h-full rounded-full bg-primary transition-all"
                            style={{ width: `${status.progress}%` }}
                          />
                        </div>
                        <div className="h-2 w-2 rounded-full bg-muted" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{shipment.direccionDestino.substring(0, 20)}...</p>
                        <p className="text-xs text-muted-foreground">Destino</p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <span className="text-muted-foreground">Creado:</span>
                          <span className="font-medium text-foreground">
                            {new Date(shipment.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Actualizado: {new Date(shipment.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={(e) => { e.stopPropagation(); openShipmentDetails(shipment) }}>
                            <Eye className="mr-2 h-4 w-4" />Ver Detalles
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <ExternalLink className="mr-2 h-4 w-4" />Rastrear en Transportista
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Printer className="mr-2 h-4 w-4" />Imprimir Etiqueta
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <ChevronRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Shipment Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Envío #{selectedShipment?.id}
              {selectedShipment && (
                <Badge variant="secondary" className={statusConfig[selectedShipment.estado]?.className}>
                  {statusConfig[selectedShipment.estado]?.label}
                </Badge>
              )}
            </DialogTitle>
            <DialogDescription>
              Pedido #{selectedShipment?.pedidoId} • {selectedShipment?.carrier} • {selectedShipment?.tipoEnvio}
            </DialogDescription>
          </DialogHeader>
          {selectedShipment && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="tracking">Rastreo</TabsTrigger>
                <TabsTrigger value="details">Detalles</TabsTrigger>
              </TabsList>
              <TabsContent value="tracking" className="mt-4 space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progreso de Entrega</span>
                    <span className="font-medium">{statusConfig[selectedShipment.estado]?.label}</span>
                  </div>
                  <Progress value={statusConfig[selectedShipment.estado]?.progress ?? 0} className="h-2" />
                </div>
                <div className="space-y-4">
                  {[
                    { evento: "Envío creado",   tiempo: selectedShipment.createdAt },
                    { evento: statusConfig[selectedShipment.estado]?.label ?? selectedShipment.estado, tiempo: selectedShipment.updatedAt },
                  ].map((event, i, arr) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`h-3 w-3 rounded-full ${i === 0 ? "bg-primary" : "bg-muted"}`} />
                        {i < arr.length - 1 && <div className="h-12 w-px bg-border" />}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className="font-medium text-foreground">{event.evento}</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.tiempo).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="details" className="mt-4 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Número de Seguimiento</h4>
                    <p className="text-foreground font-mono">{selectedShipment.numeroSeguimiento}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Transportista</h4>
                    <p className="text-foreground">{selectedShipment.carrier}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Email Cliente</h4>
                    <p className="text-foreground">{selectedShipment.emailCliente}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Tipo de Envío</h4>
                    <p className="text-foreground">{selectedShipment.tipoEnvio}</p>
                  </div>
                  <div className="space-y-2 col-span-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Dirección de Destino</h4>
                    <p className="text-foreground">{selectedShipment.direccionDestino}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Creado</h4>
                    <p className="text-foreground">{new Date(selectedShipment.createdAt).toLocaleString()}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Última Actualización</h4>
                    <p className="text-foreground">{new Date(selectedShipment.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1 gap-2">
                    <ExternalLink className="h-4 w-4" />
                    Rastrear en {selectedShipment.carrier}
                  </Button>
                  <Button variant="outline" className="flex-1 gap-2">
                    <Printer className="h-4 w-4" />
                    Imprimir Etiqueta
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}