import Link from "next/link";
import {
  Activity,
  ChartLine,
  CreditCard,
  Layers,
  List,
  Settings,
  Store,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

interface RailItem {
  key: string;
  label: string;
  icon: LucideIcon;
  href?: string;
}

const items: RailItem[] = [
  { key: "Repositories", label: "Repositories", icon: List, href: "/image-management" },
  { key: "Usage", label: "Usage", icon: Activity, href: "/usage/pulls" },
  { key: "Insights", label: "Insights & analytics", icon: ChartLine },
  { key: "Teams", label: "Teams", icon: Users },
  { key: "Members", label: "Members", icon: User },
  { key: "Billing", label: "Billing", icon: CreditCard },
  { key: "Settings", label: "Organization settings", icon: Settings },
  { key: "Marketplace", label: "Marketplace", icon: Store },
];

/**
 * Collapsed icon rail, shared by every screen. `active` highlights the current
 * section; Repositories → "/image-management" and Usage → "/usage/pulls" are
 * wired for click-through navigation between the prototypes.
 */
export function AppSidebar({ active }: { active?: string }) {
  return (
    <aside className="flex w-[68px] shrink-0 flex-col items-center gap-1 border-r border-hairline bg-white py-4">
      <Link
        href="/"
        aria-label="Docker"
        className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-sidebar-active text-white"
      >
        <Layers className="h-5 w-5" />
      </Link>

      {items.map(({ key, label, icon: Icon, href }) => {
        const isActive = key === active;
        const className = `flex h-10 w-10 items-center justify-center rounded-lg transition ${
          isActive
            ? "bg-docker-blue/10 text-docker-blue"
            : "text-muted hover:bg-canvas hover:text-ink"
        }`;
        return href ? (
          <Link key={key} href={href} title={label} aria-label={label} className={className}>
            <Icon className="h-5 w-5" />
          </Link>
        ) : (
          <button key={key} title={label} aria-label={label} className={className}>
            <Icon className="h-5 w-5" />
          </button>
        );
      })}
    </aside>
  );
}
