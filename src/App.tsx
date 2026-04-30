export default function App() {
  return (
    <main className="max-w-6xl mx-auto px-6 py-16">
      <h1 className="font-display text-4xl text-ink">Acme Widgets</h1>
      <p className="mt-4 text-ink-soft">
        Tailwind v4 wired up with the brass &amp; paper palette. Routing and
        nav arrive in later tasks.
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <span className="rounded-2xl bg-brass-600 px-4 py-2 text-paper">
          brass-600
        </span>
        <span className="rounded-2xl bg-evergreen px-4 py-2 text-paper">
          evergreen
        </span>
        <span className="rounded-2xl bg-burgundy px-4 py-2 text-paper">
          burgundy
        </span>
        <span className="rounded-2xl bg-blueprint px-4 py-2 text-paper">
          blueprint
        </span>
      </div>
      <p className="mt-8 text-3xl font-bold text-blue-600">
        text-3xl font-bold text-blue-600 (acceptance probe)
      </p>
    </main>
  );
}
