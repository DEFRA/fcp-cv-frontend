# JMeter Testing

These tests were run to performance test the CV front-end using previously missing calls and some fixes to the existing ones.

There were three tests run in this round, all testing different resource levels of CV and the DAL.

Date: 21 May 2026
Env: perf-test
React CV front-end version: v0.60.0
DAL version: v2.4.0

## Test 1 - Single DAL instance, Single CV front-end instance

Time: 16:14 to 16:23

### CDP Report

https://portal.cdp-int.defra.cloud/test-suites/test-results/perf-test/0.30.0/fcp-cv-frontend-performance-test/e3a4ea05-838e-4764-b1c5-8cceb35a3eeb/index.html

### Grafana Metrics (CV front-end)

https://metrics.perf-test.cdp-int.defra.cloud/d/d3f9bd38-6d99-4128-a99a-fb47deea287d/fcp-cv-frontend-service?orgId=1&from=2026-05-21T15:10:00.000Z&to=2026-05-21T15:25:00.000Z&timezone=browser&refresh=10s

### Grafana Metrics (DAL)

https://metrics.perf-test.cdp-int.defra.cloud/d/bejskn7edjwg0e/fcp-dal-api-service?orgId=1&from=2026-05-21T15:10:00.000Z&to=2026-05-21T15:25:59.000Z&timezone=browser&refresh=10s

### Grafana Metrics (upstream-mock)

https://metrics.perf-test.cdp-int.defra.cloud/d/bejsknoe18agwa/fcp-dal-upstream-mock-service?orgId=1&from=2026-05-21T15:10:00.000Z&to=2026-05-21T15:25:00.000Z&timezone=browser&refresh=10s

## Test 2 - Single DAL instance, 3x CV front-end instance

Time: 17:57 to 18:06

### CDP Report

https://portal.cdp-int.defra.cloud/test-suites/test-results/perf-test/0.30.0/fcp-cv-frontend-performance-test/82975068-5c1f-4330-88cd-8bedcfdb4f85/index.html

### Grafana Metrics (CV front-end)

https://metrics.perf-test.cdp-int.defra.cloud/d/d3f9bd38-6d99-4128-a99a-fb47deea287d/fcp-cv-frontend-service?orgId=1&from=2026-05-21T16:55:00.000Z&to=2026-05-21T17:10:00.000Z&timezone=browser&refresh=10s

### Grafana Metrics (DAL)

https://metrics.perf-test.cdp-int.defra.cloud/d/bejskn7edjwg0e/fcp-dal-api-service?orgId=1&from=2026-05-21T16:55:00.000Z&to=2026-05-21T17:10:00.000Z&timezone=browser&refresh=10s

### Grafana Metrics (upstream-mock)

https://metrics.perf-test.cdp-int.defra.cloud/d/bejsknoe18agwa/fcp-dal-upstream-mock-service?orgId=1&from=2026-05-21T16:55:00.000Z&to=2026-05-21T17:10:00.000Z&timezone=browser&refresh=10s

## Test 3 - 3x DAL instance, 3x CV front-end instance

Time: 18:27 to 18:36

### CDP Report

https://portal.cdp-int.defra.cloud/test-suites/test-results/perf-test/0.30.0/fcp-cv-frontend-performance-test/84019b67-2949-4ac6-9b75-d067e35cc54f/index.html

### Grafana Metrics (CV front-end)

https://metrics.perf-test.cdp-int.defra.cloud/d/d3f9bd38-6d99-4128-a99a-fb47deea287d/fcp-cv-frontend-service?orgId=1&from=2026-05-21T17:25:00.000Z&to=2026-05-21T17:40:00.000Z&timezone=browser&refresh=10s

### Grafana Metrics (DAL)

https://metrics.perf-test.cdp-int.defra.cloud/d/bejskn7edjwg0e/fcp-dal-api-service?orgId=1&from=2026-05-21T17:25:00.000Z&to=2026-05-21T17:40:00.000Z&timezone=browser&refresh=10s

### Grafana Metrics (upstream-mock)

https://metrics.perf-test.cdp-int.defra.cloud/d/bejsknoe18agwa/fcp-dal-upstream-mock-service?https:%2F%2Fmetrics.perf-test.cdp-int.defra.cloud%2Fd%2Fbejskn7edjwg0e%2Ffcp-dal-api-service%3ForgId=1&from=2026-05-21T17:25:00.000Z&to=2026-05-21T17:40:00.000Z&timezone=browser&refresh=10s&orgId=1

## Conclusion

With an improved performance test and Production-like instance counts, response times observed were both improved and acceptable.
