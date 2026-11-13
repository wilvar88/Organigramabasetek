# 🏢 Organigrama Dinámico Basetek S.A.S | Gestión Humana

Visualizador interactivo de organigrama corporativo de alta fidelidad para **Basetek S.A.S**, diseñado con arquitectura moderna Vanilla CSS (Neumorfismo + Glassmorfismo), D3.js v7, SheetJS, soporte de posiciones vacantes, privacidad de documentos, correo corporativo, auto-guardado en JSON, auto-zoom por grupo y panel de administración protegido con persistencia en `data/admins.json`. Optimizado para despliegue en **GitHub** y **Vercel**.

Repositorio oficial: [https://github.com/wilvar88/Organigramabasetek.git](https://github.com/wilvar88/Organigramabasetek.git)

---

## ✨ Novedades y Características Principales

1. **Privacidad de Documento & Correo Corporativo**:
   - Los números de documento (`Documento`) se usan únicamente de forma interna para construir la jerarquía y **nunca se muestran** en las tarjetas, tarjetas transversales ni en el modal de detalle.
   - Se incorpora la columna **`Correo`** en la plantilla oficial para que los colaboradores puedan visualizar y contactar fácilmente por correo electrónico a sus compañeros de equipo.

2. **Menú Protegido por Acceso Administrador (`data/admins.json`)**:
   - De forma predeterminada, el organigrama inicia limpio y siempre activo en **Vista Jerárquica**, manteniendo ocultas las opciones del menú de administración.
   - Al hacer clic en el ícono de **Acceso Administrador**, el sistema solicita credenciales (por defecto: Usuario `1069432843`) y desbloquea las herramientas (Subir Excel, Descargar Plantilla, Vista Transversal, Ocultar Datos, Exportar Presentación, Gestión de Usuarios Admin y Ayuda).
   - Los usuarios administradores se leen y guardan automáticamente en `data/admins.json` (vía `/api/admins` y `/api/save-admins`) y se respaldan en el navegador, permitiendo agregar o administrar nuevos administradores desde la misma interfaz.

3. **Auto-Guardado Automático en JSON al subir Excel**:
   - Al hacer clic en **"Subir Excel"** y seleccionar un archivo `.xlsx`, el sistema procesa toda la jerarquía y **guarda automáticamente el archivo `data/organigrama.json`** en el proyecto (cuando se ejecuta con el servidor local Node.js `npm start`).
   - Además, cuenta con guardado instantáneo en la memoria del navegador (`localStorage`) y descarga automática como respaldo si se abre como archivo estático.

4. **Auto-Zoom Inteligente por Grupo al Expandir (`+`)**:
   - Al pulsar el botón `+` para desplegar cualquier grupo o jefatura, la vista realiza una suave transición cinemática que **centra el grupo y ajusta el zoom al tamaño máximo posible** para que todos los colaboradores del equipo recién abierto sean visibles en el recuadro de la pantalla.
   - Al colapsar, se re-centra suavemente sobre el líder del equipo.

5. **Identidad Visual Basetek S.A.S**:
   - Paleta corporativa oficial de **Basetek S.A.S**: `#01326c`, `#2279b1`, `#43bff5` sobre fondo blanco limpio (`#ffffff`).
   - Logo oficial de Basetek S.A.S integrado en la esquina superior izquierda (`logo.png`).
   - Modo de exportación a presentación ejecutiva en formato 16:9 con alta resolución.

---

## 🚀 Despliegue Rápido en Vercel (Paso a Paso)

Este proyecto está optimizado como aplicación web estática de alto rendimiento para desplegarse en segundos en **Vercel**:

### Opción A: Despliegue con 1 Clic desde GitHub (Recomendado)
1. Ve a tu cuenta en [vercel.com](https://vercel.com) e inicia sesión (con tu cuenta de GitHub).
2. Haz clic en el botón **"Add New..."** -> **"Project"**.
3. En la lista de repositorios, selecciona **`Organigramabasetek`** (o importa `https://github.com/wilvar88/Organigramabasetek.git`).
4. Vercel detectará automáticamente la configuración (`vercel.json` y `package.json`). **No necesitas configurar comandos de build ni variables de entorno.**
5. Haz clic en **"Deploy"**.

### Opción B: Despliegue mediante Vercel CLI
```bash
vercel login
vercel --prod
```

---

## 💻 Comandos Git para Sincronizar con GitHub

```bash
git status
git add .
git commit -m "feat: adaptacion Basetek S.A.S, correo, privacidad documento y acceso administrador"
git branch -M main
git push -u origin main
```

---

## 📊 Estructura de Columnas del Excel (11 Columnas Oficiales)

Puedes descargar la plantilla oficial en cualquier momento desde el panel administrador haciendo clic en **"Descargar Plantilla"**. El archivo contiene las siguientes 11 columnas en orden:

| # | Columna | Obligatorio | Descripción |
|---|---------|-------------|-------------|
| 1 | **Documento** | Sí | Cédula, DNI o identificador único interno del colaborador (no se muestra en pantalla). |
| 2 | **Nombre** | Sí | Nombre completo del colaborador (o escribir `Vacante`). |
| 3 | **Correo** | Recomendado | Correo electrónico corporativo del colaborador (visible para el equipo). |
| 4 | **Foto del Colaborador** | Opcional | Enlace directo a imagen o enlace compartido de **Google Drive**. Si está vacío, se genera un avatar con las iniciales. |
| 5 | **Cargo** | Sí | Título oficial del cargo (ej. `Gerente de Tecnología & CTO`). |
| 6 | **Área** | Sí | Área o departamento operativo (ej. `Infraestructura Cloud`). |
| 7 | **Gerencia** | Sí | Gerencia o división a la que pertenece (ej. `Gerencia de Tecnología`). |
| 8 | **Nivel** | Sí | Nivel estratégico (ej. `Nivel 1 - Estratégico`, `Nivel 2 - Táctico`, etc.). |
| 9 | **Reporta A** | Opcional | Documento de identidad interno del jefe directo. |
| 10 | **Nombre a Quien Reporta** | Opcional | Nombre del jefe o líder directo (o escribir `Vacante`). |
| 11 | **Cargo a quien reporta** | Opcional | Título del cargo del jefe directo (ej. `Gerente de Operaciones & Supply Chain`). |

---

## 🛠️ Ejecución Local

Para probar localmente en tu equipo:
- **Modo Servidor Local (Recomendado)**:
  ```bash
  npm start
  # Abre http://localhost:3000
  ```
  Permite lectura y escritura automática en disco de `data/organigrama.json` y `data/admins.json`.
- **Modo Navegador Directo**:
  Abre directamente `index.html` en Chrome, Edge o Firefox con doble clic.

---
*© 2026 Basetek S.A.S — Propiedad intelectual, arquitectura y desarrollo por Wilson Varela.*
