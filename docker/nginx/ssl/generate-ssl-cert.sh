#!/usr/bin/env bash
# Genera certificado autofirmado para HTTPS local (gestion.iesperemaria.local)
# Ejecutar desde la raíz del proyecto: ./docker/nginx/ssl/generate-ssl-cert.sh

set -e
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# En Git Bash (Windows) evita que /CN=... se interprete como ruta
export MSYS_NO_PATHCONV=1
openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout key.pem -out cert.pem \
  -subj "/CN=gestion.iesperemaria.local" \
  -addext "subjectAltName=DNS:gestion.iesperemaria.local,DNS:localhost"

echo "Certificados generados: cert.pem y key.pem"
