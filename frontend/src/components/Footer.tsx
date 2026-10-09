"use client";

import Image from "next/image";
import Logo from "../../public/images/image_logo.jpg";

import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

type SocialPlatform =
  | "instagram"
  | "facebook"
  | "youtube"
  | "whatsapp";

interface FooterNavLink {
  label: string;
  href: string;
}

interface SocialLink {
  platform: SocialPlatform;
  href: string;
}

interface FooterProps {
  logoHref?: string;
  exploreLinks?: FooterNavLink[];
  helpLinks?: FooterNavLink[];
  legalLinks?: FooterNavLink[];
  socialLinks?: SocialLink[];
  trustItems?: string[];
  year?: number;
  onSubscribe?: (email: string) => Promise<void> | void;
}

const DEFAULT_EXPLORE_LINKS: FooterNavLink[] = [
  {
    label: "Home",
    href: "/",
  },
  {
    label: "How it Works",
    href: "/how-it-works",
  },
  {
    label: "Shop by Rashi",
    href: "/collections",
  },
  {
    label: "Customized Bracelets",
    href: "/customized",
  },
  {
    label: "About Navgrah",
    href: "/about-navgrah",
  },
  {
    label: "Contact Us",
    href: "/contact",
  },
];

const DEFAULT_HELP_LINKS: FooterNavLink[] = [
  {
    label: "FAQs",
    href: "/help",
  },
  {
    label: "Shipping & Delivery",
    href: "/shipping-delivery",
  },
  {
    label: "Returns & Refunds",
    href: "/returns-refunds",
  },
  {
    label: "Order Tracking",
    href: "/order-tracking",
  },
  {
    label: "Cancellation Policy",
    href: "/cancellation-policy",
  },
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms-conditions",
  },
];

const DEFAULT_LEGAL_LINKS: FooterNavLink[] = [
  {
    label: "Privacy Policy",
    href: "/privacy-policy",
  },
  {
    label: "Terms & Conditions",
    href: "/terms-conditions",
  },
  {
    label: "Refund Policy",
    href: "/returns-refunds",
  },
];

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    platform: "instagram",
    href: "https://www.instagram.com/navgrahbracelets/",
  },
  // {
  //   platform: "facebook",
  //   href: "https://facebook.com/",
  // },
  // {
  //   platform: "youtube",
  //   href: "https://youtube.com/",
  // },
  {
    platform: "whatsapp",
    href: "https://wa.me/918595873812?text=Hi%20Navgrah%20Bracelets%2C%20I%20would%20like%20to%20know%20more%20about%20your%20bracelets.",
  },
];

const DEFAULT_TRUST_ITEMS: string[] = [
  "Personalized Recommendations",
  "Authentic Gemstone Selection",
  "Secure Checkout",
  "Dedicated Customer Support",
];

const PLANET_COLORS = [
  "#C9631F",
  "#5B7B9E",
  "#B8433A",
  "#3F8F6B",
  "#B8862A",
  "#B14E78",
  "#4E5A70",
  "#6E5399",
  "#8A6432",
];

const SOCIAL_ACCENTS: Record<SocialPlatform, string> = {
  instagram: "#B14E78",
  facebook: "#5B7B9E",
  youtube: "#B8433A",
  whatsapp: "#3F8F6B",
};

const STARS = Array.from({ length: 28 }, (_, i) => {
  const seed = i * 91.7;

  return {
    x: ((seed * 2.3) % 100).toFixed(2),
    y: ((seed * 1.4) % 100).toFixed(2),
    r: (0.4 + ((seed * 0.51) % 1.1)).toFixed(2),
    delay: ((seed * 0.29) % 5).toFixed(2),
    color: PLANET_COLORS[i % PLANET_COLORS.length],
  };
});

function useInView<T extends HTMLElement>(
  options?: IntersectionObserverInit
) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;

    if (!node) {
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      options
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
    };
  }, []);

  return [ref, inView] as const;
}

function SocialIcon({
  platform,
}: {
  platform: SocialPlatform;
}) {
  const commonClasses =
    "block w-[20px] h-[20px] shrink-0 text-current";

  switch (platform) {
    case "instagram":
      return (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={commonClasses}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="3"
            y="3"
            width="18"
            height="18"
            rx="5"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <circle
            cx="12"
            cy="12"
            r="4.2"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <circle
            cx="17.2"
            cy="6.8"
            r="1.2"
            fill="currentColor"
          />
        </svg>
      );

    case "facebook":
      return (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={commonClasses}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M14.5 8.5h2V5.6c-.35-.05-1.53-.15-2.9-.15-2.87 0-4.84 1.75-4.84 4.97v2.48H6v3.24h3.26V21h3.35v-4.86h3.12l.5-3.24h-3.62v-2.14c0-.94.26-1.58 1.89-1.58Z"
            fill="currentColor"
          />
        </svg>
      );

    case "youtube":
      return (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={commonClasses}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <rect
            x="2.5"
            y="6"
            width="19"
            height="12"
            rx="3.5"
            stroke="currentColor"
            strokeWidth="1.8"
          />

          <path
            d="M10.2 9.3v5.4l4.7-2.7-4.7-2.7Z"
            fill="currentColor"
          />
        </svg>
      );

    case "whatsapp":
      return (
        <svg
          viewBox="0 0 24 24"
          width="20"
          height="20"
          className={commonClasses}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 3.5a8.4 8.4 0 0 0-7.2 12.7L3.5 20.5l4.45-1.27A8.4 8.4 0 1 0 12 3.5Z"
            stroke="currentColor"
            strokeWidth="1.6"
          />

          <path
            d="M8.7 8.6c.2-.45.4-.46.6-.47h.5c.16 0 .38-.06.58.44s.7 1.7.76 1.83.1.28.02.44a1.7 1.7 0 0 1-.27.4c-.14.16-.28.35-.4.47-.14.14-.28.29-.12.57.16.28.72 1.18 1.55 1.9 1.06.94 1.96 1.23 2.24 1.37s.44.12.6-.07.7-.8.89-1.08.37-.23.63-.14 1.63.77 1.9.9.46.2.53.32.07.65-.15 1.28-.22.63-1.28 1.24-1.77 1.27-1.6-.1a14.4 14.4 0 0 1-1.47-.55 11.4 11.4 0 0 1-4.36-3.86 5.2 5.2 0 0 1-1.08-2.75c0-.8.3-1.24.55-1.5Z"
            fill="currentColor"
          />
        </svg>
      );

    default:
      return null;
  }
}

function NavColumn({
  title,
  links,
}: {
  title: string;
  links: FooterNavLink[];
}) {
  const headingId = `footer-${title
    .replace(/\s+/g, "-")
    .toLowerCase()}`;

  return (
    <nav aria-labelledby={headingId}>
      <h3
        id={headingId}
        className="
          [font-family:var(--font-display)]
          text-[17px]
          text-[color:var(--ink)]
          mb-5
        "
      >
        {title}
      </h3>

      <ul className="list-none m-0 p-0 flex flex-col gap-3">
        {links.map((link) => (
          <li key={`${link.label}-${link.href}`}>
            <a
              href={link.href}
              className="
                group
                relative
                inline-flex
                items-center
                gap-1.5
                text-[14px]
                text-[color:var(--ink-dim)]
                transition-colors
                duration-300
                ease-out
                hover:text-[color:var(--gold-deep)]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-[color:var(--gold-deep)]
                focus-visible:outline-offset-2
                focus-visible:rounded-sm
              "
            >
              <span className="relative">
                {link.label}

                <span
                  className="
                    absolute
                    left-0
                    -bottom-0.5
                    h-px
                    w-0
                    bg-[color:var(--gold-deep)]
                    transition-[width]
                    duration-300
                    ease-out
                    group-hover:w-full
                    group-focus-visible:w-full
                  "
                />
              </span>

              <span
                aria-hidden="true"
                className="
                  translate-x-[-3px]
                  opacity-0
                  transition-all
                  duration-300
                  ease-out
                  group-hover:translate-x-0
                  group-hover:opacity-100
                  group-focus-visible:translate-x-0
                  group-focus-visible:opacity-100
                "
              >
                →
              </span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ==========================================================================
   FOOTER
   ========================================================================== */

export default function Footer({
  logoHref = "/",
  exploreLinks = DEFAULT_EXPLORE_LINKS,
  helpLinks = DEFAULT_HELP_LINKS,
  legalLinks = DEFAULT_LEGAL_LINKS,

  socialLinks = DEFAULT_SOCIAL_LINKS,

  trustItems = DEFAULT_TRUST_ITEMS,
  year = new Date().getFullYear(),
  onSubscribe,
}: FooterProps) {
  const [footerRef, footerInView] =
    useInView<HTMLElement>({
      threshold: 0.08,
    });

  const [email, setEmail] = useState("");

  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const trimmedEmail = email.trim();

      if (!trimmedEmail) {
        setStatus("error");
        return;
      }

      setStatus("loading");

      try {
        if (onSubscribe) {
          await onSubscribe(trimmedEmail);
        }

        setStatus("success");
        setEmail("");
      } catch {
        setStatus("error");
      }
    },
    [email, onSubscribe]
  );

  const fadeBase =
    "opacity-0 translate-y-3 motion-reduce:opacity-100 motion-reduce:translate-y-0";

  const fadeIn = (delayClass: string) =>
    footerInView
      ? `opacity-100 translate-y-0 transition-all duration-700 ease-out ${delayClass}`
      : fadeBase;

  return (
    <footer
      ref={footerRef}
      className="
        [--paper:#FFFFFF]
        [--ivory:#FBF6EC]

        [--gold:#B8863E]
        [--gold-deep:#8F692C]
        [--gold-tint:rgba(184,134,62,0.10)]

        [--ink:#241F1A]
        [--ink-dim:rgba(36,31,26,0.62)]
        [--slate:#8A7F70]
        [--border:#E7DECB]

        [--font-display:'Cormorant_Garamond',Georgia,serif]
        [--font-body:'Inter',-apple-system,BlinkMacSystemFont,sans-serif]

        relative
        overflow-hidden
        [font-family:var(--font-body)]

        bg-[color:var(--ivory)]

        border-t
        border-[color:var(--border)]
      "
    >
      <style>{`
        @keyframes footerTwinkle {
          0%, 100% {
            opacity: 0.18;
          }

          50% {
            opacity: 0.55;
          }
        }

        @keyframes footerDrift {
          from {
            transform: rotate(0deg);
          }

          to {
            transform: rotate(360deg);
          }
        }
      `}</style>

      <div
        aria-hidden="true"
        className="flex h-[3px] w-full"
      >
        {PLANET_COLORS.map((color, i) => (
          <span
            key={`planet-${i}`}
            className="h-full flex-1"
            style={{
              backgroundColor: color,
            }}
          />
        ))}
      </div>

      <svg
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          inset-0
          w-full
          h-full
          opacity-60
        "
        preserveAspectRatio="xMidYMid slice"
      >
        {STARS.map((star, i) => (
          <circle
            key={`star-${i}`}
            cx={`${star.x}%`}
            cy={`${star.y}%`}
            r={star.r}
            fill={star.color}
            className="
              motion-safe:animate-[footerTwinkle_5s_ease-in-out_infinite]
            "
            style={{
              animationDelay: `${star.delay}s`,
            }}
          />
        ))}

        <g
          className="
            motion-safe:animate-[footerDrift_220s_linear_infinite]
            [transform-box:fill-box]
            [transform-origin:center]
          "
        >
          <ellipse
            cx="12%"
            cy="10%"
            rx="220"
            ry="90"
            className="
              fill-none
              stroke-[color:var(--gold-tint)]
              [stroke-width:0.75]
            "
          />
        </g>

        <g
          className="
            motion-safe:animate-[footerDrift_260s_linear_infinite_reverse]
            [transform-box:fill-box]
            [transform-origin:center]
          "
        >
          <ellipse
            cx="88%"
            cy="85%"
            rx="260"
            ry="110"
            className="
              fill-none
              stroke-[color:var(--gold-tint)]
              [stroke-width:0.75]
            "
          />
        </g>
      </svg>

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-[6%]
          top-[4%]
          w-[260px]
          h-[260px]
          rounded-full
          bg-[radial-gradient(circle,rgba(184,134,62,0.10),transparent_70%)]
        "
      />

      <div
        className="
          relative
          max-w-[1280px]
          mx-auto
          px-[5vw]
          md:px-[6vw]
          pt-14
          md:pt-18
          pb-10
        "
      >

        <div
          className="
            grid
            grid-cols-1
            gap-12

            sm:grid-cols-2
            sm:gap-x-8
            sm:gap-y-12

            lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]
            lg:gap-10
          "
        >

          <div className={fadeIn("delay-[40ms]")}>
            <a
              href={logoHref}
              aria-label="Navgrah Bracelets home"
              className="
                inline-flex
                items-center
                mb-6
                rounded-sm

                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-[color:var(--gold-deep)]
                focus-visible:outline-offset-4
              "
            >
              <Image
                src={Logo}
                alt="Navgrah Bracelets"
                width={300}
                height={140}
                priority
                className="
                  block

                  h-16
                  md:h-[72px]
                  lg:h-[82px]

                  w-auto
                  max-w-[300px]

                  object-contain
                  object-left
                  rounded-md
                "
              />
            </a>

            <p
              className="
                text-[14px]
                leading-[1.7]
                text-[color:var(--ink-dim)]
                max-w-[32ch]
                mb-4
              "
            >
              Personalized gemstone bracelets inspired by the timeless wisdom
              of Navgrah bracelets.
            </p>

            <p
              className="
                text-[12.5px]
                tracking-[0.04em]
                text-[color:var(--slate)]
                mb-6
              "
            >
              Ancient wisdom • Modern expression
            </p>

            <div
              className="
                block
                w-full
                min-h-[44px]
              "
            >
              <ul
                aria-label="Navgrah Bracelets social media"
                className="
                  list-none
                  m-0
                  p-0

                  flex
                  items-center
                  gap-2.5
                "
              >
                {socialLinks.map((social) => {
                  const accent =
                    SOCIAL_ACCENTS[social.platform];

                  const platformName =
                    social.platform
                      .charAt(0)
                      .toUpperCase() +
                    social.platform.slice(1);

                  return (
                    <li
                      key={social.platform}
                      className="block"
                    >
                      <a
                        href={social.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Follow Navgrah Bracelets on ${platformName}`}
                        className="
                          group
                          flex
                          items-center
                          justify-center
                          w-10
                          h-10
                          md:w-11
                          md:h-11
                          rounded-full
                          border
                          border-[color:var(--border)]
                          bg-white
                          text-[#6F665B]
                          shadow-[0_2px_8px_rgba(36,31,26,0.05)]
                          transition-all
                          duration-300
                          ease-out
                          hover:-translate-y-1
                          hover:scale-105
                          focus-visible:outline
                          focus-visible:outline-2
                          focus-visible:outline-[color:var(--gold-deep)]
                          focus-visible:outline-offset-2
                        "
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color =
                            accent;

                          e.currentTarget.style.borderColor =
                            accent;

                          e.currentTarget.style.boxShadow =
                            `0 7px 20px ${accent}35`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color =
                            "#6F665B";

                          e.currentTarget.style.borderColor =
                            "#E7DECB";

                          e.currentTarget.style.boxShadow =
                            "0 2px 8px rgba(36,31,26,0.05)";
                        }}
                      >
                        <SocialIcon
                          platform={social.platform}
                        />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>

          <div className={fadeIn("delay-[120ms]")}>
            <NavColumn
              title="Explore"
              links={exploreLinks}
            />
          </div>

          <div className={fadeIn("delay-[200ms]")}>
            <NavColumn
              title="Help & Support"
              links={helpLinks}
            />
          </div>

          <div className={fadeIn("delay-[280ms]")}>
            <h3
              className="
                [font-family:var(--font-display)]
                text-[17px]
                text-[color:var(--ink)]
                mb-3
              "
            >
              Stay in the Loop
            </h3>

            <p
              className="
                text-[13.5px]
                leading-[1.65]
                text-[color:var(--ink-dim)]
                mb-5
                max-w-[34ch]
              "
            >
              Get updates, bracelet insights, and new bracelet launches
              delivered to your inbox.
            </p>

            {status === "success" ? (
              <p
                className="
                  text-[14px]
                  text-[color:var(--gold-deep)]
                "
                role="status"
              >
                You&rsquo;re on the list ✦
              </p>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col gap-3"
                noValidate
              >
                <label
                  htmlFor="footer-newsletter-email"
                  className="sr-only"
                >
                  Email address
                </label>

                <div className="flex items-stretch gap-2">
                  <input
                    id="footer-newsletter-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);

                      if (status === "error") {
                        setStatus("idle");
                      }
                    }}
                    placeholder="Enter your email address"
                    aria-invalid={status === "error"}
                    className="
                      min-w-0
                      flex-1
                      rounded-[3px]
                      bg-[color:var(--paper)]
                      border
                      border-[color:var(--border)]
                      text-[color:var(--ink)]
                      text-[13.5px]
                      placeholder:text-[color:var(--slate)]
                      px-3.5
                      py-[11px]
                      outline-none
                      transition-[border-color,box-shadow]
                      duration-300
                      ease-out
                      focus:border-[color:var(--gold)]
                      focus:shadow-[0_0_0_3px_rgba(184,134,62,0.15)]
                    "
                  />

                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="
                      shrink-0
                      rounded-[3px]
                      bg-[color:var(--gold)]
                      text-[color:var(--ivory)]
                      text-[13px]
                      font-medium
                      px-4
                      py-[11px]
                      whitespace-nowrap
                      transition-all
                      duration-200
                      ease-out
                      hover:-translate-y-[1px]
                      hover:bg-[color:var(--gold-deep)]
                      hover:shadow-[0_6px_18px_rgba(184,134,62,0.3)]
                      disabled:opacity-60
                      disabled:cursor-not-allowed
                      disabled:hover:translate-y-0
                      focus-visible:outline
                      focus-visible:outline-2
                      focus-visible:outline-[color:var(--gold-deep)]
                      focus-visible:outline-offset-2
                    "
                  >
                    {status === "loading"
                      ? "Subscribing…"
                      : "Subscribe →"}
                  </button>
                </div>

                {status === "error" && (
                  <p
                    className="
                      text-[12.5px]
                      text-[#B8433A]
                    "
                    role="alert"
                  >
                    Please enter a valid email or try again.
                  </p>
                )}
              </form>
            )}
          </div>
        </div>

        <ul
          className={`
            list-none
            m-0
            p-0
            mt-14
            md:mt-16
            pt-8
            border-t
            border-[color:var(--border)]
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-4
            gap-x-6
            gap-y-4

            ${fadeIn("delay-[360ms]")}
          `}
        >
          {trustItems.map((item, i) => (
            <li
              key={item}
              className="
                flex
                items-center
                gap-2.5
                text-[12.5px]
                tracking-[0.02em]
                text-[color:var(--ink-dim)]
              "
            >
              <span
                aria-hidden="true"
                className="
                  w-2
                  h-2
                  rounded-full
                  shrink-0
                "
                style={{
                  backgroundColor:
                    PLANET_COLORS[
                      i % PLANET_COLORS.length
                    ],
                }}
              />

              {item}
            </li>
          ))}
        </ul>

        <div
          className={`
            mt-10
            pt-6
            border-t
            border-[color:var(--border)]
            flex
            flex-col-reverse
            items-center
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
            ${fadeIn("delay-[420ms]")}
          `}
        >
          <p
            className="
              text-[12.5px]
              text-[color:var(--slate)]
              text-center
              sm:text-left
            "
          >
            © {year} Navgrah Bracelets. All rights reserved.
          </p>

          <ul
            className="
              list-none
              m-0
              p-0
              flex
              flex-wrap
              items-center
              justify-center
              gap-x-6
              gap-y-2
            "
          >
            {legalLinks.map((link) => (
              <li
                key={`${link.label}-${link.href}`}
              >
                <a
                  href={link.href}
                  className="
                    text-[12.5px]
                    text-[color:var(--slate)]
                    transition-colors
                    duration-300
                    ease-out
                    hover:text-[color:var(--gold-deep)]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-[color:var(--gold-deep)]
                    focus-visible:outline-offset-2
                    focus-visible:rounded-sm
                  "
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
