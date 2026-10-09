'use client';

import { useEffect, useState, type KeyboardEvent } from 'react';

interface CertifiedBracelet {
  id: string;
  archiveNo: string;
  name: string;
  stone: string;
  craftedIn?: string;
  reference?: string;
  verified: boolean;
  price: number;
  currency?: string;
  image: string;
  imageAlt: string;
  accent: string;
  href: string;
}

const SAMPLE_BRACELETS: CertifiedBracelet[] = [
  {
    id: 'b-01',
    archiveNo: '01',
    name: 'Ember Ruby Bracelet',
    stone: 'Natural Ruby',
    craftedIn: 'India',
    reference: 'NG-0114',
    verified: true,
    price: 4250,
    currency: 'INR',
    image:
      'https://images.unsplash.com/photo-1617038220319-276d3cfab638?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Ember Ruby bracelet with deep red beads on a neutral backdrop',
    accent: '#9B2226',
    href: '/products/ember-ruby-bracelet',
  },
  {
    id: 'b-02',
    archiveNo: '02',
    name: 'Deep Forest Emerald Bracelet',
    stone: 'Natural Emerald',
    craftedIn: 'India',
    reference: 'NG-0198',
    verified: true,
    price: 5100,
    currency: 'INR',
    image:
      'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Deep Forest Emerald bracelet with green beads on a neutral backdrop',
    accent: '#1B4332',
    href: '/products/deep-forest-emerald-bracelet',
  },
  {
    id: 'b-03',
    archiveNo: '03',
    name: 'Saffron Topaz Bracelet',
    stone: 'Natural Yellow Topaz',
    craftedIn: 'India',
    reference: 'NG-0212',
    verified: true,
    price: 3600,
    currency: 'INR',
    image:
      'https://images.unsplash.com/photo-1611652022419-a9419f74343d?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Saffron Topaz bracelet with warm golden beads on a neutral backdrop',
    accent: '#C97A2B',
    href: '/products/saffron-topaz-bracelet',
  },
  {
    id: 'b-04',
    archiveNo: '04',
    name: 'Indigo Sapphire Bracelet',
    stone: 'Natural Blue Sapphire',
    craftedIn: 'India',
    reference: 'NG-0233',
    verified: true,
    price: 6300,
    currency: 'INR',
    image:
      'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Indigo Sapphire bracelet with deep blue beads on a neutral backdrop',
    accent: '#2C3E70',
    href: '/products/indigo-sapphire-bracelet',
  },
  {
    id: 'b-05',
    archiveNo: '05',
    name: 'Terracotta Garnet Bracelet',
    stone: 'Natural Garnet',
    craftedIn: 'India',
    reference: 'NG-0267',
    verified: true,
    price: 2950,
    currency: 'INR',
    image:
      'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Terracotta Garnet bracelet with warm brick-toned beads on a neutral backdrop',
    accent: '#B5563C',
    href: '/products/terracotta-garnet-bracelet',
  },
  {
    id: 'b-06',
    archiveNo: '06',
    name: 'Rosewater Quartz Bracelet',
    stone: 'Natural Rose Quartz',
    craftedIn: 'India',
    verified: false,
    price: 2100,
    currency: 'INR',
    image:
      'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?auto=format&fit=crop&w=900&q=85',
    imageAlt: 'Rosewater Quartz bracelet with soft pink beads on a neutral backdrop',
    accent: '#B5657A',
    href: '/products/rosewater-quartz-bracelet',
  },
];

const SCATTER_LAYOUT = [
  { top: 2, left: 3, width: 30, mobileWidth: 88, rotate: -4 },
  { top: 6, left: 38, width: 20, mobileWidth: 72, rotate: 3 },
  { top: 0, left: 66, width: 22, mobileWidth: 76, rotate: -2 },
  { top: 47, left: 8, width: 19, mobileWidth: 70, rotate: 4 },
  { top: 51, left: 34, width: 24, mobileWidth: 74, rotate: -3 },
  { top: 45, left: 64, width: 21, mobileWidth: 70, rotate: 2 },
] as const;

function formatPrice(price: number, currency = 'INR') {
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency,
      maximumFractionDigits: 0,
    }).format(price);
  } catch {
    return `${currency} ${price}`;
  }
}

function useEnterOnce<T extends HTMLElement>() {
  const [node, setNode] = useState<T | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (!node) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setEntered(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setEntered(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [node]);

  return { setRef: setNode, entered };
}

export default function LabVerifiedCollection({
  bracelets = SAMPLE_BRACELETS,
}: {
  bracelets?: CertifiedBracelet[];
}) {
  const { setRef, entered } = useEnterOnce<HTMLElement>();
  const [activeId, setActiveId] = useState<string | null>(null);

  return (
    <section
      ref={setRef}
      aria-labelledby="lab-verified-heading"
      className="ng-section relative overflow-hidden bg-[#FAF7F1] px-6 py-20 sm:px-10 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <span className="ng-glow-field" />
        <span className="ng-speck ng-speck-a" />
        <span className="ng-speck ng-speck-b" />
        <span className="ng-speck ng-speck-c" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <header
          className={`ng-reveal grid grid-cols-1 gap-6 lg:grid-cols-[1.3fr_1fr] lg:items-end lg:gap-10 ${
            entered ? 'ng-reveal-in' : ''
          }`}
        >
          <div>
            <p className="ng-eyebrow text-sm text-[#8A6D4B]">
              Before it reaches you
            </p>
            <h2
              id="lab-verified-heading"
              className="ng-serif mt-3 max-w-xl text-4xl leading-[1.1] text-[#2B2620] sm:text-5xl"
            >
              Every bracelet spends time on this table before it spends time
              on your wrist.
            </h2>
          </div>
          <div className="lg:pb-1">
            <p className="max-w-sm text-[15px] leading-relaxed text-[#5B5347]">
              Stone, craftsmanship and verification status are checked piece
              by piece. Touch or hover any bracelet below to see what we
              found.
            </p>
            <p className="ng-mono mt-4 text-xs text-[#8A8071]">
              {bracelets.length} specimens currently on the table
            </p>
          </div>
        </header>

        <svg
          aria-hidden="true"
          className={`ng-reveal ng-reveal-delay-1 mt-10 h-4 w-full text-[#D8CFBE] ${
            entered ? 'ng-reveal-in' : ''
          }`}
          preserveAspectRatio="none"
          viewBox="0 0 800 16"
        >
          <line x1="0" y1="8" x2="800" y2="8" stroke="currentColor" strokeWidth="1" />
          {Array.from({ length: 41 }).map((_, i) => (
            <line
              key={i}
              x1={i * 20}
              x2={i * 20}
              y1="8"
              y2={i % 5 === 0 ? 1 : 5}
              stroke="currentColor"
              strokeWidth="1"
            />
          ))}
        </svg>

        <ul
          className={`ng-bench ng-reveal ng-reveal-delay-2 relative mt-6 flex flex-col items-center lg:mt-4 lg:block ${
            entered ? 'ng-reveal-in' : ''
          }`}
        >
          <span aria-hidden="true" className="ng-bench-grid pointer-events-none absolute inset-0 hidden lg:block" />

          {bracelets.map((bracelet, index) => (
            <BenchItem
              key={bracelet.id}
              bracelet={bracelet}
              layout={SCATTER_LAYOUT[index % SCATTER_LAYOUT.length]}
              index={index}
              isActive={activeId === bracelet.id}
              isDimmed={activeId !== null && activeId !== bracelet.id}
              entered={entered}
              onActivate={() => setActiveId(bracelet.id)}
              onDeactivate={() =>
                setActiveId((current) => (current === bracelet.id ? null : current))
              }
            />
          ))}
        </ul>
      </div>

      <style>{`
        .ng-serif { font-family: 'Fraunces', 'Iowan Old Style', 'Georgia', serif; font-weight: 480; letter-spacing: -0.01em; }
        .ng-mono { font-family: 'IBM Plex Mono', ui-monospace, 'SFMono-Regular', Menlo, monospace; }
        .ng-eyebrow { font-family: 'Inter', system-ui, sans-serif; letter-spacing: 0.01em; }
        .ng-section, .ng-section * { box-sizing: border-box; }

        /* Ambient light + specks */
        .ng-glow-field {
          position: absolute; width: 60vw; height: 60vw; max-width: 640px; max-height: 640px;
          top: -10%; right: -10%; border-radius: 999px; filter: blur(60px);
          background: radial-gradient(circle, rgba(201,122,43,0.10), rgba(201,122,43,0) 70%);
          animation: ng-drift-field 32s ease-in-out infinite alternate;
        }
        @keyframes ng-drift-field {
          from { transform: translate(0, 0); }
          to { transform: translate(-6%, 8%); }
        }
        .ng-speck { position: absolute; border-radius: 999px; opacity: 0.4; background: #D8CFBE; }
        .ng-speck-a { width: 6px; height: 6px; top: 18%; left: 6%; animation: ng-drift 15s ease-in-out infinite; }
        .ng-speck-b { width: 4px; height: 4px; top: 70%; left: 92%; animation: ng-drift 19s ease-in-out infinite reverse; }
        .ng-speck-c { width: 3px; height: 3px; top: 88%; left: 20%; animation: ng-drift 23s ease-in-out infinite; }
        @keyframes ng-drift {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }

        /* Single orchestrated entrance */
        .ng-reveal { opacity: 0; transform: translateY(16px); transition: opacity 0.7s ease, transform 0.7s ease; }
        .ng-reveal-delay-1 { transition-delay: 0.1s; }
        .ng-reveal-delay-2 { transition-delay: 0.18s; }
        .ng-reveal-in { opacity: 1; transform: translateY(0); }

        /* Table surface texture (desktop only) */
        .ng-bench-grid {
          background-image:
            repeating-linear-gradient(to right, rgba(43,38,32,0.05) 0 1px, transparent 1px 64px),
            repeating-linear-gradient(to bottom, rgba(43,38,32,0.05) 0 1px, transparent 1px 64px);
          mask-image: radial-gradient(circle at 50% 40%, black 0%, transparent 75%);
        }

        /* -------- Bench item: mobile-first -------- */
        .ng-item {
          position: relative;
          list-style: none;
          width: var(--mw, 78%);
          margin: 0 0 60px 0;
          transform: rotate(calc(var(--rot, 0deg) * 0.45));
          transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.4s ease, filter 0.4s ease;
        }
        .ng-item:nth-child(2n) { align-self: flex-end; }
        .ng-item:nth-child(3n) { align-self: flex-start; }
        .ng-item--active { transform: rotate(0deg) translateY(-4px); z-index: 30; }
        .ng-item--dimmed { opacity: 0.55; filter: blur(1px) saturate(0.85); }

        .ng-item.ng-item-in { animation: ng-settle 0.7s cubic-bezier(0.22, 1, 0.36, 1) backwards; animation-delay: var(--delay, 0ms); }
        @keyframes ng-settle {
          from { opacity: 0; transform: translateY(-22px) rotate(calc(var(--rot, 0deg) * 1.4)); }
          to { opacity: 1; transform: rotate(calc(var(--rot, 0deg) * 0.45)); }
        }

        .ng-trigger {
          position: relative; display: block; width: 100%; text-align: left;
          background: transparent; border: none; padding: 0; cursor: pointer;
          font: inherit; color: inherit;
        }
        .ng-glow {
          position: absolute; inset: -14%; border-radius: 999px; z-index: 0;
          opacity: 0.16; filter: blur(20px);
        }
        .ng-frame {
          position: relative; z-index: 1; overflow: hidden; aspect-ratio: 4 / 5;
          display: block; border: 1px solid #E4DDD1; background: #F1ECE3;
          box-shadow: 0 1px 2px rgba(43,38,32,0.06);
          transition: box-shadow 0.4s ease;
        }
        .ng-item--active .ng-frame { box-shadow: 0 22px 34px -18px rgba(43,38,32,0.32); }
        .ng-image { display: block; width: 100%; height: 100%; object-fit: cover; }
        .ng-archive-tag {
          position: absolute; top: 10px; left: 10px; z-index: 2;
          font-size: 11px; letter-spacing: 0.02em; padding: 2px 7px; border-radius: 999px;
          background: rgba(250,247,241,0.92); color: #5B5347;
        }
        .ng-caption {
          position: absolute; inset-inline: 0; bottom: 0; z-index: 2;
          display: flex; align-items: baseline; justify-content: space-between; gap: 8px;
          padding: 10px 12px; background: linear-gradient(to top, rgba(43,38,32,0.55), transparent);
        }
        .ng-caption-name { font-size: 13px; color: #FAF7F1; }
        .ng-caption-price { font-size: 12px; color: #FAF7F1; white-space: nowrap; }

        /* Leader pin + line, grown height on reveal */
        .ng-leader { display: flex; justify-content: center; height: 0; overflow: hidden; transition: height 0.35s ease; }
        .ng-item--active .ng-leader,
        .ng-item:focus-within .ng-leader { height: 22px; }
        .ng-leader::before {
          content: ''; width: 1px; height: 100%; background: var(--accent, #2B2620);
          opacity: 0.7;
        }
        .ng-pin {
          position: absolute; left: 50%; top: 0; width: 6px; height: 6px; border-radius: 999px;
          background: var(--accent, #2B2620); transform: translate(-50%, -50%) scale(0);
          transition: transform 0.3s ease 0.1s; z-index: 3;
        }
        .ng-item--active .ng-pin,
        .ng-item:focus-within .ng-pin { transform: translate(-50%, -50%) scale(1); }

        /* Verification panel: smooth height animation via grid-rows */
        .ng-reveal-wrap { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.4s ease; }
        .ng-item--active .ng-reveal-wrap,
        .ng-item:focus-within .ng-reveal-wrap { grid-template-rows: 1fr; }
        .ng-reveal-inner { min-height: 0; overflow: hidden; }
        .ng-panel {
          border: 1px solid #E4DDD1; background: #FFFDF9; padding: 16px 18px;
          box-shadow: 0 14px 24px -18px rgba(43,38,32,0.28);
        }

        .ng-cta:focus-visible, .ng-trigger:focus-visible {
          outline: 2px solid var(--accent, #2B2620); outline-offset: 3px; border-radius: 2px;
        }

        /* -------- Desktop: true scatter on the table -------- */
        @media (min-width: 1024px) {
          .ng-bench { min-height: clamp(760px, 72vw, 960px); display: block; }
          .ng-item {
            position: absolute; top: var(--top); left: var(--left); width: var(--w);
            margin: 0; align-self: auto; transform: rotate(var(--rot, 0deg));
          }
          .ng-item--active { transform: rotate(0deg) translateY(-10px) scale(1.045); }
          .ng-panel { width: max(220px, 100%); }
        }

        @media (prefers-reduced-motion: reduce) {
          .ng-reveal, .ng-item, .ng-glow-field, .ng-speck, .ng-item.ng-item-in {
            animation: none !important; transition: opacity 0.2s linear !important; transform: none !important;
          }
          .ng-reveal { opacity: 1; }
        }
      `}</style>
    </section>
  );
}
function BenchItem({
  bracelet,
  layout,
  index,
  isActive,
  isDimmed,
  entered,
  onActivate,
  onDeactivate,
}: {
  bracelet: CertifiedBracelet;
  layout: (typeof SCATTER_LAYOUT)[number];
  index: number;
  isActive: boolean;
  isDimmed: boolean;
  entered: boolean;
  onActivate: () => void;
  onDeactivate: () => void;
}) {
  function handleKeyDown(event: KeyboardEvent<HTMLLIElement>) {
    if (event.key === 'Escape') onDeactivate();
  }

  return (
    <li
      className={`ng-item ${entered ? 'ng-item-in' : ''} ${isActive ? 'ng-item--active' : ''} ${
        isDimmed ? 'ng-item--dimmed' : ''
      }`}
      style={
        {
          '--top': `${layout.top}%`,
          '--left': `${layout.left}%`,
          '--w': `${layout.width}%`,
          '--mw': `${layout.mobileWidth}%`,
          '--rot': `${layout.rotate}deg`,
          '--delay': `${index * 70}ms`,
          '--accent': bracelet.accent,
        } as React.CSSProperties
      }
      onMouseEnter={onActivate}
      onMouseLeave={onDeactivate}
      onFocus={onActivate}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          onDeactivate();
        }
      }}
      onKeyDown={handleKeyDown}
    >
      <button type="button" className="ng-trigger" aria-label={`Inspect ${bracelet.name}`}>
        <span className="ng-glow" aria-hidden="true" style={{ background: bracelet.accent }} />
        <span className="ng-frame">
          <span className="ng-archive-tag ng-mono" aria-hidden="true">
            {bracelet.archiveNo}
          </span>
          <img src={bracelet.image} alt={bracelet.imageAlt} className="ng-image" />
          <span className="ng-caption">
            <span className="ng-caption-name">{bracelet.stone}</span>
            <span className="ng-caption-price ng-mono">
              {formatPrice(bracelet.price, bracelet.currency)}
            </span>
          </span>
        </span>
      </button>

      <span className="ng-pin" aria-hidden="true" />
      <span className="ng-leader" aria-hidden="true" />

      <div className="ng-reveal-wrap">
        <div className="ng-reveal-inner">
          <VerificationPanel bracelet={bracelet} />
        </div>
      </div>
    </li>
  );
}

function VerificationPanel({ bracelet }: { bracelet: CertifiedBracelet }) {
  const rows: { label: string; value: string }[] = [
    { label: 'Material', value: bracelet.stone },
  ];
  if (bracelet.craftedIn) rows.push({ label: 'Crafted in', value: bracelet.craftedIn });
  rows.push({
    label: 'Verification',
    value: bracelet.verified ? 'Verified' : 'In review',
  });
  if (bracelet.reference) rows.push({ label: 'Reference', value: bracelet.reference });

  return (
    <div className="ng-panel mt-1">
      <p className="ng-eyebrow text-xs text-[#8A6D4B]">Verification</p>
      <dl className="mt-3 divide-y divide-[#EDE7DA]">
        {rows.map((row) => (
          <div key={row.label} className="flex items-baseline justify-between gap-6 py-2">
            <dt className="text-xs text-[#8A8071]">{row.label}</dt>
            <dd className="ng-mono text-right text-xs text-[#2B2620]">{row.value}</dd>
          </div>
        ))}
      </dl>
      <a
        href={bracelet.href}
        className="ng-cta ng-mono mt-4 inline-flex items-center gap-2 border-b border-[#2B2620] pb-0.5 text-xs text-[#2B2620] transition-opacity hover:opacity-70"
      >
        View this piece
      </a>
    </div>
  );
}