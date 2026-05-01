import Papa from 'papaparse';

export type Widget = {
  type: string;
  description: string;
  numberInStock: number;
  price: number;
  icon: string;
  categories: string[];
};

type CsvRow = {
  type?: string;
  description?: string;
  number_in_stock?: string;
  price?: string;
  icon?: string;
  categories?: string;
};

const REQUIRED_COLUMNS = [
  'type',
  'description',
  'number_in_stock',
  'price',
  'icon',
  'categories',
] as const;

export function parseWidgetsCsv(csv: string): Widget[] {
  const result = Papa.parse<CsvRow>(csv, {
    header: true,
    skipEmptyLines: true,
  });

  if (result.errors.length > 0) {
    const fatal = result.errors.find((e) => e.type !== 'FieldMismatch');
    if (fatal) {
      throw new Error(`CSV parse error: ${fatal.message}`);
    }
  }

  const fields = result.meta.fields ?? [];
  const missing = REQUIRED_COLUMNS.filter((c) => !fields.includes(c));
  if (missing.length > 0) {
    throw new Error(
      `Catalog CSV is missing required column(s): ${missing.join(', ')}`,
    );
  }

  const widgets: Widget[] = [];
  for (const row of result.data) {
    const type = row.type?.trim();
    const icon = row.icon?.trim();
    if (!type || !icon) {
      console.warn('Skipping CSV row with empty type or icon:', row);
      continue;
    }
    widgets.push({
      type,
      description: row.description?.trim() ?? '',
      numberInStock: Number.parseInt(row.number_in_stock ?? '0', 10) || 0,
      price: Number.parseFloat(row.price ?? '0') || 0,
      icon,
      categories:
        row.categories
          ?.split(';')
          .map((c) => c.trim())
          .filter(Boolean) ?? [],
    });
  }
  return widgets;
}

async function fetchCatalogCsv(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(
      `Failed to load catalog (${response.status} ${response.statusText})`,
    );
  }
  return response.text();
}

let cache: Promise<Widget[]> | null = null;

export function fetchWidgets(): Promise<Widget[]> {
  if (cache) return cache;
  cache = (async () => {
    const sheetUrl = import.meta.env.VITE_WIDGETS_SHEET_URL;
    const fallbackUrl = `${import.meta.env.BASE_URL}data/widgets.csv`;
    let csv: string;
    try {
      csv = await fetchCatalogCsv(sheetUrl);
    } catch (error) {
      // Fall back only when the sheet itself is unreachable (network error or
      // non-OK HTTP). A successful fetch with malformed CSV propagates from
      // parseWidgetsCsv below — per ADR 0002, bad data fails loud rather than
      // being papered over with stale bundled data.
      console.warn(
        'Sheet catalog unreachable; falling back to bundled widgets.csv.',
        error,
      );
      csv = await fetchCatalogCsv(fallbackUrl);
    }
    return parseWidgetsCsv(csv);
  })();
  cache.catch(() => {
    cache = null;
  });
  return cache;
}

export function resetWidgetsCache(): void {
  cache = null;
}
