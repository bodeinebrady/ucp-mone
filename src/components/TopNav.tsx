import Link from "next/link";
import { Search } from "lucide-react";

// Docker Hub mark — the exact rounded-square logo used in ucp-dhilaunch.
function DockerMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
      <rect width="32" height="32" rx="6" fill="#1d63ed" />
      <path d="M8 18h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path d="M8 15h2v2H8v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path d="M11 12h2v2h-2v-2zm3 0h2v2h-2v-2zm3 0h2v2h-2v-2z" fill="white" />
      <path
        d="M24 16.5c.5-1.5-.5-3-2-3.5-.5-1.5-2-2-3.5-1.5 0 0-.5-1-2-1-.5 0-1 .2-1.4.5"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

function NavTab({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <button
      className={`flex select-none items-center whitespace-nowrap border-b-2 px-4 text-[15px] transition ${
        active
          ? "border-white font-medium text-white"
          : "border-transparent text-white/70 hover:text-white"
      }`}
    >
      {label}
    </button>
  );
}

/** Exact replica of the ucp-dhilaunch top navigation, shared across screens. */
export function TopNav() {
  return (
    <header className="sticky top-0 z-50 bg-gradient-to-r from-[#1d63ed] to-[#7d2eff] text-white">
      <div className="flex min-h-16 items-center px-8">
        {/* Left — back-to-landing, logo + tabs */}
        <div className="flex h-16 flex-1 items-stretch">
          <Link
            href="/"
            className="mr-6 flex shrink-0 items-center gap-1.5 self-center rounded-md border border-white/25 py-1.5 pl-2.5 pr-3 text-sm font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            <span aria-hidden>←</span> Prototype
          </Link>
          <Link href="/" className="mr-8 flex shrink-0 items-center gap-3">
            <DockerMark />
            <span className="text-[15px] text-white" style={{ fontWeight: 680, letterSpacing: "-0.01em" }}>
              Docker Hub
            </span>
          </Link>
          <NavTab label="Explore" />
          <NavTab label="My Hub" />
        </div>

        {/* Center — search */}
        <div className="mx-6 w-[480px] shrink-0">
          <div className="flex h-9 items-center gap-2 rounded-md border border-white/[0.18] bg-white/[0.12] px-3">
            <Search size={16} className="shrink-0 text-white/50" />
            <input
              type="text"
              placeholder="Search Docker Hub…"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/60 outline-none"
            />
          </div>
        </div>

        {/* Right — auth */}
        <div className="flex flex-1 items-center justify-end gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#1d63ed] text-xs font-bold text-white">
            PT
          </div>
        </div>
      </div>
    </header>
  );
}
