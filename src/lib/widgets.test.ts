import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { fetchWidgets, parseWidgetsCsv, resetWidgetsCache } from './widgets';

const HEADER =
  'type,description,number_in_stock,price,icon,categories';

describe('parseWidgetsCsv', () => {
  it('preserves a quoted comma inside the description column', () => {
    const csv = [
      HEADER,
      'Classic Brass Widget,"A timeless hand-polished brass widget, suitable for everyday use.",42,19.99,brass-widget.svg,everyday;artisanal',
    ].join('\n');

    const widgets = parseWidgetsCsv(csv);
    expect(widgets).toHaveLength(1);
    const widget = widgets[0]!;
    expect(widget.description).toBe(
      'A timeless hand-polished brass widget, suitable for everyday use.',
    );
    expect(widget.description).toContain(',');
  });

  it('returns an empty array for an empty-but-valid CSV (header only)', () => {
    const csv = `${HEADER}\n`;
    expect(parseWidgetsCsv(csv)).toEqual([]);
  });

  it('coerces numeric fields and splits categories on ";"', () => {
    const csv = [
      HEADER,
      'Pocket Widget Mini,A travel-sized widget,260,4.99,pocket-widget.svg,everyday;kids;starter',
    ].join('\n');

    const [widget] = parseWidgetsCsv(csv);
    expect(widget).toMatchObject({
      type: 'Pocket Widget Mini',
      icon: 'pocket-widget.svg',
      numberInStock: 260,
      price: 4.99,
      categories: ['everyday', 'kids', 'starter'],
    });
    expect(typeof widget!.numberInStock).toBe('number');
    expect(typeof widget!.price).toBe('number');
  });

  it('falls back to 0 for a malformed price (does not throw)', () => {
    // Contract: parseFloat("abc") is NaN, our parser uses `|| 0`, so price = 0.
    // Asserted explicitly so the contract is fixed in the test suite.
    const csv = [
      HEADER,
      'Mystery Widget,Strange thing,5,abc,standard-widget.svg,everyday',
    ].join('\n');

    const widgets = parseWidgetsCsv(csv);
    expect(widgets).toHaveLength(1);
    expect(widgets[0]!.price).toBe(0);
  });

  it('throws when a required column is missing or renamed in the header', () => {
    // Header has "Price ($)" instead of "price" — without fail-loud validation,
    // every row would silently coerce to price 0. ADR 0002 requires this to throw.
    const renamedHeader =
      'type,description,number_in_stock,Price ($),icon,categories';
    const csv = [
      renamedHeader,
      'Classic Brass Widget,desc,42,19.99,brass-widget.svg,everyday',
    ].join('\n');

    expect(() => parseWidgetsCsv(csv)).toThrow(/missing required column/i);
  });

  it('drops rows with empty type or icon (does not crash)', () => {
    const csv = [
      HEADER,
      ',No type here,1,1.00,standard-widget.svg,everyday',
      'Has Type But No Icon,desc,1,1.00,,everyday',
      'Valid Widget,desc,1,1.00,standard-widget.svg,everyday',
    ].join('\n');

    const widgets = parseWidgetsCsv(csv);
    expect(widgets).toHaveLength(1);
    expect(widgets[0]!.type).toBe('Valid Widget');
  });
});

describe('fetchWidgets', () => {
  const SHEET_BODY = [
    HEADER,
    'Sheet Widget,from the live sheet,10,9.99,sheet.svg,everyday',
  ].join('\n');

  const FALLBACK_BODY = [
    HEADER,
    'Bundled Widget,from the local CSV,1,1.00,bundled.svg,everyday',
  ].join('\n');

  function csvResponse(body: string): Response {
    return new Response(body, {
      status: 200,
      headers: { 'content-type': 'text/csv' },
    });
  }

  beforeEach(() => {
    resetWidgetsCache();
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('fetches the sheet, parses it, and caches the result', async () => {
    const fetchMock = vi.fn().mockResolvedValue(csvResponse(SHEET_BODY));
    vi.stubGlobal('fetch', fetchMock);

    const first = await fetchWidgets();
    const second = await fetchWidgets();

    expect(first).toHaveLength(1);
    expect(first[0]!.type).toBe('Sheet Widget');
    expect(second).toBe(first);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock).toHaveBeenCalledWith(
      import.meta.env.VITE_WIDGETS_SHEET_URL,
    );
  });

  it('falls back to the bundled CSV with a console.warn on a network error', async () => {
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('network down'))
      .mockResolvedValueOnce(csvResponse(FALLBACK_BODY));
    vi.stubGlobal('fetch', fetchMock);

    const widgets = await fetchWidgets();

    expect(widgets).toHaveLength(1);
    expect(widgets[0]!.type).toBe('Bundled Widget');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(warn).toHaveBeenCalled();
  });

  it('falls back when the sheet returns a non-OK HTTP response', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(
        new Response('not found', {
          status: 404,
          statusText: 'Not Found',
        }),
      )
      .mockResolvedValueOnce(csvResponse(FALLBACK_BODY));
    vi.stubGlobal('fetch', fetchMock);

    const widgets = await fetchWidgets();

    expect(widgets[0]!.type).toBe('Bundled Widget');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does NOT fall back when the sheet returns 200 but the CSV is malformed', async () => {
    // Per ADR 0002: a successful fetch with bad headers means the sheet itself
    // is misconfigured — surface that as an error rather than papering over it
    // with stale bundled data.
    const renamedHeader =
      'type,description,number_in_stock,Price ($),icon,categories';
    const malformed = [
      renamedHeader,
      'Sheet Widget,desc,10,9.99,sheet.svg,everyday',
    ].join('\n');
    const fetchMock = vi.fn().mockResolvedValue(csvResponse(malformed));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchWidgets()).rejects.toThrow(/missing required column/i);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('clears the cache after a rejected fetch so the next call retries', async () => {
    // Both sheet and fallback fail — the rejection must clear the cache, or
    // every subsequent page load would replay the same failure.
    const fetchMock = vi
      .fn()
      .mockRejectedValueOnce(new TypeError('network down'))
      .mockRejectedValueOnce(new TypeError('still down'))
      .mockResolvedValueOnce(csvResponse(SHEET_BODY));
    vi.stubGlobal('fetch', fetchMock);

    await expect(fetchWidgets()).rejects.toThrow();

    const widgets = await fetchWidgets();
    expect(widgets[0]!.type).toBe('Sheet Widget');
  });
});
