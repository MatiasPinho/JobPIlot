# JobPilot

Centro de control local para busqueda laboral con Claude Cowork.

JobPilot no reemplaza a Claude Cowork. JobPilot guarda el perfil, portales, ofertas, aprobaciones y estado del tracker. Cowork sigue siendo el operador que usa Chrome, lee portales y ejecuta postulaciones mediante herramientas MCP.

## Estado actual

- App desktop en desarrollo, pensada para correr localmente.
- Los datos se guardan en JSON local, sin cloud ni login propio.
- Cowork se conecta a JobPilot por MCP desde la pantalla Conexion Cowork.
- Las instrucciones largas no se editan a mano: se generan desde Perfil y Portales.
- Las postulaciones requieren aprobacion humana previa dentro de JobPilot.

Hoy no esta cubierto todo por tests. Hay tests para scoring y deduplicacion, pero faltan tests de UI, flujo MCP completo, aprobacion/postulacion y empaquetado.

## Stack

- Electron 31 + electron-vite
- React 18 + TypeScript
- Tailwind CSS
- Zustand
- Vitest
- MCP SDK
- JSON local en `~/Documents/JobPilot/data`

## Comandos

```bash
npm install
npm run dev
npm run build
npm run typecheck
npm run test
npm run mcp:dev
npm run mcp:http
```

`npm run test -- --coverage` requiere instalar/configurar `@vitest/coverage-v8`.

## Requisitos externos

Para desarrollo local hace falta:

- Node.js y npm.
- Claude Cowork con capacidad de conectar MCP HTTP.
- `cloudflared` si Cowork necesita acceder al MCP desde una URL publica.

JobPilot levanta el MCP local en `http://localhost:3005/mcp`. Para exponerlo a Cowork usa Cloudflare Tunnel:

```bash
cloudflared tunnel --url http://localhost:3005
```

La app intenta encontrar `cloudflared` en:

- La instalacion de WinGet de Windows:
  `~/AppData/Local/Microsoft/WinGet/Packages/Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe/cloudflared.exe`
- El `PATH` del sistema como `cloudflared`.

Si `cloudflared` no esta instalado, el boton Cloudflare Tunnel puede fallar o no devolver URL. Ver detalles en [docs/cloudflared-tunnel.md](docs/cloudflared-tunnel.md).

## Datos locales

JobPilot persiste datos en:

```text
~/Documents/JobPilot/data/
  profile.json
  offers.json
  settings.json
  help_requests.json
```

Archivos principales:

- `profile.json`: perfil laboral, stack, filtros, datos personales opcionales, CV y texto extraido del CV.
- `settings.json`: configuracion minima de app y portales de busqueda.
- `offers.json`: ofertas detectadas, recomendadas, aprobadas, postuladas, duplicadas o con error.
- `help_requests.json`: pedidos de ayuda que Cowork deja cuando necesita intervencion humana.

## Flujo de uso

1. Completar Perfil.
2. Cargar portales de busqueda en Perfil.
3. Abrir Conexion Cowork.
4. Iniciar el servidor MCP y el tunel si hace falta.
5. Copiar la URL MCP en Claude Cowork.
6. En Instrucciones, copiar una sola vez el system prompt corto del proyecto.
7. Pedirle a Cowork que busque ofertas.
8. Revisar las ofertas en JobPilot y aprobar solo las que correspondan.
9. Pedirle a Cowork que postule a las aprobadas.
10. Revisar resultados en Tracker y Dashboard.

La pantalla Instrucciones no es para editar el prompt. Sirve para ver y copiar los textos que Cowork necesita. El contenido operativo sale de Perfil y Portales.

## Que lee Cowork

Cowork debe llamar siempre:

1. `get_profile`
2. `get_instructions` con `mode: "busqueda"` o `mode: "postulacion"`

`get_profile` devuelve el perfil completo, incluyendo:

- roles objetivo
- seniority buscado
- stack
- rango de anos de experiencia
- soft skills
- rango de pretension salarial
- disponibilidad
- modalidad y ubicacion preferidas
- filtros de exclusion
- datos personales opcionales
- ruta y texto del CV, si existe

`get_instructions` devuelve el plan textual para la tarea actual. En busqueda usa perfil y portales. En postulacion refuerza que solo puede trabajar con ofertas aprobadas.

Los datos personales existen para completar formularios si el portal los pide. No influyen en scoring. La advertencia visual de datos sensibles solo vive en la UI y no se envia como instruccion a Cowork.

## Herramientas MCP

| Herramienta | Uso |
|---|---|
| `get_profile` | Lee el perfil actualizado del usuario. |
| `get_instructions` | Devuelve instrucciones para busqueda o postulacion. |
| `list_offers` | Lista ofertas por estado. |
| `list_approved_offers` | Lista solo ofertas aprobadas para postular. |
| `add_offer` | Registra una oferta compatible o dudosa encontrada por Cowork. |
| `add_offers` | Registra varias ofertas compatibles o dudosas encontradas por Cowork. |
| `mark_offer_applied` | Marca una oferta como postulada. |
| `register_error` | Registra error, pendiente manual o pendiente test. |
| `request_human_help` | Pide ayuda al usuario desde JobPilot. |
| `request_cover_letter` | Pide al usuario una carta o mensaje personalizado. |
| `get_tracker_summary` | Devuelve resumen de seguimiento. |

## Reglas duras

- Cowork nunca debe postular sin aprobacion explicita en JobPilot.
- Cowork debe usar `list_approved_offers` para postular.
- Cowork no debe guardar ofertas descartadas por criterios duros; esas van solo en el resumen de cobertura.
- Cowork debe pedir carta o mensaje personalizado al usuario antes de enviar una postulacion que la requiera.
- Si una oferta ya existe, `add_offer` y `add_offers` intentan detectarla como duplicada.
- Si la oferta ya esta postulada y Cowork intenta agregarla otra vez, el MCP responde que ya estaba cargada/postulada.
- Si hay captcha, login, test tecnico o duda importante, Cowork debe pedir ayuda humana.

## Scoring

El scoring va de 0 a 100:

- Base: 42 puntos.
- Cada tecnologia del stack que aparece en titulo, descripcion o requisitos suma 8 puntos.
- El stack suma como maximo 30 puntos.
- Modalidad preferida suma 6 puntos.
- Ubicacion preferida suma 6 puntos.
- Seniority compatible suma 10 puntos.
- Seniority demasiado alto o anos requeridos por encima del rango maximo del perfil resta 22 puntos.
- Anos requeridos por debajo del rango minimo del perfil tambien penalizan.
- Salario publicado compatible suma 6 puntos; salario publicado por debajo de la pretension resta 18 puntos.
- Cada filtro de exclusion encontrado resta 18 puntos.

El seniority buscado vive como campo explicito del perfil. `Semi Senior`,
`Semi-Senior` y `SSR` se tratan como equivalentes, y una exclusion generica
`Senior` no penaliza automaticamente ofertas `Semi Senior`.

Los anos de experiencia y la pretension salarial se guardan como rangos
estructurados. Los campos de texto `experience` y `salaryExpectation` se
mantienen por compatibilidad, pero se derivan de los rangos al guardar.
Si faltan roles objetivo o portales, `get_instructions` debe frenar la busqueda
y pedir completar Perfil/Portales en vez de inventar defaults.

Clasificacion:

| Score | Estado |
|---|---|
| 65 a 100 | `recomendada` |
| 35 a 64 | `detectada` |
| 0 a 34 | `rechazada` |

El stack secundario fue eliminado de la UI. La totalidad del stack editable vive en Perfil como un unico campo.

## Estados de ofertas

| Estado | Significado |
|---|---|
| `detectada` | Oferta cargada, requiere revision. |
| `recomendada` | Buen match segun scoring. |
| `aprobada` | El usuario la aprobo para postular. |
| `rechazada` | Descartada por usuario o score bajo. |
| `postulada` | Cowork marco la postulacion como enviada. |
| `pendiente_manual` | Requiere intervencion humana. |
| `pendiente_test` | Requiere test tecnico antes de continuar. |
| `error` | Hubo un problema al procesarla. |
| `duplicada` | Ya existe una oferta equivalente. |

## Desarrollo pendiente

- Tests de contrato MCP para `get_profile` y `get_instructions`.
- Tests de flujo completo de aprobacion y postulacion.
- Tests UI para Perfil, Instrucciones, Conexion Cowork y Dashboard.
- Documentacion de instalacion para usuarios no tecnicos.
- Build distribuible firmado o instalador final.
- Coverage configurado en Vitest.
