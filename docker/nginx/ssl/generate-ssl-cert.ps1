# Genera certificado autofirmado para HTTPS local (gestion.iesperemaria.local)
# Ejecutar desde la raíz del proyecto: .\docker\nginx\ssl\generate-ssl-cert.ps1

$sslDir = $PSScriptRoot
Set-Location $sslDir

$openssl = Get-Command openssl -ErrorAction SilentlyContinue
if (-not $openssl) {
    Write-Error "No se encontró 'openssl'. Instálalo o usa Git Bash y ejecuta: ./docker/nginx/ssl/generate-ssl-cert.sh"
    exit 1
}

& openssl req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout key.pem -out cert.pem `
  -subj "/CN=gestion.iesperemaria.local" `
  -addext "subjectAltName=DNS:gestion.iesperemaria.local,DNS:localhost"

if ($LASTEXITCODE -eq 0) {
    Write-Host "Certificados generados: cert.pem y key.pem"
} else {
    Write-Error "Error al generar certificados"
    exit 1
}
