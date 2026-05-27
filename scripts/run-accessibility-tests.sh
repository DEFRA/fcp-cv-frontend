#!/bin/bash
set -euo pipefail

export PATH="./node_modules/.bin:$PATH"

# Install chromedriver if not already present — no-op if binary already exists
if [ ! -f "./node_modules/chromedriver/lib/chromedriver/chromedriver" ]; then
  echo "chromedriver not found, installing..."
  node node_modules/chromedriver/install.js
fi

# Run accessibility tests against the running app
# Expects docker to already be running (npm run up)
axe "${CV_URL:-http://localhost:3200}"
