// const API = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";
const API = process.env.NEXT_PUBLIC_API_URL ?? "https://navgrah-bracelets-api.vercel.app";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  pincode: string;
  createdAt: string;
}

export class AuthError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function call<T>(path: string, init: RequestInit = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API}${path}`, {
      ...init,
      credentials: "include", // cookie bhejne/lene ke liye
      cache: "no-store",
      headers: { "Content-Type": "application/json", ...(init.headers ?? {}) },
    });
  } catch {
    throw new AuthError("Network error. Please check your connection.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new AuthError(data.message || "Something went wrong.", res.status);
  return data as T;
}

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    return (await call<{ user: AuthUser }>("/auth/me")).user;
  } catch {
    return null; // login nahi hai (ya backend band)
  }
}

export const sendOtp = (name: string, phone: string) =>
  call<{ ok: true; resendIn: number }>("/auth/send-otp", {
    method: "POST",
    body: JSON.stringify({ name, phone }),
  });

export async function verifyOtp(input: { name: string; phone: string; otp: string }): Promise<AuthUser> {
  const data = await call<{ user: AuthUser }>("/auth/verify-otp", {
    method: "POST",
    body: JSON.stringify(input),
  });
  return data.user;
}

export const logoutApi = () => call<{ ok: true }>("/auth/logout", { method: "POST" });

export async function updateProfile(
  patch: Partial<Pick<AuthUser, "name" | "email" | "address" | "pincode">>
): Promise<AuthUser> {
  const data = await call<{ user: AuthUser }>("/auth/me", { method: "PATCH", body: JSON.stringify(patch) });
  return data.user;
}
