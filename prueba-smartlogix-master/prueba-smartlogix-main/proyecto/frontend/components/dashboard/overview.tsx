"use client"

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
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  PieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data
const revenueData = [
  { name: "Jan", revenue: 4000, orders: 240 },
  { name: "Feb", revenue: 3000, orders: 198 },
  { name: "Mar", revenue: 5000, orders: 305 },
  { name: "Apr", revenue: 4500, orders: 278 },
  { name: "May", revenue: 6000, orders: 390 },
  { name: "Jun", revenue: 5500, orders: 351 },
  { name: "Jul", revenue: 7000, orders: 445 },
]

const orderStatusData = [
  { name: "Pending", value: 45, color: "oklch(0.75 0.15 85)" },
  { name: "Processing", value: 120, color: "oklch(0.60 0.15 200)" },
  { name: "Shipped", value: 85, color: "oklch(0.68 0.18 45)" },
  { name: "Delivered", value: 230, color: "oklch(0.65 0.18 150)" },
]

const recentOrders = [
  { id: "ORD-7891", customer: "Maria Garcia", status: "shipped", total: "$128.50", date: "2 min ago" },
  { id: "ORD-7890", customer: "James Wilson", status: "processing", total: "$89.00", date: "15 min ago" },
  { id: "ORD-7889", customer: "Emma Thompson", status: "pending", total: "$256.75", date: "32 min ago" },
  { id: "ORD-7888", customer: "Michael Chen", status: "delivered", total: "$175.25", date: "1 hour ago" },
  { id: "ORD-7887", customer: "Sarah Davis", status: "shipped", total: "$342.00", date: "2 hours ago" },
]

const lowStockItems = [
  { sku: "SKU-4521", name: "Audifonos Inalambricos Pro", stock: 12, threshold: 50 },
  { sku: "SKU-3892", name: "Cable de Carga USB-C", stock: 28, threshold: 100 },
  { sku: "SKU-2156", name: "Funda de Telefono Premium", stock: 8, threshold: 30 },
]

const carrierPerformance = [
  { name: "FedEx", onTime: 94, volume: 1250 },
  { name: "UPS", onTime: 91, volume: 980 },
  { name: "DHL", onTime: 88, volume: 750 },
  { name: "USPS", onTime: 85, volume: 420 },
]

const statusLabels: Record<string, string> = {
  delivered: "Entregado",
  shipped: "Enviado",
  processing: "Procesando",
  pending: "Pendiente",
}

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Bienvenido de nuevo. Esto es lo que esta pasando con tu logistica.</p>
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
              <Badge variant="secondary" className="bg-success/10 text-success gap-1">
                <ArrowUpRight className="h-3 w-3" />
                12.5%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-2xl font-bold text-foreground">$45,231.89</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">+$5,234.00 vs. el mes pasado</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <ShoppingCart className="h-6 w-6 text-chart-2" />
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success gap-1">
                <ArrowUpRight className="h-3 w-3" />
                8.2%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Pedidos Totales</p>
              <p className="text-2xl font-bold text-foreground">2,345</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">+180 vs. el mes pasado</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Truck className="h-6 w-6 text-chart-3" />
              </div>
              <Badge variant="secondary" className="bg-destructive/10 text-destructive gap-1">
                <ArrowDownRight className="h-3 w-3" />
                2.1%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">En Tránsito</p>
              <p className="text-2xl font-bold text-foreground">456</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">-12 vs. ayer</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <Package className="h-6 w-6 text-chart-4" />
              </div>
              <Badge variant="secondary" className="bg-warning/10 text-warning gap-1">
                <AlertTriangle className="h-3 w-3" />
                3 alerts
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Artículos en Inventario</p>
              <p className="text-2xl font-bold text-foreground">12,543</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">3 artículos con bajo stock</p>
          </CardContent>
        </Card>
      </div>

      {/* Resumen de Ingresos */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Resumen de Ingresos</CardTitle>
            <CardDescription>Tendencias mensuales de ingresos y pedidos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
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

        {/* Distribución del Estado de los Pedidos */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Distribución del Estado de los Pedidos</CardTitle>
            <CardDescription>Desglose actual de los pedidos por estado</CardDescription>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
      </div>

      {/* Pedidos Recientes */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="bg-card border-border lg:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Pedidos Recientes</CardTitle>
              <CardDescription>Ultima actividad de pedidos en todos los canales</CardDescription>
            </div>
            <Button variant="outline" size="sm">Ver Todos</Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
                      <ShoppingCart className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{order.id}</p>
                      <p className="text-sm text-muted-foreground">{order.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge
                      variant="secondary"
                      className={
                        order.status === "delivered"
                          ? "bg-success/10 text-success"
                          : order.status === "shipped"
                          ? "bg-primary/10 text-primary"
                          : order.status === "processing"
                          ? "bg-chart-2/10 text-chart-2"
                          : "bg-warning/10 text-warning"
                      }
                    >
                      {order.status}
                    </Badge>
                    <div className="text-right">
                      <p className="font-medium text-foreground">{order.total}</p>
                      <p className="text-xs text-muted-foreground">{order.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas de Stock Bajo */}
        <Card className="bg-card border-border">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <CardTitle>Alertas de Stock Bajo</CardTitle>
            </div>
            <CardDescription>Artículos que necesitan reabastecimiento</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {lowStockItems.map((item) => (
                <div key={item.sku} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.name}</p>
                      <p className="text-xs text-muted-foreground">{item.sku}</p>
                    </div>
                    <span className="text-sm font-medium text-warning">
                      {item.stock}/{item.threshold}
                    </span>
                  </div>
                  <Progress value={(item.stock / item.threshold) * 100} className="h-2" />
                </div>
              ))}
            </div>
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
          <CardDescription>Tipos de entrega a tiempo por transportista</CardDescription>
        </CardHeader>
        <CardContent>
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
                  formatter={(value: number) => [`${value}%`, "Tasa de Entrega a Tiempo"]}
                />
                <Bar dataKey="onTime" fill="oklch(0.68 0.18 45)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
