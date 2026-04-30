import { Link } from 'react-router';
import { Cog8ToothIcon } from '@heroicons/react/24/outline';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Home() {
  useDocumentTitle('Home — Acme Widgets');

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

      <p className="mt-20 mb-20 text-center font-sans italic text-[14px] text-ink-soft">
        Hand-curated since 1952. Ships from Vermont, the workshop floor, and
        the calibration lab.
      </p>
    </>
  );
}
