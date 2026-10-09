import type { FC } from "react";
import "../../styles/navgrah-about.css";

interface Graha {
  sanskrit: string;
  english: string;
  essence: string;
  line: string;
}

const mandala: Graha[] = [
  { sanskrit: "Shukra", english: "Venus", essence: "Grace", line: "What you're drawn to, and why." },
  { sanskrit: "Chandra", english: "Moon", essence: "Calm", line: "The mind's tide, worn to steady it." },
  { sanskrit: "Mangal", english: "Mars", essence: "Courage", line: "The push to act before doubt sets in." },
  { sanskrit: "Budh", english: "Mercury", essence: "Clarity", line: "How you speak, and how well you're heard." },
  { sanskrit: "Surya", english: "Sun", essence: "Vitality", line: "The self that everything else orbits." },
  { sanskrit: "Shani", english: "Saturn", essence: "Discipline", line: "The weight that builds something lasting." },
  { sanskrit: "Ketu", english: "South Node", essence: "Release", line: "The letting go that ambition needs." },
  { sanskrit: "Guru", english: "Jupiter", essence: "Wisdom", line: "The long view, and the patience for it." },
  { sanskrit: "Rahu", english: "North Node", essence: "Ambition", line: "The pull toward what you don't have yet." },
];

interface Principle {
  label: string;
  body: string;
}

const principles: Principle[] = [
  {
    label: "Strung, not glued",
    body: "Every bracelet is hand-knotted bead by bead by artisans in Jaipur, the same technique used for three generations. Nothing is set with adhesive, so a bead can always be replaced without replacing the bracelet.",
  },
  {
    label: "Read before it's made",
    body: "We ask for a birth date and place before we ask for a wrist size. A short chart reading tells us which graha your order should be built around, so the bracelet is chosen for you, not picked off a shelf.",
  },
  {
    label: "One planet, one bracelet",
    body: "We don't mix nine stones onto a single wrist for the sake of looking complete. Each piece carries one influence at a time, the way a single remedy is prescribed in a reading — worn until it's done its work.",
  },
];

const NavGrahAbout: FC = () => {
  return (
    <div className="ng-about">
      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-16 px-6 pb-24 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-12 lg:px-10">
        <div>
          <h1 className="ng-serif ng-hero-heading max-w-xl text-[var(--ng-ivory)]">
            Nine planets,
            <br />
            strung by hand.
          </h1>
          <p className="mt-7 max-w-md text-[1.05rem] leading-relaxed text-[var(--ng-mist)]">
            NavGrah bracelets are built the way a Vedic astrologer reads a
            chart — one graha at a time. Each bead is chosen for a single
            planetary influence, strung in Jaipur by hand, and finished the
            same week it's ordered.
          </p>
          <a
            href="#story"
            className="mt-9 inline-block border-b border-[var(--ng-brass-dim)] pb-0.5 text-sm text-[var(--ng-brass)] transition-colors hover:border-[var(--ng-brass)] hover:text-[var(--ng-ivory)]"
          >
            Read how we started
          </a>
        </div>

        <div className="mx-auto w-full max-w-[320px] lg:max-w-none">
          <svg
            viewBox="0 0 300 300"
            className="mx-auto h-auto w-full max-w-[280px]"
            aria-hidden="true"
          >
            <circle
              className="ng-thread-circle"
              cx="150"
              cy="150"
              r="120"
              fill="none"
              strokeWidth="1"
            />
            {[
              { x: 150, y: 30, lit: true },
              { x: 227, y: 58 },
              { x: 268, y: 129 },
              { x: 254, y: 210 },
              { x: 191, y: 263 },
              { x: 109, y: 263 },
              { x: 46, y: 210 },
              { x: 32, y: 129 },
              { x: 73, y: 58 },
            ].map((bead, i) => (
              <circle
                key={i}
                className={
                  bead.lit
                    ? "ng-thread-bead ng-thread-bead--lit"
                    : "ng-thread-bead"
                }
                cx={bead.x}
                cy={bead.y}
                r={bead.lit ? 8 : 6}
                strokeWidth="1.5"
                style={{ animationDelay: `${0.5 + i * 0.08}s` }}
              />
            ))}
          </svg>
        </div>
      </section>

      <section
        id="story"
        className="border-y border-[var(--ng-line)] bg-[var(--ng-void-2)]"
      >
        <div className="ng-story mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-[0.55fr_1fr] lg:gap-16">
            <h2 className="ng-serif ng-section-heading text-[var(--ng-ivory)] lg:sticky lg:top-24 lg:self-start">
              It started with a grandmother's box of beads.
            </h2>
            <div className="max-w-[60ch] space-y-6 text-[1.05rem] leading-[1.75] text-[var(--ng-mist)]">
              <p>
                Our founder's grandmother kept a wooden box of loose stones
                on her windowsill in Jaipur — rudraksha, coral, pearl, one
                cloudy piece of blue sapphire she never sold. She read
                charts for the neighborhood and strung a bracelet for
                whatever the chart called for. No two were ever the same.
              </p>
              <p>
                When we started NavGrah in 2019, we kept that box as the
                model instead of a jewelry catalog. Every order still
                begins with a short reading, not a size guide. A karigar in
                the same workshop still knots every bead by hand. The only
                thing that changed is that the box is bigger now, and the
                windowsill has a website.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
        <div className="max-w-xl">
          <h2 className="ng-serif ng-section-heading text-[var(--ng-ivory)]">
            The nine, in order.
          </h2>
          <p className="mt-4 text-[1.05rem] leading-relaxed text-[var(--ng-mist)]">
            Laid out the way they sit in a navagraha mandala — Surya at the
            center, the other eight around it. Every bracelet we make draws
            from exactly one of these.
          </p>
        </div>

        <div className="ng-mandala mt-12 grid grid-cols-1 sm:grid-cols-3">
          {mandala.map((graha) => (
            <div
              key={graha.sanskrit}
              tabIndex={0}
              className={
                "ng-mandala-cell flex min-h-[176px] flex-col justify-between p-6 outline-none sm:min-h-[200px] sm:p-7" +
                (graha.sanskrit === "Surya" ? " ng-mandala-cell--surya" : "")
              }
            >
              <div className="flex items-baseline justify-between gap-3">
                <span className="ng-graha-sanskrit ng-serif text-xl text-[var(--ng-ivory)]">
                  {graha.sanskrit}
                </span>
                <span className="whitespace-nowrap text-xs text-[var(--ng-mist)]">
                  {graha.english}
                </span>
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--ng-brass)]">
                  {graha.essence}
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-[var(--ng-mist)]">
                  {graha.line}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-[var(--ng-line)]">
        <div className="mx-auto max-w-6xl px-6 py-20 sm:px-8 sm:py-24 lg:px-10">
          <h2 className="ng-serif ng-section-heading max-w-xl text-[var(--ng-ivory)]">
            How each one gets made.
          </h2>

          <div className="mt-12 divide-y divide-[var(--ng-line)] border-t border-[var(--ng-line)]">
            {principles.map((principle) => (
              <div
                key={principle.label}
                className="grid grid-cols-1 gap-3 py-8 sm:grid-cols-[0.9fr_1.6fr] sm:gap-10"
              >
                <h3 className="ng-serif text-xl text-[var(--ng-ivory)]">
                  {principle.label}
                </h3>
                <p className="max-w-[58ch] text-[1.02rem] leading-relaxed text-[var(--ng-mist)]">
                  {principle.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--ng-line)] bg-[var(--ng-void-2)]">
        <div className="mx-auto max-w-6xl px-6 py-20 text-center sm:px-8 sm:py-24 lg:px-10">
          <p className="ng-serif mx-auto max-w-2xl text-2xl italic leading-snug text-[var(--ng-ivory)] sm:text-3xl">
            "Every bracelet begins with a birth chart, not a size chart."
          </p>
          <a
            href="/find-your-planet"
            className="mt-8 inline-block border-b border-[var(--ng-brass-dim)] pb-0.5 text-sm text-[var(--ng-brass)] transition-colors hover:border-[var(--ng-brass)] hover:text-[var(--ng-ivory)]"
          >
            Find your planet
          </a>
        </div>
      </section>
    </div>
  );
};

export default NavGrahAbout;