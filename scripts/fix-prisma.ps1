# Script para solucionar problemas con Prisma Client en Windows

Write-Host "🔍 Verificando procesos de Node.js..." -ForegroundColor Cyan

# Buscar procesos de Node.js
$nodeProcesses = Get-Process | Where-Object {$_.ProcessName -like "*node*"}

if ($nodeProcesses) {
    Write-Host "⚠️  Se encontraron procesos de Node.js ejecutándose:" -ForegroundColor Yellow
    $nodeProcesses | ForEach-Object {
        Write-Host "   - PID: $($_.Id) - $($_.ProcessName)" -ForegroundColor Yellow
    }
    Write-Host ""
    $response = Read-Host "¿Deseas finalizar estos procesos? (S/N)"
    if ($response -eq "S" -or $response -eq "s") {
        $nodeProcesses | ForEach-Object {
            try {
                Stop-Process -Id $_.Id -Force
                Write-Host "✓ Proceso $($_.Id) finalizado" -ForegroundColor Green
            } catch {
                Write-Host "✗ No se pudo finalizar proceso $($_.Id)" -ForegroundColor Red
            }
        }
        Start-Sleep -Seconds 2
    }
} else {
    Write-Host "✓ No hay procesos de Node.js ejecutándose" -ForegroundColor Green
}

Write-Host ""
Write-Host "🔍 Verificando si Prisma Client ya está generado..." -ForegroundColor Cyan

if (Test-Path "node_modules\.prisma\client\index.js") {
    Write-Host "✓ Prisma Client ya está generado" -ForegroundColor Green
    Write-Host ""
    $response = Read-Host "¿Deseas regenerarlo de todas formas? (S/N)"
    if ($response -ne "S" -and $response -ne "s") {
        Write-Host "Operación cancelada." -ForegroundColor Yellow
        exit 0
    }
}

Write-Host ""
Write-Host "🗑️  Eliminando carpeta .prisma existente..." -ForegroundColor Cyan

if (Test-Path "node_modules\.prisma") {
    try {
        Remove-Item -Recurse -Force "node_modules\.prisma" -ErrorAction Stop
        Write-Host "✓ Carpeta .prisma eliminada" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  No se pudo eliminar completamente la carpeta .prisma" -ForegroundColor Yellow
        Write-Host "   Intenta cerrar todas las aplicaciones y ejecutar este script como Administrador" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "🔨 Generando Prisma Client..." -ForegroundColor Cyan

try {
    npx prisma generate
    Write-Host ""
    Write-Host "✅ Prisma Client generado exitosamente!" -ForegroundColor Green
} catch {
    Write-Host ""
    Write-Host "❌ Error al generar Prisma Client:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Soluciones alternativas:" -ForegroundColor Yellow
    Write-Host "   1. Cierra todas las aplicaciones (VS Code, navegadores, etc.)" -ForegroundColor Yellow
    Write-Host "   2. Ejecuta PowerShell como Administrador" -ForegroundColor Yellow
    Write-Host "   3. Reinicia tu computadora" -ForegroundColor Yellow
    Write-Host "   4. Si Prisma Client ya existe, puedes continuar sin regenerarlo" -ForegroundColor Yellow
}
