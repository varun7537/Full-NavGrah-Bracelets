"use client";

import Link from "next/link";
import { useAuth } from "./AuthContext";

export default function UserMenu({ className = "" }: { className?: string }) {
  const { user, isReady, openLogin } = useAuth();

  if (!isReady) return <span className={`inline-block h-9 w-16 ${className}`} aria-hidden="true" />;

  if (!user) {
    return (
      <button
        type="button"
        onClick={() => openLogin({ message: "Login to track your orders and checkout faster." })}
        className={`rounded-full border border-[#e7dfd5] px-4 py-2 text-sm font-medium text-[#241c16] transition hover:border-[#a47735] ${className}`}
      >
        Login
      </button>
    );
  }

  return (
    <Link
      href="/profile"
      className={`flex items-center gap-2 rounded-full border border-[#e7dfd5] py-1 pl-1 pr-3 text-sm font-medium text-[#241c16] transition hover:border-[#a47735] ${className}`}
    >
      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#a47735] text-xs font-semibold text-white">
        {user.name.charAt(0).toUpperCase()}
      </span>
      <span className="hidden max-w-[90px] truncate sm:inline">{user.name.split(" ")[0]}</span>
    </Link>
  );
}