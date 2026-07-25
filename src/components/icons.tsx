/**
 * Icon layer aligned with ucp-dhilaunch: lucide-react is the icon library.
 * We re-export lucide glyphs under the names the app already uses, so the
 * component code stays stable while the visual language matches the DS.
 */
export {
  Search as SearchIcon,
  Trash2 as TrashIcon,
  ChevronDown as ChevronDownIcon,
  ArrowUp as ArrowUpIcon,
  Lock as LockIcon,
  Plus as PlusIcon,
} from "lucide-react";

/** Small filled dot used for status indicators and stat legends. */
export function Dot({ className = "" }: { className?: string }) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 shrink-0 rounded-full ${className}`}
      aria-hidden
    />
  );
}

/** Blue verified checkmark badge (publisher). */
export function VerifiedBadge(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="none" {...props}>
      <path
        d="M12 2.5l2.2 1.6 2.7-.2 1 2.5 2.3 1.4-.6 2.6.9 2.6-2.1 1.7-.4 2.7-2.7.4L13 24l-2.6-1.5-2.7-.4-.4-2.7-2.1-1.7.9-2.6-.6-2.6 2.3-1.4 1-2.5 2.7.2z"
        fill="#1d63ed"
      />
      <path
        d="m8.5 12 2.3 2.3 4.7-4.6"
        stroke="#fff"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
