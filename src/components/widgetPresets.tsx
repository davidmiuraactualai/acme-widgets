import {
  Cog6ToothIcon as Cog6Solid,
  Cog8ToothIcon as Cog8Solid,
  XMarkIcon,
} from '@heroicons/react/24/solid';
import type { ReactNode } from 'react';

type Cog = 6 | 8;

type Preset = {
  cog: Cog;
  hero: ReactNode;
};

const cogClass =
  'transition-transform ease-out group-hover:rotate-[360deg] motion-reduce:transition-none motion-reduce:group-hover:rotate-0 duration-[1600ms]';

function CogEl({
  cog,
  className,
  durationMs,
  size = 'w-24 h-24',
}: {
  cog: Cog;
  className?: string;
  durationMs?: number;
  size?: string;
}) {
  const Icon = cog === 6 ? Cog6Solid : Cog8Solid;
  const style = durationMs ? { transitionDuration: `${durationMs}ms` } : undefined;
  return (
    <Icon
      aria-hidden="true"
      className={`${size} ${cogClass} ${className ?? ''}`}
      style={style}
    />
  );
}

const Brass: Preset = {
  cog: 6,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-[radial-gradient(ellipse_at_center,#FBF7EF_0%,#FBF1D8_100%)]"
    >
      <span className="absolute top-3 left-1/2 -translate-x-1/2 font-display italic text-[8px] tracking-widest text-brass-700/70">
        ACME · EST. 1952 · BRASS
      </span>
      <CogEl
        cog={6}
        className="text-brass-600 drop-shadow-[0_2px_0_rgba(255,255,255,0.4)]"
      />
    </div>
  ),
};

const Steel: Preset = {
  cog: 8,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-blueprint"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, transparent 0 15px, rgba(122,168,216,0.4) 15px 16px), repeating-linear-gradient(90deg, transparent 0 15px, rgba(122,168,216,0.4) 15px 16px)',
      }}
    >
      <CogEl cog={8} className="text-gunmetal" />
      <span className="absolute top-2 right-2 font-mono text-[9px] text-blueprint-line">
        0.001mm
      </span>
      <span className="absolute bottom-2 left-2 font-mono text-[9px] text-blueprint-line">
        |·|·|·|
      </span>
    </div>
  ),
};

const Pocket: Preset = {
  cog: 6,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-paper"
    >
      <span className="absolute top-3 italic text-[10px] text-walnut">
        Travel-sized
      </span>
      <div className="rounded-2xl border-2 border-dashed border-walnut p-4">
        <CogEl cog={6} size="w-12 h-12" className="text-walnut" />
      </div>
    </div>
  ),
};

const Sparkle: Preset = {
  cog: 6,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-paper overflow-hidden"
    >
      {[
        ['top-3', 'left-4', 'bg-sparkle-pink'],
        ['top-6', 'right-6', 'bg-brass-400'],
        ['top-12', 'left-12', 'bg-evergreen'],
        ['bottom-4', 'right-3', 'bg-sparkle-pink'],
        ['bottom-6', 'left-6', 'bg-gold'],
        ['bottom-10', 'right-12', 'bg-burgundy'],
        ['top-2', 'right-1/3', 'bg-blueprint'],
        ['bottom-2', 'left-1/3', 'bg-copper'],
        ['top-1/3', 'left-2', 'bg-gold'],
        ['top-1/2', 'right-2', 'bg-sparkle-pink'],
        ['top-1/4', 'right-1/4', 'bg-evergreen'],
        ['bottom-1/4', 'left-1/4', 'bg-brass-400'],
      ].map(([top, left, color], i) => (
        <span
          key={i}
          className={`absolute ${top} ${left} w-1.5 h-1.5 rounded-full ${color}`}
        />
      ))}
      <CogEl cog={6} className="text-sparkle-pink" durationMs={1000} />
    </div>
  ),
};

const Heirloom: Preset = {
  cog: 8,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-paper"
    >
      <div className="bg-burgundy rounded-[40%] p-8 shadow-inner relative">
        <span className="absolute -top-1 left-1/2 -translate-x-1/2 whitespace-nowrap text-[8px] text-burgundy">
          Acme &amp; Co. · Heirloom Series
        </span>
        <CogEl cog={8} className="text-silver" durationMs={3000} />
      </div>
    </div>
  ),
};

const Evergreen: Preset = {
  cog: 8,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center"
      style={{
        background: 'linear-gradient(135deg, #1F4D3A 0%, #0F2E22 100%)',
      }}
    >
      <XMarkIcon className="absolute top-3 left-3 w-6 h-6 text-paper/40 rotate-45" />
      <XMarkIcon className="absolute bottom-3 right-3 w-6 h-6 text-paper/40 rotate-45" />
      <CogEl
        cog={8}
        className="text-evergreen drop-shadow-[0_0_3px_#D4AF37]"
      />
    </div>
  ),
};

const Industrial: Preset = {
  cog: 8,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-gunmetal/5"
      style={{
        backgroundImage:
          'repeating-linear-gradient(45deg, transparent 0 8px, rgba(46,52,59,0.06) 8px 9px)',
      }}
    >
      {[
        'top-3 left-3',
        'top-3 right-3',
        'bottom-3 left-3',
        'bottom-3 right-3',
      ].map((pos) => (
        <span
          key={pos}
          className={`absolute ${pos} w-2 h-2 rounded-full bg-gunmetal`}
        />
      ))}
      <CogEl cog={8} className="text-gunmetal" />
      <span className="absolute bottom-1 left-1/2 -translate-x-1/2 font-mono text-[9px] tracking-widest text-gunmetal">
        RATED · 24/7 · MIL-SPEC
      </span>
    </div>
  ),
};

const Walnut: Preset = {
  cog: 6,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-walnut/15 overflow-hidden"
      style={{
        backgroundImage:
          'repeating-linear-gradient(0deg, rgba(90,59,34,0.18) 0 6px, rgba(179,106,61,0.10) 6px 14px, rgba(90,59,34,0.16) 14px 22px)',
      }}
    >
      <CogEl cog={6} className="text-walnut" />
      <span className="absolute bottom-2 right-2 font-display italic text-[10px] text-walnut">
        № __ / Vermont
      </span>
    </div>
  ),
};

const Standard: Preset = {
  cog: 6,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-paper"
    >
      <span className="absolute inline-block w-32 h-32 rounded-full border border-ink/15" />
      <CogEl cog={6} className="text-ink-soft" />
      <span className="absolute bottom-3 font-sans text-[10px] tracking-widest text-ink-soft">
        STANDARD ISSUE
      </span>
    </div>
  ),
};

const Gold: Preset = {
  cog: 8,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-end justify-center"
      style={{
        background: 'linear-gradient(180deg, #FBF7EF 0%, #EFEDE6 100%)',
      }}
    >
      <CogEl
        cog={8}
        className="text-gold drop-shadow-[0_2px_3px_rgba(212,175,55,0.5)] mb-6"
      />
      <span className="absolute bottom-3 w-32 h-3 rounded-full bg-marble shadow-md" />
    </div>
  ),
};

const Lab: Preset = {
  cog: 8,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-white"
    >
      <CogEl cog={8} className="text-blueprint" />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-px bg-blueprint/40" />
      <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-px h-16 bg-blueprint/40" />
      <span className="absolute bottom-3 right-3 bg-paper border border-ink/20 px-2 py-1 font-mono text-[9px] text-ink">
        NIST-TRACEABLE · CERT #__
      </span>
    </div>
  ),
};

const Rainbow: Preset = {
  cog: 6,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-paper overflow-hidden"
    >
      <span className="absolute top-4 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full border-[3px] border-sparkle-pink/40" />
      <span className="absolute top-7 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full border-[3px] border-gold/60" />
      <span className="absolute top-10 left-1/2 -translate-x-1/2 w-24 h-24 rounded-full border-[3px] border-blueprint/50" />
      <Cog6Solid
        aria-hidden="true"
        className="w-24 h-24 transition-transform duration-[1600ms] ease-[cubic-bezier(.34,1.56,.64,1)] group-hover:rotate-[360deg] motion-reduce:group-hover:rotate-0"
        style={{
          background:
            'conic-gradient(from 0deg, #FF4FA3, #D4AF37, #1F4D3A, #0E2A47, #B36A3D, #FF4FA3)',
          WebkitMaskImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'black\'><path d=\'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.165.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z\'/><path d=\'M15 12a3 3 0 11-6 0 3 3 0 016 0z\'/></svg>")',
          maskImage:
            'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' viewBox=\'0 0 24 24\' fill=\'black\'><path d=\'M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.165.855.142 1.205-.108l.737-.527a1.125 1.125 0 011.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 01-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 01-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.107-1.204l-.527-.738a1.125 1.125 0 01.12-1.45l.773-.773a1.125 1.125 0 011.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894z\'/><path d=\'M15 12a3 3 0 11-6 0 3 3 0 016 0z\'/></svg>")',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
        }}
      />
    </div>
  ),
};

const Graduation: Preset = {
  cog: 8,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex flex-col items-center justify-center bg-paper"
    >
      <div className="relative">
        <span className="absolute -top-3 -left-3 w-6 h-2 bg-ink rotate-12 origin-bottom-left" />
        <span className="absolute -top-1 -left-3 w-px h-4 bg-brass-600 rotate-[20deg] origin-top" />
        <CogEl cog={8} className="text-ink" />
      </div>
      <span className="mt-2 font-display italic text-[10px] text-ink-soft">
        CLASS OF ____
      </span>
    </div>
  ),
};

const Bulk: Preset = {
  cog: 6,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-parchment"
    >
      <Cog6Solid
        aria-hidden="true"
        className="absolute w-20 h-20 text-walnut/40 -translate-x-4 -translate-y-2 -rotate-6"
      />
      <Cog6Solid
        aria-hidden="true"
        className="absolute w-20 h-20 text-walnut/70"
      />
      <Cog6Solid
        aria-hidden="true"
        className="absolute w-20 h-20 text-walnut translate-x-4 translate-y-2 rotate-6 transition-transform duration-[1600ms] ease-out group-hover:rotate-[366deg] motion-reduce:group-hover:rotate-6"
      />
      <span className="absolute top-2 right-2 font-display font-black text-[20px] text-burgundy">
        × 25
      </span>
    </div>
  ),
};

const Copper: Preset = {
  cog: 6,
  hero: (
    <div
      aria-hidden="true"
      className="relative h-[180px] flex items-center justify-center bg-parchment"
    >
      <span className="absolute inset-3 rounded-md border-2 border-copper/40" />
      <CogEl cog={6} className="text-copper" />
      <span className="absolute bottom-3 left-1/2 -translate-x-1/2 whitespace-nowrap font-display uppercase text-[9px] tracking-wider text-copper">
        THE 1952 ACME CATALOG · NO. 0007
      </span>
    </div>
  ),
};

export const widgetPresets: Record<string, Preset> = {
  'brass-widget.svg': Brass,
  'steel-widget.svg': Steel,
  'pocket-widget.svg': Pocket,
  'sparkle-widget.svg': Sparkle,
  'heirloom-widget.svg': Heirloom,
  'evergreen-widget.svg': Evergreen,
  'industrial-widget.svg': Industrial,
  'walnut-widget.svg': Walnut,
  'standard-widget.svg': Standard,
  'gold-widget.svg': Gold,
  'lab-widget.svg': Lab,
  'rainbow-widget.svg': Rainbow,
  'graduation-widget.svg': Graduation,
  'bulk-widget.svg': Bulk,
  'copper-widget.svg': Copper,
};

export const standardPreset = Standard;
