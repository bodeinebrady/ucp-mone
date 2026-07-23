import { useEffect } from "react";

interface Props {
  message: React.ReactNode;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: Props) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 5000);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div className="pointer-events-none fixed bottom-6 right-6 z-50 flex justify-end">
      <div className="pointer-events-auto flex max-w-sm items-start gap-3 rounded-lg border border-hairline bg-white p-4 shadow-lg animate-[toastIn_180ms_ease-out]">
        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-ready/15 text-ready">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none">
            <path
              d="m5 12 4 4L19 7"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <p className="text-sm text-body">{message}</p>
      </div>
    </div>
  );
}
