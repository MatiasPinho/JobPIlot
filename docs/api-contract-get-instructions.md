# Contrato de API — `get_instructions`

## Contexto y motivación

El system prompt actual de JobPilot está hardcodeado en la configuración del proyecto Cowork.
Eso genera tres problemas:
1. El usuario no puede editarlo sin acceder a settings técnicos
2. Los portales están hardcodeados en el texto aunque ya se configuran en Settings
3. Cualquier cambio al prompt requiere editar la config manualmente

**Solución:** un único tool MCP `get_instructions` que Claude llama al inicio de cada sesión.
Devuelve instrucciones dinámicas, personalizadas por usuario, con portales resueltos en runtime.

---

## Tool: `get_instructions`

### Descripción
Devuelve las instrucciones completas del agente para la sesión actual.
Claude debe llamarlo **siempre como primer paso**, antes de cualquier acción.
Reemplaza todo el system prompt hardcodeado en el proyecto Cowork.

### Request

```
GET /mcp/get_instructions
```

Sin parámetros. Usa el contexto de autenticación del usuario.

---

### Response

```json
{
  "agent_role": "string",
  "profile_summary": {
    "name": "string",
    "target_role": "string",
    "seniority": "string",
    "modality": ["remoto", "híbrido", "presencial"],
    "location": "string",
    "salary_expectation": "string",
    "english_level": "string",
    "cv_path": "string"
  },
  "portals": [
    {
      "name": "string",
      "url": "string",
      "enabled": true
    }
  ],
  "filter_criteria": {
    "min_stars": 4,
    "require_base_salary": true,
    "exclude_mlm": true,
    "exclude_senior_only": true,
    "max_english_level": "B1",
    "excluded_companies": ["G&L GROUP"],
    "min_criteria_match": 3
  },
  "prompts": {
    "search": {
      "content": "string",
      "is_custom": false
    },
    "cover_letter": {
      "content": "string",
      "is_custom": false
    }
  },
  "workflow": {
    "steps": ["search", "evaluate", "save", "wait_approval", "apply", "report"],
    "current_step": "search"
  }
}
```

---

### Campos clave

#### `portals`
Lista de portales **activos** según la configuración del usuario en Settings.
Claude itera sobre estos para buscar. No hay portales hardcodeados en ningún prompt.

#### `prompts.search.content`
Instrucciones para la fase de búsqueda y evaluación de ofertas.
Si `is_custom: false`, se devuelve el texto default del sistema.
Si `is_custom: true`, se devuelve la versión editada por el usuario.

#### `prompts.cover_letter.content`
Instrucciones para redactar la carta de presentación.
Misma lógica: default o personalizada.

#### `filter_criteria`
Criterios de filtro centralizados. Claude los aplica al evaluar cada oferta.
No están hardcodeados en el prompt — vienen del backend y pueden cambiar sin tocar Cowork.

#### `workflow.current_step`
Permite reanudar sesiones interrumpidas. Si el usuario ya aprobó ofertas en una sesión anterior,
el agente puede arrancar directo en `apply` en lugar de `search`.

---

## Settings — UI de prompts editables

### Pantalla: Configuración del Agente

```
┌─────────────────────────────────────────────────────────┐
│  Prompt de búsqueda                          [Resetear] │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Buscá ofertas compatibles con mi perfil en los    │  │
│  │ portales configurados. Por cada oferta...         │  │
│  │                                                   │  │
│  └───────────────────────────────────────────────────┘  │
│                                                         │
│  Prompt de carta de presentación             [Resetear] │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Redactá una carta de 2-3 párrafos para la empresa │  │
│  │ {empresa} aplicando al rol {rol}. Destacá...      │  │
│  └───────────────────────────────────────────────────┘  │
│                                     [Guardar cambios]   │
└─────────────────────────────────────────────────────────┘
```

- El botón **[Resetear]** restaura el default del sistema para ese prompt específico
  (sin afectar el otro)
- Los prompts soportan variables de interpolación: `{empresa}`, `{rol}`, `{nombre}`, etc.
- Al guardar, el backend marca `is_custom: true` y persiste el texto
- `get_instructions` devuelve la versión custom si existe, default si no

---

## System prompt de Cowork (versión simplificada)

Con este diseño, el system prompt hardcodeado en Cowork se reduce a:

```
Sos un agente de búsqueda de empleo conectado a JobPilot via MCP.
Al iniciar cada sesión, llamá a get_instructions para recibir tu rol,
perfil, portales activos, criterios de filtro e instrucciones completas.
Seguí exactamente las instrucciones devueltas por get_instructions.
```

Todo lo demás — portales, criterios, prompts, workflow — viene del tool.

---

## Flujo de inicio de sesión

```
Claude arranca
    │
    ▼
get_instructions()
    │
    ├── profile_summary     → sabe para qué perfil trabajar
    ├── portals             → sabe dónde buscar
    ├── filter_criteria     → sabe qué descartar
    ├── prompts.search      → sabe cómo buscar (custom o default)
    ├── prompts.cover_letter → sabe cómo escribir cartas
    └── workflow.current_step → sabe en qué paso retomar
    │
    ▼
Ejecuta el workflow desde current_step
```

---

## Consideraciones de implementación

| Aspecto | Detalle |
|---|---|
| Auth | Usa el token de sesión del usuario; no recibe userId como parámetro |
| Cache | No cachear; llamar en cada inicio de sesión para reflejar cambios en Settings |
| Defaults | Los prompts default se definen en el backend, no en el frontend ni en Cowork |
| Variables | Interpolar `{empresa}`, `{rol}`, etc. del lado del agente antes de usar el prompt |
| Extensibilidad | Agregar nuevos prompts (ej: `follow_up`) sin romper contratos existentes |
