import { expect, test } from '@playwright/test';

test('orders page renders an h1 and the sales mailto link', async ({ page }) => {
  await page.goto('/orders');

  // Asserting an h1 exists so removing it in source produces a useful
  // failure ("expected to be visible" + the matched query).
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();

  // The literal email string must be visible somewhere in the DOM.
  await expect(page.getByText('sales@acmewidgets.com')).toBeVisible();

  // The mailto link points exactly at the bare address (no query params).
  await expect(
    page.getByRole('link', { name: /sales@acmewidgets\.com/ }),
  ).toHaveAttribute('href', 'mailto:sales@acmewidgets.com');
});
