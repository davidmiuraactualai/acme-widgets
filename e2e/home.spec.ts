import { expect, test } from '@playwright/test';

test('home page renders the hero h1 and links to the catalog', async ({
  page,
}) => {
  await page.goto('/');

  await expect(
    page.getByRole('heading', { level: 1, name: /widgets for all purposes/i }),
  ).toBeVisible();

  // Primary CTA links to /widgets. Use the link role + name; the wordmark
  // logo also links to /, but it doesn't match /catalog/i.
  await expect(
    page.getByRole('link', { name: /catalog/i }),
  ).toHaveAttribute('href', '/widgets');
});
