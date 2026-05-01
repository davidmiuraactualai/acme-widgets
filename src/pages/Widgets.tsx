import { useMemo } from 'react';
import { Link, useLoaderData, useSearchParams } from 'react-router';
import WidgetCard from '../components/WidgetCard';
import WidgetCardSkeleton from '../components/WidgetCardSkeleton';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import type { Widget } from '../lib/widgets';
import { fetchWidgets } from '../lib/widgets';

export async function widgetsLoader(): Promise<Widget[]> {
  return fetchWidgets();
}

export function WidgetsHydrateFallback() {
  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <header>
        <h1 className="font-display font-black text-[44px] text-ink">
          The Catalog
        </h1>
        <p className="font-sans text-[16px] text-ink-soft mt-2 max-w-prose">
          Loading the catalog…
        </p>
      </header>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {Array.from({ length: 6 }).map((_, i) => (
          <WidgetCardSkeleton key={i} />
        ))}
      </div>
    </section>
  );
}

function categoryCounts(widgets: Widget[]): Map<string, number> {
  const counts = new Map<string, number>();
  for (const w of widgets) {
    for (const c of w.categories) {
      counts.set(c, (counts.get(c) ?? 0) + 1);
    }
  }
  return counts;
}

export default function Widgets() {
  useDocumentTitle('Catalog — Acme Widgets');

  const widgets = useLoaderData() as Widget[];
  const [searchParams, setSearchParams] = useSearchParams();
  const activeCategory = searchParams.get('category');

  const counts = useMemo(() => categoryCounts(widgets), [widgets]);
  const categories = useMemo(
    () => Array.from(counts.keys()).sort(),
    [counts],
  );

  const filtered = useMemo(() => {
    if (!activeCategory) return widgets;
    return widgets.filter((w) => w.categories.includes(activeCategory));
  }, [widgets, activeCategory]);

  function setCategory(c: string | null) {
    if (c) {
      setSearchParams({ category: c });
    } else {
      setSearchParams({});
    }
  }

  if (widgets.length === 0) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-12 text-center">
        <h1 className="font-display font-black text-[44px] text-ink">
          The Catalog
        </h1>
        <p className="mt-4 font-display text-[20px] text-ink-soft">
          No widgets available.
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-6xl mx-auto px-6 py-12">
      <header>
        <h1 className="font-display font-black text-[44px] text-ink">
          The Catalog
        </h1>
        <p className="font-sans text-[16px] text-ink-soft mt-2 max-w-prose">
          Fifteen widgets. One for every purpose, occasion, and excuse.
        </p>
      </header>

      <div role="group" aria-label="Filter by category" className="mt-8 flex flex-wrap gap-2">
        <CategoryChip
          active={!activeCategory}
          onClick={() => setCategory(null)}
          label="Showing all"
          count={widgets.length}
        />
        {categories.map((c) => (
          <CategoryChip
            key={c}
            active={activeCategory === c}
            onClick={() => setCategory(c)}
            label={c}
            count={counts.get(c) ?? 0}
          />
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="mt-16 text-center">
          <p className="font-display text-[20px] text-ink">
            No widgets in this category — yet.
          </p>
          <Link
            to="/widgets"
            onClick={(e) => {
              e.preventDefault();
              setCategory(null);
            }}
            className="mt-4 inline-block font-sans font-semibold text-brass-700 hover:text-brass-600 underline"
          >
            Show everything
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filtered.map((w) => (
            <WidgetCard key={w.type} widget={w} />
          ))}
        </div>
      )}
    </section>
  );
}

function CategoryChip({
  active,
  onClick,
  label,
  count,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
}) {
  const base =
    'rounded-full px-4 py-1.5 font-sans text-[13px] transition-colors flex items-center gap-2';
  const styles = active
    ? 'bg-brass-600 text-paper'
    : 'bg-paper border border-ink/15 text-ink-soft hover:border-ink/40 hover:text-ink';
  return (
    <button type="button" className={`${base} ${styles}`} onClick={onClick}>
      <span>{label}</span>
      <span
        className={`text-[11px] tabular-nums ${
          active ? 'text-paper/80' : 'text-ink-soft'
        }`}
      >
        {count}
      </span>
    </button>
  );
}
