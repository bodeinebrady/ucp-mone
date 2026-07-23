import { Calendar, ChevronDown, MessageSquareText } from "lucide-react";
import { TopNav } from "@/components/TopNav";
import { Footer } from "@/components/Footer";
import { AppSidebar } from "@/components/AppSidebar";
import {
  AreaSparkline,
  BarChart,
  ChartCard,
  Legend,
  LineChart,
} from "@/components/pulls/Charts";
import {
  avgDailyPulls,
  avgDailyVersionChecks,
  barData,
  barMaxY,
  barYTicks,
  kpis,
  lineMaxY,
  lineYTicks,
  repoSeries,
  userSeries,
} from "@/lib/pullsData";

export const metadata = {
  title: "Docker Hub — Usage · Pulls",
};

function Kpi({
  label,
  value,
  children,
  className = "",
}: {
  label: string;
  value: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <div className="text-[11px] font-medium uppercase tracking-wide text-muted">{label}</div>
      <div className="mt-1.5 flex items-center gap-2 text-2xl font-medium text-ink">{value}</div>
      {children && <div className="mt-0.5 text-xs">{children}</div>}
    </div>
  );
}

/** Small progress ring for "monthly pulls remaining". */
function Donut({ frac }: { frac: number }) {
  const r = 9;
  const c = 2 * Math.PI * r;
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" aria-hidden>
      <circle cx={12} cy={12} r={r} fill="none" stroke="#e2e2e6" strokeWidth={3} />
      <circle
        cx={12}
        cy={12}
        r={r}
        fill="none"
        stroke="#e8883a"
        strokeWidth={3}
        strokeLinecap="round"
        strokeDasharray={`${frac * c} ${c}`}
        transform="rotate(-90 12 12)"
      />
    </svg>
  );
}

export default function PullsPage() {
  return (
    <div className="flex min-h-full flex-col bg-canvas">
      <TopNav />
      <div className="flex flex-1">
        <AppSidebar active="Usage" />
        <main className="min-w-0 flex-1">
          <div className="mx-auto max-w-[1180px] px-8 py-7">
            {/* Header */}
            <div className="flex items-start justify-between gap-6">
              <div>
                <h1 className="text-[26px] font-medium text-ink">Pulls</h1>
                <p className="mt-1.5 max-w-2xl text-sm text-body">
                  Discover insights into your Docker Hub pulls and usage metrics,{" "}
                  <a href="#" className="text-docker-blue hover:underline">
                    learn more
                  </a>
                  .
                </p>
              </div>
              <a
                href="#"
                className="flex shrink-0 items-center gap-1.5 text-sm font-medium text-docker-blue hover:underline"
              >
                Give feedback
                <MessageSquareText className="h-4 w-4" />
              </a>
            </div>

            {/* Filters */}
            <div className="mt-5 flex flex-wrap items-end justify-between gap-4">
              <label className="block">
                <span className="mb-1 block text-xs text-muted">Filter by</span>
                <div className="relative">
                  <select className="h-10 w-56 appearance-none rounded-md border border-hairline bg-white pl-3.5 pr-9 text-sm text-ink focus:border-docker-blue focus:outline-none">
                    <option>Private</option>
                    <option>Public</option>
                    <option>All</option>
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
                </div>
              </label>

              <label className="block">
                <span className="mb-1 block text-xs text-muted">Datespan</span>
                <div className="flex h-10 w-[360px] items-center gap-2 rounded-md border border-hairline bg-white px-3.5 text-sm text-ink">
                  <span className="flex-1 truncate">{kpis.datespan}</span>
                  <Calendar className="h-4 w-4 shrink-0 text-muted" />
                </div>
              </label>
            </div>

            {/* KPI strip */}
            <div className="mt-6 flex flex-wrap items-start gap-x-12 gap-y-6 border-t border-hairline pt-6">
              <Kpi label="Your plan" value={kpis.plan}>
                <a href="#" className="text-docker-blue hover:underline">
                  Upgrade to Team
                </a>
              </Kpi>
              <Kpi label="Monthly pull limit" value={kpis.monthlyPullLimit.toLocaleString()}>
                <span className="text-muted">Resets in {kpis.resetsInDays} days</span>
              </Kpi>
              <Kpi label="Additional pulls" value={kpis.additionalPulls}>
                <a href="#" className="text-docker-blue hover:underline">
                  Purchase additional pulls
                </a>
              </Kpi>
              <Kpi
                label="Monthly pulls remaining"
                value={
                  <>
                    {kpis.monthlyPullsRemaining.toLocaleString()}
                    <Donut frac={kpis.monthlyPullsRemaining / kpis.monthlyPullLimit} />
                  </>
                }
              />
              <Kpi label="Overages" value={kpis.overages} />

              <button className="ml-auto self-center rounded-md bg-docker-blue px-4 py-2.5 text-sm font-medium text-white transition hover:bg-docker-blue-dark">
                Send report to email
              </button>
            </div>

            {/* Charts */}
            <div className="mt-6 flex flex-col gap-5">
              <ChartCard
                title="Pulls over time"
                headerStats={
                  <div className="mt-3 flex gap-10">
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-wide text-muted">
                        Total pulls
                      </div>
                      <div className="mt-1 text-xl font-medium text-ink">{kpis.totalPulls}</div>
                    </div>
                    <div>
                      <div className="text-[11px] font-medium uppercase tracking-wide text-muted">
                        Version checks
                      </div>
                      <div className="mt-1 text-xl font-medium text-ink">{kpis.versionChecks}</div>
                    </div>
                  </div>
                }
                legend={
                  <Legend
                    series={[
                      { label: "Pulls", color: "#1d63ed" },
                      { label: "Version checks", color: "#7cc0f5" },
                    ]}
                  />
                }
              >
                <BarChart data={barData} maxY={barMaxY} yTicks={barYTicks} />
              </ChartCard>

              <ChartCard
                title="Top repositories by pulls"
                legend={<Legend series={repoSeries} />}
              >
                <LineChart series={repoSeries} maxY={lineMaxY} yTicks={lineYTicks} />
              </ChartCard>

              <div className="grid grid-cols-1 gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.6fr)]">
                <div className="flex flex-col gap-5">
                  <div className="rounded-lg border border-hairline bg-white p-5">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-muted">
                      Avg daily pulls
                    </div>
                    <div className="mt-1 text-2xl font-medium text-ink">{kpis.avgDailyPulls}</div>
                    <div className="mt-3">
                      <AreaSparkline points={avgDailyPulls} id="spark-pulls" />
                    </div>
                  </div>
                  <div className="rounded-lg border border-hairline bg-white p-5">
                    <div className="text-[11px] font-medium uppercase tracking-wide text-muted">
                      Avg daily version checks
                    </div>
                    <div className="mt-1 text-2xl font-medium text-ink">
                      {kpis.avgDailyVersionChecks}
                    </div>
                    <div className="mt-3">
                      <AreaSparkline points={avgDailyVersionChecks} id="spark-checks" />
                    </div>
                  </div>
                </div>

                <ChartCard title="Top users by pulls" fill legend={<Legend series={userSeries} />}>
                  <LineChart series={userSeries} maxY={lineMaxY} yTicks={lineYTicks} height={460} />
                </ChartCard>
              </div>
            </div>

            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
}
