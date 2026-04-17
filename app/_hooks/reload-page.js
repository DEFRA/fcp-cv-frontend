/**
 * It's not possible to mock window.location.reload when running tests using Playwright.
 * Extracting it here allows this module to be mocked, making it straightforward to assert
 * that reload is triggered in consuming functions.
 */
export function reloadPage() {
  window.location.reload()
}
