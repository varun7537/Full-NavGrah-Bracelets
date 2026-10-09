// src/components/NavgrahBracelets/CommentSection.tsx
"use client";

import {
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CheckIcon, ChevronIcon } from "../Header/icons";

export interface CommentAuthor {
  name: string;
  avatarUrl?: string;
  initials?: string;
  isVerifiedBuyer?: boolean;
  isStaff?: boolean;
}

export interface Comment {
  id: string;
  author: CommentAuthor;
  timestamp: string;
  text: string;
  likeCount: number;
  liked?: boolean;
  edited?: boolean;
  replies?: Comment[];
}

interface CommentSectionProps {
  comments?: Comment[];
  heading?: string;
  subheading?: string;
  currentUser?: CommentAuthor;
  className?: string;
}

type SortMode = "top" | "newest";

export const SAMPLE_COMMENTS: Comment[] = [
  {
    id: "c1",
    author: { name: "Riya Kapoor", isVerifiedBuyer: true },
    timestamp: "2h ago",
    text: "got this for my dad's shani dasha and he hasn't taken it off since. no idea if it's the stone or just him feeling looked after but he's sleeping better and that's good enough for me 😄",
    likeCount: 34,
    replies: [],
  },
  {
    id: "c2",
    author: { name: "vikram.rao" },
    timestamp: "5h ago",
    text: "Quick q — the form asks for exact birth time but I only have an approx one from my mom. does the recommendation still hold up or should I get it corrected first",
    likeCount: 6,
    replies: [
      {
        id: "c2-r1",
        author: { name: "Navgrah Bracelets", isStaff: true },
        timestamp: "4h ago",
        text: "Hi Vikram, approximate is fine for most cases — we cross-check with date and place of birth as well. If you want more precision you can upload a birth chart at checkout, but it's optional.",
        likeCount: 11,
      },
      {
        id: "c2-r2",
        author: { name: "vikram.rao" },
        timestamp: "3h ago",
        text: "ah perfect thank you, ordering now",
        likeCount: 2,
      },
    ],
  },
  {
    id: "c3",
    author: { name: "Sana Q." },
    timestamp: "9h ago",
    text: "the stone colour irl is so much better than the photos ngl",
    likeCount: 12,
    replies: [],
  },
  {
    id: "c4",
    author: { name: "Arjun Malhotra", isVerifiedBuyer: true },
    timestamp: "1d ago",
    text: "Did the consultation call before ordering — the astrologer actually went through my chart instead of just pushing the priciest option, appreciated that. Delivery to Delhi took 9 days, packaging was nice. Only gripe is the clasp feels a bit loose, might get a jeweller to tighten it.",
    likeCount: 21,
    replies: [
      {
        id: "c4-r1",
        author: { name: "Navgrah Bracelets", isStaff: true },
        timestamp: "22h ago",
        text: "Thanks for the honest feedback, Arjun. Send us your order number over email and we'll get a replacement clasp out to you, no charge.",
        likeCount: 8,
      },
      {
        id: "c4-r2",
        author: { name: "Arjun Malhotra", isVerifiedBuyer: true },
        timestamp: "20h ago",
        text: "done, sent it just now. thanks for the quick turnaround",
        likeCount: 3,
      },
    ],
  },
  {
    id: "c5",
    author: { name: "Deepika R." },
    timestamp: "1d ago",
    text: "can the bracelet combine remedies for two doshas or does it have to be one at a time? mine flagged both Mangal and Shani in the reading",
    likeCount: 4,
    replies: [
      {
        id: "c5-r1",
        author: { name: "Navgrah Bracelets", isStaff: true },
        timestamp: "1d ago",
        text: "It can — combination bracelets are pretty common for us. Just mention both doshas in the notes field at checkout and the astrologer will work out the right stone pairing.",
        likeCount: 5,
      },
    ],
  },
  {
    id: "c6",
    author: { name: "Manoj Tiwari" },
    timestamp: "2d ago",
    text: "Got this for my wife's birthday, she loves it. Shipping to Nagpur was quicker than expected too, under a week. Ordering one for my mother next.",
    likeCount: 15,
    replies: [],
  },
  {
    id: "c7",
    author: { name: "fatima.a", isVerifiedBuyer: true },
    timestamp: "3d ago",
    text: "quality is genuinely good but wish there were more sizing options. mine came out slightly loose even after filling the wrist measurement field, had to add a bead myself at home",
    likeCount: 9,
    replies: [
      {
        id: "c7-r1",
        author: { name: "Priyanka S." },
        timestamp: "3d ago",
        text: "same happened to mine, think the elastic loosens up a bit after the first few wears",
        likeCount: 3,
      },
      {
        id: "c7-r2",
        author: { name: "Navgrah Bracelets", isStaff: true },
        timestamp: "2d ago",
        text: "Appreciate the feedback — passing this to the design team. In the meantime, DM us your order ID and we'll send a couple of spare beads free of cost.",
        likeCount: 6,
      },
    ],
  },
  {
    id: "c8",
    author: { name: "karthik_iyer99" },
    timestamp: "4d ago",
    text: "🔥🔥🔥",
    likeCount: 3,
    replies: [],
  },
  {
    id: "c9",
    author: { name: "Neha Joshi", isVerifiedBuyer: true },
    timestamp: "5d ago",
    text: "Was honestly pretty skeptical about ordering a gemstone bracelet online without seeing it in person, but the whole process felt more considered than I expected. The questionnaire was detailed, the call cleared up my doubts, and the final piece matches what we discussed. Not saying it changed my life but it's a nice daily reminder and the craftsmanship is solid.",
    likeCount: 27,
    replies: [],
  },
  {
    id: "c10",
    author: { name: "Suresh Pillai" },
    timestamp: "6d ago",
    text: "is COD available for orders above 5k? checkout only gave me a prepaid option",
    likeCount: 1,
    replies: [
      {
        id: "c10-r1",
        author: { name: "Navgrah Bracelets", isStaff: true },
        timestamp: "6d ago",
        text: "COD is capped at ₹5,000 right now, anything above ships prepaid only. We're working on raising that limit soon.",
        likeCount: 4,
      },
    ],
  },
  {
    id: "c11",
    author: { name: "Ananya B." },
    timestamp: "1w ago",
    text: "wanted this for so long, finally pulled the trigger during the festive sale. worth every rupee honestly",
    likeCount: 8,
    replies: [],
  },
  {
    id: "c12",
    author: { name: "Rohit_Sharma88" },
    timestamp: "1w ago",
    edited: true,
    text: "Ordered on the 3rd, got a shipping update on the 5th, then nothing for 4 days. Got a bit worried but it showed up on day 9 in perfect condition. Support replied to my email within a couple hours each time so that helped.",
    likeCount: 6,
    replies: [],
  },
];

function initialsFromName(name: string) {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatCount(count: number) {
  if (count >= 1000) return `${(count / 1000).toFixed(count % 1000 === 0 ? 0 : 1)}k`;
  return String(count);
}

const AVATAR_PALETTES = [
  { bg: "#F1E4C9", fg: "#7A5A22" },
  { bg: "#E7DCEF", fg: "#5F4A82" },
  { bg: "#DCEAE3", fg: "#2F6E52" },
  { bg: "#F3DEDA", fg: "#9A4635" },
  { bg: "#DDE6EF", fg: "#3B5D80" },
  { bg: "#EDE7DC", fg: "#6B5B3E" },
];

function paletteForName(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
    hash |= 0;
  }
  return AVATAR_PALETTES[Math.abs(hash) % AVATAR_PALETTES.length];
}

const QUICK_EMOJI = ["🙂", "❤️", "🙏", "🔥", "😍", "👏"];

function HeartIcon({
  className,
  filled = false,
}: {
  className?: string;
  filled?: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20.5s-7.2-4.6-9.6-9.1C.9 8.1 2.1 4.8 5.3 4c2.1-.5 4.1.4 5.2 2.1a.6.6 0 0 0 1 0C12.6 4.4 14.6 3.5 16.7 4c3.2.8 4.4 4.1 2.9 7.4C17.2 15.9 12 20.5 12 20.5Z"
      />
    </svg>
  );
}

function ReplyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9 10 4 14l5 4v-3.2c4.9 0 8.2 1.4 10.5 4.7-.6-5.6-3.4-9.5-10.5-9.9V6l-5 4Z"
      />
    </svg>
  );
}

function SendIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 12 20 4l-5.5 16-3.6-6.9L4 12Z"
      />
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.9 13.1 20 4" />
    </svg>
  );
}

function SmileIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path strokeLinecap="round" d="M8.5 10.5h.01M15.5 10.5h.01" />
      <path strokeLinecap="round" d="M8.3 14c.9 1.1 2.1 1.7 3.7 1.7s2.8-.6 3.7-1.7" />
    </svg>
  );
}

function Avatar({
  author,
  size = "md",
}: {
  author: CommentAuthor;
  size?: "sm" | "md";
}) {
  const initials = author.initials || initialsFromName(author.name);
  const dimension = size === "sm" ? "h-8 w-8 text-[11px]" : "h-10 w-10 text-sm";

  if (author.avatarUrl) {
    return (
      <img
        src={author.avatarUrl}
        alt=""
        className={`shrink-0 rounded-full border border-[#B8863E]/40 object-cover ${dimension}`}
      />
    );
  }

  if (author.isStaff) {
    return (
      <span
        className={`flex shrink-0 items-center justify-center rounded-full border border-[#B8863E] bg-gradient-to-b from-[#C9954F] to-[#A8793F] font-display font-semibold text-[#FBF6EC] shadow-sm ${dimension}`}
      >
        N
      </span>
    );
  }

  const palette = paletteForName(author.name);

  return (
    <span
      style={{ backgroundColor: palette.bg, color: palette.fg }}
      className={`flex shrink-0 items-center justify-center rounded-full font-display font-semibold ring-1 ring-inset ring-black/5 ${dimension}`}
    >
      {initials}
    </span>
  );
}

const MAX_LENGTH = 600;

function Composer({
  author,
  placeholder,
  autoFocus,
  compact,
  onSubmit,
  onCancel,
}: {
  author: CommentAuthor;
  placeholder: string;
  autoFocus?: boolean;
  compact?: boolean;
  onSubmit: (text: string) => void;
  onCancel?: () => void;
}) {
  const [value, setValue] = useState("");
  const [showEmoji, setShowEmoji] = useState(false);
  const [focused, setFocused] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const emojiPopoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (autoFocus) textareaRef.current?.focus();
  }, [autoFocus]);

  const autosize = useCallback(() => {
    const node = textareaRef.current;
    if (!node) return;
    node.style.height = "auto";
    node.style.height = `${node.scrollHeight}px`;
  }, []);

  useEffect(() => {
    autosize();
  }, [value, autosize]);

  useEffect(() => {
    if (!showEmoji) return;
    function handleClick(e: MouseEvent) {
      if (!emojiPopoverRef.current?.contains(e.target as Node)) {
        setShowEmoji(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showEmoji]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const trimmed = value.trim();
    if (!trimmed || submitting) return;

    setSubmitting(true);
    onSubmit(trimmed);
    setValue("");
    setShowEmoji(false);
    window.setTimeout(() => setSubmitting(false), 250);
  }

  const remaining = MAX_LENGTH - value.length;
  const nearLimit = remaining <= 40;

  return (
    <form onSubmit={handleSubmit} className="flex items-start gap-3">
      {!compact && <Avatar author={author} />}

      <div
        className={`relative flex-1 rounded-2xl border bg-white transition-shadow duration-150 ${
          focused
            ? "border-[#B8863E] shadow-[0_0_0_3px_rgba(184,134,62,0.12)]"
            : "border-[#241F1A]/12 hover:border-[#241F1A]/20"
        }`}
      >
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => setValue(e.target.value.slice(0, MAX_LENGTH))}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          onKeyDown={(e) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
              handleSubmit(e as unknown as FormEvent);
            }
          }}
          placeholder={placeholder}
          rows={1}
          maxLength={MAX_LENGTH}
          aria-label={placeholder}
          className="max-h-40 w-full resize-none rounded-2xl bg-transparent px-4 pb-2 pt-3 text-sm text-[#241F1A] placeholder:text-[#241F1A]/40 focus:outline-none"
        />

        <div className="flex items-center justify-between gap-3 border-t border-[#241F1A]/8 px-3 py-2">
          <div className="relative" ref={emojiPopoverRef}>
            <button
              type="button"
              onClick={() => setShowEmoji((v) => !v)}
              aria-label="Add an emoji"
              aria-expanded={showEmoji}
              className="flex h-7 w-7 items-center justify-center rounded-full text-[#241F1A]/40 transition-colors hover:bg-[#B8863E]/10 hover:text-[#B8863E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8863E]"
            >
              <SmileIcon className="h-4 w-4" />
            </button>

            {showEmoji && (
              <div className="absolute bottom-9 left-0 z-10 flex items-center gap-1 rounded-full border border-[#241F1A]/10 bg-white px-2 py-1.5 shadow-[0_8px_20px_-6px_rgba(36,31,26,0.18)]">
                {QUICK_EMOJI.map((emoji) => (
                  <button
                    key={emoji}
                    type="button"
                    onClick={() => {
                      setValue((v) => `${v}${emoji}`.slice(0, MAX_LENGTH));
                      textareaRef.current?.focus();
                    }}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-base transition-transform hover:scale-110"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            {value.length > 0 && (
              <span
                className={`text-xs tabular-nums transition-colors ${
                  nearLimit ? "text-[#B8492A]" : "text-[#241F1A]/35"
                }`}
              >
                {remaining}
              </span>
            )}

            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                className="rounded-full px-3 py-1.5 text-xs font-medium text-[#241F1A]/60 transition-colors hover:text-[#241F1A]"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={!value.trim() || submitting}
              className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-b from-[#C9954F] to-[#A8793F] px-4 py-1.5 text-xs font-medium text-[#FBF6EC] shadow-[0_4px_12px_-4px_rgba(168,121,63,0.45)] transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:pointer-events-none disabled:opacity-40 disabled:shadow-none disabled:hover:translate-y-0"
            >
              {compact ? "Reply" : "Post"}
              <SendIcon className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}

function CommentRow({
  comment,
  isReply = false,
  currentUser,
  onAddReply,
}: {
  comment: Comment;
  isReply?: boolean;
  currentUser: CommentAuthor;
  onAddReply: (parentId: string, text: string) => void;
}) {
  const [liked, setLiked] = useState(Boolean(comment.liked));
  const [likeCount, setLikeCount] = useState(comment.likeCount);
  const [justLiked, setJustLiked] = useState(false);
  const [replying, setReplying] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);

  const replyCount = comment.replies?.length ?? 0;

  function toggleLike() {
    setLiked((prev) => {
      const next = !prev;
      setLikeCount((count) => (prev ? count - 1 : count + 1));
      if (next) {
        setJustLiked(true);
        window.setTimeout(() => setJustLiked(false), 260);
      }
      return next;
    });
  }

  return (
    <div className="flex gap-3">
      <Avatar author={comment.author} size={isReply ? "sm" : "md"} />

      <div className="min-w-0 flex-1">
        <div className="rounded-2xl bg-[#241F1A]/[0.035] px-4 py-3 transition-colors">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
            <span className="text-sm font-medium text-[#241F1A]">
              {comment.author.name}
            </span>

            {comment.author.isStaff && (
              <span className="rounded-full bg-[#B8863E]/15 px-2 py-0.5 text-[10px] font-medium text-[#8F692C]">
                Team
              </span>
            )}

            {comment.author.isVerifiedBuyer && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2F6E52]">
                <CheckIcon className="h-3 w-3" />
                Verified buyer
              </span>
            )}
          </div>

          <p className="mt-1 whitespace-pre-wrap break-words text-sm leading-relaxed text-[#241F1A]/85">
            {comment.text}
          </p>
        </div>

        <div className="mt-1.5 flex items-center gap-4 px-1">
          <span className="text-xs text-[#241F1A]/40">
            {comment.timestamp}
            {comment.edited && <span className="text-[#241F1A]/30"> · edited</span>}
          </span>

          <button
            type="button"
            onClick={toggleLike}
            aria-pressed={liked}
            aria-label={liked ? "Unlike comment" : "Like comment"}
            className={`inline-flex items-center gap-1.5 text-xs font-medium transition-colors ${
              liked ? "text-[#B8492A]" : "text-[#241F1A]/50 hover:text-[#B8492A]"
            }`}
          >
            <HeartIcon
              className={`h-3.5 w-3.5 transition-transform duration-200 ${
                justLiked ? "scale-125" : "scale-100"
              }`}
              filled={liked}
            />
            {likeCount > 0 && (
              <span className="tabular-nums">{formatCount(likeCount)}</span>
            )}
          </button>

          {!isReply && (
            <button
              type="button"
              onClick={() => setReplying((v) => !v)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#241F1A]/50 transition-colors hover:text-[#B8863E]"
            >
              <ReplyIcon className="h-3.5 w-3.5" />
              Reply
            </button>
          )}
        </div>

        {replying && (
          <div className="mt-3 animate-[fadeIn_0.15s_ease-out]">
            <Composer
              author={currentUser}
              placeholder={`Replying to ${comment.author.name}…`}
              autoFocus
              compact
              onCancel={() => setReplying(false)}
              onSubmit={(text) => {
                onAddReply(comment.id, text);
                setReplying(false);
                setRepliesOpen(true);
              }}
            />
          </div>
        )}

        {replyCount > 0 && (
          <div className="mt-3">
            {!repliesOpen ? (
              <button
                type="button"
                onClick={() => setRepliesOpen(true)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#B8863E] transition-colors hover:text-[#8F692C]"
              >
                <span className="h-px w-6 bg-[#B8863E]/40" aria-hidden="true" />
                View {replyCount} {replyCount === 1 ? "reply" : "replies"}
                <ChevronIcon className="h-3 w-3 -rotate-90" />
              </button>
            ) : (
              <div className="flex flex-col gap-4 border-l-2 border-[#B8863E]/15 pl-4">
                <button
                  type="button"
                  onClick={() => setRepliesOpen(false)}
                  className="inline-flex w-fit items-center gap-1.5 text-xs font-medium text-[#241F1A]/40 transition-colors hover:text-[#B8863E]"
                >
                  <span className="h-px w-6 bg-[#241F1A]/20" aria-hidden="true" />
                  Hide replies
                  <ChevronIcon className="h-3 w-3 rotate-90" />
                </button>

                {comment.replies!.map((reply) => (
                  <CommentRow
                    key={reply.id}
                    comment={reply}
                    isReply
                    currentUser={currentUser}
                    onAddReply={onAddReply}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const PAGE_SIZE = 6;

function timestampWeight(timestamp: string) {
  if (timestamp === "Just now") return 0;
  const match = timestamp.match(/(\d+)([a-z]+)/i);
  if (!match) return Number.MAX_SAFE_INTEGER;
  const value = Number(match[1]);
  const unit = match[2];
  const scale: Record<string, number> = { m: 1, h: 60, d: 60 * 24, w: 60 * 24 * 7 };
  return value * (scale[unit] ?? 60 * 24 * 30);
}

export default function CommentSection({
  comments = SAMPLE_COMMENTS,
  heading = "Community discussion",
  subheading = "Questions, reviews, and stories from people wearing a Navgrah bracelet",
  currentUser = { name: "You", initials: "Y" },
  className = "",
}: CommentSectionProps) {
  const [items, setItems] = useState<Comment[]>(comments);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [sortMode, setSortMode] = useState<SortMode>("top");

  const totalCount = useMemo(
    () => items.reduce((sum, c) => sum + 1 + (c.replies?.length ?? 0), 0),
    [items]
  );

  const sortedItems = useMemo(() => {
    const copy = [...items];
    if (sortMode === "newest") {
      copy.sort((a, b) => timestampWeight(a.timestamp) - timestampWeight(b.timestamp));
    } else {
      copy.sort((a, b) => b.likeCount - a.likeCount);
    }
    return copy;
  }, [items, sortMode]);

  function handleAddTopLevel(text: string) {
    const newComment: Comment = {
      id: `local-${Date.now()}`,
      author: currentUser,
      timestamp: "Just now",
      text,
      likeCount: 0,
      replies: [],
    };
    setItems((prev) => [newComment, ...prev]);
    setSortMode("newest");
  }

  function handleAddReply(parentId: string, text: string) {
    setItems((prev) =>
      prev.map((comment) =>
        comment.id === parentId
          ? {
              ...comment,
              replies: [
                ...(comment.replies ?? []),
                {
                  id: `local-${Date.now()}`,
                  author: currentUser,
                  timestamp: "Just now",
                  text,
                  likeCount: 0,
                },
              ],
            }
          : comment
      )
    );
  }

  const visibleItems = sortedItems.slice(0, visibleCount);
  const hasMore = visibleCount < sortedItems.length;

  return (
    <section
      aria-labelledby="comments-heading"
      className={`bg-[#FBF6EC] px-6 py-20 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-3xl">
        <div className="flex flex-col gap-1.5">
          <h2
            id="comments-heading"
            className="font-display text-2xl font-semibold text-[#241F1A] sm:text-3xl"
          >
            {heading}
          </h2>
          <p className="text-sm text-[#241F1A]/55">{subheading}</p>
        </div>

        <div className="mt-8">
          <Composer
            author={currentUser}
            placeholder="Share your experience or ask a question…"
            onSubmit={handleAddTopLevel}
          />
        </div>

        <div className="mt-9 flex items-center justify-between border-b border-[#241F1A]/8 pb-3">
          <span className="text-sm font-medium text-[#241F1A]/70">
            {formatCount(totalCount)} {totalCount === 1 ? "comment" : "comments"}
          </span>

          <div
            role="group"
            aria-label="Sort comments"
            className="flex items-center rounded-full bg-[#241F1A]/[0.04] p-0.5 text-xs font-medium"
          >
            {(["top", "newest"] as SortMode[]).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setSortMode(mode)}
                aria-pressed={sortMode === mode}
                className={`rounded-full px-3 py-1.5 capitalize transition-colors ${
                  sortMode === mode
                    ? "bg-white text-[#241F1A] shadow-sm"
                    : "text-[#241F1A]/50 hover:text-[#241F1A]"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-7 flex flex-col gap-7">
          {visibleItems.map((comment) => (
            <CommentRow
              key={comment.id}
              comment={comment}
              currentUser={currentUser}
              onAddReply={handleAddReply}
            />
          ))}
        </div>

        {hasMore && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setVisibleCount((v) => v + PAGE_SIZE)}
              className="inline-flex items-center gap-1.5 rounded-full border border-[#241F1A]/15 px-5 py-2.5 text-sm font-medium text-[#241F1A]/70 transition-colors hover:border-[#B8863E]/50 hover:text-[#B8863E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#B8863E]"
            >
              Show more comments
              <ChevronIcon className="h-3.5 w-3.5 rotate-90" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}