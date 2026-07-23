import { LockIcon, PlusIcon, VerifiedBadge } from "./icons";

const TABS = [
  "General",
  "Tags",
  "Image management",
  "Builds",
  "Collaborators",
  "Settings",
] as const;

export function RepoHeader() {
  return (
    <div className="pt-6">
      {/* Breadcrumb */}
      <nav className="mb-4 flex items-center gap-2 text-sm">
        <a href="#" className="font-medium text-docker-blue hover:underline">
          Repositories
        </a>
        <span className="text-muted">/</span>
        <span className="text-body">docker / hub-ui</span>
      </nav>

      <div className="flex items-start justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-[26px] font-medium leading-tight text-ink">
              docker / hub-ui
            </h1>
            <LockIcon className="h-4 w-4 text-muted" />
          </div>

          <div className="mt-1.5 flex items-center gap-2 text-sm">
            <a href="#" className="flex items-center gap-1 font-medium text-docker-blue hover:underline">
              Docker
              <VerifiedBadge />
            </a>
            <span className="text-muted">·</span>
            <span className="text-body">Created: 12 months ago</span>
          </div>

          <p className="mt-3 text-sm text-body">Hub frontend image, formerly mercury-ui</p>

          <button className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-body transition hover:text-ink">
            Add category
            <PlusIcon className="h-4 w-4" />
          </button>
        </div>

        <button className="inline-flex shrink-0 items-center rounded-md bg-docker-blue px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-docker-blue-dark">
          Push a new tag
        </button>
      </div>

      {/* Tabs */}
      <div className="mt-6 border-b border-hairline">
        <nav className="flex gap-7">
          {TABS.map((tab) => {
            const active = tab === "Image management";
            return (
              <button
                key={tab}
                className={`relative -mb-px pb-3 text-sm transition ${
                  active
                    ? "font-medium text-ink"
                    : "text-body hover:text-ink"
                }`}
              >
                {tab}
                {active && (
                  <span className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-docker-blue" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
