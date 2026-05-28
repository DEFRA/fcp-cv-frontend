#!/bin/bash
set -euo pipefail

export PATH="./node_modules/.bin:$PATH"

# Configure git hooks path — no-op in CI (Husky detects CI env var automatically)
husky

# Install Playwright Chromium — headless-only on CI, full build locally
if [ "${CI:-false}" = "true" ]; then
  playwright install chromium --only-shell --with-deps
else
  playwright install chromium --with-deps
fi

# Install chromedriver if not already present — no-op if binary already exists.
# Set SKIP_CHROMEDRIVER_INSTALL=true to bypass entirely (e.g. in publish-hotfix, where accessibility tests are not run).
if [ "${SKIP_CHROMEDRIVER_INSTALL:-false}" != "true" ] && [ ! -f "./node_modules/chromedriver/lib/chromedriver/chromedriver" ]; then
  echo "chromedriver not found, installing..."
  node node_modules/chromedriver/install.js
fi

