"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CalendarRange, Loader2, RefreshCw, Table2, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { isLocale, localeInfo } from "@/i18n/config";

interface Stats {
  total: number;
  last24h: number;
  last30d: number;
  range: {
    from: string;
    to: string;
    views: number;
    visitors: number;
    daily: { day: string; views: number; visitors: number }[];
    pages: { path: string; views: number }[];
    langs: { lang: string; views: number }[];
    devices: { device: string; views: number }[];
    referrers: { host: string; views: number }[];
  };
}

// Validated against both chart surfaces (light #fcfcfb, dark #1a1a19).
const BAR = "#059669";

const day = (d: Date) => d.toISOString().slice(0, 10);
const daysAgo = (n: number) => day(new Date(Date.now() - n * 86400_000));
const PRESETS = [
  { key: "7", label: "Last 7 days", from: () => daysAgo(6) },
  { key: "30", label: "Last 30 days", from: () => daysAgo(29) },
  { key: "90", label: "Last 90 days", from: () => daysAgo(89) },
  { key: "year", label: "This year", from: () => `${new Date().getUTCFullYear()}-01-01` },
] as const;

const nf = new Intl.NumberFormat("en");
const shortDate = (k: string) => new Date(`${k}T00:00:00Z`).toLocaleDateString("en", { month: "short", day: "numeric", timeZone: "UTC" });

function Tile({ label, value, hint }: { label: string; value: number | string; hint?: string }) {
  return (
    <div className="rounded-xl border border-border/60 bg-card/60 p-4">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      <p className="mt-1 text-3xl font-bold tabular-nums tracking-tight">{typeof value === "number" ? nf.format(value) : value}</p>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function Breakdown({ title, rows, empty = "No data in this range." }: { title: string; rows: { label: string; value: number }[]; empty?: string }) {
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="rounded-xl border border-border/60 bg-card/60 p-4">
      <h3 className="mb-3 text-sm font-semibold">{title}</h3>
      {rows.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => (
            <li key={r.label} className="space-y-1">
              <div className="flex justify-between gap-3 text-sm">
                <span className="truncate" title={r.label}>
                  {r.label}
                </span>
                <span className="shrink-0 tabular-nums text-muted-foreground">{nf.format(r.value)}</span>
              </div>
              <div className="h-1.5 rounded-full bg-muted">
                <div className="h-full rounded-full" style={{ width: `${(r.value / max) * 100}%`, background: BAR }} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

export function Dashboard() {
  const [preset, setPreset] = useState<string>("30");
  const [from, setFrom] = useState(daysAgo(29));
  const [to, setTo] = useState(day(new Date()));
  const [applied, setApplied] = useState({ from: daysAgo(29), to: day(new Date()) });
  const [asTable, setAsTable] = useState(false);

  // Statistics for the applied range; changing the range refetches automatically.
  const { data: stats, isFetching: loading, error: queryError, refetch } = useQuery({
    queryKey: ["admin-stats", applied.from, applied.to],
    queryFn: async () => {
      const res = await fetch(`/api/admin/stats?from=${applied.from}&to=${applied.to}`, { cache: "no-store" });
      if (res.status === 401) {
        window.location.href = "/admin/login";
        throw new Error("Not signed in.");
      }
      const data = (await res.json().catch(() => ({}))) as Stats & { error?: string };
      if (!res.ok) throw new Error(data.error || "Could not load statistics.");
      return data;
    },
  });
  const error = queryError instanceof Error ? queryError.message : null;
  const load = (f: string, t: string) => {
    if (f === applied.from && t === applied.to) void refetch();
    else setApplied({ from: f, to: t });
  };

  const pickPreset = (key: string) => {
    const p = PRESETS.find((x) => x.key === key);
    setPreset(key);
    if (!p) return;
    const f = p.from();
    const t = day(new Date());
    setFrom(f);
    setTo(t);
    load(f, t);
  };

  const chartData = useMemo(() => stats?.range.daily.map((d) => ({ ...d, label: shortDate(d.day) })) ?? [], [stats]);
  const r = stats?.range;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Statistics</h1>
          <p className="text-sm text-muted-foreground">Page views on all languages. Bots and the admin area are not counted.</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => load(from, to)} disabled={loading}>
          {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
          Refresh
        </Button>
      </div>

      {/* Headline numbers */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Tile label="Total views" value={stats?.total ?? "-"} hint="All time" />
        <Tile label="Last day" value={stats?.last24h ?? "-"} hint="Past 24 hours" />
        <Tile label="Last month" value={stats?.last30d ?? "-"} hint="Past 30 days" />
        <Tile label="Selected range" value={r?.views ?? "-"} hint={r ? `${nf.format(r.visitors)} unique visitors` : undefined} />
      </div>

      {/* Date filter: presets + custom range, in one row above the chart */}
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-border/60 bg-card/60 p-3">
        <CalendarRange className="size-4 text-muted-foreground" aria-hidden />
        {PRESETS.map((p) => (
          <Button
            key={p.key}
            size="sm"
            variant={preset === p.key ? "default" : "ghost"}
            className={preset === p.key ? "bg-emerald-600 text-white hover:bg-emerald-500" : ""}
            onClick={() => pickPreset(p.key)}
          >
            {p.label}
          </Button>
        ))}
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            From
            <Input type="date" value={from} max={to} onChange={(e) => { setPreset("custom"); setFrom(e.target.value); }} className="h-9 w-[150px]" />
          </label>
          <label className="flex items-center gap-1.5 text-xs text-muted-foreground">
            To
            <Input type="date" value={to} min={from} max={day(new Date())} onChange={(e) => { setPreset("custom"); setTo(e.target.value); }} className="h-9 w-[150px]" />
          </label>
          <Button size="sm" variant={preset === "custom" ? "default" : "outline"} onClick={() => load(from, to)} disabled={!from || !to || loading}>
            Apply
          </Button>
        </div>
      </div>

      {error && <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">{error}</p>}

      {/* Daily views */}
      <section className="rounded-xl border border-border/60 bg-card/60 p-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <h2 className="text-sm font-semibold">
            Daily views{r ? ` · ${shortDate(r.from)} - ${shortDate(r.to)}` : ""}
          </h2>
          <Button size="sm" variant="ghost" className="gap-1.5 text-xs" onClick={() => setAsTable((v) => !v)}>
            {asTable ? <BarChart3 className="size-4" /> : <Table2 className="size-4" />}
            {asTable ? "Chart" : "Table"}
          </Button>
        </div>
        {asTable ? (
          <div className="max-h-80 overflow-auto">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card text-xs text-muted-foreground">
                <tr>
                  <th className="py-1.5 text-start font-medium">Day</th>
                  <th className="py-1.5 text-end font-medium">Views</th>
                  <th className="py-1.5 text-end font-medium">Unique visitors</th>
                </tr>
              </thead>
              <tbody>
                {[...(r?.daily ?? [])].reverse().map((d) => (
                  <tr key={d.day} className="border-t border-border/40">
                    <td className="py-1.5">{d.day}</td>
                    <td className="py-1.5 text-end tabular-nums">{nf.format(d.views)}</td>
                    <td className="py-1.5 text-end tabular-nums">{nf.format(d.visitors)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 8, right: 8, bottom: 0, left: -12 }} barCategoryGap={2}>
                <CartesianGrid vertical={false} stroke="currentColor" strokeOpacity={0.08} />
                <XAxis dataKey="label" tickLine={false} axisLine={false} minTickGap={24} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
                <YAxis allowDecimals={false} tickLine={false} axisLine={false} width={44} tick={{ fontSize: 11, fill: "currentColor", opacity: 0.6 }} />
                <Tooltip
                  cursor={{ fill: "currentColor", fillOpacity: 0.06 }}
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const p = payload[0].payload as { day: string; views: number; visitors: number };
                    return (
                      <div className="rounded-lg border border-border/60 bg-popover px-3 py-2 text-xs text-popover-foreground shadow-lg">
                        <p className="font-medium">{p.day}</p>
                        <p className="tabular-nums">{nf.format(p.views)} views</p>
                        <p className="tabular-nums text-muted-foreground">{nf.format(p.visitors)} unique visitors</p>
                      </div>
                    );
                  }}
                />
                <Bar dataKey="views" fill={BAR} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <div className="grid gap-4 md:grid-cols-2">
        <Breakdown title="Top pages" rows={(r?.pages ?? []).map((p) => ({ label: p.path, value: p.views }))} />
        <Breakdown
          title="Languages"
          rows={(r?.langs ?? []).map((l) => ({ label: isLocale(l.lang) ? `${localeInfo[l.lang].name} (${localeInfo[l.lang].native})` : l.lang, value: l.views }))}
        />
        <Breakdown title="Devices" rows={(r?.devices ?? []).map((d) => ({ label: d.device, value: d.views }))} />
        <Breakdown title="Top referrers" rows={(r?.referrers ?? []).map((x) => ({ label: x.host, value: x.views }))} empty="No referring websites in this range." />
      </div>
    </div>
  );
}
