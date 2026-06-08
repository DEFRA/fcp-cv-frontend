## JMeter Testing

These tests were run on the perf-test environment against v0.57.0 of the React CV front-end

Date: 15th May 2026
Time: 13:40-13:50

# CDP Report

https://portal.cdp-int.defra.cloud/test-suites/test-results/perf-test/0.23.0/fcp-cv-frontend-performance-test/ec8e1881-bed4-4fc9-81d0-07da2effbfcb/index.html

# Grafana Metrics (CV front-end)

https://metrics.perf-test.cdp-int.defra.cloud/d/d3f9bd38-6d99-4128-a99a-fb47deea287d/fcp-cv-frontend-service?orgId=1&from=2026-05-15T12:35:00.000Z&to=2026-05-15T12:55:00.000Z&timezone=browser&refresh=10s

# Grafana Metrics (upstream-mock)

'https://metrics.perf-test.cdp-int.defra.cloud/d/bejsknoe18agwa/fcp-dal-upstream-mock-service?orgId=1&from=2026-05-15T12:35:00.000Z&to=2026-05-15T12:55:00.000Z&timezone=browser&refresh=10s

# Conclusion

Some of the response times in this test were slower than expected (averaging 3805ms). This is likely to be because the one instance of the CV front-end was reaching 100% of its CPU. It is likely that adding further instances will alleviate this problem.
