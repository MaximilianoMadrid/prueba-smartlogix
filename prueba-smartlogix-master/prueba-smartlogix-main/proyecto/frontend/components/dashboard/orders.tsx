"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Eye,
  Printer,
  Truck,
  CheckCircle2,
  Clock,
  Package,
  XCircle,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"

// Mapeo de estados del backend (español) al frontend
const statusConfig = {
  PENDIENTE:   { label: "Pendiente",  icon: Clock,        className: "bg-warning/10 text-warning" },
  PROCESANDO:  { label: "Procesando", icon: Package,      className: "bg-chart-2/10 text-chart-2" },
  ENVIADO:     { label: "Enviado",    icon: Truck,        className: "bg-primary/10 text-primary" },
  ENTREGADO:   { label: "Entregado",  icon: CheckCircle2, className: "bg-success/10 text-success" },
  CANCELADO:   { label: "Cancelado",  icon: XCircle,      className: "bg-destructive/10 text-destructive" },
}

type OrderStatus = keyof typeof statusConfig

interface Order {
  id: number
  email: string
  nombreProducto: string
  cantidad: number
  precioTotal: number
  estado: OrderStatus
  canal: string
  createdAt: string
  updatedAt: string
}

export function OrdersPage() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  useEffect(() => {
    if (!token) return
    fetch('http://localhost:8080/api/orders', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setOrders(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [token])

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      String(order.id).includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.nombreProducto.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.estado === statusFilter
    return matchesSearch && matchesStatus
  })

  const toggleOrderSelection = (orderId: string) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
    )
  }

  const toggleAllOrders = () => {
    if (selectedOrders.length === filteredOrders.length) {
      setSelectedOrders([])
    } else {
      setSelectedOrders(filteredOrders.map((order) => String(order.id)))
    }
  }

  const openOrderDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Pedidos</h1>
          <p className="text-muted-foreground">Gestiona y cumple los pedidos de clientes en todos los canales.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            Crear Pedido
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {[
          { label: "Todos los Pedidos", value: orders.length },
          { label: "Pendientes",  value: orders.filter(o => o.estado === "PENDIENTE").length },
          { label: "Procesando",  value: orders.filter(o => o.estado === "PROCESANDO").length },
          { label: "Enviados",    value: orders.filter(o => o.estado === "ENVIADO").length },
          { label: "Entregados",  value: orders.filter(o => o.estado === "ENTREGADO").length },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground">{stat.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters and Search */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar pedidos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-secondary border-0">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="PENDIENTE">Pendiente</SelectItem>
                  <SelectItem value="PROCESANDO">Procesando</SelectItem>
                  <SelectItem value="ENVIADO">Enviado</SelectItem>
                  <SelectItem value="ENTREGADO">Entregado</SelectItem>
                  <SelectItem value="CANCELADO">Cancelado</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
            {selectedOrders.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">
                  {selectedOrders.length} seleccionados
                </span>
                <Button variant="outline" size="sm">
                  Acciones en Lote
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Orders Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Cargando pedidos...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No hay pedidos registrados.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedOrders.length === filteredOrders.length && filteredOrders.length > 0}
                      onCheckedChange={toggleAllOrders}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-8 gap-1 -ml-3 font-medium">
                      Pedido <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Email Cliente</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead>Canal</TableHead>
                  <TableHead>Cantidad</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrders.map((order) => {
                  const status = statusConfig[order.estado] ?? statusConfig.PENDIENTE
                  const StatusIcon = status.icon
                  return (
                    <TableRow
                      key={order.id}
                      className="border-border cursor-pointer"
                      onClick={() => openOrderDetails(order)}
                    >
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <Checkbox
                          checked={selectedOrders.includes(String(order.id))}
                          onCheckedChange={() => toggleOrderSelection(String(order.id))}
                        />
                      </TableCell>
                      <TableCell className="font-medium text-foreground">#{order.id}</TableCell>
                      <TableCell className="text-muted-foreground">{order.email}</TableCell>
                      <TableCell>{order.nombreProducto}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-secondary">
                          {order.canal}
                        </Badge>
                      </TableCell>
                      <TableCell>{order.cantidad}</TableCell>
                      <TableCell className="font-medium">${order.precioTotal.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={status.className}>
                          <StatusIcon className="mr-1 h-3 w-3" />
                          {status.label}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell onClick={(e) => e.stopPropagation()}>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => openOrderDetails(order)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Ver Detalles
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              Imprimir Etiqueta
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Truck className="mr-2 h-4 w-4" />
                              Enviar Pedido
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredOrders.length} de {orders.length} pedidos
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 min-w-8">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Order Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Pedido #{selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Realizado el {selectedOrder && new Date(selectedOrder.createdAt).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Email Cliente</h4>
                    <p className="text-foreground">{selectedOrder.email}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Canal</h4>
                    <Badge variant="secondary">{selectedOrder.canal}</Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Producto</h4>
                    <p className="text-foreground">{selectedOrder.nombreProducto}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Cantidad</h4>
                    <p className="text-foreground">{selectedOrder.cantidad} unidades</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Estado</h4>
                    <Badge variant="secondary" className={statusConfig[selectedOrder.estado]?.className}>
                      {statusConfig[selectedOrder.estado]?.label}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Última actualización</h4>
                    <p className="text-foreground">{new Date(selectedOrder.updatedAt).toLocaleString()}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">${selectedOrder.precioTotal.toFixed(2)}</span>
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <div className="space-y-4">
                  {[
                    { event: "Pedido creado", time: new Date(selectedOrder.createdAt).toLocaleTimeString(), date: new Date(selectedOrder.createdAt).toLocaleDateString() },
                    { event: `Estado: ${statusConfig[selectedOrder.estado]?.label}`, time: new Date(selectedOrder.updatedAt).toLocaleTimeString(), date: new Date(selectedOrder.updatedAt).toLocaleDateString() },
                  ].map((event, i, arr) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {i < arr.length - 1 && <div className="h-8 w-px bg-border" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">{event.date} a las {event.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}