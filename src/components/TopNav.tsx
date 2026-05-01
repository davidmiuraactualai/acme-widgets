import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import { Link, NavLink } from 'react-router';

const links = [
  { to: '/', label: 'Home', end: true },
  { to: '/widgets', label: 'Widgets' },
  { to: '/orders', label: 'Orders' },
];

const linkClass = ({ isActive }: { isActive: boolean }) =>
  [
    'font-sans font-medium text-[13px] sm:text-[15px] transition-colors',
    isActive
      ? 'text-ink border-b-2 border-brass-600'
      : 'text-ink-soft hover:text-ink',
  ].join(' ');

export default function TopNav() {
  return (
    <header className="sticky top-0 z-40 h-[72px] bg-paper/80 backdrop-blur border-b border-ink/10">
      <div className="max-w-6xl mx-auto h-full px-3 sm:px-6 flex items-center justify-between gap-3 sm:gap-4">
        <Link to="/" className="group flex items-center gap-2 sm:gap-3">
          <Cog6ToothIcon
            aria-hidden="true"
            className="w-8 h-8 text-brass-600 transition-transform duration-[400ms] ease-out group-hover:rotate-[60deg]"
          />
          <span className="whitespace-nowrap font-display font-bold text-[17px] sm:text-[22px] text-ink leading-none">
            Acme Widgets
            <sup className="hidden sm:inline ml-1 font-sans font-normal text-[11px] text-ink-soft align-super">
              Est. 1952
            </sup>
          </span>
        </Link>
        <nav aria-label="Primary" className="flex items-center gap-3 sm:gap-8 whitespace-nowrap">
          {links.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  );
}
