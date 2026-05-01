import { Cog8ToothIcon } from '@heroicons/react/24/solid';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export default function Orders() {
  useDocumentTitle('Orders — Acme Widgets');

  return (
    <section className="max-w-2xl mx-auto px-6 py-20">
      <div className="flex justify-center">
        <div className="rounded-full border border-brass-200 p-3">
          <Cog8ToothIcon
            aria-hidden="true"
            className="w-24 h-24 text-brass-100"
          />
        </div>
      </div>

      <h1 className="font-display font-black text-[40px] text-ink text-center mt-6">
        Online orders are coming soon.
      </h1>

      <p className="font-sans text-[16px] text-ink-soft text-center mt-3 max-w-prose mx-auto">
        In the meantime, we&rsquo;ll handle your order the old-fashioned way:
        in writing, by hand, by a real human.
      </p>

      <div className="mt-10 rounded-2xl border border-ink/10 bg-paper p-6 shadow-sm">
        <p className="font-sans font-medium text-[11px] tracking-[0.2em] uppercase text-brass-700">
          Email our sales desk
        </p>
        <a
          href="mailto:sales@acmewidgets.com"
          className="block font-display font-bold text-[28px] text-brass-700 hover:text-brass-600 underline decoration-2 underline-offset-4 break-all"
        >
          sales@acmewidgets.com
        </a>
        <p className="font-sans text-[13px] text-ink-soft mt-3">
          Tell us which widgets, how many, and where to ship them. We reply
          within one business day.
        </p>
      </div>

      <p className="mt-10 text-center font-sans italic text-[13px] text-ink-soft">
        Yes, we know it&rsquo;s 2026. Yes, we still email.
      </p>
    </section>
  );
}
