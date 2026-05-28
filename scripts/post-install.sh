#!/bin/bash
set -euo pipefail

export PATH="./node_modules/.bin:$PATH"

# Install Playwright Chromium — required for browser tests, always (not just CI)
# The zip extraction can hang on resource-constrained CI runners; retry with a timeout to recover.
# timeout(1) is not available on macOS without coreutils, so only use it when present.
_playwright_install() {
  if command -v timeout >/dev/null 2>&1; then
    DEBUG=pw:install timeout 180 playwright install chromium --only-shell --with-deps
  else
    DEBUG=pw:install playwright install chromium --only-shell --with-deps
  fi
}
for attempt in 1 2 3; do
  if _playwright_install; then break; fi
  [ "$attempt" -lt 3 ] || { echo "playwright install failed after 3 attempts"; exit 1; }
  echo "playwright install attempt ${attempt} timed out or failed, retrying..."
done
unset -f _playwright_install

# Install chromedriver if not already present — no-op if binary already exists.
# Set SKIP_CHROMEDRIVER_INSTALL=true to bypass entirely (e.g. in publish-hotfix, where accessibility tests are not run).
if [ "${SKIP_CHROMEDRIVER_INSTALL:-false}" != "true" ] && [ ! -f "./node_modules/chromedriver/lib/chromedriver/chromedriver" ]; then
  echo "chromedriver not found, installing..."
  node node_modules/chromedriver/install.js
fi

