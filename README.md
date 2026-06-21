# JobPilot

Centro de control para búsqueda laboral con Claude Cowork.

JobPilot **no reemplaza a Claude Cowork** — es el cerebro que organiza el flujo. Cowork sigue siendo el operador que usa Chrome y navega portales. JobPilot guarda el perfil, puntúa ofertas, evita duplicados, genera tareas para Cowork y registra resultados.

## Stack

- Electron 31 + electron-vite
- React 18 + TypeScript
- Tailwind CSS
- Zustand (estado)
- JSON local en `~/Documents/JobPilot/` (sin cloud, sin login)

## Comandos

```bash
npm install
npm run dev          # Electron + React en modo desarrollo
npm run build        # Build de producción
npm run typecheck    # Verificación de tipos sin compilar
npm run test         # Tests con Vitest (scoring y deduplicación)
npm run mcp:dev      # Servidor MCP experimental (stdio)
```

## Estructura de datos

Todos los datos se guardan en `~/Documents/JobPilot/`:

```
~/Documents/JobPilot/
├── data/
│   ├── profile.json      # Perfil laboral
│   ├── offers.json       # Todas las ofertas
│   ├── answers.json      # Banco de respuestas
│   └── settings.json     # Configuración
└── cowork/
    ├── busqueda/
    │   ├── 01_perfil.md                # Generado por JobPilot → Cowork
    │   ├── 02_tarea_busqueda.md        # Generado por JobPilot → Cowork
    │   ├── 03_schema_ofertas.json      # Schema de referencia
    │   └── ofertas_encontradas.json    # Cowork escribe aquí → JobPilot lee
    └── postulacion/
        ├── 01_tarea_postulacion.md     # Generado por JobPilot → Cowork
        ├── 02_ofertas_aprobadas.json   # Generado por JobPilot → Cowork
        ├── 03_banco_respuestas.json    # Generado por JobPilot → Cowork
        └── resultados.json             # Cowork escribe aquí → JobPilot lee
```

## Flujo completo

### Fase 1 — Búsqueda

1. Completá tu perfil en **Perfil**
2. En **Cowork Bridge** → "Preparar búsqueda para Cowork"
3. JobPilot genera los archivos en `cowork/busqueda/`
4. Abrís `02_tarea_busqueda.md` con Claude Cowork
5. Cowork busca ofertas en portales y guarda `ofertas_encontradas.json`
6. En **Cowork Bridge** → "Importar ofertas encontradas"
7. JobPilot procesa las ofertas: scoring, deduplicación, clasificación automática
8. En **Ofertas** revisás las recomendadas y aprobás las que te gustan

### Fase 2 — Postulación

9. En **Cowork Bridge** → "Preparar postulación para Cowork"
10. JobPilot genera los archivos en `cowork/postulacion/`
11. Abrís `01_tarea_postulacion.md` con Claude Cowork
12. Cowork postula a cada oferta aprobada y guarda `resultados.json`
13. En **Cowork Bridge** → "Importar resultados de postulación"
14. El **Tracker** se actualiza automáticamente

## Scoring

Las ofertas se puntúan de 0 a 100 según el perfil:

| Señal | Puntos |
|-------|--------|
| React | +15 |
| TypeScript | +12 |
| Angular | +12 |
| Frontend explícito | +10 |
| Remoto | +10 |
| Híbrido | +6 |
| CABA/AMBA | +5 |
| SSR / 2-3 años experiencia | +6 |
| APIs REST / Testing / Scrum | +3-4 c/u |
| **Soporte / Help Desk** | **-25** |
| Seniority 5+ años obligatorio | -20 |
| Infraestructura / DevOps | -20 |
| Presencial (sin híbrido) | -12 |
| Backend dominante | -15 |
| Inglés avanzado excluyente | -12 |

**Clasificación automática** (umbrales configurables en Settings):
- Score ≥ 65 → `recomendada`
- Score 35-64 → `detectada`
- Score < 35 → `rechazada`

## Estados de ofertas

| Estado | Descripción |
|--------|-------------|
| `detectada` | Importada, score medio, requiere revisión |
| `recomendada` | Score alto, sugerida para aprobar |
| `aprobada` | Aprobada para postular |
| `rechazada` | Descartada manualmente o por score bajo |
| `postulada` | Cowork la procesó con éxito |
| `pendiente_manual` | Captcha u obstáculo que requiere intervención humana |
| `pendiente_test` | Requiere completar un test técnico |
| `error` | Error de carga u otro problema técnico |
| `duplicada` | Misma oferta ya existente en el sistema |

## MCP Server (experimental)

El servidor MCP permite que Claude Cowork interactúe con JobPilot directamente,
sin necesidad de archivos intermedios.

### Configurar en Claude Code

Agregá al `~/.claude/claude_desktop_config.json` o al MCP config de tu cliente:

```json
{
  "mcpServers": {
    "jobpilot": {
      "command": "node",
      "args": ["--loader", "ts-node/esm", "mcp/server.ts"],
      "cwd": "C:/Users/mati1/projects/jobpilot"
    }
  }
}
```

### Herramientas disponibles

| Herramienta | Descripción |
|------------|-------------|
| `get_profile` | Devuelve el perfil laboral |
| `list_approved_offers` | Lista ofertas aprobadas listas para postular |
| `list_offers` | Lista ofertas filtradas por estado |
| `mark_offer_applied` | Marca una oferta como postulada |
| `register_error` | Registra error, pendiente_manual o pendiente_test |
| `get_tracker_summary` | Resumen con métricas del tracker |
| `get_answers_bank` | Devuelve el banco de respuestas frecuentes |

## Persistencia

Se eligió JSON plano en `~/Documents/JobPilot/` en lugar de SQLite o electron-store porque:
- Cero dependencias adicionales
- Los archivos son directamente legibles e inspeccionables
- Cowork puede leer/escribir los archivos de la carpeta `cowork/` directamente
- Para el volumen de datos esperado (cientos de ofertas), el rendimiento es más que suficiente

## Primer uso

1. `npm install && npm run dev`
2. La app carga datos de prueba automáticamente al primer arranque
3. Revisá las 8 ofertas de ejemplo en **Ofertas**
4. Configurá la carpeta de trabajo en **Settings**
5. Explorá el flujo desde **Cowork Bridge**

Para cargar datos de prueba manualmente: **Settings → Cargar datos de prueba**
