import { expect, test } from '@playwright/test';

test('widgets page renders cards from the live CSV with quoted-comma intact', async ({
  page,
}) => {
  await page.goto('/widgets');

  // Wait for at least one card; we look up a stable name string from the
  // CSV rather than a row index so reordering doesn't break the spec.
  const classicBrass = page.getByRole('article', { name: 'Classic Brass Widget' });
  await expect(classicBrass).toBeVisible();

  // The CSV row's description has an embedded comma — verify it survived
  // the parse intact (would truncate if a naive split-on-comma were used).
  await expect(
    classicBrass.getByText(
      'A timeless hand-polished brass widget, suitable for everyday use and treasured heirloom display.',
    ),
  ).toBeVisible();
});
