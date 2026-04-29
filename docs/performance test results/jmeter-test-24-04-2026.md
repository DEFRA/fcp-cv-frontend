## JMeter Testing

These tests were run on the perf-test environment against v0.49.0 of the React CV front-end

# CDP Report
https://portal.cdp-int.defra.cloud/test-suites/test-results/perf-test/0.22.0/fcp-cv-frontend-performance-test/d554a357-ce7f-46a3-b6d0-cf0c1a289808/index.html

# Grafana Metrics
https://metrics.perf-test.cdp-int.defra.cloud/d/d3f9bd38-6d99-4128-a99a-fb47deea287d/fcp-cv-frontend-service?orgId=1&from=2026-04-24T14:00:00.000Z&to=2026-04-24T14:30:00.000Z&timezone=browser&refresh=10s

# Conclusion
Some of the response times in this test were slower than expected. This is likely to be because the one instance of the CV front-end was reaching 100% of its CPU. It is likely that adding further instances will allieviate this problem.
