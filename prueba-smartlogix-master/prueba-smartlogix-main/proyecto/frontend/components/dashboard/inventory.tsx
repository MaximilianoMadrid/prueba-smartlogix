"use client"

import { useState, useEffect } from "react"
import {
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  AlertTriangle,
  Package,
  TrendingUp,
  TrendingDown,
  BarChart3,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Warehouse,
  RefreshCcw,
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
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts"
import { useAuth } from "@/lib/auth-context"

const stockHistoryData = [
  { date: "Lun", stock: 1250 },
  { date: "Mar", stock: 1180 },
  { date: "Mie", stock: 1320 },
  { date: "Jue", stock: 1290 },
  { date: "Vie", stock: 1150 },
  { date: "Sab", stock: 1080 },
  { date: "Dom", stock: 1200 },
]

// Mapeo de estado real basado en stockBajo del backend
const getStatusConfig = (stockBajo: boolean, cantidadEnStock: number) => {
  if (cantidadEnStock === 0) return { label: "Sin Stock",   className: "bg-muted text-muted-foreground",          key: "out" }
  if (stockBajo)             return { label: "Stock Bajo",  className: "bg-warning/10 text-warning",              key: "low" }
  return                            { label: "Saludable",   className: "bg-success/10 text-success",              key: "healthy" }
}

interface Producto {
  id: number
  sku: string
  nombre: string
  descripcion: string
  categoria: string
  cantidadEnStock: number
  stockMinimo: number
  precio: number
  almacen: string
  stockBajo: boolean
  createdAt: string
  updatedAt: string
}

interface NuevoProducto {
  sku: string
  nombre: string
  descripcion: string
  categoria: string
  cantidadEnStock: number
  stockMinimo: number
  precio: number
  almacen: string
}

export function InventoryPage() {
  const { token } = useAuth()
  const [inventoryItems, setInventoryItems] = useState<Producto[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [addItemOpen, setAddItemOpen] = useState(false)
  const [nuevoProducto, setNuevoProducto] = useState<NuevoProducto>({
    sku: "", nombre: "", descripcion: "", categoria: "",
    cantidadEnStock: 0, stockMinimo: 0, precio: 0, almacen: ""
  })

  const fetchInventory = () => {
    if (!token) return
    fetch('http://localhost:8080/api/inventario', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => {
        setInventoryItems(Array.isArray(data) ? data : [])
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  useEffect(() => {
    fetchInventory()
  }, [token])

  const handleAgregarProducto = async () => {
    if (!token) return
    try {
      const res = await fetch('http://localhost:8080/api/inventario', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(nuevoProducto),
      })
      if (res.ok) {
        setAddItemOpen(false)
        setNuevoProducto({ sku: "", nombre: "", descripcion: "", categoria: "", cantidadEnStock: 0, stockMinimo: 0, precio: 0, almacen: "" })
        fetchInventory()
      }
    } catch (err) {
      console.error('Error al agregar producto:', err)
    }
  }

  const categories = [...new Set(inventoryItems.map((item) => item.categoria))]

  const filteredItems = inventoryItems.filter((item) => {
    const status = getStatusConfig(item.stockBajo, item.cantidadEnStock)
    const matchesSearch =
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.nombre.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || status.key === statusFilter
    const matchesCategory = categoryFilter === "all" || item.categoria === categoryFilter
    return matchesSearch && matchesStatus && matchesCategory
  })

  const toggleItemSelection = (itemId: string) => {
    setSelectedItems((prev) =>
      prev.includes(itemId) ? prev.filter((id) => id !== itemId) : [...prev, itemId]
    )
  }

  const toggleAllItems = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map((item) => String(item.id)))
    }
  }

  const totalValue = inventoryItems.reduce((sum, item) => sum + item.cantidadEnStock * item.precio, 0)
  const totalItems = inventoryItems.reduce((sum, item) => sum + item.cantidadEnStock, 0)
  const lowStockCount = inventoryItems.filter((item) => item.stockBajo && item.cantidadEnStock > 0).length
  const outOfStockCount = inventoryItems.filter((item) => item.cantidadEnStock === 0).length

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Inventario</h1>
          <p className="text-muted-foreground">Rastrea y gestiona el inventario de tus productos en todos los almacenes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <Button variant="outline" className="gap-2" onClick={fetchInventory}>
            <RefreshCcw className="h-4 w-4" />
            Sincronizar
          </Button>
          <Dialog open={addItemOpen} onOpenChange={setAddItemOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Agregar Artículo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Agregar Artículo al Inventario</DialogTitle>
                <DialogDescription>Agrega un nuevo producto a tu inventario.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label>SKU</Label>
                  <Input placeholder="SKU-XXXX" value={nuevoProducto.sku}
                    onChange={e => setNuevoProducto(p => ({ ...p, sku: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Nombre del Producto</Label>
                  <Input placeholder="Nombre del producto" value={nuevoProducto.nombre}
                    onChange={e => setNuevoProducto(p => ({ ...p, nombre: e.target.value }))} />
                </div>
                <div className="grid gap-2">
                  <Label>Descripción</Label>
                  <Input placeholder="Descripción del producto" value={nuevoProducto.descripcion}
                    onChange={e => setNuevoProducto(p => ({ ...p, descripcion: e.target.value }))} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label>Categoría</Label>
                    <Select onValueChange={val => setNuevoProducto(p => ({ ...p, categoria: val }))}>
                      <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ELECTRONICA">Electrónica</SelectItem>
                        <SelectItem value="ROPA">Ropa</SelectItem>
                        <SelectItem value="ALIMENTOS">Alimentos</SelectItem>
                        <SelectItem value="HOGAR">Hogar</SelectItem>
                        <SelectItem value="DEPORTES">Deportes</SelectItem>
                        <SelectItem value="JUGUETES">Juguetes</SelectItem>
                        <SelectItem value="OTROS">Otros</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label>Almacén</Label>
                    <Select onValueChange={val => setNuevoProducto(p => ({ ...p, almacen: val }))}>
                      <SelectTrigger><SelectValue placeholder="Selecciona almacén" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Bodega Principal">Bodega Principal</SelectItem>
                        <SelectItem value="Bodega Norte">Bodega Norte</SelectItem>
                        <SelectItem value="Bodega Sur">Bodega Sur</SelectItem>
                        <SelectItem value="Bodega Centro">Bodega Centro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label>Stock Inicial</Label>
                    <Input type="number" placeholder="0"
                      onChange={e => setNuevoProducto(p => ({ ...p, cantidadEnStock: Number(e.target.value) }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Precio</Label>
                    <Input type="number" placeholder="0.00"
                      onChange={e => setNuevoProducto(p => ({ ...p, precio: Number(e.target.value) }))} />
                  </div>
                  <div className="grid gap-2">
                    <Label>Stock Mínimo</Label>
                    <Input type="number" placeholder="10"
                      onChange={e => setNuevoProducto(p => ({ ...p, stockMinimo: Number(e.target.value) }))} />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setAddItemOpen(false)}>Cancelar</Button>
                <Button onClick={handleAgregarProducto}>Agregar Artículo</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Artículos Totales</p>
              <p className="text-2xl font-bold text-foreground">{totalItems.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-chart-2/10">
                <BarChart3 className="h-6 w-6 text-chart-2" />
              </div>
              <TrendingUp className="h-4 w-4 text-success" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Valor Total</p>
              <p className="text-2xl font-bold text-foreground">${totalValue.toLocaleString()}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-warning/10">
                <AlertTriangle className="h-6 w-6 text-warning" />
              </div>
              <TrendingDown className="h-4 w-4 text-warning" />
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Stock Bajo</p>
              <p className="text-2xl font-bold text-foreground">{lowStockCount}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-destructive/10">
                <Warehouse className="h-6 w-6 text-destructive" />
              </div>
            </div>
            <div className="mt-4">
              <p className="text-sm text-muted-foreground">Fuera de Stock</p>
              <p className="text-2xl font-bold text-foreground">{outOfStockCount}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Stock Trend Chart */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Tendencia de Nivel de Stock</CardTitle>
          <CardDescription>Niveles totales de inventario durante la última semana</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stockHistoryData}>
                <defs>
                  <linearGradient id="stockGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="oklch(0.68 0.18 45)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.25 0.02 250)" />
                <XAxis dataKey="date" stroke="oklch(0.65 0 0)" fontSize={12} />
                <YAxis stroke="oklch(0.65 0 0)" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "oklch(0.16 0.02 250)", border: "1px solid oklch(0.25 0.02 250)", borderRadius: "8px", color: "oklch(0.95 0 0)" }} />
                <Area type="monotone" dataKey="stock" stroke="oklch(0.68 0.18 45)" strokeWidth={2} fill="url(#stockGradient)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Buscar inventario..." value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)} className="pl-10 bg-secondary border-0" />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-secondary border-0">
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los Estados</SelectItem>
                  <SelectItem value="healthy">Saludable</SelectItem>
                  <SelectItem value="low">Stock Bajo</SelectItem>
                  <SelectItem value="out">Sin Stock</SelectItem>
                </SelectContent>
              </Select>
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40 bg-secondary border-0">
                  <SelectValue placeholder="Categoría" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todas las Categorías</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" size="icon"><Filter className="h-4 w-4" /></Button>
            </div>
            {selectedItems.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{selectedItems.length} seleccionados</span>
                <Button variant="outline" size="sm">Actualizar en Lote</Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="bg-card border-border">
        <CardContent className="p-0">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">Cargando inventario...</p>
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-muted-foreground">No hay productos registrados.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-border hover:bg-transparent">
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredItems.length && filteredItems.length > 0}
                      onCheckedChange={toggleAllItems}
                    />
                  </TableHead>
                  <TableHead>
                    <Button variant="ghost" className="h-8 gap-1 -ml-3 font-medium">
                      Producto <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>Categoría</TableHead>
                  <TableHead>Almacén</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Mínimo</TableHead>
                  <TableHead className="text-right">Precio</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredItems.map((item) => {
                  const status = getStatusConfig(item.stockBajo, item.cantidadEnStock)
                  const stockPercentage = item.stockMinimo > 0
                    ? (item.cantidadEnStock / item.stockMinimo) * 100
                    : 100
                  return (
                    <TableRow key={item.id} className="border-border">
                      <TableCell>
                        <Checkbox
                          checked={selectedItems.includes(String(item.id))}
                          onCheckedChange={() => toggleItemSelection(String(item.id))}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-lg bg-secondary flex items-center justify-center">
                            <Package className="h-5 w-5 text-muted-foreground" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">{item.nombre}</p>
                            <p className="text-xs text-muted-foreground">{item.sku}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="bg-secondary">{item.categoria}</Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">{item.almacen}</TableCell>
                      <TableCell className="text-right">
                        <div className="space-y-1">
                          <p className="font-medium">{item.cantidadEnStock}</p>
                          <Progress value={Math.min(stockPercentage, 100)} className="h-1 w-16 ml-auto" />
                        </div>
                      </TableCell>
                      <TableCell className="text-right text-muted-foreground">{item.stockMinimo}</TableCell>
                      <TableCell className="text-right font-medium">${item.precio.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant="secondary" className={status.className}>{status.label}</Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>
                              <Edit className="mr-2 h-4 w-4" />Editar Artículo
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <RefreshCcw className="mr-2 h-4 w-4" />Ajustar Stock
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="text-destructive">
                              <Trash2 className="mr-2 h-4 w-4" />Eliminar Artículo
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
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-sm text-muted-foreground">
              Mostrando {filteredItems.length} de {inventoryItems.length} artículos
            </p>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="icon" className="h-8 w-8"><ChevronLeft className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="h-8 min-w-8">1</Button>
              <Button variant="outline" size="icon" className="h-8 w-8"><ChevronRight className="h-4 w-4" /></Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}