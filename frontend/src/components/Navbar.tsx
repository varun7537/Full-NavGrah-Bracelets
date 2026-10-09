"use client";

import Link from "next/link";
import Image, { type StaticImageData } from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Bag,
  ChevronDown,
  Person,
  Search,
  X,
  Heart,
  Phone,
} from "./Header/icons";

import Logo from "../../public/images/image_logo.jpg";

import Aries from "../../public/images/aries_image.jpg";
import Aquarius from "../../public/images/aquarius_image.jpg";
import Cancer from "../../public/images/cancer_image.jpg";
import Capricorn from "../../public/images/capricorn_image.jpg";
import Leo from "../../public/images/leo_image.jpg";
import Pisces from "../../public/images/pisces_image.jpg";
import Libra from "../../public/images/libra_image.jpg";
import Sagittarius from "../../public/images/sagitarius_image.jpg";
import Taurus from "../../public/images/taurus_image.jpg";
import Scorpio from "../../public/images/scorpio_image.jpg";
import Virgo from "../../public/images/virgo_image.jpg";
import Gemini from "../../public/images/gemini_image.jpg";
import { useCart } from "../components/cart/CartContext";
import { useAuth } from "../components/Auth/AuthContext";

type MenuKey = "rashi";

type NavItem = {
  label: string;
  href?: string;
  hasDropdown?: boolean;
  menu?: MenuKey;
};

type RashiLink = {
  name: string;
  sanskrit: string;
  element: "Fire" | "Earth" | "Air" | "Water";
  color: string;
  image: StaticImageData;
  href?: string;
};

const WHATSAPP_URL =
  "https://wa.me/918598573812?text=Hello%2C%20I%20would%20like%20to%20consult%20an%20expert";

const primaryRow: NavItem[] = [
  { label: "Home", href: "/" },
  { label: "How it Works", href: "/how-it-works" },
  {
    label: "Shop By Rashi",
    href: "/#shop-by-planets-heading",
    hasDropdown: true,
    menu: "rashi",
  },
  {
    label: "Customized Bracelets",
    href: "/customized",
  },
  {
    label: "Contact Us",
    href: "/contactus",
  },
];

const RASHIS: RashiLink[] = [
  {
    name: "Aries",
    sanskrit: "Mesha",
    element: "Fire",
    color: "#B23A2E",
    image: Aries,
  },
  {
    name: "Taurus",
    sanskrit: "Vrishabha",
    element: "Earth",
    color: "#4C7C59",
    image: Taurus,
  },
  {
    name: "Gemini",
    sanskrit: "Mithuna",
    element: "Air",
    color: "#C89B3C",
    image: Gemini,
  },
  {
    name: "Cancer",
    sanskrit: "Karka",
    element: "Water",
    color: "#8C97A6",
    image: Cancer,
  },
  {
    name: "Leo",
    sanskrit: "Simha",
    element: "Fire",
    color: "#E2672A",
    image: Leo,
  },
  {
    name: "Virgo",
    sanskrit: "Kanya",
    element: "Earth",
    color: "#7A8B5C",
    image: Virgo,
  },
  {
    name: "Libra",
    sanskrit: "Tula",
    element: "Air",
    color: "#B98CB0",
    image: Libra,
  },
  {
    name: "Scorpio",
    sanskrit: "Vrishchika",
    element: "Water",
    color: "#7A2E3A",
    image: Scorpio,
  },
  {
    name: "Sagittarius",
    sanskrit: "Dhanu",
    element: "Fire",
    color: "#D98B3F",
    image: Sagittarius,
  },
  {
    name: "Capricorn",
    sanskrit: "Makara",
    element: "Earth",
    color: "#33526E",
    image: Capricorn,
  },
  {
    name: "Aquarius",
    sanskrit: "Kumbha",
    element: "Air",
    color: "#5B8AA6",
    image: Aquarius,
  },
  {
    name: "Pisces",
    sanskrit: "Meena",
    element: "Water",
    color: "#5B6B4F",
    image: Pisces,
  },
];

const ZODIAC_THREAD = `linear-gradient(90deg, ${RASHIS.map(
  (rashi) => rashi.color
).join(", ")})`;

function MandalaGlyph({ active }: { active: boolean }) {
  return (
    <svg
      viewBox="0 0 18 18"
      width="16"
      height="16"
      className={`shrink-0 text-current transition-transform duration-300 ${
        active
          ? "rotate-45 scale-110"
          : "rotate-0 group-hover:rotate-[20deg]"
      }`}
      aria-hidden="true"
    >
      <rect
        x="1"
        y="1"
        width="16"
        height="16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        opacity={active ? 0.9 : 0.45}
      />

      <path
        d="M1,1 L17,17 M17,1 L1,17"
        stroke="currentColor"
        strokeWidth="1"
        opacity={active ? 0.9 : 0.35}
      />

      <path
        d="M9,1 L17,9 L9,17 L1,9 Z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.1"
        opacity={active ? 1 : 0.65}
      />
    </svg>
  );
}

function RashiAvatar({
  rashi,
  size,
}: {
  rashi: RashiLink;
  size: number;
}) {
  return (
    <span
      className="relative inline-block shrink-0 overflow-hidden rounded-full ring-1 ring-white"
      style={{
        width: size,
        height: size,
        boxShadow: `0 0 0 1.5px ${rashi.color}8C`,
      }}
    >
      <Image
        src={rashi.image}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  );
}

function RashiGrid({ replayKey }: { replayKey: number }) {
  return (
    <div
      key={replayKey}
      className="grid w-[380px] grid-cols-4 gap-2.5 p-1"
      role="none"
    >
      {RASHIS.map((rashi, index) => (
        <Link
          key={rashi.name}
          href={rashi.href ?? `/rashi/${rashi.name.toLowerCase()}`}
          role="menuitem"
          style={
            {
              "--pc": rashi.color,
              animationDelay: `${60 + index * 35}ms`,
            } as React.CSSProperties
          }
          className="ng-cell ng-clip-sm group flex flex-col items-center gap-1.5 border border-[#1C1024]/[0.08] bg-[#FCFBF8] px-2 py-3 text-center transition-all duration-200 hover:-translate-y-0.5"
        >
          <span className="transition-transform duration-200 group-hover:scale-110">
            <RashiAvatar rashi={rashi} size={36} />
          </span>

          <span className="ng-display text-[12px] italic leading-tight text-[#1C1024]">
            {rashi.name}
          </span>

          <span className="text-[9px] leading-tight text-[#1C1024]/50">
            {rashi.sanskrit}
          </span>
        </Link>
      ))}
    </div>
  );
}

function NavLink({
  item,
  isActive,
  isOpen,
  onToggle,
  onNavigate,
}: {
  item: NavItem;
  isActive: boolean;
  isOpen?: boolean;
  onToggle?: () => void;
  onNavigate?: (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => void;
}) {
  const base =
    "group relative flex items-center gap-2 whitespace-nowrap rounded-sm py-2.5 text-[15px] font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E2711D]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-white";

  const color =
    isActive || isOpen
      ? "text-[#E2711D]"
      : "text-[#1C1024] hover:text-[#E2711D]";

  const underline = `absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left bg-[#E2711D] transition-transform duration-200 ${
    isActive || isOpen
      ? "scale-x-100"
      : "scale-x-0 group-hover:scale-x-100"
  }`;

  if (item.hasDropdown) {
    return (
      <button
        type="button"
        onClick={onToggle}
        aria-haspopup="true"
        aria-expanded={isOpen}
        className={`${base} ${color}`}
      >
        {item.label}

        <MandalaGlyph active={!!isOpen} />

        <span className={underline} />
      </button>
    );
  }

  return (
    <Link
      href={item.href ?? "#"}
      onClick={(event) => onNavigate?.(event, item.href ?? "#")}
      aria-current={isActive ? "page" : undefined}
      className={`${base} ${color}`}
    >
      {item.label}

      <span className={underline} />
    </Link>
  );
}

export default function Navbar() {
  const pathname = usePathname();

  const { itemCount, isReady } = useCart();
  const { user, isReady: authReady, openLogin, logout } = useAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<MenuKey | null>(null);
  const [menuPulseKey, setMenuPulseKey] = useState(0);

  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openMobileMenu, setOpenMobileMenu] =
    useState<MenuKey | null>(null);

  const [isDesktopSearchOpen, setIsDesktopSearchOpen] =
    useState(false);

  const [isMobileSearchOpen, setIsMobileSearchOpen] =
    useState(false);

  const [searchValue, setSearchValue] = useState("");

  const [cartBadgePulse, setCartBadgePulse] = useState(false);

  const [wishlistCount] = useState(0);

  const prevCartCount = useRef(itemCount);

  const rashiRef = useRef<HTMLLIElement>(null);

  const closeTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const desktopSearchInputRef =
    useRef<HTMLInputElement>(null);

  const mobileSearchInputRef =
    useRef<HTMLInputElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    function handleClick(event: MouseEvent) {
      const target = event.target as Node;

      if (!rashiRef.current?.contains(target)) {
        setOpenMenu(null);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(null);
        setIsMobileOpen(false);
        setIsDesktopSearchOpen(false);
        setIsMobileSearchOpen(false);
        setOpenMobileMenu(null);
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMobileOpen
      ? "hidden"
      : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isMobileOpen]);

  useEffect(() => {
    if (itemCount !== prevCartCount.current) {
      prevCartCount.current = itemCount;

      setCartBadgePulse(true);

      const timer = setTimeout(() => {
        setCartBadgePulse(false);
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [itemCount]);

  useEffect(() => {
    if (isDesktopSearchOpen) {
      const timer = setTimeout(() => {
        desktopSearchInputRef.current?.focus();
      }, 180);

      return () => clearTimeout(timer);
    }
  }, [isDesktopSearchOpen]);

  useEffect(() => {
    if (isMobileSearchOpen) {
      const timer = setTimeout(() => {
        mobileSearchInputRef.current?.focus();
      }, 180);

      return () => clearTimeout(timer);
    }
  }, [isMobileSearchOpen]);

  useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  function openMenuNow(menu?: MenuKey) {
    if (!menu) return;

    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }

    setOpenMenu(menu);

    if (menu === "rashi") {
      setMenuPulseKey((key) => key + 1);
    }
  }

  function scheduleMenuClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }

    closeTimerRef.current = setTimeout(() => {
      setOpenMenu(null);
    }, 150);
  }

  function toggleMenu(menu?: MenuKey) {
    if (!menu) return;

    setOpenMenu((previous) => {
      const next = previous === menu ? null : menu;

      if (next === "rashi") {
        setMenuPulseKey((key) => key + 1);
      }

      return next;
    });
  }

  function handleSearchSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    const query = searchValue.trim();

    if (!query) return;

    setIsDesktopSearchOpen(false);
    setIsMobileSearchOpen(false);

    console.log("Search:", query);
  }

  function handleSectionNavigation(
    event: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) {
    if (!href.startsWith("/#")) {
      return;
    }

    const id = href.slice(2);

    if (pathname === "/") {
      event.preventDefault();

      const target = document.getElementById(id);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });

        window.history.pushState(
          null,
          "",
          `/#${id}`
        );
      }

      setOpenMenu(null);
      setIsMobileOpen(false);
      setOpenMobileMenu(null);
    }
  }

  const isItemActive = (item: NavItem) => {
    if (!item.href || item.href === "#") {
      return false;
    }

    if (item.href.startsWith("/#")) {
      return pathname === "/";
    }

    return pathname === item.href;
  };

  function closeMobileMenu() {
    setIsMobileOpen(false);
    setOpenMobileMenu(null);
  }

  return (
    <header
      className={`sticky top-0 z-50 bg-white transition-shadow duration-300 ${
        isScrolled
          ? "shadow-[0_2px_16px_-6px_rgba(28,16,36,0.16)]"
          : ""
      }`}
    >
      <style jsx global>{`
        @import url("https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@0,500;0,600;1,500;1,600&family=Manrope:wght@400;500;600;700&display=swap");

        .ng-display {
          font-family: "Newsreader", serif;
        }

        .ng-ui {
          font-family: "Manrope", sans-serif;
        }

        .ng-clip-sm {
          clip-path: polygon(
            0 0,
            calc(100% - 10px) 0,
            100% 10px,
            100% 100%,
            0 100%
          );
        }

        .ng-clip-lg {
          clip-path: polygon(
            0 0,
            calc(100% - 22px) 0,
            100% 22px,
            100% 100%,
            0 100%
          );
        }

        @keyframes ng-cell-in {
          from {
            opacity: 0;
            transform: scale(0.85);
          }

          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        .ng-cell {
          animation: ng-cell-in 340ms
            cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        @keyframes ng-live-dot {
          0%,
          100% {
            opacity: 1;
          }

          50% {
            opacity: 0.35;
          }
        }

        .ng-live-dot {
          animation: ng-live-dot 1.6s ease-in-out infinite;
        }

        @media (prefers-reduced-motion: reduce) {
          .ng-cell,
          .ng-live-dot {
            animation: none !important;
            transform: none !important;
            opacity: 1 !important;
          }
        }
      `}</style>

      <div
        className="h-[3px] w-full"
        style={{
          backgroundImage: ZODIAC_THREAD,
        }}
        aria-hidden="true"
      />

      <div className="mx-auto flex max-w-container items-center gap-4 px-4 py-3.5 sm:px-6 lg:gap-7 lg:px-10 lg:py-4">
        <Link
          href="/"
          className="relative flex shrink-0 items-center"
          aria-label="NavGrah home"
        >
          <span
            className="pointer-events-none absolute -inset-2 -z-10 rounded-full opacity-60 blur-md"
            style={{
              background:
                "radial-gradient(circle, rgba(226,113,29,0.16), transparent 70%)",
            }}
          />

          <Image
            src={Logo}
            alt="NavGrah Logo"
            className="h-14 w-auto rounded-lg md:h-16 lg:h-[68px]"
            priority
          />
        </Link>

        {/* Desktop search */}
        <div className="ml-auto hidden shrink-0 items-center md:flex">
          <div
            className={`grid transition-[grid-template-columns] duration-300 ${
              isDesktopSearchOpen
                ? "grid-cols-[min(22vw,320px)]"
                : "grid-cols-[0px]"
            }`}
          >
            <div className="min-w-0 overflow-hidden">
              <form
                onSubmit={handleSearchSubmit}
                role="search"
                className="pr-2"
              >
                <label
                  htmlFor="navgrah-search-desktop"
                  className="sr-only"
                >
                  Search
                </label>

                <input
                  id="navgrah-search-desktop"
                  ref={desktopSearchInputRef}
                  type="search"
                  value={searchValue}
                  onChange={(event) =>
                    setSearchValue(event.target.value)
                  }
                  onBlur={() => {
                    if (!searchValue.trim()) {
                      setIsDesktopSearchOpen(false);
                    }
                  }}
                  placeholder="Search gemstones, remedies…"
                  className="ng-ui ng-clip-sm w-full border border-[#1C1024]/15 bg-[#FCFBF8] px-4 py-2.5 text-[14px] text-[#1C1024] outline-none focus:border-[#E2711D]/50"
                />
              </form>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setIsDesktopSearchOpen((value) => !value)
            }
            aria-label={
              isDesktopSearchOpen
                ? "Close search"
                : "Search"
            }
            className="flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] transition hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D]"
          >
            {isDesktopSearchOpen ? (
              <X className="h-[22px] w-[22px]" />
            ) : (
              <Search className="h-[22px] w-[22px]" />
            )}

            <span className="hidden lg:inline">
              Search
            </span>
          </button>
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-1 md:flex">
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ng-ui ng-clip-sm mr-2 hidden items-center gap-2 bg-[#B8232F] px-4 py-2.5 text-[13.5px] font-semibold text-white hover:bg-[#93121C] lg:inline-flex"
          >
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="ng-live-dot absolute inset-0 rounded-full bg-[#7BC67E]" />
            </span>

            <Phone className="h-4 w-4" />

            Talk to our Expert
          </a>

          <button
            type="button"
            aria-label={`Wishlist, ${wishlistCount} items`}
            className="relative flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D]"
          >
            <Heart
              className="h-[22px] w-[22px]"
              filled={wishlistCount > 0}
            />

            <span className="hidden lg:inline">
              Wishlist
            </span>
          </button>

          {!authReady ? (
            <span className="inline-block h-10 w-24" aria-hidden="true" />
          ) : user ? (
            <Link
              href="/profile"
              aria-label="My profile"
              className="flex items-center gap-2 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D]"
            >
              <span className="flex h-[26px] w-[26px] items-center justify-center rounded-full bg-[#E2711D] text-[12px] font-semibold text-white">
                {user.name.charAt(0).toUpperCase()}
              </span>
              <span className="hidden max-w-[90px] truncate lg:inline">
                {user.name.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <button
              type="button"
              aria-label="Login"
              onClick={() =>
                openLogin({ message: "Login to track your orders and checkout faster." })
              }
              className="flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D]"
            >
              <Person className="h-[22px] w-[22px]" />
              <span className="hidden lg:inline">Login</span>
            </button>
          )}

          {/* FIXED: Bag now navigates to /cart */}
          <Link
            href="/cart"
            aria-label={`Shopping bag, ${
              isReady ? itemCount : 0
            } items`}
            className="relative flex items-center gap-1.5 rounded-md px-3 py-2.5 text-[13.5px] font-medium text-[#1C1024] transition hover:bg-[#1C1024]/[0.04] hover:text-[#E2711D]"
          >
            <span className="relative">
              <Bag className="h-[22px] w-[22px]" />

              {isReady && itemCount > 0 && (
                <span
                  className={`absolute -right-1.5 -top-1.5 flex h-[17px] min-w-[17px] items-center justify-center rounded-full bg-[#B8232F] px-1 text-[10px] font-semibold text-white transition-transform duration-300 ${
                    cartBadgePulse
                      ? "scale-125"
                      : "scale-100"
                  }`}
                >
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </span>

            <span className="hidden lg:inline">
              Bag
            </span>
          </Link>
        </div>

        {/* Mobile actions */}
        <div className="ml-auto flex shrink-0 items-center gap-1 md:hidden">
          <button
            type="button"
            onClick={() =>
              setIsMobileSearchOpen((value) => !value)
            }
            aria-label={
              isMobileSearchOpen
                ? "Close search"
                : "Open search"
            }
            className="flex h-10 w-10 items-center justify-center rounded-md text-[#1C1024] hover:bg-[#1C1024]/[0.05]"
          >
            {isMobileSearchOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Search className="h-[22px] w-[22px]" />
            )}
          </button>

          {/* FIXED: Mobile bag now navigates to /cart */}
          <Link
            href="/cart"
            aria-label={`Shopping bag, ${
              isReady ? itemCount : 0
            } items`}
            className="relative flex h-10 w-10 items-center justify-center rounded-md text-[#1C1024] hover:bg-[#1C1024]/[0.05]"
          >
            <Bag className="h-[22px] w-[22px]" />

            {isReady && itemCount > 0 && (
              <span
                className={`absolute right-0.5 top-0.5 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#B8232F] px-1 text-[10px] font-semibold text-white transition-transform duration-300 ${
                  cartBadgePulse
                    ? "scale-125"
                    : "scale-100"
                }`}
              >
                {itemCount > 99 ? "99+" : itemCount}
              </span>
            )}
          </Link>

          <button
            type="button"
            onClick={() => setIsMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={isMobileOpen}
            className="flex h-10 w-10 shrink-0 flex-col items-center justify-center gap-[5px] rounded-md hover:bg-[#1C1024]/[0.05]"
          >
            <span className="h-[1.5px] w-5 rounded-full bg-[#1C1024]" />
            <span className="h-[1.5px] w-5 rounded-full bg-[#1C1024]" />
            <span className="h-[1.5px] w-3.5 self-end rounded-full bg-[#E2711D]" />
          </button>
        </div>
      </div>

      {/* Mobile search */}
      <div
        className={`grid overflow-hidden border-t border-[#1C1024]/8 transition-all duration-200 md:hidden ${
          isMobileSearchOpen
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] border-t-0 opacity-0"
        }`}
      >
        <div className="min-h-0 overflow-hidden">
          <form
            onSubmit={handleSearchSubmit}
            role="search"
            className="px-4 py-2.5 sm:px-6"
          >
            <div className="relative">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-[#1C1024]/70" />

              <input
                ref={mobileSearchInputRef}
                type="search"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(event.target.value)
                }
                placeholder="Search gemstones, remedies…"
                className="ng-ui ng-clip-sm w-full border border-[#1C1024]/15 bg-[#FCFBF8] py-2.5 pl-10 pr-4 text-[13.5px] text-[#1C1024] outline-none focus:border-[#E2711D]/50"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Desktop navigation */}
      <nav
        aria-label="Primary"
        className="hidden border-t border-[#1C1024]/8 md:block"
      >
        <ul className="mx-auto flex max-w-container flex-wrap items-center justify-center gap-x-10 px-6 py-1.5 lg:gap-x-14 lg:px-10">
          {primaryRow.map((item) => (
            <li
              key={item.label}
              className={
                item.hasDropdown ? "relative" : undefined
              }
              ref={
                item.menu === "rashi"
                  ? rashiRef
                  : undefined
              }
              onMouseEnter={
                item.hasDropdown
                  ? () => openMenuNow(item.menu)
                  : undefined
              }
              onMouseLeave={
                item.hasDropdown
                  ? scheduleMenuClose
                  : undefined
              }
              onFocus={
                item.hasDropdown
                  ? () => openMenuNow(item.menu)
                  : undefined
              }
            >
              <NavLink
                item={item}
                isActive={isItemActive(item)}
                isOpen={
                  item.hasDropdown
                    ? openMenu === item.menu
                    : undefined
                }
                onToggle={
                  item.hasDropdown
                    ? () => toggleMenu(item.menu)
                    : undefined
                }
                onNavigate={handleSectionNavigation}
              />

              {item.menu === "rashi" && (
                <div
                  role="menu"
                  aria-label="Shop by rashi"
                  onMouseEnter={() =>
                    openMenuNow("rashi")
                  }
                  onMouseLeave={scheduleMenuClose}
                  className={`ng-clip-lg absolute left-1/2 top-full z-50 mt-3 w-[620px] -translate-x-1/2 border border-[#1C1024]/10 bg-white shadow-[0_16px_40px_-14px_rgba(28,16,36,0.24)] transition-[opacity,transform,visibility] duration-200 ${
                    openMenu === "rashi"
                      ? "visible translate-y-0 opacity-100"
                      : "invisible -translate-y-1 opacity-0"
                  }`}
                >
                  {openMenu === "rashi" && (
                    <div className="flex items-stretch">
                      <div className="flex items-center justify-center border-r border-[#1C1024]/8 p-5">
                        <RashiGrid
                          replayKey={menuPulseKey}
                        />
                      </div>

                      <div className="flex w-[220px] flex-col justify-between p-6">
                        <div>
                          <p className="ng-display text-[18px] italic leading-snug text-[#1C1024]">
                            Every rashi carries its own
                            stone.
                          </p>

                          <p className="mt-2 text-[12.5px] leading-relaxed text-[#1C1024]/60">
                            Choose your zodiac sign to see
                            the gemstone bracelet matched to
                            it.
                          </p>
                        </div>

                        <Link
                          href="/collections"
                          className="mt-4 inline-flex w-fit text-[12.5px] font-semibold text-[#B8232F]"
                        >
                          View All Collections
                        </Link>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>

      {/* Mobile overlay */}
      <div
        aria-hidden={!isMobileOpen}
        onClick={closeMobileMenu}
        className={`fixed inset-0 z-40 bg-[#1C1024]/45 transition-opacity duration-300 md:hidden ${
          isMobileOpen
            ? "visible opacity-100"
            : "invisible opacity-0"
        }`}
      />

      {/* Mobile drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
        className={`fixed inset-y-0 right-0 z-50 flex w-[86%] max-w-sm flex-col bg-white shadow-2xl transition-transform duration-300 md:hidden ${
          isMobileOpen
            ? "translate-x-0"
            : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-[#1C1024]/10 px-5 py-4">
          <Link
            href="/"
            onClick={closeMobileMenu}
            aria-label="NavGrah home"
          >
            <Image
              src={Logo}
              alt="NavGrah Logo"
              width={130}
              height={32}
              className="h-9 w-auto"
            />
          </Link>

          <button
            type="button"
            onClick={closeMobileMenu}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#1C1024] hover:bg-[#1C1024]/[0.06]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav
          aria-label="Mobile primary"
          className="flex-1 overflow-y-auto px-5 py-4"
        >
          <a
            href={WHATSAPP_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="ng-ui ng-clip-sm mb-4 flex items-center justify-center gap-2 bg-[#B8232F] py-3 text-[14px] font-semibold text-white"
          >
            <Phone className="h-4 w-4" />
            Talk to our Expert
          </a>

          <ul className="flex flex-col gap-1">
            {primaryRow.map((item) =>
              item.hasDropdown ? (
                <li
                  key={item.label}
                  className="border-b border-[#1C1024]/8 py-1"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setOpenMobileMenu(
                        (previous) =>
                          previous === item.menu
                            ? null
                            : item.menu ?? null
                      )
                    }
                    aria-expanded={
                      openMobileMenu === item.menu
                    }
                    className="flex w-full items-center justify-between py-3 text-left text-[15px] font-medium text-[#1C1024]"
                  >
                    {item.label}

                    <ChevronDown
                      className={`h-4 w-4 text-[#E2711D] transition-transform ${
                        openMobileMenu === item.menu
                          ? "rotate-180"
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`grid overflow-hidden transition-all ${
                      openMobileMenu === item.menu
                        ? "grid-rows-[1fr] pb-3 opacity-100"
                        : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="min-h-0 overflow-hidden">
                      {item.menu === "rashi" && (
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2.5 pl-1">
                          {RASHIS.map((rashi) => (
                            <Link
                              key={rashi.name}
                              href={
                                rashi.href ??
                                `/rashi/${rashi.name.toLowerCase()}`
                              }
                              onClick={closeMobileMenu}
                              className="flex items-center gap-2 rounded-md py-1.5 text-[13.5px] text-[#1C1024]/85 hover:text-[#E2711D]"
                            >
                              <RashiAvatar
                                rashi={rashi}
                                size={22}
                              />

                              <span>
                                {rashi.name}{" "}
                                <span className="text-[#1C1024]/45">
                                  · {rashi.sanskrit}
                                </span>
                              </span>
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ) : (
                <li
                  key={item.label}
                  className="border-b border-[#1C1024]/8"
                >
                  <Link
                    href={item.href ?? "#"}
                    onClick={(event) =>
                      handleSectionNavigation(
                        event,
                        item.href ?? "#"
                      )
                    }
                    className={`block py-3 text-[15px] font-medium ${
                      isItemActive(item)
                        ? "text-[#E2711D]"
                        : "text-[#1C1024]"
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              )
            )}
          </ul>

          <div className="mt-5 flex items-center justify-between border-t border-[#1C1024]/8 pt-4">
            {user ? (
              <Link
                href="/profile"
                onClick={closeMobileMenu}
                className="flex items-center gap-2 py-2 text-[14px] font-medium text-[#1C1024]"
              >
                <Person className="h-5 w-5" />
                {user.name.split(" ")[0]}
              </Link>
            ) : (
              <button
                type="button"
                onClick={() => {
                  closeMobileMenu();
                  openLogin({ message: "Login to track your orders and checkout faster." });
                }}
                className="flex items-center gap-2 py-2 text-[14px] font-medium text-[#1C1024]"
              >
                <Person className="h-5 w-5" />
                Login
              </button>
            )}

            <button
              type="button"
              className="relative flex items-center gap-2 py-2 text-[14px] font-medium text-[#1C1024]"
            >
              <Heart
                className="h-5 w-5"
                filled={wishlistCount > 0}
              />
              Wishlist
            </button>

            {/* FIXED: mobile drawer Bag */}
            <Link
              href="/cart"
              onClick={closeMobileMenu}
              className="relative flex items-center gap-2 py-2 text-[14px] font-medium text-[#1C1024]"
            >
              <Bag className="h-5 w-5" />

              Bag

              {isReady && itemCount > 0 && (
                <span className="absolute -right-3 -top-1 flex h-[16px] min-w-[16px] items-center justify-center rounded-full bg-[#B8232F] px-1 text-[10px] font-semibold text-white">
                  {itemCount > 99 ? "99+" : itemCount}
                </span>
              )}
            </Link>
          </div>
          {user && (
            <button
              type="button"
              onClick={() => {
                closeMobileMenu();
                logout();
              }}
              className="mt-4 w-full rounded-full border border-[#1C1024]/15 py-2.5 text-[14px] font-medium text-[#1C1024]"
            >
              Logout
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
