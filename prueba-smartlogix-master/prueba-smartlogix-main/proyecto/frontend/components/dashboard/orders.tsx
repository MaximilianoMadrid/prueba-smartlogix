"use client"

import { useState } from "react"
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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

// Sample order data
const orders = [
  {
    id: "ORD-7891",
    customer: "Maria Garcia",
    email: "maria.garcia@email.com",
    items: 3,
    total: 128.50,
    status: "shipped",
    channel: "Shopify",
    date: "2024-01-15T10:30:00",
    shipping: "FedEx Express",
    address: "Av. Providencia 1234, Providencia, Región Metropolitana",
  },
  {
    id: "ORD-7890",
    customer: "James Wilson",
    email: "james.w@email.com",
    items: 1,
    total: 89.00,
    status: "processing",
    channel: "Amazon",
    date: "2024-01-15T09:15:00",
    shipping: "UPS Ground",
    address: "San Diego 456, Santiago Centro, Región Metropolitana",
  },
  {
    id: "ORD-7889",
    customer: "Emma Thompson",
    email: "emma.t@email.com",
    items: 5,
    total: 256.75,
    status: "pending",
    channel: "WooCommerce",
    date: "2024-01-15T08:45:00",
    shipping: "USPS Priority",
    address: "Av. Apoquindo 7890, Las Condes, Región Metropolitana",
  },
  {
    id: "ORD-7888",
    customer: "Michael Chen",
    email: "m.chen@email.com",
    items: 2,
    total: 175.25,
    status: "delivered",
    channel: "Shopify",
    date: "2024-01-14T16:20:00",
    shipping: "DHL Express",
    address: "Gran Avenida 3210, San Miguel, Región Metropolitana",
  },
  {
    id: "ORD-7887",
    customer: "Sarah Davis",
    email: "sarah.d@email.com",
    items: 4,
    total: 342.00,
    status: "shipped",
    channel: "Amazon",
    date: "2024-01-14T14:55:00",
    shipping: "FedEx Ground",
    address: "Av. Irarrázaval 654, Ñuñoa, Región Metropolitana",
  },
  {
    id: "ORD-7886",
    customer: "Robert Brown",
    email: "r.brown@email.com",
    items: 1,
    total: 59.99,
    status: "cancelled",
    channel: "Direct",
    date: "2024-01-14T12:30:00",
    shipping: "N/A",
    address: "Av. Pajaritos 987, Maipú, Región Metropolitana",
  },
  {
    id: "ORD-7885",
    customer: "Lisa Anderson",
    email: "lisa.a@email.com",
    items: 6,
    total: 489.50,
    status: "processing",
    channel: "Shopify",
    date: "2024-01-14T10:00:00",
    shipping: "UPS Express",
    address: "Matucana 147, Quinta Normal, Región Metropolitana",
  },
  {
    id: "ORD-7884",
    customer: "David Kim",
    email: "d.kim@email.com",
    items: 2,
    total: 134.75,
    status: "delivered",
    channel: "WooCommerce",
    date: "2024-01-13T18:45:00",
    shipping: "USPS Priority",
    address: "Av. Vicuña Mackenna 258, La Florida, Región Metropolitana",
  },
]

const statusConfig = {
  pending: { label: "Pendiente", icon: Clock, className: "bg-warning/10 text-warning" },
  processing: { label: "Procesando", icon: Package, className: "bg-chart-2/10 text-chart-2" },
  shipped: { label: "Enviado", icon: Truck, className: "bg-primary/10 text-primary" },
  delivered: { label: "Entregado", icon: CheckCircle2, className: "bg-success/10 text-success" },
  cancelled: { label: "Cancelado", icon: XCircle, className: "bg-destructive/10 text-destructive" },
}


type OrderStatus = keyof typeof statusConfig

export function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [selectedOrders, setSelectedOrders] = useState<string[]>([])
  const [selectedOrder, setSelectedOrder] = useState<typeof orders[0] | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || order.status === statusFilter
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
      setSelectedOrders(filteredOrders.map((order) => order.id))
    }
  }

  const openOrderDetails = (order: typeof orders[0]) => {
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
          { label: "Todos los Pedidos", value: "2,345", change: "+12.5%" },
          { label: "Pendientes", value: "45", change: "-5.2%" },
          { label: "Procesando", value: "120", change: "+8.1%" },
          { label: "Enviados", value: "456", change: "+15.3%" },
          { label: "Entregados", value: "1,724", change: "+22.4%" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-card border-border">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground">{stat.label}</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                <span className="text-xs text-success">{stat.change}</span>
              </div>
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
                  placeholder="Search orders..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-secondary border-0"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-secondary border-0">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="pending">Pendiente</SelectItem>
                  <SelectItem value="processing">Procesando</SelectItem>
                  <SelectItem value="shipped">Enviado</SelectItem>
                  <SelectItem value="delivered">Entregado</SelectItem>
                  <SelectItem value="cancelled">Cancelado</SelectItem>
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
                <TableHead>Cliente</TableHead>
                <TableHead>Canal</TableHead>
                <TableHead>Articulos</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.map((order) => {
                const status = statusConfig[order.status as OrderStatus]
                const StatusIcon = status.icon
                return (
                  <TableRow
                    key={order.id}
                    className="border-border cursor-pointer"
                    onClick={() => openOrderDetails(order)}
                  >
                    <TableCell onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={selectedOrders.includes(order.id)}
                        onCheckedChange={() => toggleOrderSelection(order.id)}
                      />
                    </TableCell>
                    <TableCell className="font-medium text-foreground">{order.id}</TableCell>
                    <TableCell>
                      <div>
                        <p className="text-foreground">{order.customer}</p>
                        <p className="text-xs text-muted-foreground">{order.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="bg-secondary">
                        {order.channel}
                      </Badge>
                    </TableCell>
                    <TableCell>{order.items}</TableCell>
                    <TableCell className="font-medium">${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className={status.className}>
                        <StatusIcon className="mr-1 h-3 w-3" />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {new Date(order.date).toLocaleDateString()}
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

          {/* Pagination */}
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredOrders.length} de {orders.length} pedidos
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8">
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="h-8 min-w-8">
                1
              </Button>
              <Button variant="ghost" size="sm" className="h-8 min-w-8">
                2
              </Button>
              <Button variant="ghost" size="sm" className="h-8 min-w-8">
                3
              </Button>
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
            <DialogTitle>Pedido {selectedOrder?.id}</DialogTitle>
            <DialogDescription>
              Realizado el {selectedOrder && new Date(selectedOrder.date).toLocaleString()}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <Tabs defaultValue="details" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Detalles</TabsTrigger>
                <TabsTrigger value="items">Artículos</TabsTrigger>
                <TabsTrigger value="history">Historial</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="space-y-4 mt-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Cliente</h4>
                    <p className="text-foreground">{selectedOrder.customer}</p>
                    <p className="text-sm text-muted-foreground">{selectedOrder.email}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Direccion de Envio</h4>
                    <p className="text-foreground">{selectedOrder.address}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Metodo de Envio</h4>
                    <p className="text-foreground">{selectedOrder.shipping}</p>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-muted-foreground">Estado</h4>
                    <Badge variant="secondary" className={statusConfig[selectedOrder.status as OrderStatus].className}>
                      {statusConfig[selectedOrder.status as OrderStatus].label}
                    </Badge>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-2xl font-bold">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </TabsContent>
              <TabsContent value="items" className="mt-4">
                <div className="space-y-3">
                  {Array.from({ length: selectedOrder.items }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg border border-border p-3">
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-lg bg-secondary" />
                        <div>
                          <p className="font-medium">Producto {i + 1}</p>
                          <p className="text-sm text-muted-foreground">SKU-{1000 + i}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${(selectedOrder.total / selectedOrder.items).toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">Qty: 1</p>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="history" className="mt-4">
                <div className="space-y-4">
                  {[
                   { event: "Pedido realizado", time: "10:30", date: "15 Ene" },
                    { event: "Pago confirmado", time: "10:31", date: "15 Ene" },
                    { event: "Procesamiento iniciado", time: "11:00", date: "15 Ene" },
                    { event: "Enviado", time: "14:30", date: "15 Ene" },
                  ].map((event, i) => (
                    <div key={i} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="h-2 w-2 rounded-full bg-primary" />
                        {i < 3 && <div className="h-8 w-px bg-border" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">
                          {event.date} a las {event.time}
                        </p>
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
