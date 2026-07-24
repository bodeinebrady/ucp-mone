import { Dot, TrashIcon } from "./icons";
import { TagChip } from "./TagChip";
import { formatSize, type SuggestedItem } from "@/lib/data";

interface Props {
  items: SuggestedItem[];
  onDelete: (item: SuggestedItem) => void;
}

export function SuggestedCleanup({ items, onDelete }: Props) {
  if (items.length === 0) return null;

  return (
    <section className="mt-8">
      <h2 className="text-base font-medium text-ink">Suggested cleanup</h2>

      <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-col rounded-lg border border-hairline bg-white transition hover:border-docker-blue/40 hover:shadow-sm"
          >
            <div className="flex-1 p-4">
              <div className="flex items-center gap-2">
                <Dot className="bg-ready" />
                <span className="font-mono text-sm text-ink">{item.digest}</span>
              </div>
              <p className="mt-2 text-xs text-muted">
                Image · {formatSize(item.sizeMB)} · Last Pushed {item.lastPushed}
              </p>
            </div>
            <div className="flex items-center justify-between border-t border-hairline px-3 py-2">
              <TagChip>{item.tag}</TagChip>
              <button
                onClick={() => onDelete(item)}
                aria-label={`Delete ${item.digest}`}
                className="rounded-md p-1.5 text-muted transition hover:bg-danger/10 hover:text-danger"
              >
                <TrashIcon className="h-[18px] w-[18px]" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
