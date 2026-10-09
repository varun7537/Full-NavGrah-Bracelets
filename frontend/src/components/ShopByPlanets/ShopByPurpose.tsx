"use client";

import { useId, useState, type CSSProperties, type KeyboardEvent } from "react";
import clsx from "clsx";
import { BraceletImage } from "./BraceletImage";
import { PurposeIcon } from "./PurposeIcons";
import { PURPOSES } from "../../data/Purposes.data";
import styles from "../../styles/ShopByPurpose.module.css";
import type { Purpose } from "../../data/Types";
import type { StaticImageData } from "next/image";

type Orientation = "horizontal" | "vertical";

type AccentVars = CSSProperties & {
  "--tab-accent"?: string;
  "--tab-accent-soft"?: string;
};

export default function ShopByPurpose() {
  const [activeIndex, setActiveIndex] = useState(0);
  const uid = useId();

  const active: Purpose | undefined = PURPOSES[activeIndex];

  if (!active) {
    return null;
  }

  function handleTabKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
    orientation: Orientation,
    idPrefix: string
  ): void {
    const forwardKey = orientation === "horizontal" ? "ArrowRight" : "ArrowDown";
    const backwardKey = orientation === "horizontal" ? "ArrowLeft" : "ArrowUp";

    let nextIndex: number | null = null;
    if (event.key === forwardKey) {
      nextIndex = (index + 1) % PURPOSES.length;
    } else if (event.key === backwardKey) {
      nextIndex = (index - 1 + PURPOSES.length) % PURPOSES.length;
    } else if (event.key === "Home") {
      nextIndex = 0;
    } else if (event.key === "End") {
      nextIndex = PURPOSES.length - 1;
    }

    if (nextIndex !== null) {
      event.preventDefault();
      setActiveIndex(nextIndex);
      document.getElementById(`${idPrefix}-${nextIndex}`)?.focus();
    }
  }

  const gridTemplateColumns = PURPOSES.map((_, i) =>
    i === activeIndex ? "minmax(0,1fr)" : "var(--collapsed-track)"
  ).join(" ");

  return (
    <section
      aria-labelledby={`${uid}-heading`}
      className="bg-[#f3e7d9] px-5 py-12 text-[#211d1a] sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16 xl:py-24"
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-6 sm:mb-10">
          <div>
            <h2
              id={`${uid}-heading`}
              className={clsx(
                styles.fontDisplay,
                "max-w-[16ch] text-[26px] font-medium leading-[1.08] tracking-[-0.01em] sm:text-[38px] lg:text-[48px] xl:text-[52px]"
              )}
            >
              Find what speaks to you
            </h2>
            <p className={clsx(styles.fontMeta, "mt-4 max-w-[46ch] text-sm leading-relaxed text-[#6b645c] sm:text-base")}>
              Six intentions, six materials — open one to see the bracelet
              and craftsmanship behind it.
            </p>
          </div>
          <p className={clsx(styles.fontMeta, "text-xs tracking-[0.04em] text-[#6b645c]")} aria-hidden="true">
            {String(activeIndex + 1).padStart(2, "0")} / {String(PURPOSES.length).padStart(2, "0")}
          </p>
        </div>

        <div
          role="tablist"
          aria-label="Shop by purpose"
          aria-orientation="horizontal"
          className={clsx(
            styles.rail,
            styles.desktopCabinet,
            "h-[400px] overflow-hidden md:h-[440px] lg:h-[560px] xl:h-[620px]"
          )}
          style={{ gridTemplateColumns }}
        >
          {PURPOSES.map((purpose, index) => {
            const isActive = index === activeIndex;
            const tabId = `${uid}-tab-${index}`;
            const panelId = `${uid}-panel-${index}`;
            const accentVars: AccentVars = {
              "--tab-accent": purpose.accent,
              "--tab-accent-soft": purpose.accentSoft,
            };

            return (
              <div
                key={purpose.id}
                data-active={isActive}
                className={clsx(styles.tab, "flex min-w-0 flex-col")}
                style={{ ...accentVars, backgroundColor: isActive ? "transparent" : `${purpose.accentSoft}66` }}
              >
                <button
                  type="button"
                  id={tabId}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={isActive ? panelId : undefined}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index, "horizontal", `${uid}-tab`)}
                  className={clsx(
                    "relative w-full bg-transparent px-2 pt-4 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px] md:px-3 md:pt-5",
                    isActive
                      ? "flex flex-row items-center gap-3 pb-4 md:gap-4 md:pb-5"
                      : "flex h-full flex-col items-center gap-3 pb-5 md:gap-4 md:pb-6"
                  )}
                  style={{ outlineColor: purpose.accent } as CSSProperties}
                >
                  <PurposeIcon
                    id={purpose.id}
                    className={clsx(
                      styles.iconBadge,
                      isActive
                        ? "h-9 w-9 shrink-0 p-2 md:h-11 md:w-11 md:p-2.5"
                        : "h-7 w-7 p-1.5 md:h-10 md:w-10 md:p-2.5"
                    )}
                  />

                  <span className={clsx(styles.fontMeta, "text-[10px] tracking-[0.06em] text-[#6b645c] md:text-[11px]")}>
                    {purpose.number}
                  </span>

                  <span
                    className={clsx(styles.fontDisplay, styles.spineLabel, "flex-1 text-sm text-[#211d1a] md:text-lg")}
                    data-visible={!isActive}
                    aria-hidden={isActive}
                  >
                    {purpose.name}
                  </span>

                  <span
                    className={clsx(styles.fontDisplay, styles.horizontalLabel, "text-base text-[#211d1a] md:text-xl")}
                    data-visible={isActive}
                    aria-hidden={!isActive}
                  >
                    {purpose.name}
                  </span>

                  <span className={styles.tick} data-open={isActive} aria-hidden="true" style={{ background: purpose.accent }} />
                </button>

                {isActive && (
                  <div
                    id={panelId}
                    role="tabpanel"
                    aria-labelledby={tabId}
                    data-visible="true"
                    className={clsx(styles.panelContent, "flex flex-1 flex-col justify-between gap-3 px-4 pb-6 md:gap-4 md:px-6 md:pb-8 lg:px-10 lg:pb-10")}
                  >
                    <p className={clsx(styles.fontMeta, "max-w-[32ch] text-xs text-[#6b645c] md:text-sm")}>{purpose.tagline}</p>

                    <div className="relative mx-auto flex w-full max-w-[220px] flex-1 items-center justify-center md:max-w-[260px] lg:max-w-[300px]">
                      <div aria-hidden="true" className={styles.imageGlow} />
                      <div className={clsx(styles.imageFrame, "relative aspect-square w-full")}>
                        <BraceletImage
                          purposeId={purpose.id}
                          src={purpose.image}
                          alt={purpose.imageAlt}
                          accent={purpose.accent}
                          accentSoft={purpose.accentSoft}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-baseline justify-between gap-4">
                        <p className={clsx(styles.fontMeta, "text-xs text-[#6b645c] md:text-sm")}>{purpose.material}</p>
                        <p className={clsx(styles.fontMeta, "text-xs font-semibold text-[#6b645c] md:text-sm")}>{purpose.price}</p>
                      </div>
                      <h3 className={clsx(styles.fontDisplay, "mt-1 text-lg md:text-2xl")}>{purpose.productName}</h3>
                      <a
                        href={purpose.href}
                        className={clsx(
                          styles.fontMeta,
                          "mt-3 inline-flex w-fit items-center gap-2 border-b border-[#211d1a] pb-1 text-xs text-[#211d1a] no-underline transition-[gap] duration-300 hover:gap-3 md:mt-4 md:gap-2.5 md:text-sm",
                          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[6px]"
                        )}
                        style={{ outlineColor: purpose.accent } as CSSProperties}
                      >
                        Explore collection
                        <span aria-hidden="true" style={{ color: purpose.accent }}>
                          →
                        </span>
                      </a>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className={clsx(styles.dots, styles.desktopCabinet, "mt-5")} aria-hidden="true">
          {PURPOSES.map((purpose, index) => (
            <span
              key={purpose.id}
              className={styles.dot}
              data-active={index === activeIndex}
              style={{ backgroundColor: purpose.accent }}
            />
          ))}
        </div>

        <div
          role="tablist"
          aria-label="Shop by purpose"
          aria-orientation="vertical"
          className={clsx(styles.mobileCabinet, "border-t border-[#ddd6c9]")}
        >
          {PURPOSES.map((purpose, index) => {
            const isActive = index === activeIndex;
            const tabId = `${uid}-mtab-${index}`;
            const panelId = `${uid}-mpanel-${index}`;

            return (
              <div
                key={purpose.id}
                className={clsx(styles.mRow, "border-b border-[#ddd6c9]")}
                style={
                  {
                    "--tab-accent": purpose.accent,
                    backgroundColor: isActive ? `${purpose.accentSoft}55` : "transparent",
                  } as AccentVars
                }
              >
                <button
                  type="button"
                  id={tabId}
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={panelId}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => setActiveIndex(index)}
                  onKeyDown={(event) => handleTabKeyDown(event, index, "vertical", `${uid}-mtab`)}
                  className={clsx(
                    styles.fontDisplay,
                    "flex w-full items-center justify-between gap-2 bg-transparent px-3 py-3.5 text-left sm:gap-3 sm:py-4",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-4px]"
                  )}
                >
                  <span className="flex min-w-0 items-center gap-2 sm:gap-3">
                    <PurposeIcon id={purpose.id} className={clsx(styles.iconBadge, "h-8 w-8 shrink-0 p-1.5 sm:h-9 sm:w-9 sm:p-2")} />
                    <span className={clsx(styles.fontMeta, "shrink-0 text-[10px] tracking-[0.06em] text-[#6b645c] sm:text-[11px]")}>
                      {purpose.number}
                    </span>
                    <span className="truncate text-[17px] text-[#211d1a] sm:text-[20px]">{purpose.name}</span>
                  </span>
                  <span
                    className={styles.mTick}
                    data-open={isActive}
                    aria-hidden="true"
                    style={{ background: purpose.accent }}
                  />
                </button>

                <div id={panelId} className={styles.mPanel} data-open={isActive} aria-hidden={!isActive}>
                  <div className={styles.mPanelInner}>
                    <div className="flex flex-col items-center px-3 pb-6 sm:pb-7">
                      <p className={clsx(styles.fontMeta, "mb-3 self-start text-xs text-[#6b645c] sm:mb-4 sm:text-[13px]")}>
                        {purpose.tagline}
                      </p>

                      <div className="relative mb-4 w-full max-w-[240px] sm:mb-5 sm:max-w-[280px]">
                        <div aria-hidden="true" className={styles.imageGlow} />
                        <div className={clsx(styles.imageFrame, "relative aspect-square w-full")}>
                          <BraceletImage
                            purposeId={purpose.id}
                            src={purpose.image}
                            alt={purpose.imageAlt}
                            accent={purpose.accent}
                            accentSoft={purpose.accentSoft}
                          />
                        </div>
                      </div>

                      <div className="w-full">
                        <p className={clsx(styles.fontMeta, "mb-1 text-xs text-[#6b645c] sm:text-sm")}>{purpose.material}</p>
                        <h3 className={clsx(styles.fontDisplay, "mb-1 text-lg sm:text-[22px]")}>{purpose.productName}</h3>
                        <p className={clsx(styles.fontMeta, "text-xs text-[#6b645c] sm:text-sm")}>{purpose.price}</p>
                      </div>

                      <a
                        href={purpose.href}
                        tabIndex={isActive ? undefined : -1}
                        className={clsx(
                          styles.fontMeta,
                          "mt-3 inline-flex w-fit items-center gap-2 border-b border-[#211d1a] pb-1 text-xs text-[#211d1a] no-underline sm:mt-4 sm:gap-2.5 sm:text-sm"
                        )}
                      >
                        Explore collection <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}