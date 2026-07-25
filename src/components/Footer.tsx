const links = [
  "Terms of Service",
  "Subscription Service Agreement",
  "Cookie Settings",
  "Privacy",
  "Legal",
];

function Social({ label, path }: { label: string; path: string }) {
  return (
    <a
      href="#"
      aria-label={label}
      className="flex h-8 w-8 items-center justify-center rounded-full text-muted transition hover:text-ink"
    >
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
        <path d={path} />
      </svg>
    </a>
  );
}

const socials = [
  { label: "Facebook", path: "M13.5 21v-7h2.3l.4-2.8h-2.7V9.4c0-.8.2-1.4 1.4-1.4h1.4V5.6C16.4 5.5 15.6 5.4 14.6 5.4c-2 0-3.4 1.2-3.4 3.5v1.9H8.8V13.6h2.4V21z" },
  { label: "X", path: "M18.3 3H21l-6.6 7.6L22 21h-6.1l-4.8-6.3L5.6 21H3l7-8.1L2.3 3h6.2l4.3 5.7zM17.2 19.4h1.5L7.3 4.5H5.7z" },
  { label: "YouTube", path: "M22 8.2a2.6 2.6 0 0 0-1.8-1.8C18.6 6 12 6 12 6s-6.6 0-8.2.4A2.6 2.6 0 0 0 2 8.2 27 27 0 0 0 1.6 12 27 27 0 0 0 2 15.8a2.6 2.6 0 0 0 1.8 1.8C5.4 18 12 18 12 18s6.6 0 8.2-.4a2.6 2.6 0 0 0 1.8-1.8A27 27 0 0 0 22.4 12 27 27 0 0 0 22 8.2zM10 14.7V9.3l4.7 2.7z" },
  { label: "LinkedIn", path: "M6.9 8.5H4V20h2.9zM5.4 4a1.7 1.7 0 1 0 0 3.4 1.7 1.7 0 0 0 0-3.4zM20 20v-6.3c0-3.3-1.8-4.9-4.1-4.9a3.6 3.6 0 0 0-3.2 1.8V8.5H9.8V20h2.9v-6c0-1.6.3-3.1 2.3-3.1s2 1.8 2 3.2V20z" },
  { label: "Instagram", path: "M12 4.6c2.4 0 2.7 0 3.6.1 2.5.1 3.6 1.3 3.7 3.7 0 .9.1 1.2.1 3.6s0 2.7-.1 3.6c-.1 2.4-1.2 3.6-3.7 3.7-.9 0-1.2.1-3.6.1s-2.7 0-3.6-.1c-2.5-.1-3.6-1.3-3.7-3.7 0-.9-.1-1.2-.1-3.6s0-2.7.1-3.6C4.8 6 5.9 4.8 8.4 4.7c.9 0 1.2-.1 3.6-.1zM12 8.6a3.4 3.4 0 1 0 0 6.8 3.4 3.4 0 0 0 0-6.8zm0 5.6a2.2 2.2 0 1 1 0-4.4 2.2 2.2 0 0 1 0 4.4zm3.5-6.4a.8.8 0 1 0 0 1.6.8.8 0 0 0 0-1.6z" },
];

export function Footer() {
  return (
    <footer className="mt-16 flex flex-wrap items-center justify-between gap-4 border-t border-hairline py-6 text-xs text-muted">
      <div className="flex flex-wrap items-center gap-4">
        <span>© 2023 Docker Inc. All rights reserved.</span>
        {links.map((l) => (
          <a key={l} href="#" className="transition hover:text-ink">
            {l}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-1">
        {socials.map((s) => (
          <Social key={s.label} label={s.label} path={s.path} />
        ))}
      </div>
    </footer>
  );
}
