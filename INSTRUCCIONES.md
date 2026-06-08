# Guía de Inicio Rápido: Cómo Arrancar gesCasesRurals desde Cero

Este documento contiene las instrucciones detalladas paso a paso con los comandos exactos que debes ejecutar para levantar la base de datos, configurar el servidor y hacer funcionar la aplicación en tu entorno local.

---

## 📋 Requisitos Previos

Antes de empezar, asegúrate de tener instalado en tu sistema:
1. **Node.js** (versión 16 o superior). Puedes descargarlo en [nodejs.org](https://nodejs.org/).
2. **Servidor MySQL**. Puedes utilizar la herramienta **XAMPP** (recomendado, incluye MariaDB/MySQL y una consola gráfica fácil de usar) o tener MySQL instalado de forma independiente.

---

## 🛠️ Paso 1: Levantar e Importar la Base de Datos

### Opción A: Usando XAMPP
1. Abre el **XAMPP Control Panel**.
2. Haz clic en el botón **Start** en el módulo **MySQL** (y también en *Apache* si deseas administrarlo por interfaz web).
3. Asegúrate de que el puerto de MySQL sea el `3306` (el puerto por defecto).
4. Abre tu navegador e ingresa a: [http://localhost/phpmyadmin](http://localhost/phpmyadmin)
5. En la barra superior, haz clic en **Importar** (Import).
6. Haz clic en **Seleccionar archivo** y busca el archivo del proyecto:
   `/Users/alumne_tarda1/Desktop/Proyecto-beta/database/database.sql`
7. Desplázate al final de la página y haz clic en **Importar** (o *Ejecutar*).
8. Repite el proceso (pasos 5 a 7) para importar el segundo archivo:
   `/Users/alumne_tarda1/Desktop/Proyecto-beta/database/seed.sql`

### Opción B: Usando MAMP (Recomendado en macOS)
1. Abre la aplicación **MAMP**.
2. Haz clic en el botón **Start Servers** para iniciar los servicios.
3. Abre tu navegador e ingresa a: [http://localhost:8888/MAMP/](http://localhost:8888/MAMP/) o haz clic en **WebStart** en la interfaz de MAMP.
4. Dirígete a **Tools** -> **phpMyAdmin** en el menú superior.
5. En la barra superior de phpMyAdmin, haz clic en **Importar** (Import).
6. Haz clic en **Seleccionar archivo** y busca el archivo del proyecto:
   `/Users/alumne_tarda1/Desktop/Proyecto-beta/database/database.sql`
7. Desplázate al final de la página y haz clic en **Importar** (o *Ejecutar*).
8. Repite el proceso (pasos 5 a 7) para importar el segundo archivo:
   `/Users/alumne_tarda1/Desktop/Proyecto-beta/database/seed.sql`

---

## ⚙️ Paso 2: Configurar las Variables de Entorno del Servidor

El backend utiliza variables del archivo `.env` para conectarse a la base de datos.
1. Abre el archivo `/Users/alumne_tarda1/Desktop/Proyecto-beta/backend/.env` en tu editor de código.
2. Comprueba que las credenciales coincidan con las de tu servidor MySQL.

* **Si usas MAMP (por defecto en macOS):**
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=8889
   DB_USER=root
   DB_PASS=root
   DB_NAME=gescasesrurals
   JWT_SECRET=gesCasesRurals_S3cr3t_K3y_2026_!@#SuperSegura
   JWT_EXPIRES_IN=7d
   ```

* **Si usas XAMPP (por defecto):**
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

---

## 💻 Paso 3: Abrir la Terminal e Instalar Dependencias

Debemos instalar los módulos de Node.js necesarios para el backend.
1. Abre tu terminal de macOS.
2. Ve al directorio del backend del proyecto ejecutando el siguiente comando:
   ```bash
   cd /Users/alumne_tarda1/Desktop/Proyecto-beta/backend
   ```
3. Instala los paquetes requeridos ejecutando:
   ```bash
   npm install
   ```
   *(Este paso ya lo he realizado en los pasos previos, pero es útil conocerlo por si clonas el proyecto de nuevo).*

---

## 🚀 Paso 4: Arrancar el Servidor Backend

Con la base de datos levantada y configurada, procedemos a iniciar el servidor.
1. En la misma terminal (dentro de la carpeta `/Users/alumne_tarda1/Desktop/Proyecto-beta/backend`), arranca la aplicación ejecutando:
   ```bash
   npm run dev
   ```
2. Verás en la terminal un mensaje similar a este:
   ```text
   Server is running on port 3000
   Access the application at http://localhost:3000
   Database connected successfully to gescasesrurals database
   ```
   *(Si aparece un error de conexión, revisa que XAMPP/MySQL esté encendido y que las credenciales del `.env` sean correctas).*

---

## 🌐 Paso 5: Abrir la Aplicación en el Navegador

Una vez que el servidor esté corriendo, la aplicación se servirá automáticamente.
1. Abre tu navegador web (Chrome, Safari, Firefox, etc.).
2. Ingresa a la siguiente dirección:
   [http://localhost:3000](http://localhost:3000)

---

## 🔑 Credenciales de Acceso para Pruebas

Para acceder a las distintas secciones, puedes usar las siguientes cuentas de prueba:

* **Administrador Principal (Dashboard y Calendario Gantt)**:
  * **Email**: `admin@gescasesrurals.com`
  * **Contraseña**: `Test1234!`
* **Cliente Semilla (Para realizar nuevas reservas)**:
  * **Email**: `joan@email.com`
  * **Contraseña**: `Test1234!`
