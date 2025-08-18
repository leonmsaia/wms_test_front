# WMS Frontend

Aplicación frontend para el sistema **WMS**, construida con **Angular 20** (standalone), **Angular Material** y **MiniRx** para manejo de estado. Implementa autenticación, listado y **CRUD de usuarios** con filtros, paginación y feedback visual.

**Repo:** https://github.com/leonmsaia/wms_test_front  
**Backend (Laravel 11):** https://github.com/leonmsaia/wms_test_back

---

## Tecnologías

- Angular 20 (standalone, Signals)
- Angular Material (UI/UX)
- MiniRx Store (estado global + effects)
- RxJS 7.8
- SSR opcional con Angular Universal
- TypeScript 5.8

---

## Requisitos previos

- Node.js 20+
- npm 10+
- (Opcional) Backend en marcha en `http://localhost:8000` (Laravel + Sanctum)

> La app se conecta al backend vía **proxy** en dev (`/api` → `http://localhost:8000`). También podés usar `environment.ts` si preferís URLs directas.

---

## Instalación

```bash
git clone https://github.com/leonmsaia/wms_test_front.git
cd wms_test_front
npm install
```

---

## Scripts (package.json)

```json
"start": "ng serve --proxy-config proxy.conf.json",
"build": "ng build",
"dev:ssr": "ng run app:serve-ssr",
"build:ssr": "ng build && ng run app:server",
"serve:ssr": "node dist/app/server/server.mjs"
```

- `npm start` → Dev server con **proxy** (recomendado)
- `npm run build` → Build SPA de producción
- `npm run dev:ssr` → Servir SSR en modo desarrollo
- `npm run build:ssr` + `npm run serve:ssr` → Compilar y servir SSR

---

## Desarrollo (modo recomendado)

1) Levantá el backend (ver README del backend).  
2) Iniciá el front con proxy:

```bash
npm start
# http://localhost:4200
```

### proxy.conf.json (referencia)
Asegurate de tener esto en la raíz del front:

```json
{
  "/api": {
    "target": "http://localhost:8000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "info"
  }
}
```

> Así todas las llamadas a `/api/**` se redirigen al backend local en dev.

---

## Variables de entorno

La app usa `environment.ts` para la **base URL** del API en producción/SSR. En dev, con proxy, no necesitás setearlo.

Ejemplo sugerido:

`src/environments/environment.ts`
```ts
export const environment = {
  production: false,
  apiBaseUrl: '/api', // en dev va por proxy
};
```

`src/environments/environment.prod.ts`
```ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://TU_DOMINIO_BACKEND/api'
};
```

---

## Credenciales de prueba

```json
{
  "email": "admin@demo.com",
  "password": "secret1234"
}
```

---

## Funcionalidades

- Login + guard de rutas protegidas
- Header con **logout**
- **Usuarios**: listado, filtros (rol / búsqueda), paginación, **CRUD**
- Formularios reactivos con validaciones (Material)
- Indicadores de carga y errores
- Efectos con MiniRx para llamadas al backend
- Diseño Material "pro" (toolbar, cards, table, paginator, tooltips)

---

## Estructura de carpetas (resumen)

```
src/app
├── core
│   ├── guards/            # authGuard, etc.
│   ├── interceptors/      # authInterceptor (Bearer)
│   ├── models/            # auth.model.ts, user.model.ts
│   └── services/          # users.api.ts, auth.api.ts
├── features
│   ├── auth/
│   │   ├── login.component.(ts|html|scss)
│   │   └── store/         # AuthStore (login/register/me/logout)
│   ├── layout/
│   │   └── private-layout.component.(ts|html|scss)
│   └── users/
│       ├── store/         # actions/reducer/effects/selectors
│       └── ui/
│           ├── usuario-listado/
│           │   ├── usuario-listado.component.(ts|html|scss)
│           ├── usuario-formulario/
│           │   └── usuario-formulario.component.ts
│           └── usuario-form-dialog.component.(ts|html)
├── shared
│   └── loading/           # LoadingComponent
└── store/                 # AppStoreModule, etc.
```

---

## Configuración de estilos / fuentes

En `styles.scss` se incluyen tipografías y tema Material (puede ser prebuilt o custom):

- **Roboto** (tipografía):  
  `@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap');`
- **Material Icons (ligaduras)**:  
  `@import url('https://fonts.googleapis.com/icon?family=Material+Icons');`

> Necesario para que `<mat-icon>edit</mat-icon>` y otros íconos se vean correctamente.

---

## Interceptores / Guard

- **authInterceptor**: agrega `Authorization: Bearer <token>` si existe en `AuthStore`/`localStorage`.
- **authGuard**: bloquea rutas privadas si no hay sesión válida.

---

## Testing

```bash
npm test
```

Incluye configuración Karma + Jasmine.  
*(Podés sumar tests unitarios en `*.spec.ts` para features críticas: store, effects y componentes.)*

---

## SSR (opcional)

SSR está preparado con los scripts del `package.json`. Para una prueba rápida:

```bash
npm run build:ssr
npm run serve:ssr
# escucha en el puerto configurado por Angular Universal (por defecto 4000)
```

> Si usás SSR en producción, recordá setear `environment.prod.ts` con el dominio real del backend.

---

## Endpoints (consumo desde el front)

- `POST /api/auth/login` → login (guarda token)
- `GET  /api/auth/me` → usuario autenticado
- `POST /api/auth/logout` → logout
- `GET  /api/usuarios` → listado con filtros/paginación (`?role=&q=&page=&per_page=`)
- `POST /api/usuarios` → crear
- `PUT  /api/usuarios/:id` → actualizar
- `DELETE /api/usuarios/:id` → eliminar

> Ver README del backend para detalles de validación y ejemplos.

---

## Notas de entrega

- Rama principal con funcionalidad completa.
- Rama secundaria `feature/ui-polish` para mejoras visuales (toolbar, cards, snackbars, confirm).
- Código dividido en componentes **standalone** con templates y estilos separados.
- Documentación con **docblocks** en componentes clave.

---

## Troubleshooting

- **Íconos “rotos”**: asegurate de incluir Material Icons (ver sección estilos).  
- **CORS en dev**: usá `npm start` con `proxy.conf.json`.  
- **Token no se adjunta**: confirmá que `authInterceptor` esté registrado y que el login guarde `access_token`.  
- **SSR + API**: en SSR, preferí usar `environment.apiBaseUrl` absoluto en prod (evitar proxy del dev).

---

## Licencia

MIT — libre uso para evaluación técnica.
