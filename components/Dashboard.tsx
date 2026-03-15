"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer,
} from "recharts";
import type { ProgramMetrics, ProgramType, Country, CountryView, AggregatedMetrics } from "@/types";

// ─── Constants ───────────────────────────────────────────────────────────────
const C = {
  bg:        "#13152a",
  card:      "#1c1f3a",
  border:    "#2e2b4a",
  text:      "#eae8f0",
  muted:     "#9994b0",
  purple:    "#8b5cf6",
  darkPurple:"#6b5b8d",
  cyan:      "#22c3f0",
  amber:     "#f59e0b",
  green:     "#34d399",
  red:       "#f87171",
  y2025:     "#6b5b8d",
  y2026:     "#8b5cf6",
};

const PROGRAMS: ProgramType[] = [
  "Curso Sincrónico",
  "Curso Asincrónico",
  "Acreditación Internacional",
  "Sesiones Magistrales",
  "Especialización",
  "Diplomado",
  "Postítulo",
];

const MODALIDAD: Record<ProgramType, "Sincrónico" | "Asincrónico"> = {
  "Curso Sincrónico":           "Sincrónico",
  "Curso Asincrónico":          "Asincrónico",
  "Acreditación Internacional": "Sincrónico",
  "Sesiones Magistrales":       "Asincrónico",
  "Especialización":            "Asincrónico",
  "Diplomado":                  "Sincrónico",
  "Postítulo":                  "Sincrónico",
};

const COUNTRIES: Country[] = ["Chile", "México", "Colombia"];
const COUNTRY_VIEWS: CountryView[] = ["Consolidado", "Chile", "México", "Colombia"];

const pct = (a: number, b: number) =>
  b ? (((a - b) / b) * 100).toFixed(1) : "0.0";

const fmt = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `${(n / 1_000).toFixed(1)}K`;
  return n.toLocaleString("es-CL");
};

// ─── Helpers ─────────────────────────────────────────────────────────────────
function aggregate(rows: ProgramMetrics[]): AggregatedMetrics {
  const totals = rows.reduce(
    (a, r) => ({
      clientes_totales:     a.clientes_totales     + r.clientes_totales,
      clientes_nuevos:      a.clientes_nuevos      + r.clientes_nuevos,
      clientes_recurrentes: a.clientes_recurrentes + r.clientes_recurrentes,
      ventas_monto:         a.ventas_monto         + r.ventas_monto,
      ventas_pedidos:       a.ventas_pedidos        + r.ventas_pedidos,
      ventas_productos:     a.ventas_productos      + r.ventas_productos,
      ticket_promedio:      0,
    }),
    { clientes_totales: 0, clientes_nuevos: 0, clientes_recurrentes: 0,
      ventas_monto: 0, ventas_pedidos: 0, ventas_productos: 0, ticket_promedio: 0 }
  );
  totals.ticket_promedio = totals.ventas_pedidos
    ? Math.round(totals.ventas_monto / totals.ventas_pedidos)
    : 0;
  return totals;
}

function filterData(
  data: ProgramMetrics[],
  year: number,
  country: CountryView,
  programs: ProgramType[]
): ProgramMetrics[] {
  return data.filter(
    (r) =>
      r.year === year &&
      (country === "Consolidado" || r.country === country) &&
      programs.includes(r.program)
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
const Tooltip_ = ({ active, payload, label }: { active?: boolean; payload?: { name: string; value: number; color: string }[]; label?: string }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: "#13152aee", border: `1px solid ${C.border}`, borderRadius: 8, padding: "10px 14px", fontSize: 12, color: C.text }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
          <span style={{ color: C.muted }}>{p.name}:</span>
          <span style={{ fontWeight: 600, fontFamily: "monospace" }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const Badge = ({ value }: { value: string }) => {
  const v = parseFloat(value);
  return (
    <span style={{
      fontSize: 11, fontWeight: 700,
      color: v >= 0 ? C.green : C.red,
      background: v >= 0 ? "#34d39918" : "#f8717118",
      padding: "2px 7px", borderRadius: 4, marginLeft: 6, fontFamily: "monospace",
    }}>
      {v >= 0 ? "+" : ""}{value}%
    </span>
  );
};

const KpiCard = ({ label, v25, v26, currency }: { label: string; v25: number; v26: number; currency?: boolean }) => (
  <div style={{ background: C.card, borderRadius: 10, padding: "16px 20px", border: `1px solid ${C.border}`, flex: 1, minWidth: 140 }}>
    <div style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600 }}>{label}</div>
    <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginTop: 8 }}>
      <span style={{ fontSize: 22, fontWeight: 800, color: C.text, fontFamily: "monospace", letterSpacing: "-0.02em" }}>
        {currency ? "$" : ""}{currency ? fmt(v26) : v26.toLocaleString("es-CL")}
      </span>
      <Badge value={pct(v26, v25)} />
    </div>
    <div style={{ fontSize: 11, color: C.muted, marginTop: 4, fontFamily: "monospace" }}>
      vs {currency ? "$" : ""}{currency ? fmt(v25) : v25.toLocaleString("es-CL")} (2025)
    </div>
  </div>
);

const ChartCard = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div style={{ background: C.card, borderRadius: 12, padding: 20, border: `1px solid ${C.border}`, flex: "1 1 calc(50% - 10px)", minWidth: 300 }}>
    <h3 style={{ fontSize: 12, fontWeight: 700, color: C.muted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16 }}>{title}</h3>
    {children}
  </div>
);

function YoYBar({ data, prefix = "" }: { data: { country: string; "2025": number; "2026": number }[]; prefix?: string }) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} barGap={4} barCategoryGap="28%">
        <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
        <XAxis dataKey="country" tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${prefix}${fmt(v)}`} />
        <Tooltip content={<Tooltip_ />} />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        <Bar dataKey="2025" fill={C.y2025} radius={[4, 4, 0, 0]} />
        <Bar dataKey="2026" fill={C.y2026} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

// ─── Metric Block ─────────────────────────────────────────────────────────────
function MetricBlock({
  data,
  country,
  programs,
}: {
  data: ProgramMetrics[];
  country: CountryView;
  programs: ProgramType[];
}) {
  const d25 = aggregate(filterData(data, 2025, country, programs));
  const d26 = aggregate(filterData(data, 2026, country, programs));

  // Per-country chart data
  const countryCols = country === "Consolidado" ? COUNTRIES : [country as Country];

  const buildChart = (field: keyof AggregatedMetrics) =>
    countryCols.map((c) => ({
      country: c,
      "2025": aggregate(filterData(data, 2025, c, programs))[field] as number,
      "2026": aggregate(filterData(data, 2026, c, programs))[field] as number,
    }));

  return (
    <>
      {/* KPI row */}
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 20 }}>
        <KpiCard label="Clientes Totales"     v25={d25.clientes_totales}     v26={d26.clientes_totales} />
        <KpiCard label="Clientes Nuevos"      v25={d25.clientes_nuevos}      v26={d26.clientes_nuevos} />
        <KpiCard label="Clientes Recurrentes" v25={d25.clientes_recurrentes} v26={d26.clientes_recurrentes} />
        <KpiCard label="Ventas (USD)"         v25={d25.ventas_monto}         v26={d26.ventas_monto}    currency />
        <KpiCard label="N° Pedidos"           v25={d25.ventas_pedidos}       v26={d26.ventas_pedidos} />
        <KpiCard label="N° Productos"         v25={d25.ventas_productos}     v26={d26.ventas_productos} />
        <KpiCard label="Ticket Promedio"      v25={d25.ticket_promedio}      v26={d26.ticket_promedio} currency />
      </div>

      {/* Charts */}
      <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
        <ChartCard title="Clientes Totales por País">
          <YoYBar data={buildChart("clientes_totales")} />
        </ChartCard>
        <ChartCard title="Nuevos vs Recurrentes">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart
              data={countryCols.map((c) => ({
                country: c,
                "Nuevos 25":      aggregate(filterData(data, 2025, c, programs)).clientes_nuevos,
                "Recurrentes 25": aggregate(filterData(data, 2025, c, programs)).clientes_recurrentes,
                "Nuevos 26":      aggregate(filterData(data, 2026, c, programs)).clientes_nuevos,
                "Recurrentes 26": aggregate(filterData(data, 2026, c, programs)).clientes_recurrentes,
              }))}
              barGap={2} barCategoryGap="20%"
            >
              <CartesianGrid strokeDasharray="3 3" stroke={C.border} vertical={false} />
              <XAxis dataKey="country" tick={{ fill: C.muted, fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: C.muted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
              <Tooltip content={<Tooltip_ />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="Nuevos 25"      stackId="a" fill="#4a4368" />
              <Bar dataKey="Recurrentes 25" stackId="a" fill={C.darkPurple} radius={[4,4,0,0]} />
              <Bar dataKey="Nuevos 26"      stackId="b" fill={C.cyan} />
              <Bar dataKey="Recurrentes 26" stackId="b" fill={C.purple} radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Monto de Ventas (USD)">
          <YoYBar data={buildChart("ventas_monto")} prefix="$" />
        </ChartCard>
        <ChartCard title="N° de Pedidos">
          <YoYBar data={buildChart("ventas_pedidos")} />
        </ChartCard>
        <ChartCard title="N° de Productos Vendidos">
          <YoYBar data={buildChart("ventas_productos")} />
        </ChartCard>
        <ChartCard title="Ticket Promedio (USD)">
          <YoYBar data={buildChart("ticket_promedio")} prefix="$" />
        </ChartCard>
      </div>
    </>
  );
}

// ─── Small multiples ──────────────────────────────────────────────────────────
function SmallMultiples({ data, programs, country }: { data: ProgramMetrics[]; programs: ProgramType[]; country: CountryView }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 16 }}>
      {programs.map((prog) => {
        const mod = MODALIDAD[prog];
        const chartData = (country === "Consolidado" ? COUNTRIES : [country as Country]).map((c) => ({
          country: c,
          "2025": aggregate(filterData(data, 2025, c, [prog])).ventas_monto,
          "2026": aggregate(filterData(data, 2026, c, [prog])).ventas_monto,
        }));
        return (
          <div key={prog} style={{ background: C.card, borderRadius: 10, padding: "14px 16px", border: `1px solid ${C.border}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{prog}</div>
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                padding: "2px 8px", borderRadius: 4,
                background: mod === "Sincrónico" ? "#22c3f018" : "#f59e0b18",
                color: mod === "Sincrónico" ? C.cyan : C.amber,
              }}>
                {mod === "Sincrónico" ? "SYNC" : "ASYNC"}
              </span>
            </div>
            <ResponsiveContainer width="100%" height={130}>
              <BarChart data={chartData} barGap={2} barCategoryGap="20%">
                <XAxis dataKey="country" tick={{ fill: C.muted, fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: C.muted, fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${fmt(v)}`} width={46} />
                <Tooltip content={<Tooltip_ />} />
                <Bar dataKey="2025" fill={C.y2025} radius={[3,3,0,0]} />
                <Bar dataKey="2026" fill={C.y2026} radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        );
      })}
    </div>
  );
}

// ─── Login ────────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [pw, setPw] = useState("");
  const [err, setErr] = useState(false);

  const handleLogin = () => {
    if (pw === "consejo") { onLogin(); return; }
    setErr(true); setPw("");
    setTimeout(() => setErr(false), 3000);
  };

  return (
    <div style={{
      position: "fixed", inset: 0,
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
        borderRadius: 20, padding: 50, border: "1px solid rgba(255,255,255,0.2)",
        textAlign: "center", maxWidth: 400, width: "90%",
      }}>
        <Image src="/yoy/logo-adipa.svg" alt="ADIPA" width={160} height={50} style={{ margin: "0 auto 16px" }} />
        <div style={{ color: "rgba(255,255,255,0.6)", fontSize: 12, marginBottom: 8 }}>adipa.report/yoy</div>
        <div style={{ color: "#fff", fontSize: 18, fontWeight: 600, marginBottom: 36 }}>Unit Economics & Ventas</div>
        <input
          type="password" placeholder="Contraseña" value={pw}
          onChange={(e) => setPw(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", padding: 14, borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)", color: "#fff",
            fontSize: 15, marginBottom: 16, outline: "none", boxSizing: "border-box",
          }}
        />
        <button onClick={handleLogin} style={{
          width: "100%", padding: 14,
          background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
          border: "none", borderRadius: 10, color: "#fff",
          fontSize: 15, fontWeight: 700, cursor: "pointer",
        }}>
          Ingresar
        </button>
        {err && (
          <div style={{ color: C.red, background: "#f8717118", padding: 10, borderRadius: 8, marginTop: 14, fontSize: 13 }}>
            Contraseña incorrecta
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
type ViewMode = "consolidated" | "modalidad" | ProgramType;

export default function Dashboard() {
  const [loggedIn, setLoggedIn]   = useState(false);
  const [view, setView]           = useState<ViewMode>("consolidated");
  const [country, setCountry]     = useState<CountryView>("Consolidado");
  const [data, setData]           = useState<ProgramMetrics[]>([]);
  const [source, setSource]       = useState<"bigquery" | "mock">("mock");
  const [loading, setLoading]     = useState(true);

  useEffect(() => {
    fetch("/yoy/api/data")
      .then((r) => r.json())
      .then((res) => { setData(res.data); setSource(res.source); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const syncPrograms  = useMemo(() => PROGRAMS.filter((p) => MODALIDAD[p] === "Sincrónico"),  []);
  const asyncPrograms = useMemo(() => PROGRAMS.filter((p) => MODALIDAD[p] === "Asincrónico"), []);

  const VIEW_MODES: { key: ViewMode; label: string }[] = [
    { key: "consolidated", label: "Consolidado" },
    { key: "modalidad",    label: "Por Modalidad" },
    ...PROGRAMS.map((p) => ({ key: p as ViewMode, label: p })),
  ];

  if (!loggedIn) return <LoginScreen onLogin={() => setLoggedIn(true)} />;

  const activePrograms =
    view === "consolidated" ? PROGRAMS :
    view === "modalidad"    ? PROGRAMS :
    [view as ProgramType];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: "'DM Sans', system-ui, sans-serif", padding: "24px 28px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 11, color: C.purple, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            ADIPA — Unit Economics & Ventas
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 800, margin: "6px 0 4px", letterSpacing: "-0.03em" }}>
            Comparativo Ene-Feb 2025 vs 2026
          </h1>
          <p style={{ fontSize: 12, color: C.muted, margin: 0 }}>
            Fuente:{" "}
            <span style={{
              padding: "1px 8px", borderRadius: 4, fontSize: 11, fontWeight: 700,
              background: source === "bigquery" ? "#34d39918" : "#f59e0b18",
              color: source === "bigquery" ? C.green : C.amber,
            }}>
              {source === "bigquery" ? "BigQuery" : "Datos de ejemplo"}
            </span>
          </p>
        </div>
        <Image src="/yoy/logo-adipa.svg" alt="ADIPA" width={100} height={54} />
      </div>

      {/* Country tabs */}
      <div style={{ display: "flex", gap: 6, margin: "20px 0 8px", flexWrap: "wrap" }}>
        <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, alignSelf: "center", marginRight: 4 }}>País:</span>
        {COUNTRY_VIEWS.map((cv) => (
          <button key={cv} onClick={() => setCountry(cv)} style={{
            padding: "6px 16px", borderRadius: 20, fontSize: 12, fontWeight: 600, cursor: "pointer",
            border: `1px solid ${country === cv ? C.cyan : C.border}`,
            background: country === cv ? C.cyan : "transparent",
            color: country === cv ? "#13152a" : C.muted,
            transition: "all 0.15s",
          }}>
            {cv}
          </button>
        ))}
      </div>

      {/* Program tabs */}
      <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginBottom: 24 }}>
        <span style={{ fontSize: 10, color: C.muted, textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: 600, alignSelf: "center", marginRight: 4 }}>Vista:</span>
        {VIEW_MODES.map(({ key, label }) => (
          <button key={key} onClick={() => setView(key)} style={{
            padding: "6px 14px", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer",
            background: view === key ? C.purple : "transparent",
            border: `1px solid ${view === key ? C.purple : C.border}`,
            color: view === key ? "#fff" : C.muted,
            transition: "all 0.15s",
          }}>
            {label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ color: C.muted, textAlign: "center", paddingTop: 80, fontSize: 14 }}>Cargando datos...</div>
      ) : (
        <>
          {/* Single program or consolidated */}
          {view !== "modalidad" && (
            <>
              {view !== "consolidated" && MODALIDAD[view as ProgramType] && (
                <div style={{ marginBottom: 16 }}>
                  <span style={{
                    fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                    padding: "3px 10px", borderRadius: 4,
                    background: MODALIDAD[view as ProgramType] === "Sincrónico" ? "#22c3f018" : "#f59e0b18",
                    color: MODALIDAD[view as ProgramType] === "Sincrónico" ? C.cyan : C.amber,
                  }}>
                    Modalidad: {MODALIDAD[view as ProgramType]}
                  </span>
                </div>
              )}
              <MetricBlock data={data} country={country} programs={activePrograms} />
              {view === "consolidated" && (
                <div style={{ marginTop: 32 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.muted, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.04em" }}>
                    Ventas por Tipo de Programa
                  </div>
                  <SmallMultiples data={data} programs={PROGRAMS} country={country} />
                </div>
              )}
            </>
          )}

          {/* Modalidad view */}
          {view === "modalidad" && (
            <>
              <div style={{ borderTop: `2px solid ${C.cyan}44`, paddingTop: 20, marginBottom: 32 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.cyan, marginBottom: 4 }}>Sincrónico</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>{syncPrograms.join(" · ")}</div>
                <MetricBlock data={data} country={country} programs={syncPrograms} />
                <SmallMultiples data={data} programs={syncPrograms} country={country} />
              </div>
              <div style={{ borderTop: `2px solid ${C.amber}44`, paddingTop: 20 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: C.amber, marginBottom: 4 }}>Asincrónico</div>
                <div style={{ fontSize: 11, color: C.muted, marginBottom: 16 }}>{asyncPrograms.join(" · ")}</div>
                <MetricBlock data={data} country={country} programs={asyncPrograms} />
                <SmallMultiples data={data} programs={asyncPrograms} country={country} />
              </div>
            </>
          )}
        </>
      )}

      <div style={{ marginTop: 32, padding: "14px 18px", background: "#1c1f3a80", borderRadius: 10, border: `1px solid ${C.border}`, fontSize: 12, color: C.muted }}>
        {source === "mock"
          ? "Datos de ejemplo. Configura BQ_DATASET, BQ_TABLE y BQ_SERVICE_ACCOUNT en Vercel para conectar BigQuery."
          : "Datos en tiempo real desde BigQuery · adipa-cl-331013"}
      </div>
    </div>
  );
}
