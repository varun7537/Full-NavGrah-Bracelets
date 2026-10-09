// const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const API = process.env.NEXT_PUBLIC_API_URL ?? "https://navgrah-bracelets-api.vercel.app";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function sendChat(messages: ChatMessage[]): Promise<string> {
  let res: Response;
  try {
    res = await fetch(`${API}/chat`, {
      method: "POST",
      credentials: "include", // login ho to bot aapke orders dekh sake
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages }),
    });
  } catch {
    throw new Error("Network error. Please check your connection.");
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Something went wrong.");
  return data.reply as string;
}
