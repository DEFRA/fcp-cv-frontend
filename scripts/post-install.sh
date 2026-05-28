#!/bin/bash
set -euo pipefail

export PATH="./node_modules/.bin:$PATH"

# Install Playwright Chromium — required for browser tests, always (not just CI)
# If already installed locally then no attempt is made to re-install (so not a resource drain)
playwright install chromium --only-shell

# Install chromedriver if not already present — no-op if binary already exists.
# Set SKIP_CHROMEDRIVER_INSTALL=true to bypass entirely (e.g. in publish-hotfix, where accessibility tests are not run).
if [ "${SKIP_CHROMEDRIVER_INSTALL:-false}" != "true" ] && [ ! -f "./node_modules/chromedriver/lib/chromedriver/chromedriver" ]; then
  echo "chromedriver not found, installing..."
  node node_modules/chromedriver/install.js
fi

