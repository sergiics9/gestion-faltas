# Guía de despliegue en Docker Desktop (Windows)

Sigue estos pasos en orden para tener la app funcionando en **http://gestion.iesperemaria.local**.

---

## Antes de empezar

- [ ] **Docker Desktop** instalado en Windows y **en ejecución** (icono de Docker en la bandeja).
- [ ] Tener **Node.js** y **npm** (para generar el build del frontend).
- [ ] Abrir **PowerShell** o **Símbolo del sistema** (no hace falta ser administrador hasta el paso del hosts).

---

## Paso 1: Añadir el dominio en el archivo hosts

Para que el navegador entienda `gestion.iesperemaria.local` y lo envíe a tu PC:

1. Abre **Bloc de notas**.
2. Menú **Archivo → Abrir** y ve a:
   ```
   C:\Windows\System32\drivers\etc
   ```
3. En "Archivos de texto" elige **Todos los archivos (*.*)** para ver el archivo `hosts`.
4. Abre el archivo **hosts**.
5. Al final del archivo añade esta línea (sustituyendo si ya tienes otro dominio):
   ```
   127.0.0.1   gestion.iesperemaria.local
   ```
6. **Archivo → Guardar**.  
   Si no te deja guardar, cierra el Bloc de notas, clic derecho en Bloc de notas → **Ejecutar como administrador** y vuelve a abrir `hosts` desde ahí, luego guarda.

---

## Paso 2: Configurar el .env de Laravel

1. Abre una terminal en la carpeta del proyecto (por ejemplo):
   ```powershell
   cd C:\Users\Sergi\Desktop\intermod
   ```
2. Copia el ejemplo de configuración para Docker:
   ```powershell
   copy backend\.env.docker.example backend\.env
   ```
3. (Opcional) Abre `backend\.env` y revisa que estén algo así (deben coincidir con lo que usa Docker):
   - `DB_HOST=mysql`
   - `DB_DATABASE=intermod`
   - `DB_USERNAME=intermod`
   - `DB_PASSWORD=secret`  
   Si no tocas nada, con el `.env.docker.example` suele bastar.

---

## Paso 3: Generar el build del frontend (Angular)

La app que verás en el navegador sale de esta carpeta. Sin este paso, al abrir el dominio la página quedará en blanco.

1. En la misma terminal (o una nueva) en la raíz del proyecto:
   ```powershell
   cd C:\Users\Sergi\Desktop\intermod\frontend
   ```
2. Instala dependencias si aún no lo has hecho:
   ```powershell
   npm install
   ```
3. Genera el build de producción:
   ```powershell
   npm run build
   ```
4. Comprueba que exista la carpeta:
   ```powershell
   dir dist\frontend\browser
   ```
   Debe contener `index.html` y archivos `.js` y `.css`. Si no existe, revisa que el `npm run build` haya terminado sin errores.

---

## Paso 4: Levantar los contenedores con Docker

1. Ve a la raíz del proyecto:
   ```powershell
   cd C:\Users\Sergi\Desktop\intermod
   ```
2. Construye y arranca todos los servicios (nginx, Laravel, MySQL, phpMyAdmin, Bind9):
   ```powershell
   docker compose up -d --build
   ```
3. Espera a que termine (la primera vez puede tardar varios minutos).
4. Comprueba que los contenedores estén en ejecución:
   ```powershell
   docker compose ps
   ```
   Deberías ver `nginx`, `laravel`, `mysql`, `phpmyadmin` y `bind9` en estado "running" o "Up".

---

## Paso 5: Configurar Laravel (clave y base de datos)

1. Genera la clave de aplicación:
   ```powershell
   docker compose exec laravel php artisan key:generate
   ```
2. Ejecuta las migraciones:
   ```powershell
   docker compose exec laravel php artisan migrate --force
   ```
3. Carga los datos iniciales (centro, usuarios, horarios de ejemplo):
   ```powershell
   docker compose exec laravel php artisan db:seed
   ```

---

## Paso 6: Abrir la app en el navegador

1. Abre el navegador (Chrome, Edge, etc.).
2. Escribe en la barra de direcciones:
   ```
   http://gestion.iesperemaria.local
   ```
3. Deberías ver la pantalla de **login** de la app (IES Pere Maria – Gestión de Faltas).
4. Prueba a entrar con los usuarios del seeder, por ejemplo:
   - **Usuario:** `admin` — **Contraseña:** `Admin123!`
   - **Usuario:** `guardia` — **Contraseña:** `Guardia123!`
   - **Usuario:** `profesor` — **Contraseña:** `Profe123!`

---

## Resumen rápido (para próximas veces)

Si ya hiciste todo una vez y solo quieres volver a levantar el entorno:

```powershell
cd C:\Users\Sergi\Desktop\intermod
docker compose up -d
```

Para parar todo:

```powershell
docker compose down
```

---

## Si algo falla

| Problema | Qué hacer |
|----------|-----------|
| "La página no se puede mostrar" o no carga el dominio | Revisa el **Paso 1** (hosts). Debe existir la línea `127.0.0.1 gestion.iesperemaria.local`. |
| Página en blanco al abrir el dominio | Asegúrate de haber hecho el **Paso 3** (`npm run build`) y de que exista `frontend\dist\frontend\browser` con `index.html`. Luego reinicia nginx: `docker compose restart nginx`. |
| Error de conexión a la base de datos en Laravel | Comprueba que el contenedor `mysql` esté en marcha (`docker compose ps`) y que `backend\.env` tenga `DB_HOST=mysql` y las mismas credenciales que en `docker-compose.yml`. |
| Docker no arranca o "cannot connect" | Abre **Docker Desktop** y espera a que esté completamente iniciado (icono estable en la bandeja). |
| Cambios en el código del backend | Reinicia Laravel: `docker compose restart laravel`. Si cambiaste solo el frontend, haz de nuevo `npm run build` en `frontend` y `docker compose restart nginx`. |

---

## URLs útiles

- **App:** http://gestion.iesperemaria.local  
- **phpMyAdmin (gestión de MySQL):** http://localhost:8080  
  - Usuario: `root`  
  - Contraseña: `rootsecret`

Con esto deberías tener la app desplegada y accesible por dominio en Docker Desktop en Windows.
