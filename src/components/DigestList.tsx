import { useMemo, useState } from "react";
import { ArrowUpIcon, ChevronDownIcon, Dot, SearchIcon } from "./icons";
import { TagChip } from "./TagChip";
import { formatSize, statusLabel, type Digest } from "@/lib/data";

interface Props {
  digests: Digest[];
  selected: Set<string>;
  onToggle: (id: string) => void;
  onToggleAll: (ids: string[], value: boolean) => void;
  onConfirmDelete: () => void;
}

type StatusFilter = "all" | "ready" | "shared";

function Checkbox({
  checked,
  indeterminate = false,
  onChange,
  label,
}: {
  checked: boolean;
  indeterminate?: boolean;
  onChange: () => void;
  label: string;
}) {
  return (
    <button
      role="checkbox"
      aria-checked={indeterminate ? "mixed" : checked}
      aria-label={label}
      onClick={onChange}
      className={`flex h-[18px] w-[18px] items-center justify-center rounded border transition ${
        checked || indeterminate
          ? "border-docker-blue bg-docker-blue text-white"
          : "border-[#c3c8d0] bg-white hover:border-docker-blue"
      }`}
    >
      {indeterminate ? (
        <span className="h-0.5 w-2.5 rounded bg-white" />
      ) : checked ? (
        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
          <path
            d="m5 12 4 4L19 7"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ) : null}
    </button>
  );
}

const columns = [
  { label: "Digest", className: "w-[150px]" },
  { label: "Tags", className: "w-[190px]" },
  { label: "Manifest type", className: "w-[120px]" },
  { label: "OS/ARCH", className: "w-[110px]" },
  { label: "Size", className: "w-[80px]" },
  { label: "Last pushed", className: "w-[120px]", sortable: true },
  { label: "Last pulled", className: "w-[120px]", sortable: true },
  { label: "Status", className: "w-[160px]" },
];

export function DigestList({
  digests,
  selected,
  onToggle,
  onToggleAll,
  onConfirmDelete,
}: Props) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");

  const filtered = useMemo(() => {
    return digests.filter((d) => {
      if (status !== "all" && d.status !== status) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        const hay = `${d.digest} ${d.tags.join(" ")} ${d.osArch}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [digests, status, query]);

  const filteredIds = filtered.map((d) => d.id);
  const selectedInView = filteredIds.filter((id) => selected.has(id)).length;
  const allSelected = filteredIds.length > 0 && selectedInView === filteredIds.length;
  const someSelected = selectedInView > 0 && !allSelected;
  const hasSelection = selected.size > 0;

  return (
    <section className="mt-10">
      <h2 className="text-base font-medium text-ink">Digest list</h2>

      {/* Toolbar */}
      <div className="mt-3 flex items-center gap-3">
        <label className="relative flex h-10 flex-1 items-center">
          <SearchIcon className="pointer-events-none absolute left-3 h-[18px] w-[18px] text-muted" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder=""
            aria-label="Search digests"
            className="h-full w-full rounded-md border border-hairline bg-white pl-10 pr-14 text-sm text-ink focus:border-docker-blue focus:outline-none focus:ring-1 focus:ring-docker-blue"
          />
          <kbd className="pointer-events-none absolute right-3 rounded border border-hairline bg-canvas px-1.5 py-0.5 font-mono text-[11px] text-muted">
            ⌘K
          </kbd>
        </label>

        <div className="relative">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value as StatusFilter)}
            className="h-10 w-52 appearance-none rounded-md border border-hairline bg-white pl-3.5 pr-9 text-sm text-body focus:border-docker-blue focus:outline-none"
          >
            <option value="all">Filter by status...</option>
            <option value="ready">Ready for deletion</option>
            <option value="shared">Shared layers</option>
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
        </div>

        <button
          onClick={onConfirmDelete}
          disabled={!hasSelection}
          className={`h-10 shrink-0 rounded-md border px-4 text-sm font-medium transition ${
            hasSelection
              ? "border-danger text-danger hover:bg-danger/5"
              : "cursor-not-allowed border-hairline bg-canvas text-muted"
          }`}
        >
          Confirm and delete
        </button>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-hairline text-left text-xs font-medium text-muted">
              <th className="w-10 py-3 pl-1">
                <Checkbox
                  checked={allSelected}
                  indeterminate={someSelected}
                  onChange={() => onToggleAll(filteredIds, !allSelected)}
                  label="Select all digests"
                />
              </th>
              {columns.map((col) => (
                <th key={col.label} className={`py-3 pr-4 font-medium ${col.className}`}>
                  <span className="inline-flex items-center gap-1">
                    {col.label}
                    {col.sortable && <ArrowUpIcon className="h-3.5 w-3.5 text-muted" />}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((d) => {
              const isSelected = selected.has(d.id);
              return (
                <tr
                  key={d.id}
                  className={`border-b border-hairline align-middle transition ${
                    isSelected ? "bg-docker-blue/[0.04]" : "hover:bg-canvas"
                  }`}
                >
                  <td className="py-3.5 pl-1">
                    <Checkbox
                      checked={isSelected}
                      onChange={() => onToggle(d.id)}
                      label={`Select ${d.digest}`}
                    />
                  </td>
                  <td className="py-3.5 pr-4 font-mono text-[13px] text-ink">{d.digest}</td>
                  <td className="py-3.5 pr-4">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {d.tags.map((t) => (
                        <TagChip key={t}>{t}</TagChip>
                      ))}
                      {d.extraTags ? (
                        <span className="text-xs text-muted">+{d.extraTags} more</span>
                      ) : null}
                    </div>
                  </td>
                  <td className="py-3.5 pr-4 text-body">{d.manifestType}</td>
                  <td className="py-3.5 pr-4 text-body">{d.osArch}</td>
                  <td className="py-3.5 pr-4 text-body">{formatSize(d.sizeMB)}</td>
                  <td className="py-3.5 pr-4 text-body">{d.lastPushed}</td>
                  <td className="py-3.5 pr-4 text-body">{d.lastPulled}</td>
                  <td className="py-3.5 pr-4">
                    <span className="inline-flex items-center gap-2">
                      <Dot className={d.status === "ready" ? "bg-ready" : "bg-partial"} />
                      <span className="text-body">{statusLabel(d)}</span>
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-sm text-muted">
                  No digests match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
