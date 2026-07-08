"use client"

import { useState } from "react"
import {
  User,
  Building2,
  Bell,
  Shield,
  CreditCard,
  Plug,
  Webhook,
  Key,
  Globe,
  Mail,
  Save,
  Check,
  ExternalLink,
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
import { Textarea } from "@/components/ui/textarea"

// Sample integrations data
const integrations = [
  {
    id: "shopify",
    name: "Shopify",
    description: "Sincroniza pedidos e inventario con tu tienda Shopify",
    category: "eCommerce",
    connected: true,
    lastSync: "2024-01-15T10:30:00",
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Conecta tu cuenta de Amazon Seller",
    category: "Marketplace",
    connected: true,
    lastSync: "2024-01-15T09:15:00",
  },
  {
    id: "woocommerce",
    name: "WooCommerce",
    description: "Integra con tu tienda WooCommerce",
    category: "eCommerce",
    connected: false,
    lastSync: null,
  },
  {
    id: "fedex",
    name: "FedEx",
    description: "Envia con FedEx y rastrea paquetes",
    category: "Transportista",
    connected: true,
    lastSync: "2024-01-15T11:00:00",
  },
  {
    id: "ups",
    name: "UPS",
    description: "Integracion de envios con UPS",
    category: "Transportista",
    connected: true,
    lastSync: "2024-01-15T10:45:00",
  },
  {
    id: "dhl",
    name: "DHL",
    description: "Envios internacionales con DHL",
    category: "Transportista",
    connected: false,
    lastSync: null,
  },
  {
    id: "stripe",
    name: "Stripe",
    description: "Procesa pagos con Stripe",
    category: "Pagos",
    connected: true,
    lastSync: "2024-01-15T10:00:00",
  },
  {
    id: "quickbooks",
    name: "QuickBooks",
    description: "Sincroniza con la contabilidad de QuickBooks",
    category: "Contabilidad",
    connected: false,
    lastSync: null,
  },
  {
    id: "slack",
    name: "Slack",
    description: "Recibe notificaciones en Slack",
    category: "Comunicacion",
    connected: true,
    lastSync: "2024-01-15T08:30:00",
  },
  {
    id: "zapier",
    name: "Zapier",
    description: "Conecta con mas de 5000 apps via Zapier",
    category: "Automatizacion",
    connected: false,
    lastSync: null,
  },
]

const webhooks = [
  {
    id: "wh-001",
    name: "Pedido Creado",
    url: "https://api.example.com/webhooks/orders",
    events: ["order.created"],
    active: true,
  },
  {
    id: "wh-002",
    name: "Actualizaciones de Envio",
    url: "https://api.example.com/webhooks/shipments",
    events: ["shipment.created", "shipment.delivered"],
    active: true,
  },
  {
    id: "wh-003",
    name: "Alertas de Inventario",
    url: "https://api.example.com/webhooks/inventory",
    events: ["inventory.low_stock"],
    active: false,
  },
]

const apiKeys = [
  {
    id: "key-001",
    name: "Clave API de Produccion",
    key: "sk_live_••••••••••••••••xxxx",
    created: "2024-01-01",
    lastUsed: "2024-01-15",
  },
  {
    id: "key-002",
    name: "Clave API de Desarrollo",
    key: "sk_test_••••••••••••••••yyyy",
    created: "2024-01-05",
    lastUsed: "2024-01-14",
  },
]

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile")
  const [notifications, setNotifications] = useState({
    orderAlerts: true,
    shipmentUpdates: true,
    inventoryAlerts: true,
    weeklyReports: true,
    marketingEmails: false,
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Configuracion</h1>
        <p className="text-muted-foreground">Gestiona tu cuenta, integraciones y preferencias.</p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-6 h-auto">
          <TabsTrigger value="profile" className="gap-2">
            <User className="h-4 w-4" />
            <span className="hidden sm:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="company" className="gap-2">
            <Building2 className="h-4 w-4" />
            <span className="hidden sm:inline">Empresa</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="gap-2">
            <Bell className="h-4 w-4" />
            <span className="hidden sm:inline">Notificaciones</span>
          </TabsTrigger>
          <TabsTrigger value="integrations" className="gap-2">
            <Plug className="h-4 w-4" />
            <span className="hidden sm:inline">Integraciones</span>
          </TabsTrigger>
          <TabsTrigger value="api" className="gap-2">
            <Key className="h-4 w-4" />
            <span className="hidden sm:inline">API</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="gap-2">
            <Shield className="h-4 w-4" />
            <span className="hidden sm:inline">Seguridad</span>
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Informacion del Perfil</CardTitle>
              <CardDescription>Actualiza tu informacion personal y preferencias.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-6">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">JD</AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button variant="outline">Cambiar Avatar</Button>
                  <p className="text-xs text-muted-foreground">JPG, PNG or GIF. Max 2MB.</p>
                </div>
              </div>
              <Separator />
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nombre</Label>
                  <Input id="firstName" defaultValue="John" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Apellido</Label>
                  <Input id="lastName" defaultValue="Doe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Correo</Label>
                  <Input id="email" type="email" defaultValue="john.doe@company.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input id="phone" type="tel" defaultValue="+1 (555) 123-4567" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="timezone">Zona Horaria</Label>
                  <Select defaultValue="america">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="america">Chile/Santiago (PST)</SelectItem>
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

        {/* Company Tab */}
        <TabsContent value="company" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Información de la Empresa</CardTitle>
              <CardDescription>Administra los detalles de tu empresa y su marca.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="companyName">Nombre de la Empresa</Label>
                  <Input id="companyName" defaultValue="Acme eCommerce Inc." />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Label htmlFor="address">Dirección</Label>
                  <Input id="address" defaultValue="Av. Providencia 1234" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="city">Ciudad</Label>
                  <Input id="city" defaultValue="Providencia" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state">Estado</Label>
                  <Input id="state" defaultValue="Región Metropolitana" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="zip">Codigo Postal</Label>
                  <Input id="zip" defaultValue="90001" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country">País</Label>
                  <Select defaultValue="cl">
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cl">Chile</SelectItem>
                      <SelectItem value="ar">Argentina</SelectItem>
                      <SelectItem value="pe">Perú</SelectItem>
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

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Preferencias de Notificaciones</CardTitle>
              <CardDescription>Elige que notificaciones deseas recibir.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {[
               { key: "orderAlerts", label: "Alertas de Pedidos", desc: "Recibe avisos de nuevos pedidos y actualizaciones" },
                { key: "shipmentUpdates", label: "Actualizaciones de Envio", desc: "Rastrea los cambios de estado de los envios" },
                { key: "inventoryAlerts", label: "Alertas de Inventario", desc: "Avisos de stock bajo y sin stock" },
                { key: "weeklyReports", label: "Reportes Semanales", desc: "Recibe resumenes semanales de rendimiento" },
                { key: "marketingEmails", label: "Correos de Marketing", desc: "Novedades de productos y promociones" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>{item.label}</Label>
                    <p className="text-sm text-muted-foreground">{item.desc}</p>
                  </div>
                  <Switch
                    checked={notifications[item.key as keyof typeof notifications]}
                    onCheckedChange={(checked) =>
                      setNotifications((prev) => ({ ...prev, [item.key]: checked }))
                    }
                  />
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Integraciones Conectadas</CardTitle>
              <CardDescription>Gestiona tus conexiones con servicios de terceros.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 sm:grid-cols-2">
                {integrations.map((integration) => (
                  <div
                    key={integration.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors hover:bg-secondary/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary text-foreground font-bold">
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
                            <Check className="mr-1 h-3 w-3" />
                            Conectado
                          </Badge>
                          <Button variant="ghost" size="sm">
                            <Settings className="h-4 w-4" />
                          </Button>
                        </>
                      ) : (
                        <Button variant="outline" size="sm">
                          Conectar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API Tab */}
        <TabsContent value="api" className="space-y-6">
          {/* API Keys */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Claves API</CardTitle>
                <CardDescription>Gestiona tus claves API para acceso programatico.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Crear Clave
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Clave API</DialogTitle>
                    <DialogDescription>Genera una nueva clave API para tu aplicacion.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="keyName">Nombre de la Clave</Label>
                      <Input id="keyName" placeholder="Mi Clave API" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="keyEnv">Entorno</Label>
                      <Select>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona entorno" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="production">Produccion</SelectItem>
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
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="space-y-1">
                      <p className="font-medium text-foreground">{apiKey.name}</p>
                      <p className="font-mono text-sm text-muted-foreground">{apiKey.key}</p>
                      <p className="text-xs text-muted-foreground">
                        Creada {apiKey.created} • Ultimo uso {apiKey.lastUsed}
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

          {/* Webhooks */}
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Webhooks</CardTitle>
                <CardDescription>Configura webhooks para recibir eventos en tiempo real.</CardDescription>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button size="sm" className="gap-2">
                    <Plus className="h-4 w-4" />
                    Agregar Webhook
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Crear Webhook</DialogTitle>
                    <DialogDescription>Configura un nuevo endpoint de webhook.</DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="webhookName">Nombre</Label>
                      <Input id="webhookName" placeholder="My Webhook" />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="webhookUrl">URL</Label>
                      <Input id="webhookUrl" placeholder="https://api.example.com/webhooks" />
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
                  <div
                    key={webhook.id}
                    className="flex items-center justify-between rounded-lg border border-border p-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{webhook.name}</p>
                        <Badge variant="secondary" className={webhook.active ? "bg-success/10 text-success" : "bg-muted"}>
                          {webhook.active ? "Activo" : "Inactivo"}
                        </Badge>
                      </div>
                      <p className="font-mono text-sm text-muted-foreground">{webhook.url}</p>
                      <div className="flex gap-1">
                        {webhook.events.map((event) => (
                          <Badge key={event} variant="secondary" className="bg-secondary text-xs">
                            {event}
                          </Badge>
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

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Contraseña</CardTitle>
              <CardDescription>Actualiza tu contraseña para mantener tu cuenta segura.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Contraseña Actual</Label>
                <Input id="currentPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="newPassword">Nueva Contraseña</Label>
                <Input id="newPassword" type="password" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                <Input id="confirmPassword" type="password" />
              </div>
              <div className="flex justify-end">
                <Button>Actualizar Contraseña</Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle>Autenticacion de Dos Factores</CardTitle>
              <CardDescription>Agrega una capa extra de seguridad a tu cuenta.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Activar 2FA</p>
                  <p className="text-sm text-muted-foreground">
                    Usa una app de autenticacion para mayor seguridad
                  </p>
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
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="font-medium text-foreground">Eliminar Cuenta</p>
                  <p className="text-sm text-muted-foreground">
                    Eliminar permanentemente tu cuenta y todos los datos
                  </p>
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
