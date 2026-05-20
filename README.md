SmartLogix — Sistema de Gestión Logística
SmartLogix es una plataforma de gestión logística basada en arquitectura de microservicios. Permite administrar pedidos, inventario, envíos y seguimiento de entregas desde un dashboard web moderno.

Tabla de Contenidos

Arquitectura General
Requisitos Previos
Estructura del Proyecto
Componentes

Frontend
API Gateway (BFF)
ms-auth
ms-orders
ms-inventory
ms-shipping
ms-tracking
ms-notification


Bases de Datos
Variables de Entorno
Ejecución del Proyecto
Endpoints Principales
Patrones de Diseño Utilizados
Estrategia de Branching


Arquitectura General
┌─────────────────────────────────────────────────┐
│                  FRONTEND (Next.js)              │
│                  http://localhost:3000           │
└───────────────────────┬─────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│              API GATEWAY / BFF                   │
│              http://localhost:8080               │
└──┬──────┬──────┬──────┬──────┬──────┬───────────┘
   │      │      │      │      │      │
   ▼      ▼      ▼      ▼      ▼      ▼
ms-auth  ms-    ms-    ms-    ms-    ms-
:8081  orders inventory shipping tracking notification
       :8082   :8083   :8084   :8085   :8086
Todos los microservicios están conectados a bases de datos PostgreSQL independientes y se comunican a través del API Gateway.

Requisitos Previos
HerramientaVersión mínimaUsoNode.js18.xEjecutar el frontendpnpm8.xGestor de paquetes frontendJava JDK17Ejecutar los microserviciosMaven3.8+Compilar los microserviciosPostgreSQL14+Base de datosGit2.xControl de versiones

Estructura del Proyecto
proyecto/
├── frontend/                  # Aplicación Next.js
│   ├── app/                   # Rutas y páginas (App Router)
│   │   ├── dashboard/         # Módulos del dashboard
│   │   │   ├── analytics/
│   │   │   ├── inventory/
│   │   │   ├── orders/
│   │   │   ├── shipments/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx           # Landing page
│   ├── components/
│   │   ├── dashboard/         # Componentes del dashboard
│   │   ├── landing/           # Componentes de la landing
│   │   └── ui/                # Librería de componentes (shadcn/ui)
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
│
├── api-gateway/               # API Gateway / BFF
│   ├── src/
│   └── pom.xml
│
├── microservicios/
│   ├── ms-auth/               # Autenticación y usuarios
│   ├── ms-orders/             # Gestión de pedidos
│   ├── ms-inventory/          # Gestión de inventario
│   ├── ms-shipping/           # Gestión de envíos
│   ├── ms-tracking/           # Seguimiento de entregas
│   └── ms-notification/       # Notificaciones
│
└── docker-compose.yml

Componentes
Frontend (Next.js)
Tecnologías: Next.js 16, React 19, TypeScript, Tailwind CSS v4, shadcn/ui, Recharts
Módulos del dashboard:
RutaDescripción/Landing page pública/dashboardResumen general (Overview)/dashboard/ordersGestión de pedidos/dashboard/inventoryControl de inventario/dashboard/shipmentsSeguimiento de envíos/dashboard/analyticsReportes y analíticas/dashboard/settingsConfiguración del sistema
Instalación y ejecución:
bashcd proyecto/frontend

# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Construir para producción
pnpm build
pnpm start
La aplicación estará disponible en http://localhost:3000.

API Gateway (BFF)
Puerto: 8080
Tecnología: Spring Cloud Gateway
Actúa como Backend For Frontend (BFF), enrutando las peticiones del frontend hacia los microservicios correspondientes y centralizando la autenticación JWT.
Compilación y ejecución:
bashcd proyecto/api-gateway
mvn clean install
mvn spring-boot:run

Microservicio ms-auth
Puerto: 8081
Base de datos: auth_db2 (PostgreSQL)
Tecnología: Spring Boot 3.2.5, Spring Security, JJWT 0.11.5
Gestiona el registro e inicio de sesión de usuarios. Genera tokens JWT firmados con HS256 con expiración de 24 horas.
Endpoints:
MétodoRutaDescripciónAuth requeridaPOST/api/auth/registerRegistrar nuevo usuarioNoPOST/api/auth/loginIniciar sesiónNo
Ejemplo de registro:
jsonPOST /api/auth/register
{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "contrasena": "miPassword123"
}
Ejemplo de login:
jsonPOST /api/auth/login
{
  "email": "juan@ejemplo.com",
  "contrasena": "miPassword123"
}
Respuesta de login:
json{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
Compilación y ejecución:
bashcd proyecto/microservicios/ms-auth
mvn clean install
mvn spring-boot:run

Microservicio ms-orders
Puerto: 8082
Base de datos: orders_db (PostgreSQL)
Tecnología: Spring Boot 4.0.6, Spring Data JPA, Spring Security, JJWT 0.11.5
Gestiona el ciclo de vida completo de los pedidos. Requiere token JWT en el header Authorization: Bearer <token>.
Estados de un pedido:
PENDIENTE → PROCESANDO → ENVIADO → ENTREGADO
                                 → CANCELADO
Canales soportados: SHOPIFY, AMAZON, WOOCOMMERCE
Endpoints:
MétodoRutaDescripciónAuth requeridaPOST/api/ordersCrear nuevo pedidoSíGET/api/ordersListar todos los pedidosSíGET/api/orders/{id}Obtener pedido por IDSíPATCH/api/orders/{id}/statusActualizar estado del pedidoSíDELETE/api/orders/{id}Eliminar pedidoSí
Ejemplo de creación de pedido:
jsonPOST /api/orders
Authorization: Bearer <token>

{
  "email": "cliente@ejemplo.com",
  "nombreProducto": "Laptop Dell XPS 15",
  "cantidad": 1,
  "precioTotal": 1299.99,
  "canal": "SHOPIFY"
}
Compilación y ejecución:
bashcd proyecto/microservicios/ms-orders
mvn clean install
mvn spring-boot:run

Microservicio ms-inventory
Puerto: 8083 (planificado)
Base de datos: inventory_db (PostgreSQL)
Gestiona el stock de productos. (En desarrollo)

Microservicio ms-shipping
Puerto: 8084 (planificado)
Base de datos: shipping_db (PostgreSQL)
Gestiona los envíos asociados a los pedidos. (En desarrollo)

Microservicio ms-tracking
Puerto: 8085 (planificado)
Base de datos: tracking_db (PostgreSQL)
Proporciona seguimiento en tiempo real de entregas. (En desarrollo)

Microservicio ms-notification
Puerto: 8086 (planificado)
Base de datos: notification_db (PostgreSQL)
Envía notificaciones a usuarios ante cambios de estado. (En desarrollo)

Bases de Datos
Crear las siguientes bases de datos en PostgreSQL antes de ejecutar los microservicios:
sqlCREATE DATABASE auth_db2;
CREATE DATABASE orders_db;
CREATE DATABASE inventory_db;
CREATE DATABASE shipping_db;
CREATE DATABASE tracking_db;
CREATE DATABASE notification_db;
Las tablas se crean automáticamente al iniciar cada microservicio (ddl-auto: update).
Credenciales por defecto (desarrollo):
Host:     localhost
Puerto:   5432
Usuario:  postgres
Password: 1234

⚠️ Cambiar las credenciales y el JWT secret en entornos de producción.


Variables de Entorno
Cada microservicio puede sobrescribir su configuración mediante variables de entorno:
VariableDescripciónValor por defectoSPRING_DATASOURCE_URLURL de conexión a PostgreSQLjdbc:postgresql://localhost:5432/SPRING_DATASOURCE_USERNAMEUsuario de PostgreSQLpostgresSPRING_DATASOURCE_PASSWORDContraseña de PostgreSQL1234JWT_SECRETClave secreta para JWTsmartlogix-clave-super-secretaJWT_EXPIRATIONExpiración del token (ms)86400000 (24h)

Ejecución del Proyecto
Orden recomendado de arranque

PostgreSQL (base de datos)
ms-auth (puerto 8081)
ms-orders (puerto 8082)
ms-inventory, ms-shipping, ms-tracking, ms-notification
api-gateway (puerto 8080)
frontend (puerto 3000)

Arranque individual de cada microservicio
bash# Desde la raíz de cada microservicio
mvn clean install -DskipTests
mvn spring-boot:run
Arranque del frontend
bashcd proyecto/frontend
pnpm install
pnpm dev

Endpoints Principales
ServicioBase URLDescripciónFrontendhttp://localhost:3000Interfaz webAPI Gatewayhttp://localhost:8080Punto de entrada únicoms-authhttp://localhost:8081Autenticaciónms-ordershttp://localhost:8082Pedidosms-inventoryhttp://localhost:8083Inventarioms-shippinghttp://localhost:8084Envíosms-trackinghttp://localhost:8085Seguimientoms-notificationhttp://localhost:8086Notificaciones

Patrones de Diseño Utilizados
Backend
PatrónMicroservicioDescripciónRepositoryms-auth, ms-ordersAbstracción de acceso a datos mediante Spring Data JPA (UserRepository, OrderRepository)Builderms-auth, ms-ordersConstrucción de entidades complejas mediante Lombok @Builder (User, Order, OrderResponse)DTOms-auth, ms-ordersSeparación entre objetos de transferencia (LoginRequest, OrderRequest) y entidades de dominioFilter Chainms-ordersFiltro JWT (JwtFilter) integrado en la cadena de seguridad de Spring SecurityBFF (Backend For Frontend)api-gatewayPatrón arquitectónico que adapta las respuestas del backend a las necesidades específicas del frontend
Frontend
PatrónUbicaciónDescripciónCompound Componentcomponents/ui/Componentes reutilizables que comparten estado implícito (shadcn/ui)Custom Hookhooks/Lógica reutilizable encapsulada (use-toast, use-mobile)Layout Componentapp/dashboard/layout.tsxEstructura compartida entre rutas del dashboard

Estrategia de Branching
El proyecto utiliza Git Flow adaptado:
main          → código estable en producción
├── develop   → integración continua de features
│   ├── feature/ms-auth        → desarrollo de autenticación
│   ├── feature/ms-orders      → desarrollo de pedidos
│   ├── feature/frontend-dashboard → desarrollo del dashboard
│   └── feature/api-gateway    → configuración del gateway
└── hotfix/   → correcciones urgentes sobre main
Convención de commits:
feat(ms-orders): agregar endpoint de actualización de estado
fix(ms-auth): corregir validación de token expirado
docs(readme): actualizar instrucciones de instalación
refactor(frontend): extraer componente de tabla reutilizable

Equipo
Proyecto desarrollado para la asignatura DSY1106 — Desarrollo Fullstack III
Evaluación Parcial N°2 — DuocUC
