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
- **next-intl** — internacionalización (es / cat / en).

---

## Estructura

```
app/
├── lib/
│   ├── api.ts              ← fetchWithAuth y fetchPublic: toda la comunicación con la API pasa por aquí
│   │                         fetchWithAuth gestiona automáticamente el refresh del token si expira
│   ├── action-toast.ts     ← helper para mostrar toasts de éxito/error desde el cliente tras una Server Action
│   └── translate-zod.ts    ← traduce los mensajes de error de Zod usando next-intl
├── repositories/           ← llaman a fetchWithAuth/fetchPublic y devuelven datos tipados
├── actions/                ← Server Actions: validan formularios, llaman al repository, devuelven estado
│   ├── admin/              ← acciones del rol ADMIN: employees, groups, projects, requests, schedules, stats
│   ├── auth/               ← login, logout, register, update-profile
│   └── superadmin/         ← acciones del rol SUPERADMIN: company, department, superadmin
├── types/
│   ├── admin/              ← tipos del dominio admin (api/, action-states/, schemas/)
│   ├── auth/               ← tipos de autenticación
│   └── superadmin/         ← tipos del dominio superadmin
│       ├── api/            ← interfaces que reflejan las respuestas de la API
│       ├── action-states/  ← tipos de estado que devuelven las Server Actions (error | success | undefined)
│       └── schemas/        ← esquemas Zod para validar formularios
└── [locale]/               ← rutas internacionalizadas — todo lo visible al usuario cuelga de aquí
    ├── layout.tsx          ← layout raíz por idioma: fuente, providers (NextIntl, Theme), metadatos
    ├── page.tsx            ← página de login + landing (ruta "/[locale]")
    ├── not-found.tsx       ← página 404
    ├── _landing/           ← componentes de la landing (HeroSection, FichajeSection, CalendarSection,
    │                         AdminPanelSection, FeaturesSection, LandingNavbar, HeroDashboardMock).
    │                         El prefijo _ evita que Next genere ruta para esta carpeta.
    ├── about/
    │   └── page.tsx        ← página "Sobre nosotros"
    ├── error/
    │   └── page.tsx        ← página de error de sesión (refresh fallido, token expirado…)
    └── dashboard/
        ├── layout.tsx      ← layout del panel: carga empresa y departamentos, redirige si no hay sesión
        ├── page.tsx        ← selector de departamento (vista SUPERADMIN)
        ├── error.tsx       ← boundary de error del dashboard
        ├── _components/    ← componentes del panel SUPERADMIN raíz (CreateDepartmentButton,
        │                     CompanySettingsClient, EditCompanyForm, AddSuperadminForm,
        │                     EditSuperadminForm). Igual que en _landing, el prefijo _ evita ruta.
        ├── profile/        ← edición del perfil del usuario logueado
        └── [departmentId]/ ← rutas del panel de un departamento concreto
            ├── layout.tsx          ← envuelve con sidebar + header
            ├── page.tsx            ← home del departamento
            ├── DashboardLayout.tsx ← shell visual del panel
            ├── Sidebar.tsx         ← menú lateral
            ├── SidebarContext.tsx  ← contexto de apertura/cierre del sidebar
            ├── employees/          ← gestión de plantilla (incluye importación masiva CSV/JSON)
            ├── projects/           ← gestión de proyectos
            ├── requests/           ← solicitudes pendientes
            ├── statistics/         ← estadísticas (general / por usuario / por proyecto)
            ├── schedules/          ← plantillas de horario y asignaciones a usuarios/grupos
            └── settings/           ← configuración del departamento

components/
├── ui/                     ← primitivos de UI (Button, Input, Select, Dialog…)
│                             generados con shadcn, no se editan a mano
├── PageHeader.tsx          ← cabecera estándar de página: título, descripción, botones de acción
├── SectionHeader.tsx       ← cabecera estándar de sección dentro de una página
├── Navbar.tsx              ← barra superior pública (landing / about)
├── DashboardNavbar.tsx     ← barra superior dentro del panel
├── DashboardFooter.tsx     ← footer del panel
├── Footer.tsx              ← footer público
├── LoginForm.tsx           ← modal de login
├── RegisterForm.tsx        ← modal de registro de empresa
├── UserMenu.tsx            ← menú de usuario (perfil / logout)
├── LanguageSwitcher.tsx    ← selector de idioma (es / cat / en)
├── ThemeProvider.tsx       ← provider de next-themes
├── ThemeToggle.tsx         ← botón claro/oscuro
├── ConfirmDialog.tsx       ← diálogo de confirmación reutilizable
└── AppToaster.tsx          ← Toaster de sonner

i18n/
├── routing.ts              ← define los locales disponibles (es, cat, en) y el default
├── request.ts              ← carga los mensajes del JSON correspondiente al locale activo
└── navigation.ts           ← exporta Link/redirect/useRouter conscientes del locale

messages/
├── es.json                 ← traducciones en español (default)
├── cat.json                ← traducciones en catalán
└── en.json                 ← traducciones en inglés
                              Las 3 deben mantener exactamente las mismas claves.

lib/
└── utils.ts                ← cn(): combina clases Tailwind con clsx + tailwind-merge

proxy.ts                    ← middleware Next: aplica next-intl + comprueba JWT en rutas /dashboard
```

---

## Convenciones de organización

- **Archivos sueltos vs. utils**: si un componente cliente crece por encima de ~400 líneas y contiene
  funciones puras (parsers, cálculos, formateadores), extraerlas a un `*-utils.ts` paralelo. Ejemplo:
  `employees/import-utils.ts`, `employees/schedule-utils.ts`, `statistics/stats-utils.ts`.
- **Carpetas con prefijo `_`**: Next no genera ruta para ellas. Úsalas para agrupar componentes
  internos de una página (`_landing/`, `_components/`) y mantener limpia la raíz de la carpeta.
- **Server Component → Client Component**: el `page.tsx` carga datos en el servidor, llama al
  repository y los pasa como props a un `*Client.tsx` que vive en la misma carpeta.

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

## Internacionalización

- 3 locales: `es` (default), `cat`, `en`. Configurados en `i18n/routing.ts` con `localePrefix: "always"`,
  por lo que toda URL incluye el locale (`/es/dashboard`, `/en/dashboard`…).
- El middleware en `proxy.ts` resuelve el locale antes que la lógica de auth.
- Los textos viven en `messages/<locale>.json` agrupados por namespace (`landing`, `dashboard`,
  `employees`…). Acceso desde componentes con `useTranslations('namespace')` (cliente) o
  `getTranslations({ locale, namespace })` (servidor).
- Las 3 traducciones deben tener exactamente las mismas claves; si añades una a `es.json`, añádela
  también a `cat.json` y `en.json`.
