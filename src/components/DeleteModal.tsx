import { useEffect } from "react";
import { TagChip } from "./TagChip";
import { formatSize } from "@/lib/data";

export interface DeleteRow {
  digest: string;
  tags: string[];
  sizeMB: number;
  lastPushed: string;
}

export interface DeletePlan {
  variant: "single" | "multi";
  rows: DeleteRow[];
  freedMB: number;
  /** Present when a selected digest is referenced by another that must also go. */
  referenced?: { target: string; by: string };
  /** All tags that will be removed, shown as chips in the summary line. */
  affectedTags: string[];
}

interface Props {
  plan: DeletePlan | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteModal({ plan, onCancel, onConfirm }: Props) {
  useEffect(() => {
    if (!plan) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Enter") onConfirm();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [plan, onCancel, onConfirm]);

  if (!plan) return null;

  const freed = formatSize(plan.freedMB);

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-ink/40 px-4 py-10"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-3xl animate-[modalIn_140ms_ease-out] rounded-xl bg-white p-7 shadow-2xl"
      >
        <h2 id="delete-title" className="text-xl font-medium text-ink">
          Delete digest?
        </h2>

        <div className="mt-3 space-y-3 text-sm leading-relaxed text-body">
          {plan.variant === "single" ? (
            <p className="flex flex-wrap items-center gap-1.5">
              This digest does not reference any other digests and frees an
              estimated <strong className="font-medium text-ink">{freed}</strong>{" "}
              of storage.
              {plan.affectedTags.length > 0 && (
                <>
                  The
                  {plan.affectedTags.map((t) => (
                    <span key={t} className="align-middle">
                      <TagChip>{t}</TagChip>
                    </span>
                  ))}
                  tag{plan.affectedTags.length > 1 ? "s" : ""} will also be deleted.
                </>
              )}
            </p>
          ) : (
            <>
              <p>
                This frees an estimated{" "}
                <strong className="font-medium text-ink">{freed}</strong> of storage.
              </p>
              {plan.referenced && (
                <p>
                  Note that digest{" "}
                  <strong className="font-medium text-ink">
                    {plan.referenced.target}
                  </strong>{" "}
                  is referenced by digest,{" "}
                  <strong className="font-medium text-ink">
                    {plan.referenced.by}
                  </strong>
                  . To fully remove{" "}
                  <strong className="font-medium text-ink">
                    {plan.referenced.target}
                  </strong>
                  ,{" "}
                  <strong className="font-medium text-ink">
                    {plan.referenced.by}
                  </strong>{" "}
                  must also be deleted.
                </p>
              )}
              {plan.affectedTags.length > 0 && (
                <p className="flex flex-wrap items-center gap-1.5">
                  Deleting these digests automatically deletes all associated tags,
                  including
                  {plan.affectedTags.map((t) => (
                    <span key={t} className="align-middle">
                      <TagChip>{t}</TagChip>
                    </span>
                  ))}
                  .
                </p>
              )}
            </>
          )}
        </div>

        {/* Affected digests table */}
        <div className="mt-5 border-t border-hairline">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="text-left text-xs font-medium text-muted">
                <th className="py-3 pr-4 font-medium">Digest</th>
                <th className="py-3 pr-4 font-medium">Tags</th>
                <th className="py-3 pr-4 font-medium">Size</th>
                <th className="py-3 pr-4 font-medium">Last pushed</th>
                <th className="py-3 font-medium">Storage impact</th>
              </tr>
            </thead>
            <tbody>
              {plan.rows.map((row, i) => (
                <tr key={`${row.digest}-${i}`} className="border-t border-hairline">
                  <td className="py-3 pr-4 font-mono text-[13px] text-ink">
                    {row.digest}
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex flex-wrap gap-1.5">
                      {row.tags.map((t) => (
                        <TagChip key={t}>{t}</TagChip>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-body">
                    {row.sizeMB >= 1024
                      ? `${(row.sizeMB / 1024).toFixed(1)} GB`
                      : `${row.sizeMB} MB`}
                  </td>
                  <td className="py-3 pr-4 text-body">{row.lastPushed}</td>
                  <td className="py-3 text-body">Full storage reclaim</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-docker-blue px-5 py-2 text-sm font-medium text-docker-blue transition hover:bg-docker-blue/5"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-danger px-5 py-2 text-sm font-medium text-white transition hover:bg-danger-dark"
          >
            Delete forever
          </button>
        </div>
      </div>
    </div>
  );
}
