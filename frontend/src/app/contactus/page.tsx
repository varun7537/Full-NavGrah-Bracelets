// src/components/NavgrahBracelets/ContactUs.tsx
"use client";

import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type CSSProperties,
  type ReactNode,
} from "react";

type IconComponent = (props: {
  className?: string;
  style?: CSSProperties;
}) => ReactNode;


import { WhatsAppIcon, EmailIcon, PhoneIcon, AlertIcon, ShieldIcon } from "../../components/Header/icons";

interface ContactFormValues {
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

type ContactFormErrors = Partial<Record<keyof ContactFormValues, string>>;

interface SubjectOption {
  label: string;
  planet: string;
  planetEnglish: string;
  symbol: string;
  core: string;
  glow: string;
}

interface Bead {
  key: string;
  planet: string;
  planetEnglish: string;
  gem: string;
  symbol: string;
  color: string;
  glow: string;
  active?: {
    label: string;
    meaning: string;
    href: string;
    icon: IconComponent;
  };
}


const INK = "#2A1A2E";
const SECTION_BG = "#F8F4EC";
const CARD_BG = "#FFFEFB";
const INPUT_BG = "#FBF8F1";

const DEFAULT_ACCENT = { core: "#C08A2E", glow: "#EFD8A0" };

const SUBJECT_OPTIONS: SubjectOption[] = [
  { label: "Bracelet Recommendation", planet: "Guru", planetEnglish: "Jupiter", symbol: "\u2643", core: "#C98A2D", glow: "#F3D999" },
  { label: "Kundli / Birth Details", planet: "Surya", planetEnglish: "Sun", symbol: "\u2609", core: "#A62F48", glow: "#E8879A" },
  { label: "Order Support", planet: "Budh", planetEnglish: "Mercury", symbol: "\u263F", core: "#2F8F5B", glow: "#A9F0C9" },
  { label: "Shipping & Delivery", planet: "Shani", planetEnglish: "Saturn", symbol: "\u2644", core: "#33507D", glow: "#9DB6E0" },
  { label: "Product Question", planet: "Shukra", planetEnglish: "Venus", symbol: "\u2640", core: "#9C8A5E", glow: "#F3EEE0" },
  { label: "Other", planet: "Chandra", planetEnglish: "Moon", symbol: "\u263D", core: "#5D78A3", glow: "#E7F0FF" },
];

const EMPTY_VALUES: ContactFormValues = {
  fullName: "",
  email: "",
  phone: "",
  subject: "",
  message: "",
};

/** Even spacing along the thread, top (Surya) to bottom (Ketu). */
const BEAD_POSITIONS = [4, 16, 27, 39, 50, 61, 73, 84, 96];

interface ContactUsProps {
  /** e.g. "https://wa.me/91XXXXXXXXXX". The Chandra bead stays decorative if omitted. */
  whatsappLink?: string;
  /** Existing support inbox, e.g. "support@navgrah.com". The Budh bead stays decorative if omitted. */
  supportEmail?: string;
  /** Existing business phone, e.g. "+91 90000 00000". The Guru bead stays decorative if omitted. */
  supportPhone?: string;
  /** Only rendered if your project already has an FAQ route. */
  faqHref?: string;
  /**
   * Wire this up to your real API/form handler. Receives the validated
   * values and should throw (or reject) on failure. If omitted, the
   * component logs a console warning and previews the success state
   * so the UI can be reviewed before a handler exists — replace before
   * shipping to production.
   */
  onSubmit?: (values: ContactFormValues) => Promise<void> | void;
  className?: string;
}

function useInView<T extends HTMLElement>(threshold = 0.15) {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold]);

  return { ref, inView };
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(query.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    query.addEventListener?.("change", handler);
    return () => query.removeEventListener?.("change", handler);
  }, []);
  return reduced;
}

/* ------------------------------------------------------------------ */
/* Validation                                                           */
/* ------------------------------------------------------------------ */

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: ContactFormValues): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!values.fullName.trim()) {
    errors.fullName = "Please enter your full name.";
  }

  if (!values.email.trim()) {
    errors.email = "Please enter your email address.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Please enter a valid email address.";
  }

  if (!values.subject) {
    errors.subject = "Please select what you need help with.";
  }

  if (!values.message.trim()) {
    errors.message = "Please enter a message.";
  } else if (values.message.trim().length < 10) {
    errors.message = "Please add a few more details (at least 10 characters).";
  }

  return errors;
}

/* ------------------------------------------------------------------ */
/* Component                                                            */
/* ------------------------------------------------------------------ */

export default function ContactUs({
  whatsappLink,
  supportEmail,
  supportPhone,
  faqHref,
  onSubmit,
  className = "",
}: ContactUsProps) {
  const { ref: revealRef, inView } = useInView<HTMLDivElement>(0.1);
  const reducedMotion = usePrefersReducedMotion();

  const beads: Bead[] = [
    { key: "surya", planet: "Surya", planetEnglish: "Sun", gem: "Ruby", symbol: "\u2609", color: "#A62F48", glow: "#E8879A" },
    {
      key: "chandra",
      planet: "Chandra",
      planetEnglish: "Moon",
      gem: "Pearl",
      symbol: "\u263D",
      color: "#5D78A3",
      glow: "#E7F0FF",
      active: whatsappLink
        ? { label: "Chat", meaning: "for quick questions", href: whatsappLink, icon: WhatsAppIcon }
        : undefined,
    },
    { key: "mangal", planet: "Mangal", planetEnglish: "Mars", gem: "Red Coral", symbol: "\u2642", color: "#C1440E", glow: "#F0A98A" },
    {
      key: "budh",
      planet: "Budh",
      planetEnglish: "Mercury",
      gem: "Emerald",
      symbol: "\u263F",
      color: "#2F8F5B",
      glow: "#A9F0C9",
      active: supportEmail
        ? { label: "Email", meaning: "for detailed notes", href: `mailto:${supportEmail}`, icon: EmailIcon }
        : undefined,
    },
    {
      key: "guru",
      planet: "Guru",
      planetEnglish: "Jupiter",
      gem: "Yellow Sapphire",
      symbol: "\u2643",
      color: "#C98A2D",
      glow: "#F3D999",
      active: supportPhone
        ? {
            label: "Call",
            meaning: "for guidance",
            href: `tel:${supportPhone.replace(/[^\d+]/g, "")}`,
            icon: PhoneIcon,
          }
        : undefined,
    },
    { key: "shukra", planet: "Shukra", planetEnglish: "Venus", gem: "Diamond", symbol: "\u2640", color: "#9C8A5E", glow: "#F3EEE0" },
    { key: "shani", planet: "Shani", planetEnglish: "Saturn", gem: "Blue Sapphire", symbol: "\u2644", color: "#33507D", glow: "#9DB6E0" },
    { key: "rahu", planet: "Rahu", planetEnglish: "North Node", gem: "Hessonite", symbol: "\u260A", color: "#9C6B3E", glow: "#D8AE7C" },
    { key: "ketu", planet: "Ketu", planetEnglish: "South Node", gem: "Cat's Eye", symbol: "\u260B", color: "#5C6E5F", glow: "#AEBCB0" },
  ];

  return (
    <section
      aria-labelledby="contact-us-heading"
      id="contact-us-heading"
      className={`relative overflow-hidden bg-[${SECTION_BG}] px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-28 ${className}`}
      style={{ backgroundColor: SECTION_BG }}
    >
      <NebulaField />

      <div className="relative mx-auto max-w-5xl">
        <div
          ref={revealRef}
          className="grid grid-cols-1 gap-y-10 md:grid-cols-[88px_1fr] md:gap-x-8 lg:grid-cols-[104px_1fr] lg:gap-x-12"
          style={{
            opacity: inView ? 1 : 0,
            transform: inView ? "translateY(0)" : "translateY(18px)",
            transitionProperty: "opacity, transform",
            transitionDuration: "700ms",
          }}
        >
          {/* Desktop rail: the thread runs the full height of everything beside it */}
          <div className="relative hidden md:block">
            <DesktopThread beads={beads} reducedMotion={reducedMotion} />
          </div>

          {/* The single manuscript column: heading, note, mobile thread, form */}
          <div className="flex flex-col gap-8 sm:gap-10">
            <div className="max-w-[54ch]">
              <h2
                id="contact-us-heading"
                className="font-display text-[1.65rem] font-semibold leading-[1.2] text-[color:var(--ink)] sm:text-3xl sm:leading-[1.15] md:text-4xl lg:text-[2.6rem]"
                style={{ color: INK }}
              >
                Nine stones. One thread. Three ways to reach us.
              </h2>
              <p className="mt-4 text-sm sm:text-base" style={{ color: `${INK}A6` }}>
                Every navgraha bracelet we make strings nine planetary stones
                onto a single thread. Ours works the same way — pull it from
                wherever suits you: a call for guidance, an email for detail,
                or a chat for something quick.
              </p>
            </div>

            {/* Mobile rail: the same nine beads, laid flat and read left to right */}
            <MobileThread beads={beads} reducedMotion={reducedMotion} />

            <ContactForm onSubmit={onSubmit} />

            {faqHref && (
              <a
                href={faqHref}
                className="group relative -mt-2 inline-flex self-start text-sm font-medium sm:-mt-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
                style={{ color: DEFAULT_ACCENT.core, outlineColor: DEFAULT_ACCENT.core }}
              >
                Visit our FAQs
                <span
                  aria-hidden="true"
                  className="absolute -bottom-0.5 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                  style={{ backgroundColor: DEFAULT_ACCENT.core }}
                />
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/* The bead itself — shared visual, rendered by both rail layouts       */
/* ------------------------------------------------------------------ */

function BeadNode({
  bead,
  size,
}: {
  bead: Bead;
  size: "sm" | "lg";
}) {
  const dimension =
    size === "lg"
      ? "h-9 w-9 sm:h-11 sm:w-11 md:h-12 md:w-12 lg:h-14 lg:w-14"
      : "h-6 w-6 sm:h-7 sm:w-7";
  const symbolSize = size === "lg" ? "text-sm sm:text-base" : "text-[10px] sm:text-[11px]";

  if (!bead.active) {
    return (
      <span
        aria-hidden="true"
        title={`${bead.planet} \u2014 ${bead.planetEnglish} \u2014 ${bead.gem}`}
        className={`flex ${dimension} shrink-0 items-center justify-center rounded-full ${symbolSize} transition-transform duration-300 hover:scale-110`}
        style={{
          background: `radial-gradient(circle at 35% 30%, ${bead.glow}80, ${bead.color}33)`,
          boxShadow: `0 0 0 1px ${bead.color}55`,
          color: bead.color,
        }}
      >
        {bead.symbol}
      </span>
    );
  }

  const Icon = bead.active.icon;

  return (
    <a
      href={bead.active.href}
      aria-label={`${bead.active.label} with us \u2014 ${bead.planet}, the ${bead.planetEnglish}, planet ${bead.active.meaning}`}
      className={`group relative flex ${dimension} shrink-0 items-center justify-center rounded-full transition-transform duration-300 ease-out hover:scale-110 focus:outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4`}
      style={{
        background: `radial-gradient(circle at 35% 30%, ${bead.glow}, ${bead.color})`,
        boxShadow: `0 0 0 1px ${bead.color}77, 0 8px 20px -10px ${bead.color}99`,
        outlineColor: bead.color,
      }}
    >
      <span
        className={`absolute ${symbolSize} font-medium opacity-100 transition-opacity duration-300 group-hover:opacity-0 group-focus-visible:opacity-0`}
        style={{ color: INK }}
        aria-hidden="true"
      >
        {bead.symbol}
      </span>
      <Icon
        className="h-4 w-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100 sm:h-5 sm:w-5 md:h-6 md:w-6"
        style={{ color: INK } as React.CSSProperties}
      />
    </a>
  );
}

function DesktopThread({
  beads,
  reducedMotion,
}: {
  beads: Bead[];
  reducedMotion: boolean;
}) {
  return (
    <div
      className="sticky top-24 h-full"
      style={{
        animation: reducedMotion ? "none" : "navgrah-thread-sway 9s ease-in-out infinite",
        transformOrigin: "top center",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-[4%] bottom-[4%] w-px -translate-x-1/2"
        style={{
          background: `linear-gradient(to bottom, transparent, ${DEFAULT_ACCENT.core}66 6%, ${DEFAULT_ACCENT.core}66 94%, transparent)`,
        }}
      />
      {beads.map((bead, i) => (
        <div
          key={bead.key}
          className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ top: `${BEAD_POSITIONS[i]}%` }}
        >
          <BeadNode bead={bead} size={bead.active ? "lg" : "sm"} />
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Mobile thread — horizontal, same nine beads, same order              */
/* Wrapped in overflow-x-auto so it degrades to a gentle scroll instead */
/* of squeezing beads together on very narrow (< 340px) screens.        */
/* ------------------------------------------------------------------ */

function MobileThread({
  beads,
  reducedMotion,
}: {
  beads: Bead[];
  reducedMotion: boolean;
}) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 pb-1 md:hidden [scrollbar-width:thin]">
      <div
        className="relative flex min-w-max items-center justify-between gap-2.5 py-2 sm:gap-3"
        style={{
          animation: reducedMotion ? "none" : "navgrah-thread-sway 9s ease-in-out infinite",
          transformOrigin: "center",
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-[2%] top-1/2 h-px -translate-y-1/2"
          style={{
            background: `linear-gradient(to right, transparent, ${DEFAULT_ACCENT.core}66 6%, ${DEFAULT_ACCENT.core}66 94%, transparent)`,
          }}
        />
        {beads.map((bead) => (
          <BeadNode key={bead.key} bead={bead} size={bead.active ? "lg" : "sm"} />
        ))}
      </div>
      <style>{`
        @keyframes navgrah-thread-sway {
          0%, 100% { transform: rotate(-1deg); }
          50% { transform: rotate(1deg); }
        }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Form                                                                 */
/* ------------------------------------------------------------------ */

function ContactForm({
  onSubmit,
}: {
  onSubmit?: (values: ContactFormValues) => Promise<void> | void;
}) {
  const [values, setValues] = useState<ContactFormValues>(EMPTY_VALUES);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [submittedSubject, setSubmittedSubject] = useState<string>("");
  const fieldRefs = useRef<Partial<Record<keyof ContactFormValues, HTMLElement | null>>>({});

  const selectedOption = SUBJECT_OPTIONS.find((o) => o.label === values.subject);
  const accent = selectedOption ?? DEFAULT_ACCENT;

  function updateField<K extends keyof ContactFormValues>(field: K, value: ContactFormValues[K]) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);

    const firstInvalidField = (Object.keys(nextErrors) as (keyof ContactFormValues)[])[0];
    if (firstInvalidField) {
      fieldRefs.current[firstInvalidField]?.focus();
      return;
    }

    setStatus("submitting");
    try {
      if (onSubmit) {
        await onSubmit(values);
      } else if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn(
          "ContactUs: no `onSubmit` handler was provided. Previewing the success state only — wire this up to your API before shipping."
        );
      }
      setSubmittedSubject(values.subject);
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  function handleReset() {
    setValues(EMPTY_VALUES);
    setErrors({});
    setStatus("idle");
  }

  if (status === "success") {
    return (
      <div
        className="relative flex flex-col items-center gap-4 rounded-[24px] border p-8 text-center shadow-[0_18px_40px_-24px_rgba(42,26,46,0.25)] sm:p-10"
        style={{ borderColor: `${DEFAULT_ACCENT.core}40`, backgroundColor: CARD_BG }}
      >
        <span
          className="flex h-14 w-14 items-center justify-center rounded-full ring-1"
          style={{
            background: `linear-gradient(to bottom right, ${DEFAULT_ACCENT.glow}, ${DEFAULT_ACCENT.core})`,
            boxShadow: `0 0 0 1px ${DEFAULT_ACCENT.core}55`,
          }}
        >
          <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none">
            <path
              d="M5 13l4.5 4.5L19 8"
              stroke={INK}
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
                animation: "navgrah-draw-check 700ms 100ms ease-out forwards",
              }}
            />
          </svg>
        </span>
        <div className="flex flex-col gap-1">
          <p className="font-display text-lg font-semibold" style={{ color: INK }}>
            Message received.
          </p>
          <p className="text-sm" style={{ color: `${INK}A6` }}>
            {submittedSubject
              ? `We'll be in touch about your ${submittedSubject.toLowerCase()} shortly.`
              : "Our team will get back to you shortly."}
          </p>
        </div>
        <button
          type="button"
          onClick={handleReset}
          className="mt-2 text-sm font-medium underline-offset-4 transition-colors hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          style={{ color: DEFAULT_ACCENT.core, outlineColor: DEFAULT_ACCENT.core }}
        >
          Send another message
        </button>
        <style>{`
          @keyframes navgrah-draw-check {
            to { stroke-dashoffset: 0; }
          }
        `}</style>
      </div>
    );
  }

  const isSubmitting = status === "submitting";

  return (
    <form
      noValidate
      onSubmit={handleSubmit}
      className="relative flex flex-col gap-5 rounded-[24px] border p-5 shadow-[0_18px_40px_-24px_rgba(42,26,46,0.25)] backdrop-blur-sm transition-colors duration-500 sm:p-7 md:p-8"
      style={{ borderColor: `${accent.core}40`, backgroundColor: CARD_BG }}
    >
      {/* The clasp: a small marker showing where the thread ties off */}
      <span aria-hidden="true" className="absolute -top-3 left-6 flex items-center gap-1 sm:left-8">
        <span className="h-2 w-5 rounded-full" style={{ backgroundColor: `${accent.core}bb` }} />
        <span
          className="h-3 w-3 rounded-full"
          style={{ background: `radial-gradient(circle at 35% 30%, ${accent.glow}, ${accent.core})` }}
        />
      </span>

      <h3 className="font-display text-lg font-semibold sm:text-xl" style={{ color: INK }}>
        Send Us a Message
      </h3>

      {status === "error" && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-lg border px-3 py-2 text-sm"
          style={{ borderColor: "#D6454566", backgroundColor: "#FBEAEA", color: "#8C2A22" }}
        >
          <AlertIcon className="h-4 w-4 shrink-0" />
          Something went wrong sending your message. Please try again.
        </p>
      )}

      <FloatingField
        id="contact-fullName"
        label="Full Name"
        required
        value={values.fullName}
        onChange={(v) => updateField("fullName", v)}
        error={errors.fullName}
        autoComplete="name"
        registerRef={(el) => (fieldRefs.current.fullName = el)}
      />

      <div className="grid gap-5 sm:grid-cols-2">
        <FloatingField
          id="contact-email"
          label="Email Address"
          type="email"
          required
          value={values.email}
          onChange={(v) => updateField("email", v)}
          error={errors.email}
          autoComplete="email"
          registerRef={(el) => (fieldRefs.current.email = el)}
        />
        <FloatingField
          id="contact-phone"
          label="Phone Number"
          type="tel"
          value={values.phone}
          onChange={(v) => updateField("phone", v)}
          autoComplete="tel"
          registerRef={(el) => (fieldRefs.current.phone = el)}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="contact-subject" className="text-sm" style={{ color: `${INK}BF` }}>
          What can we help you with?{" "}
          <span aria-hidden="true" style={{ color: DEFAULT_ACCENT.core }}>
            *
          </span>
        </label>
        <div className="relative">
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 flex h-6 w-6 -translate-y-1/2 items-center justify-center rounded-full text-xs transition-colors duration-500"
            style={{ backgroundColor: `${accent.core}26`, color: accent.core }}
          >
            {selectedOption ? selectedOption.symbol : "\u2721"}
          </span>
          <select
            id="contact-subject"
            required
            aria-required="true"
            value={values.subject}
            onChange={(e) => updateField("subject", e.target.value)}
            aria-invalid={Boolean(errors.subject)}
            aria-describedby={errors.subject ? "contact-subject-error" : undefined}
            ref={(el) => {
              fieldRefs.current.subject = el;
            }}
            className="w-full rounded-xl border py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:ring-1"
            style={{
              backgroundColor: INPUT_BG,
              color: INK,
              borderColor: errors.subject ? "#D6454599" : `${INK}1A`,
            }}
          >
            <option value="" disabled>
              Select a topic
            </option>
            {SUBJECT_OPTIONS.map((option) => (
              <option key={option.label} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
        {errors.subject && (
          <p id="contact-subject-error" className="flex items-center gap-1.5 text-xs" style={{ color: "#8C2A22" }}>
            <AlertIcon className="h-3.5 w-3.5 shrink-0" />
            {errors.subject}
          </p>
        )}
      </div>

      <FloatingField
        id="contact-message"
        label="Message"
        as="textarea"
        required
        value={values.message}
        onChange={(v) => updateField("message", v)}
        error={errors.message}
        registerRef={(el) => (fieldRefs.current.message = el)}
      />

      <button
        type="submit"
        disabled={isSubmitting}
        aria-busy={isSubmitting}
        className="group relative mt-2 inline-flex w-full items-center justify-center gap-1.5 overflow-hidden rounded-full px-8 py-3.5 text-sm font-medium shadow-[0_8px_20px_-6px_rgba(168,121,63,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_26px_-6px_rgba(168,121,63,0.5)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:translate-y-0 motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:w-auto sm:self-start"
        style={{
          background: `linear-gradient(to bottom, ${accent.glow}, ${accent.core})`,
          color: INK,
          outlineColor: accent.core,
        }}
      >
        {isSubmitting && (
          <span
            aria-hidden="true"
            className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
            style={{ animation: "navgrah-shimmer-sweep 1.1s linear infinite" }}
          />
        )}
        <span className="relative">{isSubmitting ? "Sending\u2026" : "Send Message"}</span>
        {!isSubmitting && (
          <span aria-hidden="true" className="relative transition-transform duration-300 group-hover:translate-x-1 hover:text-white">
            &rarr;
          </span>
        )}
      </button>

      <p className="flex items-center gap-2 text-xs" style={{ color: `${INK}80` }}>
        <ShieldIcon className="h-3.5 w-3.5 shrink-0" />
        Your information is kept private and used only to respond to your
        enquiry.
      </p>

      <style>{`
        @keyframes navgrah-shimmer-sweep {
          to { transform: translateX(200%); }
        }
      `}</style>
    </form>
  );
}

/* ------------------------------------------------------------------ */
/* Floating-label field                                                 */
/* ------------------------------------------------------------------ */

interface FloatingFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  error?: string;
  type?: string;
  as?: "input" | "textarea";
  autoComplete?: string;
  registerRef?: (el: HTMLElement | null) => void;
}

function FloatingField({
  id,
  label,
  value,
  onChange,
  required,
  error,
  type = "text",
  as = "input",
  autoComplete,
  registerRef,
}: FloatingFieldProps) {
  const describedBy = error ? `${id}-error` : undefined;
  const sharedClassName =
    "peer w-full rounded-xl border px-4 pb-2.5 pt-5 text-sm outline-none transition-colors placeholder-transparent focus:ring-1";
  const sharedStyle = {
    backgroundColor: INPUT_BG,
    color: INK,
    borderColor: error ? "#D6454599" : `${INK}1A`,
  } as React.CSSProperties;

  return (
    <div className="relative">
      {as === "textarea" ? (
        <textarea
          id={id}
          name={id}
          placeholder=" "
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          rows={4}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={registerRef as (el: HTMLTextAreaElement | null) => void}
          className={`${sharedClassName} resize-none`}
          style={sharedStyle}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          placeholder=" "
          required={required}
          aria-required={required}
          aria-invalid={Boolean(error)}
          aria-describedby={describedBy}
          autoComplete={autoComplete}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          ref={registerRef as (el: HTMLInputElement | null) => void}
          className={sharedClassName}
          style={sharedStyle}
        />
      )}
      <label
        htmlFor={id}
        className="pointer-events-none absolute left-4 top-4 text-sm transition-all duration-200
          peer-placeholder-shown:top-4 peer-placeholder-shown:text-sm
          peer-focus:top-1.5 peer-focus:text-xs"
        style={{
          color: `${INK}80`,
          ...(value ? { top: "0.375rem", fontSize: "0.75rem" } : undefined),
        }}
      >
        {label}
        {required && (
          <span aria-hidden="true" style={{ color: DEFAULT_ACCENT.core }}>
            {" "}
            *
          </span>
        )}
      </label>
      {error && (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-xs" style={{ color: "#8C2A22" }}>
          <AlertIcon className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Decorative background — a marbled ivory field carrying a trace of   */
/* all nine gemstone tones, faint enough to stay atmosphere rather     */
/* than noise, with tiny ink-flecked "constellation" dots.             */
/* ------------------------------------------------------------------ */

function NebulaField() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(46% 38% at 12% 8%, rgba(166,47,72,0.07) 0%, rgba(166,47,72,0) 70%)," +
            "radial-gradient(46% 38% at 92% 14%, rgba(47,143,91,0.07) 0%, rgba(47,143,91,0) 70%)," +
            "radial-gradient(50% 42% at 85% 92%, rgba(51,80,125,0.07) 0%, rgba(51,80,125,0) 70%)," +
            "radial-gradient(44% 36% at 8% 90%, rgba(201,138,45,0.08) 0%, rgba(201,138,45,0) 70%)",
        }}
      />
      <div className="absolute inset-0 opacity-[0.5]">
        {STARFIELD.map((star, i) => (
          <span
            key={i}
            className="absolute rounded-full"
            style={{ top: star.top, left: star.left, width: star.size, height: star.size, backgroundColor: `${INK}33` }}
          />
        ))}
      </div>
    </div>
  );
}

const STARFIELD = [
  { top: "10%", left: "12%", size: "2px" },
  { top: "20%", left: "85%", size: "1.5px" },
  { top: "35%", left: "6%", size: "1.5px" },
  { top: "50%", left: "92%", size: "2px" },
  { top: "65%", left: "20%", size: "1.5px" },
  { top: "78%", left: "70%", size: "2px" },
  { top: "88%", left: "40%", size: "1.5px" },
];