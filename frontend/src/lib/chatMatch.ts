import { FAQS, type Faq } from "../data/chatbot";
import { RASHIS, type Rashi } from "../data/Rashibracelets";

/** Lowercase, punctuation hatao (Devanagari ke matras bachte hain). */
const norm = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{M}\p{N}\s-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim();

export interface MatchResult {
  best: Faq | null;
  suggestions: Faq[];
}

/** Keywords ke hisaab se sabse milta sawal. Pura shabd/phrase match zyada points deta hai. */
export function matchFaqs(text: string): MatchResult {
  const t = ` ${norm(text)} `;

  const scored = FAQS.map((faq) => {
    let score = 0;
    for (const k of faq.keywords) {
      const n = norm(k);
      if (!n) continue;
      if (t.includes(` ${n} `)) score += 3 + n.split(" ").length;
      else if (n.length >= 5 && t.includes(n)) score += 2;
    }
    return { faq, score };
  })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score);

  return {
    best: scored[0] && scored[0].score >= 3 ? scored[0].faq : null,
    suggestions: scored.slice(0, 3).map((x) => x.faq),
  };
}

export type SmallTalk = "greet" | "thanks" | "bye" | null;

export function smallTalk(text: string): SmallTalk {
  const t = norm(text);
  if (!t) return null;
  if (/\b(thanks|thank you|thx|shukriya|dhanyavad|dhanyawad|thank u)\b/.test(t)) return "thanks";
  if (/\b(bye|goodbye|alvida|tata)\b/.test(t)) return "bye";
  if (t.split(" ").length <= 4 && /^(hi+|hello+|hey+|hlo|helo|namaste|namaskar|good morning|good afternoon|good evening|hii+)\b/.test(t)) {
    return "greet";
  }
  return null;
}

/** "mesh", "Leo", "सिंह" jaise rashi ke naam pakdo. */
export function findRashi(text: string): Rashi | null {
  const t = ` ${norm(text)} `;
  for (const r of RASHIS) {
    const names = [r.name, r.english].map(norm);
    if (names.some((n) => t.includes(` ${n} `)) || t.includes(r.nameHi)) return r;
  }
  return null;
}

/** "ng-abc123" ya "NGABC123" me se Order ID nikalo. */
export function extractOrderId(text: string): string | null {
  const m = text.toUpperCase().match(/\bNG-?([A-Z0-9]{6})\b/);
  return m ? `NG-${m[1]}` : null;
}