# Cloudflare Tunnel en JobPilot

JobPilot usa `cloudflared` para exponer el servidor MCP local a Claude Cowork mediante una URL publica temporal.

## Para que sirve

JobPilot corre el MCP HTTP en la computadora del usuario:

```text
http://localhost:3005/mcp
```

Claude Cowork no siempre puede acceder directamente a `localhost`, especialmente si corre fuera del mismo entorno. Por eso JobPilot puede iniciar un tunel:

```bash
cloudflared tunnel --url http://localhost:3005
```

Cloudflare devuelve una URL temporal:

```text
https://random-name.trycloudflare.com
```

JobPilot muestra la URL final que hay que pegar en Cowork:

```text
https://random-name.trycloudflare.com/mcp
```

## Estado actual

JobPilot no instala `cloudflared` automaticamente. Solo intenta ejecutarlo.

La app busca `cloudflared` en este orden:

1. Ruta tipica de WinGet en Windows:

   ```text
   ~/AppData/Local/Microsoft/WinGet/Packages/Cloudflare.cloudflared_Microsoft.Winget.Source_8wekyb3d8bbwe/cloudflared.exe
   ```

2. Comando disponible en `PATH`:

   ```bash
   cloudflared
   ```

Si no existe en ninguna de esas dos ubicaciones, el tunel no va a iniciar correctamente.

## Instalacion

### Windows

Opcion recomendada:

```powershell
winget install Cloudflare.cloudflared
```

Verificar:

```powershell
cloudflared --version
```

Si el comando no aparece inmediatamente, cerrar y volver a abrir la terminal o la app.

### macOS

Con Homebrew:

```bash
brew install cloudflared
cloudflared --version
```

### Linux

Seguir la instalacion oficial de Cloudflare para la distribucion correspondiente y verificar:

```bash
cloudflared --version
```

## Uso desde JobPilot

1. Abrir JobPilot.
2. Ir a Conexion Cowork.
3. Iniciar `MCP HTTP`.
4. Iniciar `Cloudflare Tunnel`.
5. Esperar a que aparezca la URL `trycloudflare.com`.
6. Copiar la URL terminada en `/mcp`.
7. Pegarla en Claude Cowork como conexion MCP.

## Diagnostico rapido

Si el tunel no muestra URL:

- Confirmar que `MCP HTTP` este corriendo.
- Confirmar que el puerto `3005` no este bloqueado.
- Ejecutar `cloudflared --version`.
- Probar manualmente:

  ```bash
  cloudflared tunnel --url http://localhost:3005
  ```

- Si manualmente funciona pero JobPilot no muestra URL, revisar el log en Conexion Cowork.

## Limitaciones actuales

- La URL `trycloudflare.com` es temporal y cambia cada vez que se reinicia el tunel.
- JobPilot no instala `cloudflared` por el usuario.
- JobPilot no configura automaticamente Claude Cowork.
- En una app empaquetada final conviene incluir una deteccion visual clara de "cloudflared no instalado" y un link/boton de instalacion.

## Alternativas futuras

- Detectar `cloudflared` al abrir Conexion Cowork.
- Mostrar instrucciones de instalacion dentro de la app si falta.
- Incluir `cloudflared` como dependencia empaquetada.
- Permitir MCP local directo si Cowork soporta `localhost`.
- Agregar configuracion para usar otro proveedor de tunel.
