import { describe, expect, it } from 'vitest';
import { parseWidgetsCsv } from './widgets';

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
