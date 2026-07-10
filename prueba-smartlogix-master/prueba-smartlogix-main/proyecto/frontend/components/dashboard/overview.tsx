"use client"

import { useState, useEffect } from "react"
import {
  ArrowUpRight,
  ArrowDownRight,
  Package,
  ShoppingCart,
  Truck,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  Clock,
  CheckCircle2,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { useAuth } from "@/lib/auth-context"

// ─── Tipos que reflejan los DTOs reales del backend ───────────────

interface Order {
  id: number
  email: string
  nombreProducto: string
  cantidad: number
  precioTotal: number
  estado: "PENDIENTE" | "PROCESANDO" | "ENVIADO" | "ENTREGADO" | "CANCELADO"
  canal: string
  createdAt: string
  updatedAt: string
}

interface Producto {
  id: number
  sku: string
  nombre: string
  cantidadEnStock: number
  stockMinimo: number
  precio: number
  almacen: string
  stockBajo: boolean
}

interface Envio {
  id: number
  pedidoId: number
  emailCliente: string
  carrier: string
  numeroSeguimiento: string
  estado: "PREPARANDO" | "DESPACHADO" | "EN_TRANSITO" | "ENTREGADO" | "CANCELADO"
  tipoEnvio: string
  createdAt: string
}

// ─── Config visual de estados de pedido ───────────────────────────

const orderStatusConfig: Record<Order["estado"], { label: string; color: string; badgeClass: string }> = {
  PENDIENTE:  { label: "Pendiente",  color: "oklch(0.75 0.15 85)",  badgeClass: "bg-warning/10 text-warning" },
  PROCESANDO: { label: "Procesando", color: "oklch(0.60 0.15 200)", badgeClass: "bg-chart-2/10 text-chart-2" },
  ENVIADO:    { label: "Enviado",    color: "oklch(0.68 0.18 45)",  badgeClass: "bg-primary/10 text-primary" },
  ENTREGADO:  { label: "Entregado",  color: "oklch(0.65 0.18 150)", badgeClass: "bg-success/10 text-success" },
  CANCELADO:  { label: "Cancelado",  color: "oklch(0.55 0.2 25)",   badgeClass: "bg-destructive/10 text-destructive" },
}

const monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]

export function DashboardOverview() {
  const { token } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [inventory, setInventory] = useState<Producto[]>([])
  const [shipments, setShipments] = useState<Envio[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!token) return

    const headers = { Authorization: `Bearer ${token}` }

    Promise.all([
      fetch("http://localhost:8080/api/orders", { headers }).then((r) => r.json()),
      fetch("http://localhost:8080/api/inventario", { headers }).then((r) => r.json()),
      fetch("http://localhost:8080/api/envios", { headers }).then((r) => r.json()),
    ])
      .then(([ordersData, inventoryData, shipmentsData]) => {
        setOrders(Array.isArray(ordersData) ? ordersData : [])
        setInventory(Array.isArray(inventoryData) ? inventoryData : [])
        setShipments(Array.isArray(shipmentsData) ? shipmentsData : [])
        setLoading(false)
      })
      .catch(() => {
        setError(true)
        setLoading(false)
      })
  }, [token])

  // ─── KPIs ────────────────────────────────────────────────────

  const totalRevenue = orders.reduce((sum, o) => sum + o.precioTotal, 0)
  const totalOrders = orders.length
  const enTransito = shipments.filter((s) => s.estado === "EN_TRANSITO" || s.estado === "DESPACHADO").length
  const totalInventoryUnits = inventory.reduce((sum, p) => sum + p.cantidadEnStock, 0)
  const lowStockItems = inventory.filter((p) => p.stockBajo && p.cantidadEnStock > 0)

  // Comparación mes actual vs mes anterior (con datos reales, no simulados)
  const now = new Date()
  const thisMonthKey = `${now.getFullYear()}-${now.getMonth()}`
  const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const lastMonthKey = `${lastMonthDate.getFullYear()}-${lastMonthDate.getMonth()}`

  const revenueByMonthKey = (key: string) =>
    orders
      .filter((o) => {
        const d = new Date(o.createdAt)
        return `${d.getFullYear()}-${d.getMonth()}` === key
      })
      .reduce((sum, o) => sum + o.precioTotal, 0)

  const ordersByMonthKey = (key: string) =>
    orders.filter((o) => {
      const d = new Date(o.createdAt)
      return `${d.getFullYear()}-${d.getMonth()}` === key
    }).length

  const thisMonthRevenue = revenueByMonthKey(thisMonthKey)
  const lastMonthRevenue = revenueByMonthKey(lastMonthKey)
  const revenueDelta = lastMonthRevenue > 0 ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 : null

  const thisMonthOrders = ordersByMonthKey(thisMonthKey)
  const lastMonthOrders = ordersByMonthKey(lastMonthKey)
  const ordersDelta = lastMonthOrders > 0 ? ((thisMonthOrders - lastMonthOrders) / lastMonthOrders) * 100 : null

  // ─── Gráfico de ingresos (últimos 6 meses, agrupado desde pedidos reales) ───

  const revenueChartData = Array.from({ length: 6 }).map((_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
    const key = `${d.getFullYear()}-${d.getMonth()}`
    return {
      name: monthNames[d.getMonth()],
      revenue: revenueByMonthKey(key),
      orders: ordersByMonthKey(key),
    }
  })

  // ─── Distribución de pedidos por estado ───────────────────────

  const orderStatusData = (Object.keys(orderStatusConfig) as Order["estado"][])
    .map((estado) => ({
      name: orderStatusConfig[estado].label,
      value: orders.filter((o) => o.estado === estado).length,
      color: orderStatusConfig[estado].color,
    }))
    .filter((s) => s.value > 0)

  // ─── Pedidos recientes ─────────────────────────────────────────

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5)

  // ─── Rendimiento por transportista (basado en tasa de entrega real) ───

  const carriers = [...new Set(shipments.map((s) => s.carrier))]
  const carrierPerformance = carriers
    .map((carrier) => {
      const carrierShipments = shipments.filter((s) => s.carrier === carrier)
      const entregados = carrierShipments.filter((s) => s.estado === "ENTREGADO").length
      const tasaEntrega = carrierShipments.length > 0 ? (entregados / carrierShipments.length) * 100 : 0
      return { name: carrier, tasaEntrega: Math.round(tasaEntrega), volume: carrierShipments.length }
    })
    .sort((a, b) => b.volume - a.volume)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">Cargando dashboard...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-24">
        <p className="text-muted-foreground">No se pudo conectar con el servidor. Verifica que el backend esté activo.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido de nuevo. Esto es lo que está pasando con tu logística.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Descargar Reporte</Button>
          <Button>Nuevo Pedido</Button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <DollarSign className="h-6 w-6 text-primary" />
              </div>
              {revenueDelta !== null && (
                <Badge
                  variant="secondary"
                  className={revenueDelta >= 0 ? "bg-success/10 text-success gap-1" : "bg-destructive/10 text-destructive gap-1"}
                >
                  {revenueDelta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(revenueDelta).toFixed(1)}%
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-2xl font-bold text-foreground">
                ${totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {lastMonthRevenue > 0
                ? `${revenueDelta! >= 0 ? "+" : ""}$${(thisMonthRevenue - lastMonthRevenue).toFixed(2)} vs. el mes pasado`
                : "Sin datos del mes pasado para comparar"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <ShoppingCart className="h-6 w-6 text-chart-2" />
              </div>
              {ordersDelta !== null && (
                <Badge
                  variant="secondary"
                  className={ordersDelta >= 0 ? "bg-success/10 text-success gap-1" : "bg-destructive/10 text-destructive gap-1"}
                >
                  {ordersDelta >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {Math.abs(ordersDelta).toFixed(1)}%
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Pedidos Totales</p>
              <p className="text-2xl font-bold text-foreground">{totalOrders.toLocaleString()}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {lastMonthOrders > 0
                ? `${thisMonthOrders - lastMonthOrders >= 0 ? "+" : ""}${thisMonthOrders - lastMonthOrders} vs. el mes pasado`
                : "Sin datos del mes pasado para comparar"}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Truck className="h-6 w-6 text-chart-3" />
              </div>
              <Badge variant="secondary" className="bg-primary/10 text-primary gap-1">
                <Truck className="h-3 w-3" />
                {shipments.length} totales
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">En Tránsito</p>
              <p className="text-2xl font-bold text-foreground">{enTransito}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {shipments.filter((s) => s.estado === "ENTREGADO").length} entregados en total
            </p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <Package className="h-6 w-6 text-chart-4" />
              </div>
              {lowStockItems.length > 0 && (
                <Badge variant="secondary" className="bg-warning/10 text-warning gap-1">
                  <AlertTriangle className="h-3 w-3" />
                  {lowStockItems.length} alertas
                </Badge>
              )}
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Artículos en Inventario</p>
              <p className="text-2xl font-bold text-foreground">{totalInventoryUnits.toLocaleString()}</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {lowStockItems.length > 0
                ? `${lowStockItems.length} artículo(s) con bajo stock`
                : "Todos los artículos con stock saludable"}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Ingresos */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Resumen de Ingresos</CardTitle>
            <CardDescription>Tendencia de los últimos 6 meses (datos reales de pedidos)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueChartData}>
                  <defs>
                    <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                  <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.02 250)",
                      border: "1px solid oklch(0.25 0.02 250)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.68 0.18 45)"
                    strokeWidth={2}
                    fill="url(#revenueGradient)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Distribución del Estado de los Pedidos</CardTitle>
            <CardDescription>Desglose actual de los pedidos por estado</CardDescription>
          </CardHeader>
          <CardContent>
            {orderStatusData.length === 0 ? (
              <p className="py-12 text-center text-muted-foreground">No hay pedidos registrados.</p>
            ) : (
              <>
                <div className="flex items-center justify-center">
                  <div className="h-64 w-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatusData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={90}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {orderStatusData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "oklch(0.16 0.02 250)",
                            border: "1px solid oklch(0.25 0.02 250)",
                            borderRadius: "8px",
                            color: "oklch(0.95 0 0)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4">
                  {orderStatusData.map((status) => (
                    <div key={status.name} className="flex items-center gap-2">
                      <div className="h-3 w-3 rounded-full" style={{ backgroundColor: status.color }} />
                      <span className="text-sm text-muted-foreground">{status.name}</span>
                      <span className="ml-auto text-sm font-medium text-foreground">{status.value}</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Pedidos Recientes + Alertas de Stock */}
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Última actividad de pedidos en todos los canales</CardDescription>
            </div>
            <Button variant="outline" size="sm">Ver Todos</Button>
          </CardHeader>
          <CardContent>
            {recentOrders.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">No hay pedidos recientes.</p>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => {
                  const status = orderStatusConfig[order.estado]
                  return (
                    <div
                      key={order.id}
                      className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                          <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">#{order.id}</p>
                          <p className="text-sm text-muted-foreground">{order.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge variant="secondary" className={status.badgeClass}>
                          {status.label}
                        </Badge>
                        <div className="text-right">
                          <p className="font-medium text-foreground">${order.precioTotal.toFixed(2)}</p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <CardTitle>Alertas de Stock Bajo</CardTitle>
            </div>
            <CardDescription>Artículos que necesitan reabastecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            {lowStockItems.length === 0 ? (
              <p className="py-8 text-center text-muted-foreground">Todo el stock está saludable.</p>
            ) : (
              <div className="space-y-4">
                {lowStockItems.slice(0, 5).map((item) => (
                  <div key={item.sku} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">{item.nombre}</p>
                        <p className="text-xs text-muted-foreground">{item.sku}</p>
                      </div>
                      <span className="text-sm font-medium text-warning">
                        {item.cantidadEnStock}/{item.stockMinimo}
                      </span>
                    </div>
                    <Progress
                      value={item.stockMinimo > 0 ? Math.min((item.cantidadEnStock / item.stockMinimo) * 100, 100) : 0}
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            )}
            <Button variant="outline" className="mt-4 w-full">
              Gestionar Inventario
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Rendimiento de Transportistas */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Rendimiento de Transportistas</CardTitle>
          <CardDescription>Tasa de entrega completada por transportista (envíos reales)</CardDescription>
        </CardHeader>
        <CardContent>
          {carrierPerformance.length === 0 ? (
            <p className="py-8 text-center text-muted-foreground">No hay envíos registrados.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={carrierPerformance} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                  <XAxis type="number" stroke="oklch(0.65 0 0)" fontSize={12} domain={[0, 100]} />
                  <YAxis dataKey="name" type="category" stroke="oklch(0.65 0 0)" fontSize={12} width={60} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.02 250)",
                      border: "1px solid oklch(0.25 0.02 250)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${value}% (${props.payload.volume} envíos)`,
                      "Tasa de Entrega",
                    ]}
                  />
                  <Bar dataKey="tasaEntrega" fill="oklch(0.68 0.18 45)" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}