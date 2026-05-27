#!/bin/bash
set -euo pipefail

export PATH="./node_modules/.bin:$PATH"

# Install Playwright Chromium — required for browser tests, always (not just CI)
# If already installed locally then no attempt is made to re-install (so not a resource drain)
playwright install chromium --with-deps --only-shell

# Server-side unit tests (produces blob coverage report for merging)
vitest --coverage --reporter=blob --reporter=dot run

# Browser tests in headless mode (produces blob coverage report for merging)
HEADLESS=true vitest --config=vitest.browser.config.js --coverage --reporter=blob --reporter=dot run

# Merge blob reports from both runs into a single coverage report
vitest --config=vitest.merge.config.js --mergeReports coverage/merge --coverage run
