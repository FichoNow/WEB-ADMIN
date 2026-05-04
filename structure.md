# web-admin

## Tecnologías

- **Next.js 15 (App Router)** — framework React con renderizado en servidor. Las páginas son Server Components por defecto; solo se añade `'use client'` donde hace falta interactividad.
- **TypeScript** — tipado estático en todo el proyecto.
- **Tailwind CSS** — estilos mediante clases de utilidad.
- **Base UI + Radix UI** — primitivos de UI accesibles (Select, Label, Tabs, Slot…).
- **shadcn** — colección de componentes de UI construidos sobre Base UI / Radix.
- **React Hook Form + Zod** — gestión de formularios con validación de esquemas.
- **Framer Motion** — animaciones y transiciones de elementos.
- **Recharts** — gráficos de estadísticas.
- **Lucide React** — iconos.

---

## Estructura

```
app/
├── lib/
│   └── api.ts              ← fetchWithAuth y fetchPublic: toda la comunicación con la API pasa por aquí
│                             fetchWithAuth gestiona automáticamente el refresh del token si expira
├── repositories/           ← llaman a fetchWithAuth/fetchPublic y devuelven datos tipados
├── actions/                ← Server Actions: validan formularios, llaman al repository, devuelven estado
├── types/
│   └── admin/
│       ├── api/            ← interfaces que reflejan las respuestas de la API
│       ├── action-states/  ← tipos de estado que devuelven las Server Actions (error | success | undefined)
│       └── schemas/        ← esquemas Zod para validar formularios
├── dashboard/
│   ├── layout.tsx          ← layout del panel: carga empresa y departamentos, redirige si no hay sesión
│   ├── page.tsx            ← selector de departamento (vista SUPERADMIN)
│   ├── error.tsx           ← boundary de error del dashboard
│   └── [departmentId]/     ← rutas del panel de un departamento concreto
│       ├── layout.tsx      ← envuelve con sidebar + header
│       ├── employees/      ← gestión de plantilla
│       ├── projects/       ← gestión de proyectos
│       ├── requests/       ← solicitudes pendientes
│       ├── statistics/     ← estadísticas
│       ├── schedules/      ← plantillas de horario
│       └── settings/       ← configuración del departamento
├── error/
│   └── page.tsx            ← página de error de sesión (refresh fallido, token expirado…)
├── globals.css             ← variables CSS de color del tema y estilos globales
├── layout.tsx              ← layout raíz: fuente, metadatos, envuelve toda la app
├── page.tsx                ← página de login (ruta "/")
└── not-found.tsx           ← página 404

components/
├── ui/                     ← primitivos de UI (Button, Input, Select, Dialog…)
│                             generados con shadcn, no se editan a mano
├── PageHeader.tsx          ← cabecera estándar de página: título, descripción, botones de acción
└── ...                     ← resto de componentes compartidos entre páginas

lib/
└── utils.ts                ← cn(): combina clases Tailwind con clsx + tailwind-merge
```

---

## Flujo de una petición

```
page.tsx (Server Component)
  → repository (fetchWithAuth → API)
  → pasa datos al Client Component

Client Component (formulario / botón)
  → Server Action
    → repository (fetchWithAuth → API)
    → devuelve { error } | { success } al Client Component
```

## Autenticación

Las cookies `accessToken` y `refreshToken` son `httpOnly` — el navegador nunca las lee directamente.  
`fetchWithAuth` las gestiona en servidor: si recibe un 401, lanza el refresh automáticamente y reintenta la petición original. Si el refresh falla, redirige a `/error`.
