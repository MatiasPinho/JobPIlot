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

- rol objetivo
- experiencia
- stack completo desde Perfil
- soft skills
- pretension salarial
- modalidad preferida
- disponibilidad
- zona de residencia
- criterios de priorizacion
- filtros de exclusion desde Perfil
- portales desde Perfil/Settings
- plan de tareas de busqueda
- regla de presentar top 10 y esperar confirmacion
- regla de no postular

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
- `personalInfo`
- `mainStack`
- `secondaryStack` por compatibilidad, hoy vacio desde la UI
- `experience`
- `softSkills`
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
- Ninguno de esos dos campos influye en scoring.
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
- Filtros de exclusion: -18 por match.

## Duplicados y ofertas ya postuladas

Cuando Cowork registra ofertas con `add_offer` o `add_offers`, el MCP intenta detectar duplicados por:

- URL normalizada
- misma empresa y titulo similar

Si la oferta duplicada ya esta `postulada`, el MCP devuelve un mensaje indicando que ya estaba cargada y postulada.

Esto no reemplaza la observacion visual del portal. Cowork igual debe mirar si el portal muestra que ya fue aplicada.

## System prompt minimo para Cowork

```text
Sos un agente de busqueda y postulacion de empleo conectado a JobPilot via MCP.

Antes de ejecutar cualquier tarea siempre llama a:
1. get_profile
2. get_instructions con el mode correspondiente

Nunca postules sin aprobacion explicita del usuario en JobPilot.
```

Ese es el unico texto que hace falta cargar en las instrucciones del proyecto Cowork. El resto lo entrega JobPilot por MCP.
