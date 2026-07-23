"use client";

import { useCallback, useMemo, useState } from "react";
import { AppSidebar } from "@/components/AppSidebar";
import { TopNav } from "@/components/TopNav";
import { RepoHeader } from "@/components/RepoHeader";
import { StorageOverview } from "@/components/StorageOverview";
import { SuggestedCleanup } from "@/components/SuggestedCleanup";
import { DigestList } from "@/components/DigestList";
import { DeleteModal, type DeletePlan } from "@/components/DeleteModal";
import { Toast } from "@/components/Toast";
import { Footer } from "@/components/Footer";
import {
  digests as initialDigests,
  suggestedCleanup as initialSuggested,
  categoryOf,
  formatSize,
  ACTIVE_STORAGE_MB,
  STAT_COUNTS,
  STORAGE_TOTAL_MB,
  type Category,
  type Digest,
  type SuggestedItem,
} from "@/lib/data";

type CategoryTotals = Record<Category, number>;

/** The removal to apply when a delete is confirmed — kept separate from the
 *  modal's presentational `DeletePlan`. Metrics/storage are derived, not tracked. */
interface PendingAction {
  removeDigestIds?: string[];
  removeSuggestedId?: string;
  freedMB: number;
}

const uniqueTags = (rows: { tags: string[] }[]) => {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const r of rows) {
    for (const t of r.tags) {
      if (!seen.has(t)) {
        seen.add(t);
        out.push(t);
      }
    }
  }
  return out;
};

export default function Home() {
  const [rows, setRows] = useState<Digest[]>(initialDigests);
  const [suggested, setSuggested] = useState<SuggestedItem[]>(initialSuggested);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [plan, setPlan] = useState<DeletePlan | null>(null);
  const [pending, setPending] = useState<PendingAction | null>(null);
  const [toast, setToast] = useState<React.ReactNode | null>(null);

  // Metrics and storage are derived from the images that actually exist, so any
  // deletion is reflected automatically — deleting every image drives the
  // reclaimable categories to zero. Active images are a fixed, non-deletable base.
  const counts = useMemo<CategoryTotals>(() => {
    const c: CategoryTotals = {
      active: STAT_COUNTS.active,
      ready: suggested.length,
      partial: 0,
    };
    for (const d of rows) c[categoryOf(d)] += 1;
    return c;
  }, [rows, suggested]);

  const storage = useMemo<CategoryTotals>(() => {
    const s: CategoryTotals = { active: ACTIVE_STORAGE_MB, ready: 0, partial: 0 };
    for (const d of rows) s[categoryOf(d)] += d.sizeMB;
    for (const item of suggested) s.ready += item.sizeMB;
    return s;
  }, [rows, suggested]);

  const usedMB = useMemo(
    () => storage.active + storage.ready + storage.partial,
    [storage],
  );

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleAll = useCallback((ids: string[], value: boolean) => {
    setSelected((prev) => {
      const next = new Set(prev);
      for (const id of ids) {
        if (value) next.add(id);
        else next.delete(id);
      }
      return next;
    });
  }, []);

  const closeModal = useCallback(() => {
    setPlan(null);
    setPending(null);
  }, []);

  /** Scenario 3 — build a deletion plan from the current table selection. */
  const confirmFromSelection = useCallback(() => {
    const selectedRows = rows.filter((r) => selected.has(r.id));
    if (selectedRows.length === 0) return;

    const deletionRows = [...selectedRows];
    let referenced: DeletePlan["referenced"];

    // A selected digest referenced by another must drag that dependency along.
    for (const r of selectedRows) {
      if (!r.referencedBy) continue;
      const dep = rows.find(
        (x) => x.digest === r.referencedBy && !deletionRows.some((d) => d.id === x.id),
      );
      if (dep) {
        deletionRows.push(dep);
        referenced = { target: r.digest, by: r.referencedBy };
      }
    }

    const freedMB = deletionRows.reduce((sum, r) => sum + r.sizeMB, 0);

    setPlan({
      variant: deletionRows.length === 1 ? "single" : "multi",
      rows: deletionRows.map((r) => ({
        digest: r.digest,
        tags: r.tags,
        sizeMB: r.sizeMB,
        lastPushed: r.lastPushed,
      })),
      freedMB,
      referenced,
      affectedTags: uniqueTags(deletionRows),
    });
    setPending({ removeDigestIds: deletionRows.map((r) => r.id), freedMB });
  }, [rows, selected]);

  /** Scenario 2 — delete a single suggested-cleanup digest. */
  const confirmFromSuggested = useCallback((item: SuggestedItem) => {
    setPlan({
      variant: "single",
      rows: [
        {
          digest: item.digest,
          tags: [item.tag],
          sizeMB: item.sizeMB,
          lastPushed: item.lastPushed,
        },
      ],
      freedMB: item.sizeMB,
      affectedTags: [item.tag],
    });
    setPending({ removeSuggestedId: item.id, freedMB: item.sizeMB });
  }, []);

  const executeDeletion = useCallback(() => {
    if (!pending) return;
    const { removeDigestIds, removeSuggestedId, freedMB } = pending;

    if (removeSuggestedId) {
      setSuggested((prev) => prev.filter((s) => s.id !== removeSuggestedId));
    }
    if (removeDigestIds) {
      const idSet = new Set(removeDigestIds);
      setRows((prev) => prev.filter((r) => !idSet.has(r.id)));
      setSelected(new Set());
    }

    closeModal();
    setToast(
      <>
        Deletion confirmed: removed successfully,{" "}
        <strong className="font-medium text-ink">{formatSize(freedMB)} freed</strong>.
      </>,
    );
  }, [pending, closeModal]);

  return (
    <div className="flex min-h-full flex-col bg-white">
      <TopNav />
      <div className="flex flex-1">
        <AppSidebar active="Repositories" />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1180px] px-8 pb-4">
            <RepoHeader />
            <StorageOverview
              usedMB={usedMB}
              totalMB={STORAGE_TOTAL_MB}
              counts={counts}
              storage={storage}
            />
            <SuggestedCleanup items={suggested} onDelete={confirmFromSuggested} />
            <DigestList
              digests={rows}
              selected={selected}
              onToggle={toggle}
              onToggleAll={toggleAll}
              onConfirmDelete={confirmFromSelection}
            />
            <Footer />
          </div>
        </main>
      </div>

      <DeleteModal plan={plan} onCancel={closeModal} onConfirm={executeDeletion} />
      {toast && <Toast message={toast} onDismiss={() => setToast(null)} />}
    </div>
  );
}
