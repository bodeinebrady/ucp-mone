"use client";

import { useRef, useState } from "react";
import { DAYS, dayLabel, full, short, X_TICKS, type Series } from "@/lib/pullsData";

// Shared plot geometry. Width is fixed; height is per-chart so a chart can grow
// to fill a taller card. Everything is expressed in viewBox units.
const W = 920;
const PAD = { l: 48, r: 14, t: 12, b: 28 };
const plotW = W - PAD.l - PAD.r;

const xLine = (i: number) => PAD.l + (i / (DAYS - 1)) * plotW;
const plotHOf = (h: number) => h - PAD.t - PAD.b;
const yOf = (v: number, maxY: number, h: number) => PAD.t + (1 - v / maxY) * plotHOf(h);

const GRID = "#eceef1";

export function ChartCard({
  title,
  headerStats,
  legend,
  children,
  fill = false,
}: {
  title: string;
  headerStats?: React.ReactNode;
  legend?: React.ReactNode;
  children: React.ReactNode;
  /** When true the card fills its grid row and the chart area grows to fill it. */
  fill?: boolean;
}) {
  return (
    <div className={`rounded-lg border border-hairline bg-white p-5 ${fill ? "flex h-full flex-col" : ""}`}>
      <h3 className="text-base font-medium text-ink">{title}</h3>
      {headerStats}
      <div className={`mt-3 ${fill ? "flex flex-1 items-center" : ""}`}>{children}</div>
      {legend}
    </div>
  );
}

function Gridlines({ ticks, maxY, h }: { ticks: number[]; maxY: number; h: number }) {
  return (
    <g>
      {ticks.map((t) => {
        const y = yOf(t, maxY, h);
        return (
          <g key={t}>
            <line x1={PAD.l} y1={y} x2={W - PAD.r} y2={y} stroke={GRID} strokeWidth={1} />
            <text x={PAD.l - 8} y={y + 4} textAnchor="end" className="fill-muted text-[11px]">
              {short(t)}
            </text>
          </g>
        );
      })}
    </g>
  );
}

function XAxis({ h }: { h: number }) {
  return (
    <g>
      {X_TICKS.map((t) => (
        <text
          key={t.label}
          x={xLine(t.at)}
          y={h - 8}
          textAnchor={t.at === 0 ? "start" : t.at === DAYS - 1 ? "end" : "middle"}
          className="fill-muted text-[11px]"
        >
          {t.label}
        </text>
      ))}
    </g>
  );
}

interface TooltipRow {
  color: string;
  label: string;
  value: number;
}

/** HTML tooltip positioned by fraction of the chart width. */
function Tooltip({ xFrac, title, rows }: { xFrac: number; title: string; rows: TooltipRow[] }) {
  const leftPct = xFrac * 100;
  const tx = leftPct < 14 ? "8px" : leftPct > 86 ? "calc(-100% - 8px)" : "-50%";
  return (
    <div
      className="pointer-events-none absolute top-1 z-10 w-max max-w-[220px] rounded-md border border-hairline bg-white px-3 py-2 text-xs shadow-lg"
      style={{ left: `${leftPct}%`, transform: `translateX(${tx})` }}
    >
      <div className="mb-1 font-medium text-ink">{title}</div>
      <div className="flex flex-col gap-1">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: r.color }}
            />
            <span className="flex-1 truncate text-body">{r.label}</span>
            <span className="font-medium text-ink">{full(r.value)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Map a pointer event to a data index, given how many bands/points span the plot. */
function indexFromEvent(
  e: React.MouseEvent<HTMLDivElement>,
  el: HTMLDivElement,
  count: number,
  banded: boolean,
) {
  const rect = el.getBoundingClientRect();
  const vbX = ((e.clientX - rect.left) / rect.width) * W;
  const frac = (vbX - PAD.l) / plotW;
  const idx = banded ? Math.floor(frac * count) : Math.round(frac * (count - 1));
  return Math.max(0, Math.min(count - 1, idx));
}

export function BarChart({
  data,
  maxY,
  yTicks,
  pullsColor = "#1d63ed",
  checksColor = "#7cc0f5",
}: {
  data: { pulls: number; checks: number }[];
  maxY: number;
  yTicks: number[];
  pullsColor?: string;
  checksColor?: string;
}) {
  const H = 300;
  const plotH = plotHOf(H);
  const bottom = PAD.t + plotH;
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);
  const band = plotW / data.length;
  const barW = band * 0.62;
  const bandCenter = (i: number) => PAD.l + (i + 0.5) * band;

  return (
    <div
      ref={ref}
      className="relative w-full"
      onMouseMove={(e) => ref.current && setHover(indexFromEvent(e, ref.current, data.length, true))}
      onMouseLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Pulls over time">
        <Gridlines ticks={yTicks} maxY={maxY} h={H} />
        {hover !== null && (
          <rect x={PAD.l + hover * band} y={PAD.t} width={band} height={plotH} fill="#1d63ed" opacity={0.06} />
        )}
        {data.map((d, i) => {
          const x = PAD.l + i * band + (band - barW) / 2;
          const hPulls = (d.pulls / maxY) * plotH;
          const hChecks = (d.checks / maxY) * plotH;
          const yPulls = bottom - hPulls;
          const yChecks = yPulls - hChecks;
          return (
            <g key={i} opacity={hover === null || hover === i ? 1 : 0.55}>
              <rect x={x} y={yPulls} width={barW} height={hPulls} fill={pullsColor} rx={1} />
              <rect x={x} y={yChecks} width={barW} height={hChecks} fill={checksColor} rx={1} />
            </g>
          );
        })}
        <XAxis h={H} />
      </svg>
      {hover !== null && (
        <Tooltip
          xFrac={bandCenter(hover) / W}
          title={dayLabel(hover)}
          rows={[
            { color: pullsColor, label: "Pulls", value: data[hover].pulls },
            { color: checksColor, label: "Version checks", value: data[hover].checks },
          ]}
        />
      )}
    </div>
  );
}

export function LineChart({
  series,
  maxY,
  yTicks,
  height = 300,
}: {
  series: Series[];
  maxY: number;
  yTicks: number[];
  height?: number;
}) {
  const H = height;
  const bottom = PAD.t + plotHOf(H);
  const ref = useRef<HTMLDivElement>(null);
  const [hover, setHover] = useState<number | null>(null);

  return (
    <div
      ref={ref}
      className="relative w-full"
      onMouseMove={(e) => ref.current && setHover(indexFromEvent(e, ref.current, DAYS, false))}
      onMouseLeave={() => setHover(null)}
    >
      <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Time series">
        <Gridlines ticks={yTicks} maxY={maxY} h={H} />
        {hover !== null && (
          <line
            x1={xLine(hover)}
            y1={PAD.t}
            x2={xLine(hover)}
            y2={bottom}
            stroke="#c9ced6"
            strokeWidth={1}
            strokeDasharray="4 3"
          />
        )}
        {series.map((s) => (
          <polyline
            key={s.label}
            points={s.points.map((v, i) => `${xLine(i)},${yOf(v, maxY, H)}`).join(" ")}
            fill="none"
            stroke={s.color}
            strokeWidth={2}
            strokeLinejoin="round"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            opacity={hover === null ? 1 : 0.85}
          />
        ))}
        {hover !== null &&
          series.map((s) => (
            <circle
              key={s.label}
              cx={xLine(hover)}
              cy={yOf(s.points[hover], maxY, H)}
              r={4}
              fill={s.color}
              stroke="#fff"
              strokeWidth={2}
            />
          ))}
        <XAxis h={H} />
      </svg>
      {hover !== null && (
        <Tooltip
          xFrac={xLine(hover) / W}
          title={dayLabel(hover)}
          rows={[...series]
            .map((s) => ({ color: s.color, label: s.label, value: s.points[hover] }))
            .sort((a, b) => b.value - a.value)}
        />
      )}
    </div>
  );
}

export function AreaSparkline({
  points,
  id,
  color = "#1d63ed",
}: {
  points: number[];
  id: string;
  color?: string;
}) {
  const w = 300;
  const h = 88;
  const max = Math.max(...points) * 1.15;
  const min = Math.min(...points) * 0.6;
  const x = (i: number) => (i / (points.length - 1)) * w;
  const y = (v: number) => h - ((v - min) / (max - min)) * h;
  const line = points.map((v, i) => `${x(i)},${y(v)}`).join(" ");
  const area = `M0,${h} L${line.replaceAll(" ", " L")} L${w},${h} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-auto w-full" preserveAspectRatio="none" aria-hidden>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity={0.22} />
          <stop offset="100%" stopColor={color} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={area} fill={`url(#${id})`} />
      <polyline
        points={line}
        fill="none"
        stroke={color}
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function Legend({ series }: { series: { label: string; color: string }[] }) {
  return (
    <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5">
      {series.map((s) => (
        <div key={s.label} className="flex items-center gap-1.5">
          <span
            className="inline-block h-2 w-2 shrink-0 rounded-full"
            style={{ backgroundColor: s.color }}
          />
          <span className="text-xs text-body">{s.label}</span>
        </div>
      ))}
    </div>
  );
}
