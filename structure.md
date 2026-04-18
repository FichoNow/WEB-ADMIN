# WEB-ADMIN

```
app/
├── types/                  ← interfaces TypeScript que reflejan los datos de la API
│   └── auth/
├── services/               ← hacen el fetch a la API, lanzan Error si algo falla
│   └── auth-service.ts
├── actions/                ← validan el formulario, llaman al service, manejan cookies
│   └── auth.ts
├── (dashboard)/            ← rutas protegidas del panel (solo admins)
│   └── ...
├── globals.css             ← estilos globales y variables de color
├── layout.tsx              ← estructura HTML base que envuelve todas las páginas
└── page.tsx                ← página de login (ruta raíz "/")
```
