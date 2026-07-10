"use client"

import { useState } from "react"
import {
  User,
  Building2,
  Bell,
  Shield,
  Plug,
  Key,
  Save,
  Check,
  Plus,
  Settings,
  Trash2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/lib/auth-context"

const integrations = [
  { id: "shopify",     name: "Shopify",     category: "eCommerce",      connected: true  },
  { id: "amazon",      name: "Amazon",      category: "Marketplace",    connected: true  },
  { id: "woocommerce", name: "WooCommerce", category: "eCommerce",      connected: false },
  { id: "fedex",       name: "FedEx",       category: "Transportista",  connected: true  },
  { id: "ups",         name: "UPS",         category: "Transportista",  connected: true  },
  { id: "dhl",         name: "DHL",         category: "Transportista",  connected: false },
  { id: "stripe",      name: "Stripe",      category: "Pagos",          connected: true  },
  { id: "quickbooks",  name: "QuickBooks",  category: "Contabilidad",   connected: false },
  { id: "slack",       name: "Slack",       category: "Comunicación",   connected: true  },
  { id: "zapier",      name: "Zapier",      category: "Automatización", connected: false },
]

const webhooks = [
  { id: "wh-001", name: "Pedido Creado",        url: "https://api.example.com/webhooks/orders",    events: ["order.created"],                          active: true  },
  { id: "wh-002", name: "Actualizaciones Envío", url: "https://api.example.com/webhooks/shipments", events: ["shipment.created", "shipment.delivered"],  active: true  },
  { id: "wh-003", name: "Alertas Inventario",    url: "https://api.example.com/webhooks/inventory", events: ["inventory.low_stock"],                     active: false },
]

const apiKeys = [
  { id: "key-001", name: "Clave API Producción",  key: "sk_live_••••••••••••••••xxxx", created: "2024-01-01", lastUsed: "2024-01-15" },
  { id: "key-002", name: "Clave API Desarrollo",  key: "sk_test_••••••••••••••••yyyy", created: "2024-01-05", lastUsed: "2024-01-14" },
]

// Extrae el email del payload JWT sin librería externa
function decodeEmailFromToken(token: string): string {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]))
    return payload.sub ?? payload.email ?? ""
  } catch {
    return ""
  }
}

export function SettingsPage() {
  const { token, logout } = useAuth()
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    orderAlerts:      true,
    shipmentUpdates:  true,
    inventoryAlerts:  true,
    weeklyReports:    true,
    marketingEmails:  false,
  })

  // Email real del usuario logueado
  const userEmail = token ? decodeEmailFromToken(token) : ""
  const userInitials = userEmail ? userEmail.substring(0, 2).toUpperCase() : "US"

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
        <p className="text-muted-foreground">Gestiona tu cuenta, integraciones y preferencias.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="profile"       className="gap-2"><User       className="h-4 w-4" /><span className="hidden sm:inline">Perfil</span></TabsTrigger>
          <TabsTrigger value="company"       className="gap-2"><Building2  className="h-4 w-4" /><span className="hidden sm:inline">Empresa</span></TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2"><Bell       className="h-4 w-4" /><span className="hidden sm:inline">Notificaciones</span></TabsTrigger>
          <TabsTrigger value="integrations"  className="gap-2"><Plug       className="h-4 w-4" /><span className="hidden sm:inline">Integraciones</span></TabsTrigger>
          <TabsTrigger value="api"           className="gap-2"><Key        className="h-4 w-4" /><span className="hidden sm:inline">API</span></TabsTrigger>
          <TabsTrigger value="security"      className="gap-2"><Shield     className="h-4 w-4" /><span className="hidden sm:inline">Seguridad</span></TabsTrigger>
        </TabsList>

        {/* ── Perfil ─────────────────────────────────────────── */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Información del Perfil</CardTitle>
              <CardDescription>Actualiza tu información personal y preferencias.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Cambiar Avatar</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG o GIF. Máx. 2MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" placeholder="Tu nombre" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" placeholder="Tu apellido" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="email">Correo</Label>
                  {/* Email real del usuario logueado */}
                  <Input id="email" type="email" value={userEmail} readOnly className="bg-secondary" />
                  <p className="text-xs text-muted-foreground">El correo se gestiona desde el sistema de autenticación.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" placeholder="+56 9 XXXX XXXX" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="america">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america">Chile/Santiago (CLT)</SelectItem>
                      <SelectItem value="argentina">Argentina (ART)</SelectItem>
                      <SelectItem value="peru">Perú (PET)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2">
                  <Save className="h-4 w-4" />
                  Guardar Cambios
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Empresa ────────────────────────────────────────── */}
        <TabsContent value="company" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
              <CardDescription>Administra los detalles de tu empresa y su marca.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label>Nombre de la Empresa</Label>
                  <Input defaultValue="SmartLogix eCommerce" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label>Dirección</Label>
                  <Input defaultValue="Av. Providencia 1234" />
                </div>
                <div className="space-y-2">
                  <Label>Ciudad</Label>
                  <Input defaultValue="Providencia" />
                </div>
                <div className="space-y-2">
                  <Label>Región</Label>
                  <Input defaultValue="Región Metropolitana" />
                </div>
                <div className="space-y-2">
                  <Label>Código Postal</Label>
                  <Input defaultValue="7500000" />
                </div>
                <div className="space-y-2">
                  <Label>País</Label>
                  <Select defaultValue="cl">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cl">Chile</SelectItem>
                      <SelectItem value="ar">Argentina</SelectItem>
                      <SelectItem value="pe">Perú</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="flex justify-end">
                <Button className="gap-2"><Save className="h-4 w-4" />Guardar Cambios</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Notificaciones ─────────────────────────────────── */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Elige qué notificaciones deseas recibir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
                { key: "orderAlerts",      label: "Alertas de Pedidos",          desc: "Recibe avisos de nuevos pedidos y actualizaciones" },
                { key: "shipmentUpdates",  label: "Actualizaciones de Envío",    desc: "Rastrea los cambios de estado de los envíos" },
                { key: "inventoryAlerts",  label: "Alertas de Inventario",       desc: "Avisos de stock bajo y sin stock" },
                { key: "weeklyReports",    label: "Reportes Semanales",          desc: "Recibe resúmenes semanales de rendimiento" },
                { key: "marketingEmails",  label: "Correos de Marketing",        desc: "Novedades de productos y promociones" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications(prev => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Integraciones ──────────────────────────────────── */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Integraciones Conectadas</CardTitle>
              <CardDescription>Gestiona tus conexiones con servicios de terceros.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {integrations.map((integration) => (
                  <div key={integration.id} className="flex items-center justify-between rounded-lg border border-border p-4 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary font-bold text-foreground">
                        {integration.name[0]}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{integration.name}</p>
                        <p className="text-xs text-muted-foreground">{integration.category}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {integration.connected ? (
                        <>
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            <Check className="mr-1 h-3 w-3" />Conectado
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm">Conectar</Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── API ────────────────────────────────────────────── */}
        <TabsContent value="api" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Claves API</CardTitle>
                <CardDescription>Gestiona tus claves API para acceso programático.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Crear Clave</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Clave API</DialogTitle>
                    <DialogDescription>Genera una nueva clave API para tu aplicación.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Nombre de la Clave</Label>
                      <Input placeholder="Mi Clave API" />
                    </div>
                    <div className="space-y-2">
                      <Label>Entorno</Label>
                      <Select>
                        <SelectTrigger><SelectValue placeholder="Selecciona entorno" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Producción</SelectItem>
                          <SelectItem value="development">Desarrollo</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Generar Clave</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div key={apiKey.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{apiKey.name}</p>
                      <p className="font-mono text-sm text-muted-foreground">{apiKey.key}</p>
                      <p className="text-xs text-muted-foreground">
                        Creada {apiKey.created} • Último uso {apiKey.lastUsed}
                      </p>
                    </div>
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Configura webhooks para recibir eventos en tiempo real.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2"><Plus className="h-4 w-4" />Agregar Webhook</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Webhook</DialogTitle>
                    <DialogDescription>Configura un nuevo endpoint de webhook.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Nombre</Label>
                      <Input placeholder="Mi Webhook" />
                    </div>
                    <div className="space-y-2">
                      <Label>URL</Label>
                      <Input placeholder="https://api.example.com/webhooks" />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button>Crear Webhook</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {webhooks.map((webhook) => (
                  <div key={webhook.id} className="flex items-center justify-between rounded-lg border border-border p-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{webhook.name}</p>
                        <Badge variant="secondary" className={webhook.active ? "bg-success/10 text-success" : "bg-muted"}>
                          {webhook.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="font-mono text-sm text-muted-foreground">{webhook.url}</p>
                      <div className="flex gap-1 flex-wrap">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="secondary" className="bg-secondary text-xs">{event}</Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch checked={webhook.active} />
                      <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Seguridad ──────────────────────────────────────── */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Contraseña Actual</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Nueva Contraseña</Label>
                <Input type="password" />
              </div>
              <div className="space-y-2">
                <Label>Confirmar Nueva Contraseña</Label>
                <Input type="password" />
              </div>
              <div className="flex justify-end">
                <Button>Actualizar Contraseña</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Autenticación de Dos Factores</CardTitle>
              <CardDescription>Agrega una capa extra de seguridad a tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Activar 2FA</p>
                  <p className="text-sm text-muted-foreground">Usa una app de autenticación para mayor seguridad</p>
                </div>
                <Button variant="outline">Activar</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border border-destructive/50">
            <CardHeader>
              <CardTitle className="text-destructive">Zona de Peligro</CardTitle>
              <CardDescription>Acciones irreversibles para tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Cerrar Sesión</p>
                  <p className="text-sm text-muted-foreground">Cierra tu sesión actual en todos los dispositivos</p>
                </div>
                <Button variant="outline" onClick={logout}>Cerrar Sesión</Button>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Eliminar Cuenta</p>
                  <p className="text-sm text-muted-foreground">Eliminar permanentemente tu cuenta y todos los datos</p>
                </div>
                <Button variant="destructive">Eliminar Cuenta</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}