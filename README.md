# SmartLogix - Plataforma de Gestión Logística

## Descripción

SmartLogix es una plataforma orientada a la gestión logística y administración de pedidos construida bajo una arquitectura de microservicios. El proyecto integra un frontend moderno desarrollado con Next.js y múltiples servicios backend construidos con Spring Boot.

La solución busca centralizar procesos relacionados con:

* Gestión de pedidos
* Control de inventario
* Seguimiento de envíos
* Autenticación de usuarios
* Gestión de notificaciones
* Tracking logístico

---

## Arquitectura del Proyecto

El sistema está dividido en varios módulos independientes siguiendo una arquitectura basada en microservicios.

```bash
proyecto/
│
├── api-gateway/
├── frontend/
├── microservicios/
│   ├── ms-auth/
│   ├── ms-inventory/
│   ├── ms-notification/
│   ├── ms-orders/
│   ├── ms-shipping/
│   └── ms-tracking/
└── docker-compose.yml
```

---

# Tecnologías Utilizadas

## Frontend

* Next.js 16
* React 19
* TypeScript
* TailwindCSS
* Radix UI
* Recharts
* Lucide React

## Backend

* Java 17
* Spring Boot
* Spring Data JPA
* JWT Authentication
* PostgreSQL
* Maven

## DevOps / Infraestructura

* Docker
* Docker Compose
* GitHub
* GitHub Actions (CI/CD)

---

# Microservicios

## ms-auth

Servicio encargado de la autenticación y autorización de usuarios mediante JWT.

### Funcionalidades

* Login de usuarios
* Registro de usuarios
* Generación y validación de tokens JWT
* Seguridad con Spring Security

### Puerto

```bash
8081
```

---

## ms-orders

Servicio encargado de la administración de pedidos.

### Funcionalidades

* Crear pedidos
* Listar pedidos
* Actualizar estado de pedidos
* Persistencia con PostgreSQL

### Puerto

```bash
8082
```

---

## ms-inventory

Servicio encargado del control y gestión de inventario.

### Posibles funcionalidades

* Registro de productos
* Control de stock
* Actualización de inventario

---

## ms-shipping

Servicio encargado de la gestión de envíos.

### Posibles funcionalidades

* Gestión de despachos
* Estados de envío
* Información logística

---

## ms-tracking

Servicio orientado al seguimiento de pedidos y envíos.

### Posibles funcionalidades

* Tracking en tiempo real
* Historial de estados
* Seguimiento logístico

---

## ms-notification

Servicio encargado de las notificaciones del sistema.

### Posibles funcionalidades

* Envío de alertas
* Notificaciones de pedidos
* Confirmaciones de estado

---

# Frontend

El frontend fue desarrollado utilizando Next.js con App Router y una estructura modular.

## Secciones principales

* Dashboard
* Analytics
* Inventory
* Orders
* Shipments
* Settings

## Componentes destacados

* Dashboard interactivo
* Landing page moderna
* Sistema de temas
* Componentes reutilizables
* Diseño responsive

---

# Base de Datos

El proyecto utiliza PostgreSQL como sistema gestor de base de datos.

## Configuración observada

### ms-auth

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/auth_db2
    username: postgres
    password: 1234
```

### ms-orders

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/orders_db
    username: postgres
    password: 1234
```

---

# Instalación y Ejecución

## Requisitos Previos

Instalar:

* Java 17
* Maven
* Node.js
* PostgreSQL
* Docker Desktop

---

# Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>
cd proyecto
```

---

# Ejecutar el Frontend

```bash
cd frontend
npm install
npm run dev
en caso de no funcionar
(npx pnpm install)
(npx pnpm run dev)
```

El frontend estará disponible en:

```bash
http://localhost:3000
```

---

# Ejecutar Microservicios

Ejemplo para ms-auth:

```bash
cd microservicios/ms-auth
mvn spring-boot:run
```

Ejemplo para ms-orders:

```bash
cd microservicios/ms-orders
mvn spring-boot:run
```

---

# Docker

El proyecto incluye archivos Dockerfile para los microservicios y frontend.

Ejemplo de construcción:

```bash
docker build -t ms-auth .
```

Ejemplo de ejecución:

```bash
docker run -p 8081:8081 ms-auth
```

---

# API Gateway

El proyecto incluye un módulo `api-gateway` pensado para centralizar el acceso a los microservicios.

### Objetivos del Gateway

* Enrutamiento centralizado
* Seguridad
* Balanceo de carga
* Gestión de peticiones

---

# Seguridad

El sistema utiliza JWT para autenticación.

Configuración observada:

```yaml
jwt:
  secret: smartlogix-clave-super-secreta
  expiration: 86400000
```

---

# Características del Proyecto

* Arquitectura de microservicios
* Frontend moderno y responsive
* Backend desacoplado
* Escalabilidad modular
* Integración con PostgreSQL
* Preparado para Docker
* Base para CI/CD

---

# Estado del Proyecto

⚠️ Proyecto en desarrollo.

Actualmente existen módulos estructurados y componentes funcionales, aunque algunos microservicios aún presentan configuraciones iniciales o funcionalidades en construcción.

---

# Posibles Mejoras

* Implementar comunicación entre microservicios
* Completar configuración del API Gateway
* Agregar Docker Compose funcional
* Integrar Swagger/OpenAPI
* Implementar observabilidad y logs
* Agregar pruebas unitarias e integración
* Configurar despliegue automático CI/CD

---

# Autor

Proyecto desarrollado como práctica de arquitectura de microservicios, desarrollo fullstack y DevOps.

---

# Licencia

Este proyecto puede ser utilizado con fines educativos y de aprendizaje.
