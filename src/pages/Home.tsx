import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import WidgetCard from '../components/WidgetCard';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { fetchWidgets, type Widget } from '../lib/widgets';

const FEATURED_CATEGORIES = ['everyday', 'occasion', 'business'] as const;

function pickFeatured(widgets: Widget[]): Widget[] {
  return FEATURED_CATEGORIES.map((category) =>
    widgets.find((w) => w.categories.includes(category)),
  ).filter((w): w is Widget => w !== undefined);
}

export default function Home() {
  useDocumentTitle('Home — Acme Widgets');

  const [featured, setFeatured] = useState<Widget[]>([]);

  useEffect(() => {
    let cancelled = false;
    fetchWidgets()
      .then((widgets) => {
        if (!cancelled) setFeatured(pickFeatured(widgets));
      })
      .catch(() => {
        if (!cancelled) setFeatured([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <section className="relative max-w-6xl mx-auto px-6 py-20 overflow-hidden">
        <Cog8ToothIcon
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 top-12 -z-0 w-[520px] h-[520px] text-brass-100 animate-[spin_60s_linear_infinite]"
        />
        <div className="relative z-10">
          <p className="font-sans font-medium text-[12px] tracking-[0.2em] text-brass-700">
            ACME WIDGETS · EST. 1952
          </p>
          <h1 className="font-display font-black text-ink leading-[1.05] text-[clamp(40px,6vw,72px)] mt-2">
            Widgets for all purposes and occasions.
          </h1>
          <p className="font-sans text-[18px] text-ink-soft max-w-prose mt-6">
            A widget for every wonder. Browse the catalog or get in touch —
            we&rsquo;re old-fashioned that way.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/widgets"
              className="bg-brass-600 hover:bg-brass-700 text-paper font-sans font-semibold text-[16px] px-6 py-3 rounded-full shadow-md transition"
            >
              Browse the catalog
            </Link>
            <Link
              to="/orders"
              className="border-2 border-brass-600 text-ink font-sans font-semibold text-[16px] px-6 py-3 rounded-full hover:bg-brass-50 transition"
            >
              How to order
            </Link>
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mt-8 max-w-6xl mx-auto px-6">
          <h2 className="font-display font-bold text-[28px] text-ink">
            Featured this season
          </h2>
          <p className="font-sans text-[14px] text-ink-soft mt-1">
            Three widgets, three reasons.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            {featured.map((widget) => (
              <WidgetCard key={widget.type} widget={widget} />
            ))}
          </div>
        </section>
      )}

      <p className="mt-20 mb-20 text-center font-sans italic text-[14px] text-ink-soft">
        Hand-curated since 1952. Ships from Vermont, the workshop floor, and
        the calibration lab.
      </p>
    </>
  );
}
