// components/Loader.tsx
import Image from "next/image";
import styles from "../styles/Loader.module.css";
import Logo from "../../public/images/image-logo.png";

const GRAHAS = [
  { name: "Sun",     gem: "Ruby",            color: "#B23A2E" },
  { name: "Moon",    gem: "Pearl",           color: "#9C8F76" },
  { name: "Mars",    gem: "Red Coral",       color: "#C1592E" },
  { name: "Mercury", gem: "Emerald",         color: "#2F6F52" },
  { name: "Jupiter", gem: "Yellow Sapphire", color: "#B8862E" },
  { name: "Venus",   gem: "Diamond",         color: "#7E8C99" },
  { name: "Saturn",  gem: "Blue Sapphire",   color: "#3E4E7A" },
  { name: "Rahu",    gem: "Hessonite",       color: "#7A5230" },
  { name: "Ketu",    gem: "Cat's Eye",       color: "#5C6650" },
] as const;

const RING_CENTER = 130;
const RING_RADIUS = 108;
const OUTER_RADIUS = 128;
const PETAL_RADIUS = 60;

export default function Loader() {
  return (
    <div className={styles.loaderRoot} role="status" aria-live="polite">
      <div className={styles.aura} aria-hidden="true" />
      <div className={styles.grain} aria-hidden="true" />

      <div className={styles.mark}>
        <span className={styles.groundShadow} aria-hidden="true" />

        <svg className={styles.orbits} viewBox="0 0 260 260" aria-hidden="true">
          <defs>
            <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#B8862E" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#B8862E" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#B8862E" stopOpacity="0.9" />
              <stop offset="50%" stopColor="#C1592E" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#B8862E" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          <circle cx={RING_CENTER} cy={RING_CENTER} r={95} fill="url(#coreGlow)" />

          {/* Faint lotus-petal ring behind everything */}
          <g className={styles.petalRing}>
            {Array.from({ length: 8 }).map((_, i) => {
              const angle = (i / 8) * 2 * Math.PI;
              const cx = RING_CENTER + PETAL_RADIUS * Math.cos(angle);
              const cy = RING_CENTER + PETAL_RADIUS * Math.sin(angle);
              return (
                <ellipse
                  key={i}
                  cx={cx}
                  cy={cy}
                  rx={16}
                  ry={30}
                  className={styles.petal}
                  transform={`rotate(${(angle * 180) / Math.PI + 90} ${cx} ${cy})`}
                />
              );
            })}
          </g>

          {/* Outer dashed constellation ring - slow rotate */}
          <circle
            className={styles.outerRing}
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={OUTER_RADIUS}
            fill="none"
            stroke="url(#ringGradient)"
            strokeWidth="1"
            strokeDasharray="1 7"
            strokeLinecap="round"
          />

          {/* Main dial track */}
          <circle
            className={styles.dialTrack}
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={RING_RADIUS}
            fill="none"
          />

          {/* Rotating group carrying the 9 grahas */}
          <g className={styles.orbitRing}>
            {GRAHAS.map((graha, i) => {
              const angle = (i / GRAHAS.length) * 2 * Math.PI - Math.PI / 2;
              const cx = RING_CENTER + RING_RADIUS * Math.cos(angle);
              const cy = RING_CENTER + RING_RADIUS * Math.sin(angle);
              return (
                <g key={graha.name} className={styles.gemWrap}>
                  <circle
                    cx={cx}
                    cy={cy}
                    r={10}
                    className={styles.gemHalo}
                    style={{ fill: graha.color, opacity: 0.18 }}
                  />
                  <circle
                    cx={cx}
                    cy={cy}
                    r={5}
                    className={styles.gem}
                    style={{
                      fill: graha.color,
                      filter: `drop-shadow(0 1px 2px ${graha.color}88)`,
                      animationDelay: `${i * 120}ms`,
                    }}
                  >
                    <title>{`${graha.name} — ${graha.gem}`}</title>
                  </circle>
                  <circle cx={cx - 1.4} cy={cy - 1.4} r={1.1} className={styles.gemSpark} />
                </g>
              );
            })}
          </g>

          {/* Counter-rotating faint inner ring for depth */}
          <circle
            className={styles.innerSpin}
            cx={RING_CENTER}
            cy={RING_CENTER}
            r={RING_RADIUS - 24}
            fill="none"
            stroke="#B8862E22"
            strokeWidth="1"
            strokeDasharray="4 10"
          />
        </svg>

        <div className={styles.logoPulse}>
          <Image
            src={Logo}
            alt="Navgrah Bracelets"
            width={200}
            height={200}
            priority
            sizes="(max-width: 480px) 140px, 200px"
            className={styles.logoImg}
          />
        </div>
      </div>

      <p className={styles.caption}>
        <span className={styles.captionText}>Aligning the Nine Planets</span>
        <span className={styles.dots} aria-hidden="true">
          <span />
          <span />
          <span />
        </span>
      </p>
      <span className="sr-only">Loading Navgrah Bracelets, please wait</span>
    </div>
  );
}