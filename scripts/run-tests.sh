#!/bin/bash
set -euo pipefail

# Server-side unit tests (produces blob coverage report for merging)
vitest --coverage --reporter=blob --reporter=dot run

# Browser tests in headless mode (produces blob coverage report for merging)
HEADLESS=true vitest --config=vitest.browser.config.js --coverage --reporter=blob --reporter=dot run

# Merge blob reports from both runs into a single coverage report
vitest --config=vitest.merge.config.js --mergeReports coverage/merge --coverage run
