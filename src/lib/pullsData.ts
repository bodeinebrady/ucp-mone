// Deterministic sample data for the Usage → Pulls dashboard. A seeded PRNG keeps
// the generated series stable between server and client render (no hydration
// mismatch) while still looking organic.

function mulberry32(seed: number) {
  return () => {
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const DAYS = 31;

/** X-axis tick labels shown under the time-series charts. */
export const X_TICKS = [
  { at: 0, label: "MAY 1" },
  { at: 7, label: "MAY 8" },
  { at: 14, label: "MAY 15" },
  { at: 20, label: "MAY 21" },
  { at: 30, label: "MAY 31" },
];

export interface Series {
  label: string;
  color: string;
  points: number[];
}

/** A smooth-ish walking series bounded to [min, max], centred near `base`. */
function walk(seed: number, base: number, spread: number, min: number, max: number): number[] {
  const rand = mulberry32(seed);
  let v = base;
  const out: number[] = [];
  for (let i = 0; i < DAYS; i++) {
    v += (rand() - 0.5) * spread;
    v = Math.max(min, Math.min(max, v));
    out.push(Math.round(v));
  }
  return out;
}

// ── "Pulls over time" — stacked bars (pulls + version checks) ────────────────
export const barData: { pulls: number; checks: number }[] = (() => {
  const pulls = walk(11, 330_000, 60_000, 300_000, 380_000);
  const checks = walk(22, 40_000, 30_000, 20_000, 70_000);
  return pulls.map((p, i) => ({ pulls: p, checks: checks[i] }));
})();

export const barMaxY = 500_000;
export const barYTicks = [0, 150_000, 300_000, 400_000, 500_000];

// ── "Top repositories by pulls" — multi-line ─────────────────────────────────
// All series stay comfortably under lineMaxY so lines never clip above the plot.
export const repoSeries: Series[] = [
  { label: "docker/db-migrate", color: "#1d63ed", points: walk(101, 280_000, 140_000, 120_000, 440_000) },
  { label: "docker/audit-logs", color: "#e5484d", points: walk(102, 360_000, 120_000, 240_000, 455_000) },
  { label: "docker/accounts-api", color: "#8b5cf6", points: walk(103, 200_000, 120_000, 80_000, 320_000) },
  { label: "docker/accounts-api-thisi...", color: "#e8883a", points: walk(104, 330_000, 150_000, 200_000, 450_000) },
  { label: "docker/admin-insights-lo...", color: "#14b8a6", points: walk(105, 95_000, 55_000, 45_000, 155_000) },
];

// ── "Top users by pulls" — multi-line ────────────────────────────────────────
export const userSeries: Series[] = [
  { label: "Dan Gillick", color: "#1d63ed", points: walk(201, 350_000, 150_000, 200_000, 450_000) },
  { label: "Todd Flanders", color: "#0e9f6e", points: walk(202, 360_000, 120_000, 240_000, 450_000) },
  { label: "Len Loenard", color: "#ec4899", points: walk(203, 260_000, 170_000, 120_000, 440_000) },
  { label: "Herb Powell", color: "#b45309", points: walk(204, 180_000, 110_000, 110_000, 310_000) },
  { label: "Nelson Muntz", color: "#7c3aed", points: walk(205, 240_000, 160_000, 110_000, 410_000) },
];

export const lineMaxY = 500_000;
export const lineYTicks = [0, 150_000, 300_000, 450_000];

// ── Daily-average sparklines ─────────────────────────────────────────────────
export const avgDailyPulls = walk(301, 2500, 900, 1600, 3400);
export const avgDailyVersionChecks = walk(302, 1000, 500, 500, 1500);

// ── KPI strip ────────────────────────────────────────────────────────────────
export const kpis = {
  plan: "Personal",
  monthlyPullLimit: 500_000,
  resetsInDays: 10,
  additionalPulls: 0,
  monthlyPullsRemaining: 100_000,
  overages: "$0.00",
  totalPulls: "500k",
  versionChecks: "150k",
  avgDailyPulls: "2,500",
  avgDailyVersionChecks: "1,000",
  datespan: "05/01/2024 09:00 AM - 05/31/2024 09:00 AM",
};

/** Compact number formatting for axis labels, e.g. 300000 → "300k". */
export function short(n: number): string {
  if (n >= 1_000_000) return `${+(n / 1_000_000).toFixed(1)}m`;
  if (n >= 1000) return `${Math.round(n / 1000)}k`;
  return `${n}`;
}

/** Full number with thousands separators for tooltips, e.g. 312500 → "312,500". */
export const full = (n: number) => n.toLocaleString();

/** Day index (0-based) → "May 1" style label for tooltips. */
export const dayLabel = (i: number) => `May ${i + 1}`;
