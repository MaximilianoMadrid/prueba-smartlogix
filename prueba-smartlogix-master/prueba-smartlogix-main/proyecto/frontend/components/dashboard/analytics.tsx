"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  Download,
  Calendar,
  DollarSign,
  ShoppingCart,
  Package,
  Truck,
  Users,
  Clock,
  Target,
} from "lucide-react"
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
  Legend,
} from "recharts"

// Sample data for analytics
const revenueData = [
  { name: "Ene", revenue: 45000, orders: 420, profit: 12500 },
  { name: "Feb", revenue: 38000, orders: 380, profit: 10200 },
  { name: "Mar", revenue: 52000, orders: 510, profit: 15800 },
  { name: "Abr", revenue: 48000, orders: 465, profit: 13900 },
  { name: "May", revenue: 61000, orders: 590, profit: 18200 },
  { name: "Jun", revenue: 55000, orders: 545, profit: 16500 },
  { name: "Jul", revenue: 72000, orders: 695, profit: 22400 },
]

const channelData = [
  { name: "Shopify", value: 45, color: "oklch(0.68 0.18 45)" },
  { name: "Amazon", value: 30, color: "oklch(0.60 0.15 200)" },
  { name: "WooCommerce", value: 15, color: "oklch(0.65 0.18 150)" },
  { name: "Direct", value: 10, color: "oklch(0.75 0.15 85)" },
]

const fulfillmentData = [
  { day: "Lun", sameDay: 45, nextDay: 120, standard: 85 },
  { day: "Mar", sameDay: 52, nextDay: 135, standard: 92 },
  { day: "Mie", sameDay: 48, nextDay: 128, standard: 88 },
  { day: "Jue", sameDay: 61, nextDay: 142, standard: 95 },
  { day: "Vie", sameDay: 55, nextDay: 138, standard: 90 },
  { day: "Sab", sameDay: 38, nextDay: 95, standard: 65 },
  { day: "Dom", sameDay: 28, nextDay: 72, standard: 48 },
]

const topProducts = [
  { name: "Audifonos Inalambricos Pro", sales: 1245, revenue: 99480, growth: 15.2 },
  { name: "Cable de Carga USB-C", sales: 2890, revenue: 43350, growth: 8.5 },
  { name: "Altavoz Bluetooth Mini", sales: 856, revenue: 42757, growth: 22.1 },
  { name: "Correa para Smartwatch", sales: 1542, revenue: 38537, growth: -3.2 },
  { name: "Soporte de Laptop Aluminio", sales: 423, revenue: 29600, growth: 31.5 },
]

const carrierMetrics = [
  { carrier: "FedEx", onTime: 94, volume: 1250, cost: 8.50 },
  { carrier: "UPS", onTime: 91, volume: 980, cost: 9.20 },
  { carrier: "DHL", onTime: 88, volume: 750, cost: 12.80 },
  { carrier: "USPS", onTime: 85, volume: 420, cost: 5.90 },
]

export function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Analiticas</h1>
          <p className="text-muted-foreground">Rastrea metricas de rendimiento e informacion del negocio.</p>
        </div>
        <div className="flex items-center gap-3">
          <Select defaultValue="30d">
            <SelectTrigger className="w-40">
              <Calendar className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Ultimos 7 dias</SelectItem>
              <SelectItem value="30d">Ultimos 30 dias</SelectItem>
              <SelectItem value="90d">Ultimos 90 dias</SelectItem>
              <SelectItem value="1y">Ultimo ano</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
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
                18.2%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="text-2xl font-bold text-foreground">$371,000</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">vs $313,800 periodo anterior</p>
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
                12.5%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Pedidos Totales</p>
              <p className="text-2xl font-bold text-foreground">3,605</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">vs 3,204 periodo anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-3/10">
                <Target className="h-6 w-6 text-chart-3" />
              </div>
              <Badge variant="secondary" className="bg-success/10 text-success gap-1">
                <ArrowUpRight className="h-3 w-3" />
                5.4%
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Tasa de Conversion</p>
              <p className="text-2xl font-bold text-foreground">3.2%</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">vs 3.04% periodo anterior</p>
          </CardContent>
        </Card>

        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-4/10">
                <Clock className="h-6 w-6 text-chart-4" />
              </div>
              <Badge variant="secondary" className="bg-destructive/10 text-destructive gap-1">
                <TrendingDown className="h-3 w-3" />
                -0.3 days
              </Badge>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Tiempo Promedio de Cumplimiento</p>
              <p className="text-2xl font-bold text-foreground">1.8 days</p>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">vs 2.1 dias periodo anterior</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Chart */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Ingresos y Tendencia de Pedidos</CardTitle>
            <CardDescription>Ingresos y volumen de pedidos mensuales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="ordersGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="oklch(0.60 0.15 200)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="oklch(0.60 0.15 200)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                  <XAxis dataKey="name" stroke="oklch(0.65 0 0)" fontSize={12} />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} yAxisId="left" />
                  <YAxis stroke="oklch(0.65 0 0)" fontSize={12} yAxisId="right" orientation="right" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "oklch(0.16 0.02 250)",
                      border: "1px solid oklch(0.25 0.02 250)",
                      borderRadius: "8px",
                      color: "oklch(0.95 0 0)",
                    }}
                    formatter={(value: number, name: string) => [
                      name === "revenue" ? `$${value.toLocaleString()}` : value,
                      name === "revenue" ? "Revenue" : "Orders"
                    ]}
                  />
                  <Area
                    type="monotone"
                    dataKey="revenue"
                    stroke="oklch(0.68 0.18 45)"
                    strokeWidth={2}
                    fill="url(#revenueGrad)"
                    yAxisId="left"
                  />
                  <Area
                    type="monotone"
                    dataKey="orders"
                    stroke="oklch(0.60 0.15 200)"
                    strokeWidth={2}
                    fill="url(#ordersGrad)"
                    yAxisId="right"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Channel Distribution */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Ventas por Canal</CardTitle>
            <CardDescription>Distribucion de pedidos entre canales de venta</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center">
              <div className="h-64 w-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={4}
                      dataKey="value"
                    >
                      {channelData.map((entry, index) => (
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
                      formatter={(value: number) => [`${value}%`, "Share"]}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4">
              {channelData.map((channel) => (
                <div key={channel.name} className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full" style={{ backgroundColor: channel.color }} />
                  <span className="text-sm text-muted-foreground">{channel.name}</span>
                  <span className="ml-auto text-sm font-medium text-foreground">{channel.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fulfillment Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Cumplimiento por Velocidad de Envío</CardTitle>
          <CardDescription> Pedidos diarios por método de envío</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fulfillmentData}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                <XAxis dataKey="day" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.16 0.02 250)",
                    border: "1px solid oklch(0.25 0.02 250)",
                    borderRadius: "8px",
                    color: "oklch(0.95 0 0)",
                  }}
                />
                <Bar dataKey="sameDay" stackId="a" fill="oklch(0.68 0.18 45)" name="Same Day" radius={[0, 0, 0, 0]} />
                <Bar dataKey="nextDay" stackId="a" fill="oklch(0.60 0.15 200)" name="Next Day" radius={[0, 0, 0, 0]} />
                <Bar dataKey="standard" stackId="a" fill="oklch(0.65 0.18 150)" name="Standard" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Tables Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Products */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Productos Destacados</CardTitle>
            <CardDescription>Productos mas vendidos por ingresos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProducts.map((product, index) => (
                <div key={product.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-secondary text-sm font-bold text-muted-foreground">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">{product.sales.toLocaleString()} units</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-foreground">${product.revenue.toLocaleString()}</p>
                    <Badge 
                      variant="secondary" 
                      className={product.growth >= 0 ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"}
                    >
                      {product.growth >= 0 ? "+" : ""}{product.growth}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Carrier Performance */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle>Rendimiento de Transportistas</CardTitle>
            <CardDescription>Métricas de entrega a tiempo y costos</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {carrierMetrics.map((carrier) => (
                <div key={carrier.carrier} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-bold text-muted-foreground">
                      {carrier.carrier[0]}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{carrier.carrier}</p>
                      <p className="text-xs text-muted-foreground">{carrier.volume.toLocaleString()} envíos</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">{carrier.onTime}%</p>
                      <p className="text-xs text-muted-foreground">A tiempo</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-foreground">${carrier.cost}</p>
                      <p className="text-xs text-muted-foreground">Costo promedio</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
