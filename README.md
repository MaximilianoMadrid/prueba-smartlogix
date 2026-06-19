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

### Documentación API (Swagger)

```bash
http://localhost:8081/swagger-ui.html
---

### Pruebas unitarias

Cuenta con pruebas unitarias de la capa de servicio (`AuthServiceTest`) usando JUnit 5 y Mockito, validando el registro de usuarios y la encriptación de contraseñas antes de persistir.

---
## ms-orders

Servicio encargado de la administración de pedidos.

### Funcionalidades

* Crear pedidos
* Listar pedidos
* Buscar pedidos por id y por estado
* Actualizar estado de pedidos
* Eliminar pedidos
* Persistencia con PostgreSQL

### Puerto

```bash
8082
```
### Documentación API (Swagger)

```bash
http://localhost:8082/swagger-ui.html
```
### Pruebas unitarias

Es el microservicio con mayor cobertura de pruebas del proyecto:

* `OrderServiceTest`: lógica de creación y búsqueda de pedidos.
* `OrderControllerTest`: los 6 endpoints del controlador (crear, listar, buscar por id, buscar por estado, actualizar estado, eliminar).
* `JwtServiceTest`: generación y validación de tokens JWT (token válido, expirado, email distinto, token malformado).
* `JwtFilterTest`: comportamiento del filtro de autenticación ante request sin header, header no-Bearer, token válido y token inválido.

Cobertura medida con **JaCoCo: 74%** de instrucciones, por sobre el mínimo exigido (60%).

Para generar el reporte de cobertura:

```bash
cd microservicios/ms-orders
mvn clean test
```

El reporte HTML queda disponible en:

```bash
microservicios/ms-orders/target/site/jacoco/index.html
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
en caso de no funcionar usar:
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

# Pruebas Unitarias y Cobertura
 
El proyecto incorpora pruebas unitarias con **JUnit 5** y **Mockito**, enfocadas principalmente en el microservicio `ms-orders`, que concentra la lógica de negocio crítica del sistema (gestión de pedidos y seguridad JWT).

## Resumen de cobertura (ms-orders)
 
| Paquete | Cobertura |
|---|---|
| `ms_orders.service` | 84% |
| `ms_orders.controller` | Cubierto vía tests unitarios del controlador |
| `ms_orders.security` | Cubierto (JwtService y JwtFilter) |
| **Total del módulo** | **74%** |
 
Herramienta utilizada: [JaCoCo](https://www.jacoco.org/jacoco/) 0.8.12, integrado en el `pom.xml` de `ms-orders`.
 
## Tipos de pruebas implementadas
 
* **Pruebas de servicio**: validan la lógica de negocio (creación de pedidos, búsqueda por id, registro de usuarios, encriptación de contraseñas).
* **Pruebas de controlador**: validan que cada endpoint delega correctamente al servicio y retorna la respuesta esperada.
* **Pruebas de seguridad**: validan la generación/validación de tokens JWT y el comportamiento del filtro de autenticación ante distintos escenarios (sin token, token inválido, token válido).

## Cómo ejecutar las pruebas y ver el reporte
 
```bash
cd microservicios/ms-orders
mvn clean test
```
 
El informe de cobertura en HTML se genera automáticamente en:
 
```bash
microservicios/ms-orders/target/site/jacoco/index.html
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
