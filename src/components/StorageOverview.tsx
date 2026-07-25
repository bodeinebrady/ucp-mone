import { Dot } from "./icons";
import { formatSize, type Category } from "@/lib/data";

interface Props {
  usedMB: number;
  totalMB: number;
  counts: Record<Category, number>;
  storage: Record<Category, number>;
}

const stats: { key: Category; label: string; dot: string }[] = [
  { key: "active", label: "Active images", dot: "bg-docker-blue" },
  { key: "ready", label: "Ready for deletion", dot: "bg-ready" },
  { key: "partial", label: "Partial storage reclaim", dot: "bg-partial" },
];

const segmentColor: Record<Category, string> = {
  active: "bg-docker-blue",
  ready: "bg-ready",
  partial: "bg-partial",
};

export function StorageOverview({ usedMB, totalMB, counts, storage }: Props) {
  const over = usedMB > totalMB;

  // Segments are sized by each category's storage. When over quota, normalise to
  // the used total so the colored bar fills 100%; otherwise leave free space.
  const denom = over ? usedMB : totalMB;

  return (
    <section className="mt-6">
      <div className="flex flex-wrap gap-x-14 gap-y-5">
        {/* Storage — first, styled the same as the metric cards */}
        <div>
          <div className="flex items-center gap-2">
            <Dot className="bg-ink" />
            <span className="text-sm text-body">Storage</span>
          </div>
          <div
            className={`mt-1.5 text-3xl font-medium leading-none ${
              over ? "text-danger" : "text-ink"
            }`}
          >
            {formatSize(usedMB)}
          </div>
          <div className="mt-1 text-xs text-muted">of {formatSize(totalMB)}</div>
        </div>

        {stats.map((s) => (
          <div key={s.key}>
            <div className="flex items-center gap-2">
              <Dot className={s.dot} />
              <span className="text-sm text-body">{s.label}</span>
            </div>
            <div className="mt-1.5 text-3xl font-medium leading-none text-ink">
              {counts[s.key].toLocaleString()}
            </div>
            <div className="mt-1 text-xs text-muted">
              {formatSize(storage[s.key])}
              {s.key !== "active" ? " reclaimable" : " in use"}
            </div>
          </div>
        ))}
      </div>

      {/* Segmented storage bar */}
      <div
        className={`mt-4 flex h-7 w-full overflow-hidden rounded-md bg-hairline ${
          over ? "ring-1 ring-danger/40" : ""
        }`}
        role="img"
        aria-label={`Storage: ${formatSize(usedMB)} of ${formatSize(totalMB)} used`}
      >
        {stats.map((s) => {
          const width = (storage[s.key] / denom) * 100;
          if (width <= 0) return null;
          const label = s.key === "active" ? "Active" : s.label;
          return (
            <div
              key={s.key}
              className={`flex items-center justify-center overflow-hidden whitespace-nowrap text-xs font-medium text-white ${segmentColor[s.key]}`}
              style={{ width: `${width}%` }}
              title={`${label} — ${formatSize(storage[s.key])}`}
            >
              {width > 14 && (
                <span className="truncate px-2">
                  {label} — {formatSize(storage[s.key])}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
