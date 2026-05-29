#!/bin/bash
set -euo pipefail

export PATH="./node_modules/.bin:$PATH"

echo ""
echo "npm scripts are disabled in this project (ignore-scripts=true) to defend against supply chain attacks."
echo "The following mandatory post-install scripts will now be executed."
if [ "${CI:-false}" != "true" ]; then
  echo "You will be prompted to confirm each command before it runs."
fi
echo ""

confirm_and_run() {
  if [ "${CI:-false}" != "true" ]; then
    printf 'You are about to run: %s\n' "$*"
    read -r -p "Please verify you are happy with the integrity of this command before proceeding. Enter yes to confirm [yes]: " response
    response="${response:-yes}"
    if [ "$response" != "yes" ]; then
      echo "Skipped."
      return 0
    fi
  fi
  "$@"
}

# Configure git hooks path — no-op in CI (Husky detects CI env var automatically)
confirm_and_run node ./node_modules/husky/bin.js

# Install Playwright Chromium — headless-only on CI, full build locally
if [ "${CI:-false}" = "true" ]; then
  confirm_and_run playwright install chromium --only-shell --with-deps
else
  confirm_and_run playwright install chromium --with-deps
fi

# Install chromedriver if not already present — no-op if binary already exists.
# Set SKIP_CHROMEDRIVER_INSTALL=true to bypass entirely (e.g. in publish-hotfix, where accessibility tests are not run).
if [ "${SKIP_CHROMEDRIVER_INSTALL:-false}" != "true" ] && [ ! -f "./node_modules/chromedriver/lib/chromedriver/chromedriver" ]; then
  echo "chromedriver not found, installing..."
  confirm_and_run node node_modules/chromedriver/install.js
fi
