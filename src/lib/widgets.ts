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

let cache: Promise<Widget[]> | null = null;

export function fetchWidgets(): Promise<Widget[]> {
  if (cache) return cache;
  cache = (async () => {
    const url = `${import.meta.env.BASE_URL}data/widgets.csv`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(
        `Failed to load catalog (${response.status} ${response.statusText})`,
      );
    }
    const text = await response.text();
    return parseWidgetsCsv(text);
  })();
  cache.catch(() => {
    cache = null;
  });
  return cache;
}

export function resetWidgetsCache(): void {
  cache = null;
}
