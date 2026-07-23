export function TagChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded bg-canvas px-1.5 py-0.5 font-mono text-xs text-body ring-1 ring-inset ring-hairline">
      {children}
    </span>
  );
}
