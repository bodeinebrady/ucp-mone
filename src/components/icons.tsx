/**
 * Icon layer aligned with ucp-dhilaunch: lucide-react is the icon library.
 * We re-export lucide glyphs under the names the app already uses, so the
 * component code stays stable while the visual language matches the DS.
 */
export {
  Search as SearchIcon,
  CircleHelp as HelpIcon,
  Sun as SunIcon,
  LayoutGrid as GridIcon,
  Trash2 as TrashIcon,
  ChevronDown as ChevronDownIcon,
  ArrowUp as ArrowUpIcon,
  Check as CheckIcon,
  Lock as LockIcon,
  Plus as PlusIcon,
  // Left sidebar glyphs
  List as RepoGlyph,
  PieChart as PieGlyph,
  LineChart as ChartGlyph,
  Users as UsersGlyph,
  User as UserGlyph,
  CreditCard as CardGlyph,
  Settings as GearGlyph,
  Layers as StackGlyph,
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

/** Docker whale + containers logo, simplified. */
export function DockerLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 48 34" fill="currentColor" width={38} height={27} {...props}>
      <path d="M27.5 12.9h4.7v-4.3h-4.7zm-5.7 0h4.7v-4.3h-4.7zm-5.6 0h4.6v-4.3h-4.6zm-5.7 0h4.7v-4.3h-4.7zm11.3-5.2h4.7V3.4h-4.7zm-5.6 0h4.6V3.4h-4.6zm5.6 10.5h4.7v-4.3h-4.7zm26.8-6.6c-1.2-.8-3.9-1.1-6-.7-.3-2-1.4-3.7-3.4-5.3l-1.1-.8-.8 1.2c-1 1.6-1.3 4.2-.4 6 .4.8.9 1.4 1.6 1.9-.5.3-1.5.7-2.9.7H.7l-.1.6c-.4 2.6.1 5.9 2 8.5 1.9 2.5 4.8 3.8 8.6 3.8 8.2 0 14.3-3.8 17.1-10.7 1.1 0 3.6 0 4.9-2.5.1-.1.3-.6.9-1.6l.3-.5z" />
    </svg>
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
