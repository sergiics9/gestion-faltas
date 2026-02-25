# Gestión de Faltas — IES Pere Maria

Aplicación web para gestionar las faltas del profesorado del IES Pere Maria. Permite registrar ausencias, consultar horarios y guardias, y administrar centros, aulas, asignaturas y usuarios según el rol (administrador, profesor, guardia).

---

## Contenido del repositorio

| Carpeta / archivo               | Descripción                                                     |
| ------------------------------- | --------------------------------------------------------------- |
| **`backend/`**                  | API REST con **Laravel 12** (PHP), autenticación Sanctum, MySQL |
| **`frontend/`**                 | SPA con **Angular 21**, Bootstrap                               |
| **`docker/`**                   | Configuración de Nginx (HTTPS) y certificados                   |
| **`GUIA-DESPLIEGUE-DOCKER.md`** | Guía paso a paso para desplegar con Docker en Windows           |

---

## Tecnologías

- **Backend:** Laravel 12, Laravel Sanctum, MySQL
- **Frontend:** Angular 21, Bootstrap, SCSS
- **Despliegue:** Docker (nginx, PHP-FPM, MySQL, phpMyAdmin), HTTPS
- **Documentación API:** [Scribe](https://scribe.knuckles.wtf/) (HTML, OpenAPI, Postman)

---

## Requisitos

- **PHP** 8.2+, **Composer**, **Node.js** y **npm**
- Para despliegue con Docker: **Docker Desktop** (Windows)

---

## Ejecución en local

### Backend (Laravel)

```bash
cd backend
copy .env.example .env
composer install
php artisan key:generate
# Configurar .env con tu base de datos (MySQL o SQLite)
php artisan migrate
php artisan db:seed
php artisan serve
```

API en: **http://localhost:8000**

### Frontend (Angular)

```bash
cd frontend
npm install
npm start
```

App en: **http://localhost:4200** (ajusta la URL de la API en el frontend si usas proxy o otro puerto).

### Documentación de la API

Con el backend en marcha (`php artisan serve`):

```bash
cd backend
php artisan package:discover
php artisan scribe:generate
```

Documentación en: **http://localhost:8000/docs**  
Más detalles en `backend/DOCUMENTACION-API.md`.

---

## Despliegue con Docker

1. Configura el `.env` de Laravel a partir de `backend/.env.docker.example`.
2. Genera el build del frontend: `cd frontend && npm run build`.
3. Levanta los contenedores: `docker compose up -d --build`.
4. Ejecuta migraciones y seed:  
   `docker compose exec laravel php artisan key:generate`  
   `docker compose exec laravel php artisan migrate --force`  
   `docker compose exec laravel php artisan db:seed`
5. Añade en el archivo **hosts** de Windows: `127.0.0.1 gestion.iesperemaria.local`

**URL de la aplicación:** https://gestion.iesperemaria.local  
(HTTP redirige a HTTPS.)

Instrucciones detalladas: **[GUIA-DESPLIEGUE-DOCKER.md](GUIA-DESPLIEGUE-DOCKER.md)**.

---

## Estructura de la API (resumen)

- **Público:** `POST /api/v1/auth/login`
- **Protegidos (Bearer token):** `/api/v1/auth/me`, `/auth/logout`, CRUD de centers, timeslots, classrooms, subjects, schedule-entries, users; faltas (`/absences`), guardia (`/guard/today`), horario por profesor (`/teachers/{id}/schedule/day`).

---

## Licencia

Proyecto educativo — IES Pere Maria.
