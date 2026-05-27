#!/bin/bash
set -euo pipefail

# Download the latest DAL API compose file
curl https://raw.githubusercontent.com/DEFRA/fcp-dal-api/refs/heads/main/compose.yml -o dal-api-compose.yml

# Build and start the full environment
# Any extra arguments (e.g. -d for detached mode) are forwarded to docker compose up
docker compose build
docker compose -f dal-api-compose.yml -f compose.yml -p fcp-cv up --pull always --quiet-pull --no-attach mongodb "$@"
