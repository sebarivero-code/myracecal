# Script para reiniciar el servidor de desarrollo limpiamente

Write-Host "🛑 Deteniendo servidor de desarrollo..." -ForegroundColor Yellow

# Buscar y detener procesos de Node.js relacionados con Next.js
$nodeProcesses = Get-Process | Where-Object {
    $_.ProcessName -like "*node*" -and 
    $_.Path -like "*app*"
}

if ($nodeProcesses) {
    $nodeProcesses | ForEach-Object {
        try {
            Stop-Process -Id $_.Id -Force -ErrorAction SilentlyContinue
            Write-Host "✓ Proceso $($_.Id) detenido" -ForegroundColor Green
        } catch {
            # Ignorar errores si el proceso ya no existe
        }
    }
    Start-Sleep -Seconds 2
}

Write-Host ""
Write-Host "🧹 Limpiando carpeta .next..." -ForegroundColor Cyan

if (Test-Path ".next") {
    try {
        Remove-Item -Recurse -Force ".next" -ErrorAction Stop
        Write-Host "✓ Carpeta .next eliminada" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  No se pudo eliminar completamente .next (puede estar en uso)" -ForegroundColor Yellow
    }
} else {
    Write-Host "✓ Carpeta .next no existe" -ForegroundColor Green
}

Write-Host ""
Write-Host "🚀 Iniciando servidor de desarrollo..." -ForegroundColor Cyan
Write-Host ""

# Iniciar servidor
npm run dev
