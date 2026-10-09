"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  BadgeCheck,
  Play,
  MapPin,
  Truck,
  ShoppingCart,
  Zap,
  Eye,
  Volume2,
  VolumeX,
  Plus,
  CheckCircle2,
  Clock,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import type { ProductDetail } from "../../data/ProductDetail";
import { checkDelivery } from "../../lib/productApi";
import ReviewForm from "./ReviewForm";

export interface ProductDetailsProps {
  detail: ProductDetail;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
  onOpenProduct: (productId: string) => void;
}

const LOW_STOCK_THRESHOLD = 100;

function formatTime(totalSeconds: number) {
  const clamped = Math.max(totalSeconds, 0);
  const pad = (n: number) => n.toString().padStart(2, "0");

  return {
    hrs: pad(Math.floor(clamped / 3600)),
    mins: pad(Math.floor((clamped % 3600) / 60)),
    secs: pad(clamped % 60),
  };
}

function formatINR(n: number) {
  return `₹${n.toLocaleString("en-IN")}`;
}

function isValidMediaUrl(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0;
}

function getSafeImageUrl(value: unknown): string | null {
  if (!isValidMediaUrl(value)) return null;
  return value.trim();
}

function StarRow({
  rating,
  size = 14,
}: {
  rating: number;
  size?: number;
}) {
  const safeRating = Number.isFinite(rating)
    ? Math.max(0, Math.min(5, rating))
    : 0;

  return (
    <div
      className="flex items-center gap-0.5"
      aria-label={`${safeRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < Math.floor(safeRating);
        const half = !filled && i < safeRating;

        return (
          <Star
            key={i}
            size={size}
            className={
              filled || half
                ? "fill-[#B4893C] text-[#B4893C]"
                : "fill-[#E9E1D2] text-[#E9E1D2]"
            }
            strokeWidth={1}
          />
        );
      })}
    </div>
  );
}

function AccordionRow({
  label,
  isOpen,
  onToggle,
  children,
}: {
  label: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="border-b border-[#E7DFCF]">
      <button
        type="button"
        onClick={onToggle}
        className="group flex w-full items-center justify-between py-4 text-left transition-colors"
        aria-expanded={isOpen}
      >
        <span className="text-[15px] text-[#332D25] transition-colors group-hover:text-[#171310]">
          {label}
        </span>

        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
          className="ml-4 shrink-0 text-[#A6987F] group-hover:text-[#8A7A5D]"
        >
          <Plus size={16} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="space-y-1.5 pb-4 pr-6 text-sm leading-relaxed text-[#786D5D]">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ProductDetails({
  detail,
  onAddToCart,
  onBuyNow,
  onOpenProduct,
}: ProductDetailsProps) {
  const {
    product,
    tagline,
    badges,
    labCertified,
    intro,
    careNote,
    ingredients,
    packs,
    relatedProducts,
    testimonials,
    reels,
    infoSections,
    faqs,
    specs,
    reviewPhotos,
    lovedByText,
    offerEndsAt,
    stockCount,
    reviewSummary,
    reviews,
  } = detail;

  const outOfStock = product.availability === "Out of Stock";

  const images = useMemo(() => {
    const galleryImages = (detail.gallery ?? [])
      .filter((item) => isValidMediaUrl(item?.src))
      .map((item) => ({
        ...item,
        src: item.src.trim(),
        thumb: isValidMediaUrl(item?.thumb)
          ? item.thumb.trim()
          : item.src.trim(),
      }));

    if (galleryImages.length > 0) {
      return galleryImages;
    }

    const productImage = getSafeImageUrl(product.imageUrl);

    if (productImage) {
      return [
        {
          id: 0,
          src: productImage,
          thumb: productImage,
          alt: product.imageAlt || product.name,
        },
      ];
    }

    return [];
  }, [
    detail.gallery,
    product.imageUrl,
    product.imageAlt,
    product.name,
  ]);

  const [activeImage, setActiveImage] = useState(0);

  const containerRef = useRef<HTMLDivElement>(null);
  const leftColRef = useRef<HTMLDivElement>(null);
  const galleryBoxRef = useRef<HTMLDivElement>(null);

  const [isDesktop, setIsDesktop] = useState(false);
  const [galleryStyle, setGalleryStyle] =
    useState<React.CSSProperties>({});

  useEffect(() => {
    if (images.length === 0) {
      setActiveImage(0);
      return;
    }

    setActiveImage((current) =>
      Math.min(current, images.length - 1)
    );
  }, [images.length]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");

    const update = () => setIsDesktop(mq.matches);

    update();

    mq.addEventListener("change", update);

    return () => {
      mq.removeEventListener("change", update);
    };
  }, []);

  useEffect(() => {
    if (!isDesktop || images.length === 0) {
      setGalleryStyle({});
      return;
    }

    const TOP_OFFSET = 24;
    let rafId: number | null = null;

    const measureAndSet = () => {
      const colEl = leftColRef.current;
      const boxEl = galleryBoxRef.current;
      const containerEl = containerRef.current;

      if (!colEl || !boxEl || !containerEl) return;

      const galleryHeight = boxEl.offsetHeight;

      if (galleryHeight <= 0) return;

      const colRect = colEl.getBoundingClientRect();
      const containerRect = containerEl.getBoundingClientRect();
      const scrollY = window.scrollY;

      const colTopAbs = colRect.top + scrollY;
      const containerTopAbs = containerRect.top + scrollY;
      const containerBottomAbs = containerRect.bottom + scrollY;

      const stickyStart = colTopAbs - TOP_OFFSET;
      const stickyEnd =
        containerBottomAbs - galleryHeight - TOP_OFFSET;

      if (
        scrollY < stickyStart ||
        stickyEnd <= stickyStart
      ) {
        setGalleryStyle({});
      } else if (scrollY < stickyEnd) {
        setGalleryStyle({
          position: "fixed",
          top: TOP_OFFSET,
          left: colRect.left,
          width: colRect.width,
          zIndex: 20,
        });
      } else {
        setGalleryStyle({
          position: "absolute",
          top:
            containerBottomAbs -
            galleryHeight -
            containerTopAbs,
          left: colRect.left - containerRect.left,
          width: colRect.width,
          zIndex: 20,
        });
      }
    };

    const onScrollOrResize = () => {
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        measureAndSet();
        rafId = null;
      });
    };

    measureAndSet();

    window.addEventListener(
      "scroll",
      onScrollOrResize,
      { passive: true }
    );

    window.addEventListener("resize", onScrollOrResize);

    return () => {
      window.removeEventListener(
        "scroll",
        onScrollOrResize
      );

      window.removeEventListener(
        "resize",
        onScrollOrResize
      );

      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, [isDesktop, images.length]);

  const currentImage =
    images.length > 0
      ? images[Math.min(activeImage, images.length - 1)]
      : null;

  const safePacks = packs ?? [];

  const [selectedPackId, setSelectedPackId] = useState(
    safePacks[0]?.id ?? ""
  );

  useEffect(() => {
    if (safePacks.length === 0) {
      setSelectedPackId("");
      return;
    }

    const exists = safePacks.some(
      (pack) => pack.id === selectedPackId
    );

    if (!exists) {
      setSelectedPackId(safePacks[0].id);
    }
  }, [safePacks, selectedPackId]);

  const currentPack = useMemo(() => {
    if (safePacks.length === 0) return null;

    return (
      safePacks.find(
        (pack) => pack.id === selectedPackId
      ) ?? safePacks[0]
    );
  }, [safePacks, selectedPackId]);

  const currentPackPrice =
    currentPack?.price ?? product.price;

  const currentPackQuantity =
    currentPack?.quantity ?? 1;

  const mrpForPack =
    (product.mrp ?? product.price) *
    currentPackQuantity;

  const showStrike =
    currentPack !== null &&
    mrpForPack > currentPackPrice;

  const discountPct =
    showStrike && currentPack
      ? Math.round(
          (1 - currentPackPrice / mrpForPack) * 100
        )
      : 0;

  const [secondsLeft, setSecondsLeft] =
    useState<number | null>(null);

  useEffect(() => {
    if (!offerEndsAt) {
      setSecondsLeft(null);
      return;
    }

    const end = new Date(offerEndsAt).getTime();

    if (!Number.isFinite(end)) {
      setSecondsLeft(null);
      return;
    }

    const tick = () => {
      setSecondsLeft(
        Math.max(
          0,
          Math.floor((end - Date.now()) / 1000)
        )
      );
    };

    tick();

    const interval = setInterval(tick, 1000);

    return () => clearInterval(interval);
  }, [offerEndsAt]);

  const { hrs, mins, secs } =
    formatTime(secondsLeft ?? 0);

  const safeTestimonials = testimonials ?? [];
  const [slide, setSlide] = useState(0);
  const totalSlides = safeTestimonials.length;

  useEffect(() => {
    if (totalSlides === 0) {
      setSlide(0);
      return;
    }

    setSlide((current) =>
      Math.min(current, totalSlides - 1)
    );
  }, [totalSlides]);

  useEffect(() => {
    if (totalSlides < 2) return;

    const auto = setInterval(() => {
      setSlide(
        (current) => (current + 1) % totalSlides
      );
    }, 5000);

    return () => clearInterval(auto);
  }, [totalSlides]);

  const [pincode, setPincode] = useState("");
  const [eta, setEta] = useState<string | null>(null);
  const [pinError, setPinError] =
    useState<string | null>(null);
  const [checking, setChecking] = useState(false);

  const handleCheckPincode = async () => {
    if (pincode.length !== 6 || checking) return;

    setChecking(true);
    setEta(null);
    setPinError(null);

    try {
      const result = await checkDelivery(pincode);

      if (!result.serviceable || !result.etaDate) {
        setPinError(
          result.message ??
            "Delivery is not available for this pincode."
        );
      } else {
        setEta(
          new Date(result.etaDate).toLocaleDateString(
            "en-IN",
            {
              weekday: "short",
              day: "numeric",
              month: "short",
            }
          )
        );
      }
    } catch {
      setPinError(
        "Couldn't check right now. Please try again."
      );
    } finally {
      setChecking(false);
    }
  };

  const showLowStock =
    stockCount !== null &&
    stockCount > 0 &&
    stockCount <= LOW_STOCK_THRESHOLD &&
    !outOfStock;

  const safeRelatedProducts = relatedProducts ?? [];

  const relatedItems = [
    product,
    ...safeRelatedProducts,
  ];

  const [relatedDot, setRelatedDot] = useState(0);

  const relatedTrackRef =
    useRef<HTMLDivElement>(null);

  const handleRelatedScroll = () => {
    const el = relatedTrackRef.current;

    if (!el) return;

    const maxScroll =
      el.scrollWidth - el.clientWidth;

    const progress =
      maxScroll > 0
        ? el.scrollLeft / maxScroll
        : 0;

    setRelatedDot(
      Math.round(
        progress * (relatedItems.length - 1)
      )
    );
  };

  const [cartState, setCartState] = useState<
    "idle" | "added"
  >("idle");

  const handleAddToCart = () => {
    if (outOfStock) return;

    onAddToCart(currentPackQuantity);

    setCartState("added");

    setTimeout(() => {
      setCartState("idle");
    }, 1800);
  };

  const safeReels = reels ?? [];

  const [playingReel, setPlayingReel] =
    useState<number | null>(null);

  const [mutedReels, setMutedReels] =
    useState<Record<number, boolean>>({});

  const toggleMute = (
    id: number,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();

    setMutedReels((prev) => ({
      ...prev,
      [id]: !(prev[id] ?? true),
    }));
  };

  const [openInfoId, setOpenInfoId] =
    useState<string | null>(null);

  const [openFaqId, setOpenFaqId] =
    useState<string | null>(null);

  const [showReviewForm, setShowReviewForm] =
    useState(false);

  const safeBreakdown =
    reviewSummary?.breakdown ?? [];

  const maxRatingCount = Math.max(
    ...safeBreakdown.map((row) => row.count),
    1
  );

  const safeSpecs = specs ?? [];
  const half = Math.ceil(safeSpecs.length / 2);
  const specsLeft = safeSpecs.slice(0, half);
  const specsRight = safeSpecs.slice(half);

  const safeReviewPhotos = (
    reviewPhotos ?? []
  ).filter(isValidMediaUrl);

  const safeReviews = reviews ?? [];
  const safeInfoSections = infoSections ?? [];
  const safeFaqs = faqs ?? [];
  const safeIngredients = ingredients ?? [];

  const badgeStyles = [
    "border-[#E3D2A0] bg-[#FBF3DF] text-[#7A5A1E]",
    "border-[#DED2EA] bg-[#F4EEF9] text-[#5C4776]",
  ];

  return (
    <div className="dhanyog-pdp min-h-screen w-full bg-[#FBF8F2] text-[#241F1A] antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,340;0,9..144,440;0,9..144,560;1,9..144,440&family=Manrope:wght@400;500;600;700;800&display=swap');

        .dhanyog-pdp {
          font-family: 'Manrope', ui-sans-serif, system-ui, sans-serif;
        }

        .dhanyog-pdp .font-display {
          font-family: 'Fraunces', ui-serif, Georgia, serif;
        }
      `}</style>

      <div
        ref={containerRef}
        className="relative mx-auto grid max-w-6xl grid-cols-1 gap-12 px-4 py-10 md:grid-cols-2 md:items-start md:gap-16 md:px-8 md:py-14"
      >
        <div ref={leftColRef}>
          <div
            ref={galleryBoxRef}
            style={
              isDesktop ? galleryStyle : undefined
            }
          >
            {currentImage ? (
              <>
                <div className="relative overflow-hidden rounded-[28px] border border-[#EADFC8] bg-[#F3ECDC] shadow-[0_20px_50px_-25px_rgba(64,48,20,0.35)]">
                  {labCertified && (
                    <div className="absolute left-4 top-4 z-10">
                      <motion.div
                        initial={{
                          opacity: 0,
                          y: -8,
                          scale: 0.92,
                        }}
                        animate={{
                          opacity: 1,
                          y: 0,
                          scale: 1,
                        }}
                        transition={{
                          duration: 0.5,
                          ease: "easeOut",
                        }}
                        className="flex items-center gap-1.5 rounded-full bg-[#241F1A]/85 px-3.5 py-1.5 text-[11px] font-semibold tracking-wide text-[#F6EFDF] shadow-md backdrop-blur-sm"
                      >
                        <BadgeCheck
                          size={13}
                          className="text-[#D9B970]"
                        />
                        Lab certified
                      </motion.div>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {currentImage.videoUrl &&
                    isValidMediaUrl(
                      currentImage.videoUrl
                    ) ? (
                      <motion.video
                        key={`v-${currentImage.id}`}
                        src={
                          currentImage.videoUrl
                        }
                        poster={
                          currentImage.src
                        }
                        controls
                        autoPlay
                        muted
                        loop
                        playsInline
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="aspect-square w-full object-cover"
                      />
                    ) : (
                      <motion.img
                        key={`i-${currentImage.id}`}
                        src={currentImage.src}
                        alt={
                          currentImage.alt ||
                          product.name
                        }
                        loading="eager"
                        decoding="async"
                        initial={{
                          opacity: 0,
                          scale: 1.02,
                        }}
                        animate={{
                          opacity: 1,
                          scale: 1,
                        }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.35,
                          ease: "easeOut",
                        }}
                        className="aspect-square w-full object-cover transition-transform duration-700 hover:scale-[1.03]"
                      />
                    )}
                  </AnimatePresence>

                  <div className="pointer-events-none absolute inset-0 rounded-[28px] ring-1 ring-inset ring-[#D9B970]/25" />
                </div>

                {images.length > 1 && (
                  <div className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                    {images.map((item, idx) => (
                      <button
                        type="button"
                        key={item.id}
                        onClick={() =>
                          setActiveImage(idx)
                        }
                        className={`group relative aspect-square w-[11%] min-w-[52px] shrink-0 overflow-hidden rounded-xl border transition-all duration-200 ${
                          activeImage === idx
                            ? "border-[#B4893C] ring-1 ring-[#B4893C]"
                            : "border-[#E7DFCF] hover:border-[#C9BA9A]"
                        }`}
                        aria-label={`View image ${
                          idx + 1
                        }`}
                      >
                        <img
                          src={item.thumb || item.src}
                          alt={
                            item.alt ||
                            `Product image ${
                              idx + 1
                            }`
                          }
                          loading="lazy"
                          decoding="async"
                          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />

                        {item.videoUrl &&
                          isValidMediaUrl(
                            item.videoUrl
                          ) && (
                            <span className="absolute inset-0 flex items-center justify-center bg-black/25">
                              <Play
                                size={12}
                                className="fill-white text-white"
                              />
                            </span>
                          )}
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="flex aspect-square items-center justify-center overflow-hidden rounded-[28px] border border-[#EADFC8] bg-[#F3ECDC] shadow-[0_20px_50px_-25px_rgba(64,48,20,0.35)]">
                <div className="text-center">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#E9DFC9]">
                    <ShoppingCart
                      size={24}
                      className="text-[#A6987F]"
                    />
                  </div>

                  <p className="mt-3 text-sm font-medium text-[#786D5D]">
                    Product image unavailable
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col">
          {badges.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {badges.map((badge, i) => (
                <span
                  key={badge}
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${
                    badgeStyles[
                      i % badgeStyles.length
                    ]
                  }`}
                >
                  {i === 0 && (
                    <Sparkles size={12} />
                  )}
                  {badge}
                </span>
              ))}
            </div>
          )}

          <h1 className="font-display mt-4 text-[2rem] font-medium leading-tight tracking-tight text-[#211C17] md:text-[2.4rem]">
            {product.name}
          </h1>

          {tagline && (
            <p className="mt-1 text-sm text-[#8A7E6D]">
              {tagline}
            </p>
          )}

          <div className="mt-3 flex items-center gap-2.5">
            <StarRow
              rating={reviewSummary.average}
              size={16}
            />

            <span className="text-sm text-[#8A7E6D]">
              {reviewSummary.total > 0
                ? `${reviewSummary.average.toFixed(
                    1
                  )} · ${reviewSummary.total.toLocaleString(
                    "en-IN"
                  )} reviews`
                : "No reviews yet"}
            </span>
          </div>

          <div className="mt-5 flex flex-wrap items-baseline gap-2.5 border-t border-[#EDE4D2] pt-5">
            <span className="font-display text-3xl font-medium text-[#211C17]">
              {formatINR(currentPackPrice)}
            </span>

            {showStrike && (
              <span className="text-base text-[#B3A88E] line-through">
                {formatINR(mrpForPack)}
              </span>
            )}

            {discountPct > 0 && (
              <span className="rounded-full bg-[#EAF2EC] px-2.5 py-0.5 text-xs font-semibold text-[#3F6B52]">
                {discountPct}% off
              </span>
            )}
          </div>

          {safePacks.length > 1 && (
            <div className="mt-6">
              <p className="mb-2.5 text-sm text-[#6E6355]">
                Choose a pack size
              </p>

              <div className="grid grid-cols-3 gap-3">
                {safePacks.map((opt) => {
                  const active =
                    opt.id === currentPack?.id;

                  return (
                    <motion.button
                      type="button"
                      key={opt.id}
                      onClick={() =>
                        setSelectedPackId(
                          opt.id
                        )
                      }
                      whileTap={{
                        scale: 0.97,
                      }}
                      className={`relative rounded-2xl border px-2 py-3.5 text-center transition-all duration-200 ${
                        active
                          ? "border-[#B4893C] bg-[#FBF3DF] shadow-[0_6px_18px_-10px_rgba(150,110,30,0.55)]"
                          : "border-[#E7DFCF] bg-white hover:border-[#D3C4A2]"
                      }`}
                    >
                      {opt.tag && (
                        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#241F1A] px-2.5 py-0.5 text-[10px] font-medium text-[#F3E7C9] shadow-sm">
                          {opt.tag}
                        </span>
                      )}

                      <p className="text-[13px] font-medium text-[#6E6355]">
                        {opt.label}
                      </p>

                      <p className="font-display mt-1 text-lg font-medium text-[#241F1A]">
                        {formatINR(opt.price)}
                      </p>

                      {opt.extraOff && (
                        <p className="mt-0.5 text-[11px] font-medium text-[#3F6B52]">
                          {opt.extraOff}
                        </p>
                      )}

                      {active && (
                        <motion.div
                          layoutId="qty-check"
                          className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#B4893C] text-white shadow"
                        >
                          <svg
                            viewBox="0 0 24 24"
                            className="h-3 w-3"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth={3}
                          >
                            <path
                              d="M5 13l4 4L19 7"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {secondsLeft !== null &&
            secondsLeft > 0 && (
              <div className="mt-4 inline-flex w-fit items-center gap-2 rounded-full border border-[#E7D2C5] bg-[#FBF1EA] px-3.5 py-1.5 text-xs font-medium text-[#8B4A3F]">
                <Clock size={13} />
                Offer ends in {hrs}h {mins}m {secs}s
              </div>
            )}

          <div className="mt-6 grid grid-cols-2 gap-3">
            <motion.button
              type="button"
              onClick={handleAddToCart}
              disabled={outOfStock}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              className="relative overflow-hidden rounded-xl bg-gradient-to-b from-[#D9B970] to-[#B4893C] py-3.5 text-sm font-semibold text-[#241B10] shadow-[0_10px_24px_-12px_rgba(150,110,30,0.7)] transition-shadow hover:shadow-[0_14px_28px_-12px_rgba(150,110,30,0.8)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <AnimatePresence
                mode="wait"
                initial={false}
              >
                {cartState === "idle" ? (
                  <motion.span
                    key="idle"
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <ShoppingCart size={16} />
                    {outOfStock
                      ? "Out of stock"
                      : "Add to cart"}
                  </motion.span>
                ) : (
                  <motion.span
                    key="added"
                    initial={{
                      opacity: 0,
                      y: 6,
                    }}
                    animate={{
                      opacity: 1,
                      y: 0,
                    }}
                    exit={{
                      opacity: 0,
                      y: -6,
                    }}
                    transition={{
                      duration: 0.15,
                    }}
                    className="flex items-center justify-center gap-2"
                  >
                    <BadgeCheck size={16} />
                    Added
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            <motion.button
              type="button"
              onClick={() =>
                !outOfStock &&
                onBuyNow(currentPackQuantity)
              }
              disabled={outOfStock}
              whileTap={{ scale: 0.97 }}
              whileHover={{ y: -1 }}
              className="flex items-center justify-center gap-2 rounded-xl bg-[#241F1A] py-3.5 text-sm font-semibold text-[#F6EFDF] shadow-[0_10px_24px_-12px_rgba(0,0,0,0.45)] transition-shadow hover:shadow-[0_14px_28px_-12px_rgba(0,0,0,0.55)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Zap
                size={15}
                className="fill-[#E0BE72] text-[#E0BE72]"
              />
              Buy now
            </motion.button>
          </div>

          <div className="mt-3 flex items-center justify-center gap-1.5 text-xs text-[#96897A]">
            <ShieldCheck size={13} />
            Secure checkout · 7-day easy returns
          </div>

          {totalSlides > 0 && (
            <div className="relative mt-7 overflow-hidden">
              <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                  transform: `translateX(-${
                    Math.min(
                      slide,
                      totalSlides - 1
                    ) * 100
                  }%)`,
                }}
              >
                {safeTestimonials.map(
                  (testimonial) => {
                    const avatarUrl =
                      getSafeImageUrl(
                        testimonial.avatarUrl
                      );

                    return (
                      <div
                        key={testimonial.id}
                        className="w-full shrink-0 px-0.5"
                      >
                        <div className="flex gap-3 rounded-2xl border border-[#EDE4D2] bg-[#FAF6EC] p-4">
                          {avatarUrl ? (
                            <img
                              src={avatarUrl}
                              alt={
                                testimonial.name
                              }
                              loading="lazy"
                              decoding="async"
                              className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-white"
                            />
                          ) : (
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#F1E3BE] text-sm font-semibold text-[#8A6A26] ring-2 ring-white">
                              {testimonial.name
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          )}

                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="text-sm font-semibold text-[#393129]">
                                {testimonial.name}
                              </span>

                              {testimonial.verified && (
                                <span className="inline-flex items-center gap-1 rounded-full bg-[#302A24] px-2 py-0.5 text-[10px] font-medium text-white">
                                  <BadgeCheck
                                    size={11}
                                  />
                                  Verified
                                </span>
                              )}
                            </div>

                            <StarRow
                              rating={
                                testimonial.rating
                              }
                              size={12}
                            />

                            <p className="mt-1 line-clamp-3 text-xs leading-relaxed text-[#746A5D]">
                              {testimonial.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                )}
              </div>

              {totalSlides > 1 && (
                <div className="mt-3 flex items-center justify-center gap-1.5">
                  {safeTestimonials.map(
                    (testimonial, i) => (
                      <button
                        type="button"
                        key={testimonial.id}
                        onClick={() =>
                          setSlide(i)
                        }
                        aria-label={`Go to review ${
                          i + 1
                        }`}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === slide
                            ? "w-5 bg-[#40382F]"
                            : "w-1.5 bg-[#DDD2BC]"
                        }`}
                      />
                    )
                  )}
                </div>
              )}
            </div>
          )}

          {showLowStock && (
            <div className="mt-5 flex items-center justify-center gap-2 rounded-xl border border-dashed border-[#DCC48C] bg-[#FBF6E9] py-2.5 text-sm font-medium text-[#8B4A3F]">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#B4893C] opacity-60" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#B4893C]" />
              </span>
              Only {stockCount} units left in stock
            </div>
          )}

          <div className="mt-4 rounded-2xl border border-[#EDE1C4] bg-[#FBF7EC] p-5">
            <div className="flex items-start gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F1E3BE] text-[#8A6A26]">
                <Truck size={16} />
              </span>

              <div>
                <p className="text-sm font-semibold text-[#3D352D]">
                  Check delivery date
                </p>

                <p className="text-xs text-[#8A7E6D]">
                  Prepaid orders are delivered on priority.
                </p>
              </div>
            </div>

            <div className="mt-3.5 flex overflow-hidden rounded-xl border border-[#DED2B4] bg-white">
              <span className="flex items-center pl-3.5 text-[#A6987F]">
                <MapPin size={16} />
              </span>

              <input
                value={pincode}
                onChange={(event) =>
                  setPincode(
                    event.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    handleCheckPincode();
                  }
                }}
                placeholder="Enter your pincode"
                inputMode="numeric"
                className="w-full bg-transparent px-2.5 py-2.5 text-sm text-[#342E27] outline-none placeholder:text-[#B3A88E]"
              />

              <button
                type="button"
                onClick={handleCheckPincode}
                disabled={
                  pincode.length !== 6 ||
                  checking
                }
                className="m-1 rounded-lg bg-[#3F6B52] px-5 text-sm font-semibold text-white transition-colors hover:bg-[#345A45] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {checking ? (
                  <span className="flex items-center gap-1">
                    <span className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  </span>
                ) : (
                  "Check"
                )}
              </button>
            </div>

            <AnimatePresence>
              {eta && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0 }}
                  className="mt-2.5 text-xs font-medium text-[#3F6B52]"
                >
                  Delivered by {eta} to {pincode}
                </motion.p>
              )}

              {pinError && (
                <motion.p
                  initial={{
                    opacity: 0,
                    y: -6,
                  }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  exit={{ opacity: 0 }}
                  className="mt-2.5 text-xs font-medium text-[#A3462F]"
                >
                  {pinError}
                </motion.p>
              )}
            </AnimatePresence>

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-[#EBE0C2] pt-3.5">
              <div className="flex items-center gap-2">
                <CheckCircle2
                  size={17}
                  className="shrink-0 text-[#5C5344]"
                />

                <div className="leading-tight">
                  <p className="text-xs font-semibold text-[#3B342C]">
                    Easy 7-day returns
                  </p>

                  <p className="text-[10px] text-[#8A7E6D]">
                    No questions asked
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ShieldCheck
                  size={17}
                  className="shrink-0 text-[#5C5344]"
                />

                <div className="leading-tight">
                  <p className="text-xs font-semibold text-[#3B342C]">
                    Free shipping
                  </p>

                  <p className="text-[10px] text-[#8A7E6D]">
                    On all orders
                  </p>
                </div>
              </div>
            </div>
          </div>

          {safeRelatedProducts.length > 0 && (
            <>
              <p className="mt-7 text-sm text-[#6E6355]">
                Complete your collection
              </p>

              <div
                ref={relatedTrackRef}
                onScroll={handleRelatedScroll}
                className="mt-2.5 flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
              >
                {relatedItems.map((item) => {
                  const active =
                    item.id === product.id;

                  const imageUrl =
                    getSafeImageUrl(
                      item.imageUrl
                    );

                  return (
                    <motion.button
                      type="button"
                      key={item.id}
                      onClick={() =>
                        !active &&
                        onOpenProduct(item.id)
                      }
                      whileTap={{
                        scale: 0.98,
                      }}
                      className={`flex w-[calc(50%-6px)] shrink-0 snap-start items-center gap-3 rounded-2xl border px-3 py-3 text-left transition-all duration-200 ${
                        active
                          ? "border-[#B4893C] bg-[#FBF3DF]"
                          : "border-[#E7DFCF] bg-white hover:border-[#D3C4A2]"
                      }`}
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={item.name}
                          loading="lazy"
                          decoding="async"
                          className="h-12 w-12 shrink-0 rounded-xl object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#F0E8D8]">
                          <ShoppingCart
                            size={17}
                            className="text-[#A6987F]"
                          />
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-xs font-medium text-[#4A4137]">
                          {item.name}
                        </p>

                        <p className="mt-0.5 text-sm font-semibold text-[#2E2822]">
                          {formatINR(item.price)}{" "}
                          {item.mrp &&
                            item.mrp > item.price && (
                              <span className="text-xs font-normal text-[#B3A88E] line-through">
                                {formatINR(
                                  item.mrp
                                )}
                              </span>
                            )}
                        </p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {relatedItems.length > 2 && (
                <div className="mt-2.5 flex items-center justify-center gap-1">
                  {relatedItems.map(
                    (item, i) => (
                      <span
                        key={item.id}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          i === relatedDot
                            ? "w-3.5 bg-[#40382F]"
                            : "w-1.5 bg-[#E1D7C4]"
                        }`}
                      />
                    )
                  )}
                </div>
              )}
            </>
          )}

          {(intro ||
            safeIngredients.length > 0 ||
            careNote) && (
            <div className="mt-8 border-t border-[#EDE4D2] pt-7">
              {intro && (
                <p className="text-sm leading-relaxed text-[#62584D]">
                  {intro}
                </p>
              )}

              {safeIngredients.length > 0 && (
                <ul className="mt-4 grid grid-cols-1 gap-x-6 gap-y-2.5 sm:grid-cols-2">
                  {safeIngredients.map(
                    (ingredient) => (
                      <li
                        key={ingredient.name}
                        className="flex items-start gap-2.5 text-sm text-[#62584D]"
                      >
                        <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#B4893C]" />

                        <span>
                          <span className="font-semibold text-[#302A24]">
                            {ingredient.name}
                          </span>{" "}
                          — {ingredient.benefit}
                        </span>
                      </li>
                    )
                  )}
                </ul>
              )}

              {careNote && (
                <p className="mt-4 rounded-xl bg-[#F4EFE3] p-3.5 text-xs leading-relaxed text-[#786D5D]">
                  <span className="font-semibold text-[#41392F]">
                    Note:
                  </span>{" "}
                  {careNote}
                </p>
              )}
            </div>
          )}

          {safeReels.length > 0 && (
            <>
              {lovedByText && (
                <h2 className="font-display mt-10 text-center text-2xl font-medium text-[#302A24]">
                  {lovedByText}
                </h2>
              )}

              <div className="mt-4 flex gap-3 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {safeReels.map((reel) => {
                  const isPlaying =
                    playingReel === reel.id;

                  const isMuted =
                    mutedReels[reel.id] ?? true;

                  const thumbnailUrl =
                    getSafeImageUrl(
                      reel.thumbnailUrl
                    );

                  const videoUrl =
                    getSafeImageUrl(
                      reel.videoUrl
                    );

                  return (
                    <motion.div
                      key={reel.id}
                      onClick={() =>
                        setPlayingReel(
                          isPlaying
                            ? null
                            : reel.id
                        )
                      }
                      whileTap={{
                        scale: 0.98,
                      }}
                      className="relative aspect-[9/16] w-[46%] shrink-0 cursor-pointer overflow-hidden rounded-2xl bg-[#E8E0D5]"
                    >
                      {isPlaying &&
                      videoUrl ? (
                        <video
                          src={videoUrl}
                          {...(thumbnailUrl
                            ? {
                                poster:
                                  thumbnailUrl,
                              }
                            : {})}
                          autoPlay
                          loop
                          muted={isMuted}
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : thumbnailUrl ? (
                        <motion.img
                          src={thumbnailUrl}
                          alt={
                            reel.caption ||
                            "Product video"
                          }
                          loading="lazy"
                          decoding="async"
                          animate={{
                            scale:
                              isPlaying
                                ? 1.06
                                : 1,
                          }}
                          transition={{
                            duration: 6,
                            ease: "linear",
                          }}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-[#E8E0D5]">
                          <Play
                            size={28}
                            className="text-[#A6987F]"
                          />
                        </div>
                      )}

                      {reel.views && (
                        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[10px] font-medium text-white backdrop-blur-sm">
                          <Eye size={11} />
                          {reel.views}
                        </span>
                      )}

                      <AnimatePresence>
                        {!isPlaying &&
                          thumbnailUrl && (
                            <motion.span
                              initial={{
                                opacity: 0,
                                scale: 0.7,
                              }}
                              animate={{
                                opacity: 1,
                                scale: 1,
                              }}
                              exit={{
                                opacity: 0,
                                scale: 0.7,
                              }}
                              className="absolute inset-0 flex items-center justify-center"
                            >
                              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 shadow">
                                <Play
                                  size={16}
                                  className="ml-0.5 fill-[#302A24] text-[#302A24]"
                                />
                              </span>
                            </motion.span>
                          )}
                      </AnimatePresence>

                      {isPlaying &&
                        videoUrl && (
                          <button
                            type="button"
                            onClick={(event) =>
                              toggleMute(
                                reel.id,
                                event
                              )
                            }
                            className="absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm"
                            aria-label={
                              isMuted
                                ? "Unmute"
                                : "Mute"
                            }
                          >
                            {isMuted ? (
                              <VolumeX size={13} />
                            ) : (
                              <Volume2 size={13} />
                            )}
                          </button>
                        )}

                      {reel.caption && (
                        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent px-3 pb-3 pt-8">
                          <p className="text-xs font-medium italic text-white">
                            &quot;
                            {reel.caption}
                            &quot;
                          </p>
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </>
          )}

          {safeInfoSections.length > 0 && (
            <div className="mt-9 border-t border-[#EDE4D2]">
              {safeInfoSections.map((item) => (
                <AccordionRow
                  key={item.id}
                  label={item.title}
                  isOpen={
                    openInfoId === item.id
                  }
                  onToggle={() =>
                    setOpenInfoId(
                      (current) =>
                        current === item.id
                          ? null
                          : item.id
                    )
                  }
                >
                  {item.content.map(
                    (line, index) => (
                      <p key={index}>{line}</p>
                    )
                  )}
                </AccordionRow>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <div className="mt-10 rounded-[28px] border border-[#EDE4D2] bg-white p-6 shadow-[0_20px_50px_-30px_rgba(60,45,25,0.25)] sm:p-9">
          <h2 className="font-display text-center text-2xl font-medium text-[#302A24] sm:text-3xl">
            Customer reviews
          </h2>

          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[auto_1px_1fr] sm:items-center sm:gap-9">
            <div className="flex flex-col items-start gap-1 sm:items-center sm:text-center">
              <span className="font-display text-3xl font-medium text-[#302A24]">
                {reviewSummary.total > 0
                  ? reviewSummary.average.toFixed(2)
                  : "–"}
              </span>

              <StarRow
                rating={reviewSummary.average}
                size={16}
              />

              <p className="text-xs text-[#8A7E6D]">
                {reviewSummary.total > 0
                  ? `Based on ${reviewSummary.total.toLocaleString(
                      "en-IN"
                    )} reviews`
                  : "Be the first to review"}
              </p>
            </div>

            <div className="hidden h-full w-px bg-[#EDE4D2] sm:block" />

            {reviewSummary.hasBreakdown ? (
              <div className="space-y-2">
                {safeBreakdown.map((row) => (
                  <div
                    key={row.stars}
                    className="flex items-center gap-2.5"
                  >
                    <div className="flex w-16 shrink-0 items-center gap-0.5">
                      {Array.from({
                        length: 5,
                      }).map(
                        (_, index) => (
                          <Star
                            key={index}
                            size={11}
                            className={
                              index <
                              row.stars
                                ? "fill-[#B4893C] text-[#B4893C]"
                                : "fill-[#E9E1D2] text-[#E9E1D2]"
                            }
                            strokeWidth={1}
                          />
                        )
                      )}
                    </div>

                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-[#F1EBDD]">
                      <motion.div
                        initial={{
                          width: 0,
                        }}
                        whileInView={{
                          width: `${
                            (row.count /
                              maxRatingCount) *
                            100
                          }%`,
                        }}
                        viewport={{
                          once: true,
                        }}
                        transition={{
                          duration: 0.7,
                          ease: "easeOut",
                        }}
                        className="h-full rounded-full bg-[#B4893C]"
                      />
                    </div>

                    <span className="w-9 shrink-0 text-right text-xs text-[#8A7E6D]">
                      {row.count}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div />
            )}
          </div>

          {safeReviewPhotos.length > 0 && (
            <div className="mt-6 border-t border-[#EDE4D2] pt-5">
              <p className="mb-2.5 text-xs text-[#8A7E6D]">
                Customer photos &amp; videos
              </p>

              <div className="flex items-center gap-2.5 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {safeReviewPhotos.map(
                  (src, index) => (
                    <img
                      key={`${src}-${index}`}
                      src={src}
                      alt={`Customer photo ${
                        index + 1
                      }`}
                      loading="lazy"
                      decoding="async"
                      className="h-14 w-14 shrink-0 rounded-xl object-cover transition-transform duration-200 hover:scale-105"
                    />
                  )
                )}
              </div>
            </div>
          )}

          {safeReviews.length > 0 && (
            <div className="mt-6 space-y-4 border-t border-[#EDE4D2] pt-5">
              {safeReviews.map((review) => (
                <div key={review.id}>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm font-semibold text-[#393129]">
                      {review.name}
                    </span>

                    {review.verified && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-[#302A24] px-2 py-0.5 text-[10px] font-medium text-white">
                        <BadgeCheck size={11} />
                        Verified
                      </span>
                    )}

                    <span className="text-[11px] text-[#A6987F]">
                      {new Date(
                        review.createdAt
                      ).toLocaleDateString(
                        "en-IN",
                        {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>

                  <StarRow
                    rating={review.rating}
                    size={12}
                  />

                  <p className="mt-1 text-sm leading-relaxed text-[#62584D]">
                    {review.text}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="mt-6 border-t border-[#EDE4D2] pt-5 text-center">
            <button
              type="button"
              onClick={() =>
                setShowReviewForm(
                  (value) => !value
                )
              }
              className="rounded-full border border-[#E7DFCF] px-6 py-2.5 text-sm font-semibold text-[#302A24] transition hover:border-[#B4893C] hover:text-[#8A6A26]"
            >
              {showReviewForm
                ? "Cancel"
                : "Write a review"}
            </button>

            {showReviewForm && (
              <div className="text-left">
                <ReviewForm
                  productId={product.id}
                />
              </div>
            )}
          </div>
        </div>

        {safeSpecs.length > 0 && (
          <>
            <h2 className="font-display mt-12 text-center text-2xl font-medium text-[#302A24] sm:text-3xl">
              Specifications
            </h2>

            <div className="mt-5 grid grid-cols-1 gap-x-14 sm:grid-cols-2">
              <div className="divide-y divide-[#EDE4D2]">
                {specsLeft.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between py-3.5 text-sm"
                  >
                    <span className="text-[#8A7E6D]">
                      {spec.label}
                    </span>

                    <span className="font-medium text-[#453D34]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divide-y divide-[#EDE4D2] sm:border-l sm:border-[#EDE4D2] sm:pl-9">
                {specsRight.map((spec) => (
                  <div
                    key={spec.label}
                    className="flex items-center justify-between py-3.5 text-sm"
                  >
                    <span className="text-[#8A7E6D]">
                      {spec.label}
                    </span>

                    <span className="font-medium text-[#453D34]">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}

        {safeFaqs.length > 0 && (
          <>
            <h2 className="font-display mt-12 text-center text-2xl font-medium text-[#302A24] sm:text-3xl">
              FAQs
            </h2>

            <div className="mt-5 border-t border-[#EDE4D2] pb-12">
              {safeFaqs.map((faq, index) => (
                <AccordionRow
                  key={faq.id}
                  label={`${index + 1}. ${faq.question}`}
                  isOpen={
                    openFaqId === faq.id
                  }
                  onToggle={() =>
                    setOpenFaqId(
                      (current) =>
                        current === faq.id
                          ? null
                          : faq.id
                    )
                  }
                >
                  <p>{faq.answer}</p>
                </AccordionRow>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}