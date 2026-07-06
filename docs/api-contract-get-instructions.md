# Contrato MCP - `get_instructions`

Este documento describe el comportamiento actual de `get_instructions`.

La regla del proyecto es:

```text
Antes de ejecutar cualquier tarea, Cowork debe llamar:
1. get_profile
2. get_instructions con el mode correspondiente
```

## Tool

`get_instructions`

## Input

```json
{
  "mode": "busqueda"
}
```

o:

```json
{
  "mode": "postulacion"
}
```

Valores validos:

- `busqueda`
- `postulacion`

## Output

Devuelve un bloque de texto MCP:

```json
{
  "content": [
    {
      "type": "text",
      "text": "..."
    }
  ]
}
```

No devuelve un JSON estructurado de workflow. Cowork debe leer el texto y seguirlo.

## Fuentes de datos

`get_instructions` arma el texto desde:

- `profile.json`
- `settings.json`

No lee prompts editables desde la UI. La pantalla Instrucciones solo muestra el preview de lo que Cowork recibe.

## Modo `busqueda`

Incluye:

- roles objetivo
- seniority buscado
- rango de anos de experiencia
- stack completo desde Perfil
- soft skills
- rango de pretension salarial
- modalidad preferida
- disponibilidad
- zona de residencia
- criterios de priorizacion
- filtros de exclusion desde Perfil
- portales desde Perfil/Settings
- plan de tareas de busqueda
- regla de presentar top 10 y esperar confirmacion
- regla de no postular
- regla de guardar en JobPilot solo ofertas compatibles o dudosas, no descartes duros
- busqueda en dos fases: barrido de listados (solo tarjetas, 8-10 queries, 3+ paginas por query) y luego lectura de detalle solo de candidatas
- objetivo de guardado: ~50 ofertas (compatibles + dudosas) si hay volumen; ante la duda se guarda como dudosa en vez de descartar
- descripcion en ingles no es descarte por si sola; solo descarta si el aviso exige nivel de ingles superior al perfil
- avisos que no cargan tras 2 reintentos se guardan como dudosas con los datos de la tarjeta
- regla de no declarar saturacion hasta correr todas las queries planificadas con sus 3+ paginas y que las ultimas 2 queries aporten <10% de ofertas nuevas; el costo de la sesion nunca es motivo de corte

No incluye:

- datos personales
- advertencia visual de datos sensibles
- texto del CV
- respuestas guardadas antiguas
- umbrales editables de scoring

## Modo `postulacion`

Incluye:

- trabajar solo sobre ofertas aprobadas en JobPilot
- llamar `list_approved_offers`
- adjuntar CV si existe `cvPath`
- pedir carta o mensaje personalizado al usuario
- marcar exito con `mark_offer_applied`
- registrar errores con `register_error`
- pedir ayuda humana si hay captcha, login, test tecnico o bloqueo

Regla central:

```text
NUNCA postular sin aprobacion humana en JobPilot.
```

## Variables

Los portales se resuelven desde `settings.portals`.

Si no hay portales configurados, el texto conserva placeholders como:

- `{portal_url}`
- `{portal}`

El perfil no usa placeholders porque se inserta como texto ya resuelto desde `profile.json`.

## Relacion con `get_profile`

`get_profile` devuelve el perfil completo. Eso incluye campos que `get_instructions` no imprime necesariamente.

Campos relevantes que Cowork puede ver por `get_profile`:

- `targetRole`
- `targetRoles`
- `personalInfo`
- `mainStack`
- `secondaryStack` por compatibilidad, hoy vacio desde la UI
- `targetSeniority`
- `experienceYearsMin`
- `experienceYearsMax`
- `experience`
- `softSkills`
- `salaryCurrency`
- `salaryMin`
- `salaryMax`
- `salaryExpectation`
- `availability`
- `preferredModality`
- `preferredLocation`
- `avoid`
- `cvPath`
- `cvText`
- `updatedAt`

Transparencia importante:

- `personalInfo` puede llegar a Cowork por `get_profile`.
- `cvText` puede llegar a Cowork por `get_profile`.
- `experience` y `salaryExpectation` se conservan por compatibilidad en `get_profile`; los campos operativos son los rangos estructurados.
- `personalInfo`, `cvText` y `experience` no influyen en scoring.
- La advertencia de datos sensibles solo se muestra en la UI.

## Scoring y estados

El scoring debe coincidir entre app y MCP:

- Score mayor o igual a 65: `recomendada`
- Score entre 35 y 64: `detectada`
- Score menor a 35: `rechazada`

Formula actual:

- Base 42.
- Stack: +8 por match, maximo +30.
- Modalidad preferida: +6.
- Ubicacion preferida: +6.
- Seniority compatible: +10.
- Seniority demasiado alto o anos requeridos por encima del rango maximo del perfil: -22.
- Anos requeridos por debajo del rango minimo del perfil: penalizacion de seniority/experiencia.
- Salario publicado compatible: +6.
- Salario publicado por debajo de la pretension: -18.
- Filtros de exclusion: -18 por match.

El seniority se evalua con reglas propias. `Semi Senior`, `Semi-Senior` y `SSR`
son compatibles entre si. Una exclusion generica `Senior` no debe penalizar una
oferta `Semi Senior`; solo debe matchear Senior real.

Si `Roles objetivo` o portales figuran como `No definido`, Cowork debe detener
la busqueda y pedir que se complete Perfil/Portales en JobPilot. No debe usar
roles frontend ni placeholders como fallback.

## Duplicados y ofertas ya postuladas

Cuando Cowork registra ofertas con `add_offer` o `add_offers`, el MCP intenta detectar duplicados por:

- URL normalizada
- misma empresa y titulo similar

Si la oferta duplicada ya esta `postulada`, el MCP devuelve un mensaje indicando que ya estaba cargada y postulada.

Esto no reemplaza la observacion visual del portal. Cowork igual debe mirar si el portal muestra que ya fue aplicada.

## Descartes durante la busqueda

Cowork no debe guardar en JobPilot las ofertas que reviso y descarto por criterios
duros o por falta clara de interes. Esas ofertas solo deben aparecer en el resumen
de cobertura como `descartadas no guardadas`, con un motivo breve.

Las ofertas que no cargan o cuya descripcion completa no puede leerse no son
descartes por criterio. Deben reportarse como `pendientes por error de carga`,
incluyendo URL, portal y reintentos.

Solo se guardan ofertas compatibles o dudosas que el usuario tenga que revisar. Si
el usuario luego rechaza una oferta desde JobPilot, ahi si queda registro como
`rechazada`.

## System prompt minimo para Cowork

```text
Sos un agente de busqueda y postulacion de empleo conectado a JobPilot via MCP.

Antes de ejecutar cualquier tarea siempre llama a:
1. get_profile
2. get_instructions con el mode correspondiente

Nunca postules sin aprobacion explicita del usuario en JobPilot.
```

Ese es el unico texto que hace falta cargar en las instrucciones del proyecto Cowork. El resto lo entrega JobPilot por MCP.
