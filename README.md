# gesCasesRurals — Plataforma Premium de Reservas

gesCasesRurals es una solución full-stack premium y escalable diseñada para la administración y reserva en línea de 6 casas rurales. Integra un panel de administración estilo SaaS (Gantt calendar scheduler, gestión de reservas, CRUD de casas, logs de auditoría y controles de clientes) y un portal cliente interactivo (historial de reservas, perfil y notificaciones en tiempo real).

---

## 🏗️ Arquitectura del Sistema

El proyecto sigue una arquitectura desacoplada organizada por capas limpias:

```
┌─────────────────────────────────────────────┐
│          FRONTEND (HTML/CSS/JS)              │
│        Servido estáticamente por Express     │
└──────────────────┬──────────────────────────┘
                   │ HTTP/AJAX (fetch API)
┌──────────────────▼──────────────────────────┐
│        BACKEND (Node.js + Express)           │
│        Puerto 3000                           │
│  ┌─────────┐ ┌──────────┐ ┌──────────────┐ │
│  │ Routes  │→│Controllers│→│   Models     │ │
│  └─────────┘ └──────────┘ └──────┬───────┘ │
│  ┌──────────────┐                │          │
│  │ Middlewares   │ JWT+Roles     │          │
│  └──────────────┘                │          │
└──────────────────────────────────┼──────────┘
                                    │ mysql2
┌──────────────────────────────────▼──────────┐
│          MySQL 8.x (Puerto 3306)             │
│  Base de datos: gescasesrurals              │
└─────────────────────────────────────────────┘
```

* **Frontend**: HTML5, CSS3 Vanilla (variables, transiciones suaves, flexbox/grid, responsive) y JavaScript Vanilla (SPA hash routing, fetch wrapper, toast alerts, Gantt render).
* **Backend**: Node.js + Express.
* **Base de Datos**: MySQL 8.0+.
* **Seguridad**: JWT Authentication, hash de contraseñas con `bcryptjs`, Rate Limiting, Helmet headers, validaciones robustas con `express-validator` y control de solapamiento de fechas.

---

## 📁 Estructura del Proyecto

```
Proyecto-beta/
├── backend/
│   ├── config/              # Conexión pool de MySQL
│   ├── controllers/         # Lógica controladora de las peticiones HTTP
│   ├── middlewares/         # Middlewares de JWT y express-validators
│   ├── models/              # Modelos y sentencias SQL raw
│   ├── routes/              # Mapeo de rutas de la API REST
│   ├── services/            # Lógica de negocio (precios, solapamiento)
│   ├── uploads/             # Almacenamiento de imágenes de casas subidas
│   ├── .env                 # Variables de entorno
│   ├── package.json         # Dependencias
│   └── server.js            # Punto de entrada de Express
├── database/
│   ├── database.sql         # Schema completo de la base de datos
│   └── seed.sql             # Datos de prueba iniciales (seeds)
├── frontend/
│   ├── css/                 # Hojas de estilo estructuradas
│   ├── js/                  # Módulos JS de la SPA
│   ├── pages/               # Fragmentos HTML de las vistas
│   └── index.html           # Shell principal de la SPA
└── README.md                # Documentación del proyecto
```

---

## 🚀 Guía de Instalación y Configuración

### 1. Base de Datos MySQL
Asegúrate de tener un servidor MySQL activo (ej. XAMPP, MySQL standalone) corriendo en `localhost:3306`.
1. Accede a tu cliente de bases de datos (phpMyAdmin o CLI).
2. Importa el archivo schema en orden:
   ```bash
   mysql -u root -p < database/database.sql
   mysql -u root -p < database/seed.sql
   ```
*Nota: La contraseña para todos los usuarios semilla es `Test1234!` (encriptada con bcrypt en la base de datos).*

### 2. Configurar el Backend
1. Entra al directorio `backend/` e instala las dependencias:
   ```bash
   cd backend
   npm install
   ```
2. Revisa el archivo `.env` en la raíz del backend:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=root
   DB_PASS=
   DB_NAME=gescasesrurals
   JWT_SECRET=gesCasesRurals_S3cr3t_K3y_2026_!@#SuperSegura
   JWT_EXPIRES_IN=7d
   ```
   *Modifica `DB_USER` y `DB_PASS` con los valores de tu servidor MySQL si es necesario.*

### 3. Ejecutar la Aplicación
1. Arranca el servidor Express:
   ```bash
   npm run dev
   ```
2. Abre tu navegador y accede a:
   [http://localhost:3000](http://localhost:3000)

---

## 🔑 Cuentas de Prueba Preconfiguradas

Puedes iniciar sesión en la aplicación con cualquiera de los siguientes usuarios:

| Nombre | Email | Rol | Contraseña | Estado |
| :--- | :--- | :--- | :--- | :--- |
| **Jordi** | `admin@gescasesrurals.com` | Administrador | `Test1234!` | Activo |
| **Montserrat** | `montse@gescasesrurals.com` | Administrador | `Test1234!` | Activo |
| **Joan** | `joan@email.com` | Cliente | `Test1234!` | Activo |
| **Maria** | `maria@email.com` | Cliente | `Test1234!` | Activo |
| **Laura** | `laura@email.com` | Cliente | `Test1234!` | Bloqueado |

---

## 📡 Endpoints de la API REST

### Autenticación (`/api/auth`)
* `POST /register`: Registro de nuevos clientes.
* `POST /login`: Inicio de sesión (devuelve token JWT y datos de usuario).
* `GET /profile`: Obtener perfil del usuario autenticado (requiere token).
* `PUT /profile`: Modificar datos del perfil.

### Casas Rurales (`/api/casas`)
* `GET /`: Listar casas rurales (los clientes ven solo activas, los admins ven todas).
* `GET /:id`: Detalles de una casa rural específica (con sus fotos).
* `POST /`: Crear nueva casa rural (solo admins).
* `PUT /:id`: Editar datos de una casa (solo admins).
* `DELETE /:id`: Eliminar una casa rural (solo admins, falla si tiene reservas).
* `POST /:id/images`: Subir hasta 5 fotos en multipart/form-data (solo admins).

### Reservas (`/api/reservas`)
* `GET /`: Listar todas las reservas del sistema (solo admins).
* `GET /mis-reservas`: Listar historial del cliente logueado (solo clientes).
* `GET /ocupadas/:casaId`: Obtener fechas de entrada y salida reservadas y aceptadas para el calendario.
* `POST /`: Solicitar nueva reserva (valida solapamientos y capacidad, calcula precio total).
* `PUT /:id/aprobar`: Aprobar reserva pendiente (solo admins, valida solapamiento final).
* `PUT /:id/rechazar`: Rechazar reserva pendiente (solo admins).
* `PUT /:id/cancelar`: Cancelar una reserva activa (admins o cliente propietario).

### Notificaciones (`/api/notificaciones`)
* `GET /?unread=true`: Listar notificaciones del usuario (opción de solo no leídas).
* `PUT /leidas`: Marcar todas las notificaciones como leídas.
* `PUT /:id/leida`: Marcar notificación individual como leída.

### Estadísticas (`/api/stats`)
* `GET /`: Obtener estadísticas clave, ingresos, solicitudes por estado, reservas recientes y logs de auditoría (solo admins).
