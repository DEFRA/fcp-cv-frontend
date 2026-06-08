## JMeter Testing

These tests were run to performance test the CV front-end using a more accurate usage model.

Date: 18th May 2026
Time: 18:18 to 18:27
Env: perf-test
React CV front-end version: v0.58.1

# CDP Report

https://portal.cdp-int.defra.cloud/test-suites/test-results/perf-test/0.28.0/fcp-cv-frontend-performance-test/b43389b1-3ae9-4eee-94ca-b8f3597f6c9b/index.html

# Grafana Metrics (CV front-end)

https://metrics.perf-test.cdp-int.defra.cloud/d/d3f9bd38-6d99-4128-a99a-fb47deea287d/fcp-cv-frontend-service?orgId=1&from=2026-05-18T17:15:00.000Z&to=2026-05-18T17:30:00.000Z&timezone=browser&refresh=10s

# Grafana Metrics (upstream-mock)

https://metrics.perf-test.cdp-int.defra.cloud/d/bejsknoe18agwa/fcp-dal-upstream-mock-service?orgId=1&from=2026-05-18T17:15:00.000Z&to=2026-05-18T17:30:00.000Z&timezone=browser&refresh=10s

# Conclusion

With a more accurate model of how users will be using the system, times were significantly faster but still potentially slower than expected (averaging 1865ms). The one instance of the CV front-end did not reach 100% of its CPU during the test.
