SmartLogix — Sistema de Gestión Logística

SmartLogix es una plataforma de gestión logística basada en arquitectura de microservicios. Permite administrar pedidos, inventario, envíos y seguimiento de entregas desde un dashboard web moderno.

📑 Tabla de Contenidos
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
Equipo
🏗 Arquitectura General
┌─────────────────────────────────────────────────┐
│              FRONTEND (Next.js)                │
│             http://localhost:3000              │
└───────────────────────┬────────────────────────┘
                        │
                        ▼
┌─────────────────────────────────────────────────┐
│               API GATEWAY / BFF                │
│              http://localhost:8080             │
└──┬────────┬────────┬────────┬────────┬─────────┘
   │        │        │        │        │
   ▼        ▼        ▼        ▼        ▼
 ms-auth  ms-orders  ms-     ms-      ms-
  :8081     :8082   inventory shipping tracking
                      :8083    :8084    :8085

                         ▼
                    ms-notification
                         :8086

Todos los microservicios están conectados a bases de datos PostgreSQL independientes y se comunican a través del API Gateway.

⚙ Requisitos Previos
Herramienta	Versión mínima	Uso
Node.js	18.x	Ejecutar frontend
pnpm	8.x	Gestor de paquetes frontend
Java JDK	17	Ejecutar microservicios
Maven	3.8+	Compilar microservicios
PostgreSQL	14+	Base de datos
Git	2.x	Control de versiones
📂 Estructura del Proyecto
proyecto/
├── frontend/                  # Aplicación Next.js
│   ├── app/
│   │   ├── dashboard/
│   │   │   ├── analytics/
│   │   │   ├── inventory/
│   │   │   ├── orders/
│   │   │   ├── shipments/
│   │   │   └── settings/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   │
│   ├── components/
│   │   ├── dashboard/
│   │   ├── landing/
│   │   └── ui/
│   │
│   ├── hooks/
│   ├── lib/
│   ├── public/
│   ├── package.json
│   └── next.config.mjs
│
├── api-gateway/
│   ├── src/
│   └── pom.xml
│
├── microservicios/
│   ├── ms-auth/
│   ├── ms-orders/
│   ├── ms-inventory/
│   ├── ms-shipping/
│   ├── ms-tracking/
│   └── ms-notification/
│
└── docker-compose.yml
🧩 Componentes
Frontend (Next.js)
Tecnologías utilizadas
Next.js 16
React 19
TypeScript
Tailwind CSS v4
shadcn/ui
Recharts
Módulos del Dashboard
Ruta	Descripción
/	Landing page pública
/dashboard	Resumen general
/dashboard/orders	Gestión de pedidos
/dashboard/inventory	Control de inventario
/dashboard/shipments	Seguimiento de envíos
/dashboard/analytics	Reportes y analíticas
/dashboard/settings	Configuración del sistema
Instalación y ejecución
cd proyecto/frontend

# Instalar dependencias
pnpm install

# Modo desarrollo
pnpm dev

# Construir para producción
pnpm build
pnpm start

Frontend disponible en:

http://localhost:3000
API Gateway (BFF)
Información General
Característica	Valor
Puerto	8080
Tecnología	Spring Cloud Gateway
Patrón	Backend For Frontend (BFF)
Funcionalidades
Enrutamiento centralizado
Validación JWT
Proxy hacia microservicios
Punto único de entrada
Ejecución
cd proyecto/api-gateway

mvn clean install
mvn spring-boot:run
🔐 Microservicio ms-auth
Característica	Valor
Puerto	8081
Base de datos	auth_db2
Tecnología	Spring Boot 3.2.5
Seguridad	Spring Security + JWT

Gestiona el registro e inicio de sesión de usuarios.

Endpoints
Método	Ruta	Descripción	Auth
POST	/api/auth/register	Registrar usuario	❌
POST	/api/auth/login	Iniciar sesión	❌
Ejemplo de registro
POST /api/auth/register

{
  "nombre": "Juan Pérez",
  "email": "juan@ejemplo.com",
  "contrasena": "miPassword123"
}
Ejemplo de login
POST /api/auth/login

{
  "email": "juan@ejemplo.com",
  "contrasena": "miPassword123"
}
Respuesta
{
  "token": "eyJhbGciOiJIUzI1NiJ9..."
}
Ejecución
cd proyecto/microservicios/ms-auth

mvn clean install
mvn spring-boot:run
📦 Microservicio ms-orders
Característica	Valor
Puerto	8082
Base de datos	orders_db
Tecnología	Spring Boot 4.0.6
Seguridad	JWT

Gestiona el ciclo de vida de los pedidos.

Estados del pedido
PENDIENTE → PROCESANDO → ENVIADO → ENTREGADO
                               ↘ CANCELADO
Canales soportados
SHOPIFY
AMAZON
WOOCOMMERCE
Endpoints
Método	Ruta	Descripción	Auth
POST	/api/orders	Crear pedido	✅
GET	/api/orders	Listar pedidos	✅
GET	/api/orders/{id}	Obtener pedido	✅
PATCH	/api/orders/{id}/status	Actualizar estado	✅
DELETE	/api/orders/{id}	Eliminar pedido	✅
Ejemplo de creación de pedido
POST /api/orders
Authorization: Bearer <token>

{
  "email": "cliente@ejemplo.com",
  "nombreProducto": "Laptop Dell XPS 15",
  "cantidad": 1,
  "precioTotal": 1299.99,
  "canal": "SHOPIFY"
}
Ejecución
cd proyecto/microservicios/ms-orders

mvn clean install
mvn spring-boot:run
📦 Microservicio ms-inventory
Característica	Valor
Puerto	8083
Base de datos	inventory_db
Estado	En desarrollo

Gestiona el stock de productos.

🚚 Microservicio ms-shipping
Característica	Valor
Puerto	8084
Base de datos	shipping_db
Estado	En desarrollo

Gestiona los envíos asociados a los pedidos.

📍 Microservicio ms-tracking
Característica	Valor
Puerto	8085
Base de datos	tracking_db
Estado	En desarrollo

Permite seguimiento en tiempo real de entregas.

🔔 Microservicio ms-notification
Característica	Valor
Puerto	8086
Base de datos	notification_db
Estado	En desarrollo

Envía notificaciones a usuarios.

🗄 Bases de Datos

Crear las siguientes bases de datos en PostgreSQL antes de ejecutar el proyecto:

CREATE DATABASE auth_db2;
CREATE DATABASE orders_db;
CREATE DATABASE inventory_db;
CREATE DATABASE shipping_db;
CREATE DATABASE tracking_db;
CREATE DATABASE notification_db;
Credenciales por defecto (desarrollo)
Configuración	Valor
Host	localhost
Puerto	5432
Usuario	postgres
Password	1234

⚠️ Importante: cambiar las credenciales y JWT secret en producción.

🌎 Variables de Entorno
Variable	Descripción	Valor por defecto
SPRING_DATASOURCE_URL	URL PostgreSQL	jdbc:postgresql://localhost:5432/
SPRING_DATASOURCE_USERNAME	Usuario PostgreSQL	postgres
SPRING_DATASOURCE_PASSWORD	Contraseña PostgreSQL	1234
JWT_SECRET	Clave JWT	smartlogix-clave-super-secreta
JWT_EXPIRATION	Expiración token	86400000
▶ Ejecución del Proyecto
Orden recomendado de arranque
PostgreSQL
ms-auth
ms-orders
ms-inventory
ms-shipping
ms-tracking
ms-notification
api-gateway
frontend
Arranque de microservicios
mvn clean install -DskipTests
mvn spring-boot:run
Arranque del frontend
cd proyecto/frontend

pnpm install
pnpm dev
🔗 Endpoints Principales
Servicio	URL
Frontend	http://localhost:3000
API Gateway	http://localhost:8080
ms-auth	http://localhost:8081
ms-orders	http://localhost:8082
ms-inventory	http://localhost:8083
ms-shipping	http://localhost:8084
ms-tracking	http://localhost:8085
ms-notification	http://localhost:8086
🧠 Patrones de Diseño Utilizados
Backend
Patrón	Microservicio	Descripción
Repository	ms-auth, ms-orders	Acceso a datos mediante Spring Data JPA
Builder	ms-auth, ms-orders	Construcción de entidades con Lombok
DTO	ms-auth, ms-orders	Separación entre dominio y transferencia
Filter Chain	ms-orders	Filtro JWT en Spring Security
BFF	api-gateway	Adaptación backend para frontend
Frontend
Patrón	Ubicación	Descripción
Compound Component	components/ui	Componentes reutilizables
Custom Hook	hooks	Lógica reutilizable
Layout Component	app/dashboard/layout.tsx	Layout compartido
🌿 Estrategia de Branching
main
├── develop
│   ├── feature/ms-auth
│   ├── feature/ms-orders
│   ├── feature/frontend-dashboard
│   └── feature/api-gateway
└── hotfix/
Convención de commits
feat(ms-orders): agregar endpoint de actualización de estado
fix(ms-auth): corregir validación de token expirado
docs(readme): actualizar instrucciones de instalación
refactor(frontend): extraer componente reutilizable
👥 Equipo

Proyecto desarrollado para la asignatura:

DSY1106 — Desarrollo Fullstack III
Evaluación Parcial N°2 — DuocUC
