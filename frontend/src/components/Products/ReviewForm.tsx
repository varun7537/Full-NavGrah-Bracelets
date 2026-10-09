"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { submitReview } from "../../lib/productApi";

export default function ReviewForm({ productId }: { productId: string }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  const submit = async () => {
    if (name.trim().length < 2 || text.trim().length < 10) {
      setStatus("error");
      setMessage("Please enter your name and a review of at least 10 characters.");
      return;
    }
    setStatus("loading");
    try {
      setMessage(await submitReview(productId, { name: name.trim(), rating, text: text.trim() }));
      setStatus("done");
    } catch (e) {
      setStatus("error");
      setMessage(e instanceof Error ? e.message : "Something went wrong");
    }
  };

  if (status === "done") {
    return <p className="mt-4 rounded-xl bg-[#EAF2EC] p-3.5 text-sm text-[#3F6B52]">{message}</p>;
  }

  return (
    <div className="mt-4 space-y-3 rounded-2xl border border-[#EDE4D2] bg-[#FAF6EC] p-4">
      <div className="flex items-center gap-1" role="radiogroup" aria-label="Your rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
            <Star
              size={22}
              strokeWidth={1}
              className={n <= rating ? "fill-[#B4893C] text-[#B4893C]" : "fill-[#E9E1D2] text-[#E9E1D2]"}
            />
          </button>
        ))}
      </div>
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your name"
        maxLength={60}
        className="w-full rounded-xl border border-[#DED2B4] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#B4893C]"
      />
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Share your experience"
        rows={3}
        maxLength={1000}
        className="w-full rounded-xl border border-[#DED2B4] bg-white px-3.5 py-2.5 text-sm outline-none focus:border-[#B4893C]"
      />
      {status === "error" && <p className="text-xs text-[#A3462F]">{message}</p>}
      <button
        type="button"
        onClick={submit}
        disabled={status === "loading"}
        className="rounded-xl bg-[#241F1A] px-5 py-2.5 text-sm font-semibold text-[#F6EFDF] disabled:opacity-60"
      >
        {status === "loading" ? "Submitting…" : "Submit review"}
      </button>
    </div>
  );
}