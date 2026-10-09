"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useAuth } from "../Auth/AuthContext";
import { fetchMyOrders, trackOrder, OrderError } from "../../lib/orderApi";
import { DISPLAY_LABELS, displayStatus, type TrackedOrder } from "../../data/Orders";
import { CATEGORIES, FAQS, FALLBACK, GREETING, WHATSAPP_URL, type ChatLink, type Faq } from "../../data/chatbot";
import { extractOrderId, findRashi, matchFaqs, smallTalk } from "../../lib/chatMatch";
import { formatINR } from "../../lib/Currency";
import { CloseIcon } from "../Collections/icons";

type Action =
  | { t: "menu" }
  | { t: "cat"; id: string }
  | { t: "faq"; id: string }
  | { t: "track" }
  | { t: "myorders" }
  | { t: "order"; ref: string };

interface Opt {
  label: string;
  action: Action;
}

interface Msg {
  id: number;
  from: "bot" | "user";
  text?: string;
  options?: Opt[];
  links?: ChatLink[];
  order?: TrackedOrder;
}

type BotPart = Omit<Msg, "id" | "from">;

const WA_LINK: ChatLink = { label: "Chat on WhatsApp", href: WHATSAPP_URL, external: true };

const MENU: Opt[] = [
  ...CATEGORIES.map((c) => ({ label: c.label, action: { t: "cat", id: c.id } as Action })),
  { label: "🔎 Track my order", action: { t: "track" } },
  { label: "🧾 My orders", action: { t: "myorders" } },
];

const BACK: Opt = { label: "⬅ Main menu", action: { t: "menu" } };

const faqOpt = (f: Faq): Opt => ({ label: f.question, action: { t: "faq", id: f.id } });

export default function ChatWidget() {
  const { user, openLogin } = useAuth();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([{ id: 1, from: "bot", text: GREETING, options: MENU }]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [awaitingId, setAwaitingId] = useState(false);

  const idRef = useRef(1);
  const endRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const list = timers.current;
    return () => list.forEach((t) => window.clearTimeout(t));
  }, []);

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, typing, open]);

  const nextId = () => ++idRef.current;

  const pushUser = (text: string) => setMessages((m) => [...m, { id: nextId(), from: "user", text }]);

  /** Bot ke messages ek-ek karke, thodi "typing" deri ke saath. */
  const say = useCallback((parts: BotPart[]) => {
    const run = (i: number) => {
      if (i >= parts.length) return;
      setTyping(true);
      const t = window.setTimeout(() => {
        setTyping(false);
        setMessages((m) => [...m, { id: ++idRef.current, from: "bot", ...parts[i] }]);
        run(i + 1);
      }, 450);
      timers.current.push(t);
    };
    run(0);
  }, []);

  const showMenu = (text: string) => say([{ text, options: MENU }]);

  const answerFaq = (faq: Faq) => {
    const siblings = FAQS.filter((f) => f.category === faq.category && f.id !== faq.id)
      .slice(0, 3)
      .map(faqOpt);
    say([{ text: faq.answer, links: faq.links, options: [...siblings, BACK] }]);
  };

  const lookupOrder = async (ref: string) => {
    setAwaitingId(false);
    setTyping(true);
    try {
      const order = await trackOrder(ref);
      setTyping(false);
      say([{ order, options: [{ label: "🔎 Track another order", action: { t: "track" } }, BACK] }]);
    } catch (e) {
      setTyping(false);
      say([
        {
          text: e instanceof OrderError ? e.message : "Abhi order check nahi ho pa raha. Thodi der baad try kijiye.",
          options: [{ label: "🔎 Try another ID", action: { t: "track" } }, BACK],
          links: [WA_LINK],
        },
      ]);
    }
  };

  const showMyOrders = async () => {
    if (!user) {
      say([{ text: "Apne orders dekhne ke liye pehle login kijiye.", options: [BACK] }]);
      openLogin({ message: "Please login to see your orders." });
      return;
    }
    setTyping(true);
    try {
      const orders = (await fetchMyOrders()).slice(0, 3);
      setTyping(false);
      if (orders.length === 0) {
        say([{ text: "Aapne abhi tak koi order nahi diya hai.", links: [{ label: "Browse bracelets", href: "/bracelets" }], options: [BACK] }]);
        return;
      }
      say([
        {
          text: "Aapke recent orders. Kisi par dabaiye:",
          options: [
            ...orders.map((o) => ({
              label: `${o.reference} · ${DISPLAY_LABELS[displayStatus(o)]}`,
              action: { t: "order", ref: o.reference } as Action,
            })),
            BACK,
          ],
        },
      ]);
    } catch {
      setTyping(false);
      say([{ text: "Orders load nahi ho paye. Profile page se dekh sakte hain.", links: [{ label: "Open my profile", href: "/profile" }], options: [BACK] }]);
    }
  };

  const handleOption = (opt: Opt) => {
    const a = opt.action;
    setAwaitingId(false);

    switch (a.t) {
      case "menu":
        showMenu("Aur kis cheez me madad chahiye?");
        break;
      case "cat": {
        pushUser(opt.label);
        const list = FAQS.filter((f) => f.category === a.id).map(faqOpt);
        say([{ text: "Apna sawal chuniye:", options: [...list, BACK] }]);
        break;
      }
      case "faq": {
        const faq = FAQS.find((f) => f.id === a.id);
        if (!faq) return;
        pushUser(faq.question);
        answerFaq(faq);
        break;
      }
      case "track":
        pushUser(opt.label);
        setAwaitingId(true);
        say([
          {
            text: "Apna Order ID likhiye (jaise NG-ABC123). Ye payment confirm hone par WhatsApp aur SMS par bheja gaya tha.",
            options: [{ label: "🧾 My orders", action: { t: "myorders" } }, BACK],
          },
        ]);
        break;
      case "myorders":
        pushUser(opt.label);
        showMyOrders();
        break;
      case "order":
        pushUser(a.ref);
        lookupOrder(a.ref);
        break;
    }
  };

  const send = (raw: string) => {
    const text = raw.trim();
    if (!text || typing) return;

    pushUser(text);
    setInput("");

    // 1) Order ID
    const orderId = extractOrderId(text);
    if (orderId) return void lookupOrder(orderId);

    // 2) Order ID ka intezaar tha par ID jaisa kuch nahi aaya
    if (awaitingId && text.length <= 12) {
      return say([
        {
          text: "Ye valid Order ID nahi lagta. Format NG-ABC123 hota hai (NG ke baad 6 akshar/number). Dobara likhiye.",
          options: [{ label: "🧾 My orders", action: { t: "myorders" } }, BACK],
        },
      ]);
    }
    setAwaitingId(false);

    // 3) Hello / thanks / bye
    const talk = smallTalk(text);
    if (talk === "greet") return showMenu("Namaste! 🙏 Aap kis cheez me madad chahte hain?");
    if (talk === "thanks") return say([{ text: "Aapka swagat hai! 😊 Koi aur madad chahiye to bataiye.", options: [BACK] }]);
    if (talk === "bye") return say([{ text: "Dhanyavad! Aapka din shubh ho. 🙏" }]);

    // 4) Rashi ka naam
    const rashi = findRashi(text);
    if (rashi) {
      return say([
        {
          text: `${rashi.name} (${rashi.english}) rashi ke liye bane bracelets yahan dekhiye. Personal salah ke liye custom kundli bracelet bhi le sakte hain.`,
          links: [
            { label: `Shop ${rashi.name} bracelets`, href: `/bracelets?rashi=${rashi.id}` },
            { label: "Custom bracelet", href: "/custom-bracelet" },
          ],
          options: [BACK],
        },
      ]);
    }

    // 5) FAQ keywords
    const { best, suggestions } = matchFaqs(text);
    if (best) return answerFaq(best);

    // 6) Jawab nahi mila
    say([
      {
        text: FALLBACK,
        options: [...suggestions.map(faqOpt), BACK],
        links: [WA_LINK],
      },
    ]);
  };

  const lastBotId = [...messages].reverse().find((m) => m.from === "bot")?.id;

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Chat with us"
        className="fixed bottom-20 right-4 z-[55] flex h-14 w-14 items-center justify-center rounded-full bg-[#211b17] text-white shadow-lg transition hover:scale-105 lg:bottom-6 lg:right-6"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z" />
        </svg>
      </button>
    );
  }

  return (
    <div
      role="dialog"
      aria-label="Chat assistant"
      className="fixed bottom-3 left-3 right-3 z-[56] flex h-[75vh] max-h-[620px] flex-col overflow-hidden rounded-2xl border border-[#e7dfd5] bg-white shadow-2xl sm:left-auto sm:right-6 sm:w-[380px]"
    >
      <div className="flex items-center justify-between bg-[#211b17] px-4 py-3 text-white">
        <div>
          <p className="text-sm font-semibold">Navgrah Assistant</p>
          <p className="text-[11px] text-white/70">Orders, delivery, bracelets & more</p>
        </div>
        <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-white/10">
          <CloseIcon className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto bg-[#faf8f4] p-4">
        {messages.map((m) => (
          <div key={m.id} className={`flex flex-col gap-2 ${m.from === "user" ? "items-end" : "items-start"}`}>
            {m.text && (
              <div
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${
                  m.from === "user" ? "bg-[#211b17] text-white" : "border border-[#e7dfd5] bg-white text-[#241c16]"
                }`}
              >
                {m.text}
              </div>
            )}

            {m.order && <OrderCard order={m.order} onNavigate={() => setOpen(false)} />}

            {m.links && m.links.length > 0 && (
              <div className="flex max-w-[92%] flex-wrap gap-2">
                {m.links.map((l) =>
                  l.external ? (
                    <a
                      key={l.href}
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#25D366] px-3.5 py-1.5 text-xs font-semibold text-white transition hover:bg-[#1fb857]"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      key={l.href}
                      href={l.href}
                      onClick={() => setOpen(false)}
                      className="rounded-full border border-[#a47735] bg-white px-3.5 py-1.5 text-xs font-semibold text-[#8c6327] transition hover:bg-[#faf3e7]"
                    >
                      {l.label} →
                    </Link>
                  )
                )}
              </div>
            )}

            {m.id === lastBotId && m.options && m.options.length > 0 && (
              <div className="flex max-w-[95%] flex-wrap gap-2">
                {m.options.map((o) => (
                  <button
                    key={o.label}
                    type="button"
                    disabled={typing}
                    onClick={() => handleOption(o)}
                    className="rounded-full border border-[#e7dfd5] bg-white px-3 py-1.5 text-left text-xs text-[#403a34] transition hover:border-[#a47735] hover:text-[#8c6327] disabled:opacity-50"
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {typing && (
          <div className="flex justify-start">
            <div className="rounded-2xl border border-[#e7dfd5] bg-white px-3.5 py-2.5 text-sm text-[#a89d8f]">Typing…</div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          send(input);
        }}
        className="flex items-center gap-2 border-t border-[#e7dfd5] bg-white p-3"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={awaitingId ? "Order ID likhiye (NG-ABC123)" : "Type your question…"}
          maxLength={200}
          className="min-w-0 flex-1 rounded-full border border-[#e7dfd5] px-4 py-2.5 text-sm outline-none focus:border-[#a47735]"
        />
        <button
          type="submit"
          disabled={typing || !input.trim()}
          className="rounded-full bg-[#211b17] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#332822] disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

function OrderCard({ order, onNavigate }: { order: TrackedOrder; onNavigate: () => void }) {
  const label = DISPLAY_LABELS[displayStatus(order)];

  return (
    <div className="w-full max-w-[92%] rounded-2xl border border-[#e7dfd5] bg-white p-3.5 text-sm text-[#403a34]">
      <div className="flex items-center justify-between gap-2">
        <p className="font-semibold tracking-wide text-[#241c16]">{order.reference}</p>
        <span className="rounded-full bg-[#faf3e7] px-2.5 py-1 text-[11px] font-semibold text-[#8c6327]">{label}</span>
      </div>

      <ul className="mt-2 space-y-0.5 text-xs">
        {order.items.map((i, idx) => (
          <li key={idx} className="flex justify-between gap-2">
            <span className="min-w-0 truncate">{i.name}</span>
            <span className="shrink-0 text-[#a89d8f]">× {i.quantity}</span>
          </li>
        ))}
      </ul>

      <p className="mt-2 text-xs text-[#6d6259]">
        Total: <span className="font-semibold text-[#241c16]">{formatINR(order.amount)}</span>
      </p>

      {order.status === "paid" && order.stage !== "delivered" && order.expectedDelivery && (
        <p className="mt-1 text-xs text-[#6d6259]">
          Expected delivery:{" "}
          <span className="font-semibold text-[#241c16]">
            {new Date(order.expectedDelivery).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
        </p>
      )}
      {order.status === "payment_submitted" && (
        <p className="mt-1 text-xs text-[#8c6327]">Aapka payment verify ho raha hai.</p>
      )}
      {order.status === "pending_payment" && (
        <p className="mt-1 text-xs text-[#8c6327]">Payment abhi nahi mila. Order payment ke baad hi place hota hai.</p>
      )}

      <Link
        href={`/order-tracking?id=${order.reference}`}
        onClick={onNavigate}
        className="mt-3 inline-block rounded-full border border-[#a47735] px-3.5 py-1.5 text-xs font-semibold text-[#8c6327] transition hover:bg-[#faf3e7]"
      >
        Full tracking dekhein →
      </Link>
    </div>
  );
}