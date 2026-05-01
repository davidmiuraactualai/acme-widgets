import type { Widget } from '../lib/widgets';
import { standardPreset, widgetPresets } from './widgetPresets';

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

function stockMeta(n: number): { dot: string; label: string } {
  if (n <= 0) return { dot: 'bg-burgundy', label: 'Backorder' };
  if (n < 10) return { dot: 'bg-burgundy', label: `Only ${n} left` };
  if (n < 50) return { dot: 'bg-brass-600', label: `${n} in stock` };
  return { dot: 'bg-evergreen', label: `${n} in stock` };
}

export default function WidgetCard({ widget }: { widget: Widget }) {
  const preset = widgetPresets[widget.icon] ?? standardPreset;
  const stock = stockMeta(widget.numberInStock);
  const visibleCategories = widget.categories.slice(0, 2);

  return (
    <article
      aria-label={widget.type}
      className="group rounded-2xl border border-ink/10 bg-paper overflow-hidden transition-shadow hover:shadow-lg focus-within:shadow-lg"
    >
      {preset.hero}
      <div className="p-5 space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display font-bold text-[20px] text-ink">
            {widget.type}
          </h3>
          <span className="font-sans font-semibold text-[16px] text-ink tabular-nums">
            {currency.format(widget.price)}
          </span>
        </div>
        <p className="text-[13px] text-ink-soft line-clamp-2">
          {widget.description}
        </p>
        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="inline-flex items-center gap-1.5 font-sans text-[12px] text-ink">
            <span
              aria-hidden="true"
              className={`inline-block w-2 h-2 rounded-full ${stock.dot}`}
            />
            {stock.label}
          </span>
          {visibleCategories.length > 0 && (
            <span className="font-sans text-[11px] uppercase tracking-wider text-ink-soft">
              {visibleCategories.join(' · ')}
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
