  // src/components/WhyChooseUs/WhyChooseUs.tsx
  // Replaces Hero as the section rendered in this slot.

  import type { ReactNode } from "react";

  type Feature = {
    title: string;
    description: string;
    icon: ReactNode;
  };

  // Hand-drawn line icons, kept in the same stroke language as the rest of the
  // site (currentColor, 1.6 stroke, round caps) so they read as one family.

  function GemstoneIcon() {
    return (
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M12 14 L20 6 L28 14 L34 17 L20 35 L6 17 Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M12 14H28M20 6V14M6 17H34M20 14L14 17L20 35L26 17L20 14Z"
          stroke="currentColor"
          strokeWidth="1.1"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function SelenitePlateIcon() {
    return (
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <ellipse cx="20" cy="28" rx="13" ry="4.5" stroke="currentColor" strokeWidth="1.5" />
        <ellipse cx="20" cy="26" rx="13" ry="4.5" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M20 4V11M13 7L16 13M27 7L24 13M9 12L14 16M31 12L26 16"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  function CertificateIcon() {
    return (
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <circle cx="20" cy="16" r="10" stroke="currentColor" strokeWidth="1.5" />
        <path
          d="M15.5 16.5L18.5 19.5L24.5 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.5 24.5L12 35L20 31L28 35L25.5 24.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  function BlessingFlameIcon() {
    return (
      <svg width="30" height="30" viewBox="0 0 40 40" fill="none" aria-hidden="true">
        <path
          d="M20 6C20 6 14 14.5 14 20.5C14 24.6 16.7 28 20 28C23.3 28 26 24.6 26 20.5C26 14.5 20 6 20 6Z"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path
          d="M17.5 22C17.5 24.5 18.6 26 20 26"
          stroke="currentColor"
          strokeWidth="1.2"
          strokeLinecap="round"
        />
        <ellipse cx="20" cy="33" rx="12" ry="3.5" stroke="currentColor" strokeWidth="1.5" />
      </svg>
    );
  }

  const FEATURES: Feature[] = [
    {
      title: "Premium Gemstones",
      description:
        "Nine gemstones, one for each graha, chosen for clarity and potency — never synthetic, never substituted.",
      icon: <GemstoneIcon />,
    },
    {
      title: "Selenite Plate",
      description:
        "Every bracelet rests on a selenite plate before it ships, clearing residual energy and restoring its natural vibration.",
      icon: <SelenitePlateIcon />,
    },
    {
      title: "Lab Certificates",
      description:
        "Each gemstone is backed by lab certification, so you know exactly what you're wearing and why it was chosen.",
      icon: <CertificateIcon />,
    },
    {
      title: "Energized by an Astrologer",
      description:
        "A practicing astrologer personally energizes and blesses your bracelet, aligning it to its graha before it reaches you.",
      icon: <BlessingFlameIcon />,
    },
  ];

  export default function WhyChooseUs() {
    return (
      <section
        aria-labelledby="why-choose-heading"
        className="relative overflow-hidden bg-[#FBF7EE] py-24 sm:py-28 lg:py-32"
      >
        <style>{`
          @keyframes whyChooseReveal {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .why-choose-reveal {
            animation: whyChooseReveal 0.9s cubic-bezier(0.16, 1, 0.3, 1) both;
          }
          @media (prefers-reduced-motion: reduce) {
            .why-choose-reveal {
              animation: none;
              opacity: 1;
              transform: none;
            }
          }
        `}</style>

        {/* Faint radial warmth behind the heading — quiet echo of the hero's orbit, not a repeat of it */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[720px] -translate-x-1/2 -translate-y-1/3 opacity-60"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(201,162,75,0.10) 0%, rgba(201,162,75,0) 70%)",
          }}
        />

        <div className="relative mx-auto max-w-[1100px] px-6 sm:px-10">
          <div className="why-choose-reveal mx-auto max-w-[600px] text-center">
            <h2
              id="why-choose-heading"
              className="font-display text-[30px] font-medium leading-[1.15] tracking-[-0.01em] text-[#1B1226] sm:text-[36px] md:text-[42px]"
            >
              Why Choose Navgrah Bracelets?
            </h2>
            <div className="mx-auto mt-5 h-px w-16 bg-[#C9A24B]/50" />
            <p className="mx-auto mt-5 max-w-[460px] text-base leading-[1.6] text-[#1B1226]/65 sm:text-[17px]">
              Every bracelet carries more than gemstones — it carries a lineage
              of care, from sourcing to blessing, before it ever reaches your
              wrist.
            </p>
          </div>

          <div className="why-choose-reveal mt-16 grid grid-cols-1 gap-y-12 sm:mt-20 sm:grid-cols-2 sm:gap-x-10 sm:gap-y-14 lg:grid-cols-4 lg:gap-x-0 lg:divide-x lg:divide-[#C9A24B]/25">
            {FEATURES.map((feature) => (
              <div
                key={feature.title}
                className="group flex flex-col items-center px-4 text-center lg:px-8"
              >
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-[#C9A24B]/40 text-[#C9A24B] transition-colors duration-300 group-hover:border-[#C9A24B] group-hover:bg-[#C9A24B]/8">
                  {feature.icon}
                </div>
                <h3 className="mt-5 font-display text-[18px] font-medium text-[#1B1226] sm:text-[19px]">
                  {feature.title}
                </h3>
                <p className="mt-2.5 max-w-[240px] text-[14.5px] leading-[1.55] text-[#1B1226]/60">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }