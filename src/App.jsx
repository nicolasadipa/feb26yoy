import { useState, useMemo } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer
} from "recharts";

const COLORS = {
  lavender: "#cec8e0",
  navy: "#1b2040",
  purple: "#8b5cf6",
  cyan: "#22c3f0",
  darkPurple: "#6b5b8d",
  lightGray: "#e8e6ec",
  y2025: "#6b5b8d",
  y2026: "#8b5cf6",
  positive: "#34d399",
  negative: "#f87171",
  bg: "#13152a",
  card: "#1c1f3a",
  text: "#eae8f0",
  textMuted: "#9994b0",
  border: "#2e2b4a",
  accent: "#8b5cf6",
  sync: "#22c3f0",
  async: "#f59e0b",
};

const PROGRAM_TYPES = [
  "Curso Sincrónico",
  "Curso Asincrónico",
  "Acreditación Internacional",
  "Sesiones Magistrales",
  "Especialización",
  "Diplomado",
  "Postítulo",
];

const MODALIDAD_MAP = {
  "Curso Sincrónico": "Sincrónico",
  "Curso Asincrónico": "Asincrónico",
  "Acreditación Internacional": "Sincrónico",
  "Sesiones Magistrales": "Asincrónico",
  "Especialización": "Asincrónico",
  "Diplomado": "Sincrónico",
  "Postítulo": "Sincrónico",
};

const SYNC_PROGRAMS = PROGRAM_TYPES.filter(p => MODALIDAD_MAP[p] === "Sincrónico");
const ASYNC_PROGRAMS = PROGRAM_TYPES.filter(p => MODALIDAD_MAP[p] === "Asincrónico");
const COUNTRIES = ["Chile", "México", "Colombia"];

const programData = {
  "Curso Sincrónico": {
    clientes: [
      { country: "Chile", t2025: 1200, t2026: 1400, n2025: 520, n2026: 650, r2025: 680, r2026: 750 },
      { country: "México", t2025: 320, t2026: 470, n2025: 200, n2026: 300, r2025: 120, r2026: 170 },
      { country: "Colombia", t2025: 230, t2026: 330, n2025: 140, n2026: 210, r2025: 90, r2026: 120 },
    ],
    ventas: [
      { country: "Chile", monto2025: 62000, monto2026: 78000, ped2025: 1100, ped2026: 1300, prod2025: 1350, prod2026: 1700 },
      { country: "México", monto2025: 17000, monto2026: 25000, ped2025: 290, ped2026: 420, prod2025: 340, prod2026: 510 },
      { country: "Colombia", monto2025: 11000, monto2026: 16000, ped2025: 210, ped2026: 300, prod2025: 250, prod2026: 360 },
    ],
  },
  "Curso Asincrónico": {
    clientes: [
      { country: "Chile", t2025: 600, t2026: 750, n2025: 300, n2026: 400, r2025: 300, r2026: 350 },
      { country: "México", t2025: 180, t2026: 280, n2025: 120, n2026: 190, r2025: 60, r2026: 90 },
      { country: "Colombia", t2025: 130, t2026: 200, n2025: 80, n2026: 130, r2025: 50, r2026: 70 },
    ],
    ventas: [
      { country: "Chile", monto2025: 28000, monto2026: 38000, ped2025: 550, ped2026: 700, prod2025: 650, prod2026: 850 },
      { country: "México", monto2025: 8000, monto2026: 13000, ped2025: 160, ped2026: 250, prod2025: 190, prod2026: 300 },
      { country: "Colombia", monto2025: 5000, monto2026: 8000, ped2025: 120, ped2026: 180, prod2025: 140, prod2026: 220 },
    ],
  },
  "Acreditación Internacional": {
    clientes: [
      { country: "Chile", t2025: 250, t2026: 380, n2025: 180, n2026: 280, r2025: 70, r2026: 100 },
      { country: "México", t2025: 60, t2026: 110, n2025: 45, n2026: 80, r2025: 15, r2026: 30 },
      { country: "Colombia", t2025: 40, t2026: 75, n2025: 30, n2026: 55, r2025: 10, r2026: 20 },
    ],
    ventas: [
      { country: "Chile", monto2025: 42000, monto2026: 65000, ped2025: 240, ped2026: 370, prod2025: 250, prod2026: 380 },
      { country: "México", monto2025: 10000, monto2026: 18000, ped2025: 55, ped2026: 100, prod2025: 60, prod2026: 110 },
      { country: "Colombia", monto2025: 6500, monto2026: 12000, ped2025: 38, ped2026: 70, prod2025: 40, prod2026: 75 },
    ],
  },
  "Sesiones Magistrales": {
    clientes: [
      { country: "Chile", t2025: 350, t2026: 420, n2025: 200, n2026: 250, r2025: 150, r2026: 170 },
      { country: "México", t2025: 90, t2026: 140, n2025: 60, n2026: 95, r2025: 30, r2026: 45 },
      { country: "Colombia", t2025: 65, t2026: 100, n2025: 40, n2026: 65, r2025: 25, r2026: 35 },
    ],
    ventas: [
      { country: "Chile", monto2025: 10500, monto2026: 14000, ped2025: 330, ped2026: 400, prod2025: 350, prod2026: 420 },
      { country: "México", monto2025: 2700, monto2026: 4500, ped2025: 85, ped2026: 130, prod2025: 90, prod2026: 140 },
      { country: "Colombia", monto2025: 1800, monto2026: 3000, ped2025: 60, ped2026: 95, prod2025: 65, prod2026: 100 },
    ],
  },
  "Especialización": {
    clientes: [
      { country: "Chile", t2025: 600, t2026: 750, n2025: 250, n2026: 350, r2025: 350, r2026: 400 },
      { country: "México", t2025: 150, t2026: 230, n2025: 100, n2026: 150, r2025: 50, r2026: 80 },
      { country: "Colombia", t2025: 110, t2026: 150, n2025: 70, n2026: 100, r2025: 40, r2026: 50 },
    ],
    ventas: [
      { country: "Chile", monto2025: 35000, monto2026: 45000, ped2025: 550, ped2026: 680, prod2025: 700, prod2026: 900 },
      { country: "México", monto2025: 10000, monto2026: 14000, ped2025: 130, ped2026: 190, prod2025: 160, prod2026: 250 },
      { country: "Colombia", monto2025: 6000, monto2026: 9000, ped2025: 100, ped2026: 140, prod2025: 120, prod2026: 180 },
    ],
  },
  "Diplomado": {
    clientes: [
      { country: "Chile", t2025: 1400, t2026: 1800, n2025: 600, n2026: 850, r2025: 800, r2026: 950 },
      { country: "México", t2025: 350, t2026: 550, n2025: 220, n2026: 360, r2025: 130, r2026: 190 },
      { country: "Colombia", t2025: 260, t2026: 380, n2025: 170, n2026: 250, r2025: 90, r2026: 130 },
    ],
    ventas: [
      { country: "Chile", monto2025: 180000, monto2026: 230000, ped2025: 1300, ped2026: 1700, prod2025: 1400, prod2026: 1900 },
      { country: "México", monto2025: 45000, monto2026: 68000, ped2025: 320, ped2026: 500, prod2025: 350, prod2026: 560 },
      { country: "Colombia", monto2025: 30000, monto2026: 46000, ped2025: 240, ped2026: 350, prod2025: 270, prod2026: 400 },
    ],
  },
  "Postítulo": {
    clientes: [
      { country: "Chile", t2025: 300, t2026: 420, n2025: 150, n2026: 220, r2025: 150, r2026: 200 },
      { country: "México", t2025: 70, t2026: 120, n2025: 45, n2026: 80, r2025: 25, r2026: 40 },
      { country: "Colombia", t2025: 50, t2026: 80, n2025: 30, n2026: 50, r2025: 20, r2026: 30 },
    ],
    ventas: [
      { country: "Chile", monto2025: 48000, monto2026: 68000, ped2025: 280, ped2026: 400, prod2025: 300, prod2026: 420 },
      { country: "México", monto2025: 11000, monto2026: 19000, ped2025: 65, ped2026: 110, prod2025: 70, prod2026: 120 },
      { country: "Colombia", monto2025: 7500, monto2026: 12000, ped2025: 45, ped2026: 75, prod2025: 50, prod2026: 80 },
    ],
  },
};

function aggregatePrograms(programList) {
  const result = { clientes: [], ventas: [] };
  COUNTRIES.forEach(country => {
    const cAgg = { country, t2025: 0, t2026: 0, n2025: 0, n2026: 0, r2025: 0, r2026: 0 };
    const vAgg = { country, monto2025: 0, monto2026: 0, ped2025: 0, ped2026: 0, prod2025: 0, prod2026: 0 };
    programList.forEach(prog => {
      const cd = programData[prog]?.clientes.find(c => c.country === country);
      const vd = programData[prog]?.ventas.find(v => v.country === country);
      if (cd) { cAgg.t2025 += cd.t2025; cAgg.t2026 += cd.t2026; cAgg.n2025 += cd.n2025; cAgg.n2026 += cd.n2026; cAgg.r2025 += cd.r2025; cAgg.r2026 += cd.r2026; }
      if (vd) { vAgg.monto2025 += vd.monto2025; vAgg.monto2026 += vd.monto2026; vAgg.ped2025 += vd.ped2025; vAgg.ped2026 += vd.ped2026; vAgg.prod2025 += vd.prod2025; vAgg.prod2026 += vd.prod2026; }
    });
    result.clientes.push(cAgg);
    result.ventas.push(vAgg);
  });
  return result;
}

const pct = (a, b) => (b && a ? (((a - b) / b) * 100).toFixed(1) : "0.0");
const fmt = (n) => {
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n?.toLocaleString?.() ?? n;
};

const Badge = ({ value }) => {
  const v = parseFloat(value);
  const color = v >= 0 ? COLORS.positive : COLORS.negative;
  return (
    <span style={{
      fontSize: 11, fontWeight: 700, color,
      background: v >= 0 ? "#34d39918" : "#f8717118",
      padding: "2px 7px", borderRadius: 4, marginLeft: 6,
      fontFamily: "'JetBrains Mono', monospace",
    }}>
      {v >= 0 ? "+" : ""}{value}%
    </span>
  );
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{
      background: "#13152aee", border: `1px solid ${COLORS.border}`,
      borderRadius: 8, padding: "10px 14px", fontSize: 12,
      color: COLORS.text, backdropFilter: "blur(8px)",
    }}>
      <div style={{ fontWeight: 700, marginBottom: 6 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 2 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: p.color, display: "inline-block" }} />
          <span style={{ color: COLORS.textMuted }}>{p.name}:</span>
          <span style={{ fontWeight: 600, fontFamily: "'JetBrains Mono', monospace" }}>{fmt(p.value)}</span>
        </div>
      ))}
    </div>
  );
};

const SectionTitle = ({ children, sub }) => (
  <div style={{ marginBottom: 16, marginTop: 32 }}>
    <h2 style={{ fontSize: 18, fontWeight: 800, color: COLORS.text, letterSpacing: "-0.02em", margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{children}</h2>
    {sub && <p style={{ fontSize: 12, color: COLORS.textMuted, margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif" }}>{sub}</p>}
  </div>
);

const KpiCard = ({ label, val2025, val2026, prefix = "", isCurrency }) => {
  const change = pct(val2026, val2025);
  return (
    <div style={{
      background: COLORS.card, borderRadius: 10, padding: "16px 20px",
      border: `1px solid ${COLORS.border}`, flex: 1, minWidth: 140,
    }}>
      <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.05em", fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
        {label}
      </div>
      <div style={{ display: "flex", alignItems: "baseline", gap: 6, marginTop: 8 }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: COLORS.text, fontFamily: "'JetBrains Mono', monospace", letterSpacing: "-0.02em" }}>
          {prefix}{isCurrency ? fmt(val2026) : val2026?.toLocaleString()}
        </span>
        <Badge value={change} />
      </div>
      <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 4, fontFamily: "'JetBrains Mono', monospace" }}>
        vs {prefix}{isCurrency ? fmt(val2025) : val2025?.toLocaleString()} (2025)
      </div>
    </div>
  );
};

const ChartCard = ({ title, children }) => (
  <div style={{
    background: COLORS.card, borderRadius: 12, padding: 20,
    border: `1px solid ${COLORS.border}`,
    flex: "1 1 calc(50% - 10px)", minWidth: 340,
  }}>
    <h3 style={{ fontSize: 13, fontWeight: 700, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.04em", marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>{title}</h3>
    {children}
  </div>
);

const YoYBarChart = ({ data, yPrefix = "" }) => (
  <ResponsiveContainer width="100%" height={220}>
    <BarChart data={data} barGap={4} barCategoryGap="25%">
      <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
      <XAxis dataKey="country" tick={{ fill: COLORS.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
      <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => `${yPrefix}${fmt(v)}`} />
      <Tooltip content={<CustomTooltip />} />
      <Legend wrapperStyle={{ fontSize: 11 }} />
      <Bar dataKey="Ene-Feb 2025" fill={COLORS.y2025} radius={[4, 4, 0, 0]} />
      <Bar dataKey="Ene-Feb 2026" fill={COLORS.y2026} radius={[4, 4, 0, 0]} />
    </BarChart>
  </ResponsiveContainer>
);

const VIEW_MODES = [
  { key: "consolidated", label: "Consolidado" },
  { key: "modalidad", label: "Por Modalidad" },
  ...PROGRAM_TYPES.map(p => ({ key: p, label: p })),
];

// ── Login Screen ──
const LoginScreen = ({ onLogin }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const handleLogin = () => {
    if (password === "consejo") {
      onLogin();
    } else {
      setError(true);
      setPassword("");
      setTimeout(() => setError(false), 3000);
    }
  };

  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)",
      display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999,
    }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <div style={{
        background: "rgba(255,255,255,0.1)", backdropFilter: "blur(10px)",
        borderRadius: 20, padding: 50, border: "1px solid rgba(255,255,255,0.2)",
        textAlign: "center", maxWidth: 400, width: "90%",
      }}>
        <div style={{ fontSize: 48, fontWeight: 800, color: "#fff", letterSpacing: 2, ... }}>
  🚀 ADIPA
</div>
        <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 14, marginBottom: 12, fontFamily: "'DM Sans', sans-serif" }}>
          adipa.report/yoy
        </div>
        <div style={{ color: "rgba(255,255,255,0.8)", fontSize: 18, marginBottom: 36, fontFamily: "'DM Sans', sans-serif" }}>
          Unit Economics & Ventas
        </div>
        <h2 style={{ color: "#fff", marginBottom: 28, fontSize: 22, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
          Acceso Restringido
        </h2>
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleLogin()}
          style={{
            width: "100%", padding: 15, borderRadius: 10,
            border: "2px solid rgba(255,255,255,0.3)",
            background: "rgba(255,255,255,0.1)", color: "#fff",
            fontSize: 16, marginBottom: 20, outline: "none",
            fontFamily: "'DM Sans', sans-serif",
          }}
        />
        <button onClick={handleLogin} style={{
          width: "100%", padding: 15,
          background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
          border: "none", borderRadius: 10, color: "#fff",
          fontSize: 16, fontWeight: 700, cursor: "pointer",
          fontFamily: "'DM Sans', sans-serif",
          transition: "all 0.3s",
        }}>
          Ingresar
        </button>
        {error && (
          <div style={{
            color: "#f87171", background: "rgba(248,113,113,0.1)",
            padding: 10, borderRadius: 8, marginTop: 15, fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            Contraseña incorrecta
          </div>
        )}
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeView, setActiveView] = useState("consolidated");

  const viewData = useMemo(() => {
    if (activeView === "consolidated") return { main: aggregatePrograms(PROGRAM_TYPES), label: "Consolidado" };
    if (activeView === "modalidad") return { sync: aggregatePrograms(SYNC_PROGRAMS), async: aggregatePrograms(ASYNC_PROGRAMS), label: "Modalidad" };
    return { main: programData[activeView], label: activeView };
  }, [activeView]);

  const isModalidad = activeView === "modalidad";

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  const buildChartData = (source) => {
    const cTotal = source.clientes.map(d => ({ country: d.country, "Ene-Feb 2025": d.t2025, "Ene-Feb 2026": d.t2026 }));
    const cStacked = source.clientes.map(d => ({
      country: d.country,
      "Nuevos 2025": d.n2025, "Recurrentes 2025": d.r2025,
      "Nuevos 2026": d.n2026, "Recurrentes 2026": d.r2026,
    }));
    const vMonto = source.ventas.map(d => ({ country: d.country, "Ene-Feb 2025": d.monto2025, "Ene-Feb 2026": d.monto2026 }));
    const vPedidos = source.ventas.map(d => ({ country: d.country, "Ene-Feb 2025": d.ped2025, "Ene-Feb 2026": d.ped2026 }));
    const vProductos = source.ventas.map(d => ({ country: d.country, "Ene-Feb 2025": d.prod2025, "Ene-Feb 2026": d.prod2026 }));
    const sumC = source.clientes.reduce((a, d) => ({ t25: a.t25 + d.t2025, t26: a.t26 + d.t2026, n25: a.n25 + d.n2025, n26: a.n26 + d.n2026 }), { t25: 0, t26: 0, n25: 0, n26: 0 });
    const sumV = source.ventas.reduce((a, d) => ({ m25: a.m25 + d.monto2025, m26: a.m26 + d.monto2026, p25: a.p25 + d.ped2025, p26: a.p26 + d.ped2026, pr25: a.pr25 + d.prod2025, pr26: a.pr26 + d.prod2026 }), { m25: 0, m26: 0, p25: 0, p26: 0, pr25: 0, pr26: 0 });
    const tk25 = sumV.p25 ? sumV.m25 / sumV.p25 : 0;
    const tk26 = sumV.p26 ? sumV.m26 / sumV.p26 : 0;
    const ticket = source.ventas.map(d => ({
      country: d.country,
      "Ene-Feb 2025": d.ped2025 ? Math.round(d.monto2025 / d.ped2025 * 100) / 100 : 0,
      "Ene-Feb 2026": d.ped2026 ? Math.round(d.monto2026 / d.ped2026 * 100) / 100 : 0,
    }));
    return { cTotal, cStacked, vMonto, vPedidos, vProductos, ticket, sumC, sumV, tk25, tk26 };
  };

  const renderMetricBlock = (source, titlePrefix = "") => {
    const d = buildChartData(source);
    const pre = titlePrefix ? `${titlePrefix} — ` : "";
    return (
      <>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
          <KpiCard label="Clientes Totales" val2025={d.sumC.t25} val2026={d.sumC.t26} />
          <KpiCard label="Clientes Nuevos" val2025={d.sumC.n25} val2026={d.sumC.n26} />
          <KpiCard label="Ventas (USD)" val2025={d.sumV.m25} val2026={d.sumV.m26} prefix="$" isCurrency />
          <KpiCard label="N° Pedidos" val2025={d.sumV.p25} val2026={d.sumV.p26} />
          <KpiCard label="N° Productos" val2025={d.sumV.pr25} val2026={d.sumV.pr26} />
          <KpiCard label="Ticket Promedio" val2025={Math.round(d.tk25 * 100) / 100} val2026={Math.round(d.tk26 * 100) / 100} prefix="$" />
        </div>

        <SectionTitle sub={`${pre}Comparativo por país — Ene/Feb 2025 vs 2026`}>Clientes</SectionTitle>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <ChartCard title="Clientes Totales por País (YoY)">
            <YoYBarChart data={d.cTotal} />
          </ChartCard>
          <ChartCard title="Composición: Nuevos vs Recurrentes">
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={d.cStacked} barGap={2} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke={COLORS.border} vertical={false} />
                <XAxis dataKey="country" tick={{ fill: COLORS.textMuted, fontSize: 12 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: COLORS.textMuted, fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={fmt} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="Nuevos 2025" stackId="a" fill="#4a4368" />
                <Bar dataKey="Recurrentes 2025" stackId="a" fill="#6b5b8d" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Nuevos 2026" stackId="b" fill={COLORS.cyan} />
                <Bar dataKey="Recurrentes 2026" stackId="b" fill={COLORS.purple} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        <SectionTitle sub={`${pre}Monto, pedidos y productos`}>Ventas</SectionTitle>
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
          <ChartCard title="Monto de Ventas (USD)">
            <YoYBarChart data={d.vMonto} yPrefix="$" />
          </ChartCard>
          <ChartCard title="N° de Pedidos">
            <YoYBarChart data={d.vPedidos} />
          </ChartCard>
          <ChartCard title="N° de Productos Vendidos">
            <YoYBarChart data={d.vProductos} />
          </ChartCard>
          <ChartCard title="Ticket Promedio (USD)">
            <YoYBarChart data={d.ticket} yPrefix="$" />
          </ChartCard>
        </div>
      </>
    );
  };

  const renderSmallMultiples = (programList, label) => (
    <>
      <SectionTitle sub={`Ventas por tipo de programa — ${label}`}>Small Multiples: {label}</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12 }}>
        {programList.map(prog => {
          const d = programData[prog].ventas.map(v => ({ country: v.country, "2025": v.monto2025, "2026": v.monto2026 }));
          const mod = MODALIDAD_MAP[prog];
          return (
            <div key={prog} style={{ background: COLORS.card, borderRadius: 10, padding: "14px 16px", border: `1px solid ${COLORS.border}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                <div style={{ fontSize: 12, fontWeight: 700, color: COLORS.text }}>{prog}</div>
                <span style={{
                  fontSize: 9, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
                  padding: "2px 8px", borderRadius: 4,
                  background: mod === "Sincrónico" ? "#22c3f018" : "#f59e0b18",
                  color: mod === "Sincrónico" ? COLORS.sync : COLORS.async,
                }}>
                  {mod === "Sincrónico" ? "SYNC" : "ASYNC"}
                </span>
              </div>
              <ResponsiveContainer width="100%" height={130}>
                <BarChart data={d} barGap={2} barCategoryGap="20%">
                  <XAxis dataKey="country" tick={{ fill: COLORS.textMuted, fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: COLORS.textMuted, fontSize: 9 }} axisLine={false} tickLine={false} tickFormatter={v => `$${fmt(v)}`} width={50} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="2025" fill={COLORS.y2025} radius={[3, 3, 0, 0]} />
                  <Bar dataKey="2026" fill={COLORS.y2026} radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          );
        })}
      </div>
    </>
  );

  return (
    <div style={{ background: COLORS.bg, minHeight: "100vh", color: COLORS.text, fontFamily: "'DM Sans', sans-serif", padding: "24px 28px" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600;700;800&display=swap" rel="stylesheet" />

      <div style={{ marginBottom: 8 }}>
        <div style={{ fontSize: 11, color: COLORS.accent, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>ADIPA — Unit Economics & Ventas</div>
        <h1 style={{ fontSize: 28, fontWeight: 800, margin: "6px 0 4px", letterSpacing: "-0.03em" }}>Comparativo Ene-Feb 2025 vs 2026</h1>
        <p style={{ fontSize: 13, color: COLORS.textMuted, margin: 0 }}>Datos de ejemplo · Reemplazar con datos reales</p>
      </div>

      {/* Tabs */}
      <div style={{ marginTop: 20, marginBottom: 6 }}>
        <div style={{ fontSize: 10, color: COLORS.textMuted, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8, fontWeight: 600 }}>Vista</div>
        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
          {VIEW_MODES.map(v => {
            const isActive = activeView === v.key;
            const isMod = v.key === "modalidad";
            return (
              <button key={v.key} onClick={() => setActiveView(v.key)} style={{
                background: isActive ? (isMod ? "#22c3f0" : COLORS.accent) : "transparent",
                color: isActive ? "#fff" : COLORS.textMuted,
                border: `1px solid ${isActive ? (isMod ? "#22c3f0" : COLORS.accent) : COLORS.border}`,
                borderRadius: 6, padding: "6px 14px", fontSize: 12, fontWeight: 600,
                cursor: "pointer", transition: "all 0.15s", fontFamily: "'DM Sans', sans-serif",
              }}>
                {v.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Modalidad badge for single program */}
      {!isModalidad && activeView !== "consolidated" && MODALIDAD_MAP[activeView] && (
        <div style={{ marginTop: 10 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em",
            padding: "3px 10px", borderRadius: 4,
            background: MODALIDAD_MAP[activeView] === "Sincrónico" ? "#22c3f018" : "#f59e0b18",
            color: MODALIDAD_MAP[activeView] === "Sincrónico" ? COLORS.sync : COLORS.async,
          }}>
            Modalidad: {MODALIDAD_MAP[activeView]}
          </span>
        </div>
      )}

      {/* Consolidated or single program */}
      {!isModalidad && viewData.main && (
        <div style={{ marginTop: 20 }}>
          {renderMetricBlock(viewData.main)}
          {activeView === "consolidated" && renderSmallMultiples(PROGRAM_TYPES, "Todos los Programas")}
        </div>
      )}

      {/* Modalidad view */}
      {isModalidad && (
        <>
          <div style={{ marginTop: 20, padding: "20px 0 0", borderTop: `2px solid ${COLORS.sync}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.sync, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>Sincrónico</span>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{SYNC_PROGRAMS.join(" · ")}</span>
            </div>
            {renderMetricBlock(viewData.sync, "Sincrónico")}
            {renderSmallMultiples(SYNC_PROGRAMS, "Sincrónicos")}
          </div>

          <div style={{ marginTop: 40, padding: "20px 0 0", borderTop: `2px solid ${COLORS.async}33` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 20, fontWeight: 800, color: COLORS.async, fontFamily: "'DM Sans', sans-serif", letterSpacing: "-0.02em" }}>Asincrónico</span>
              <span style={{ fontSize: 11, color: COLORS.textMuted }}>{ASYNC_PROGRAMS.join(" · ")}</span>
            </div>
            {renderMetricBlock(viewData.async, "Asincrónico")}
            {renderSmallMultiples(ASYNC_PROGRAMS, "Asincrónicos")}
          </div>
        </>
      )}

      <div style={{
        marginTop: 32, padding: "16px 20px", background: "#1c1f3a80",
        borderRadius: 10, border: `1px solid ${COLORS.border}`,
        fontSize: 12, color: COLORS.textMuted, lineHeight: 1.6,
      }}>
        <strong style={{ color: COLORS.text }}>Nota:</strong> Datos de ejemplo. Para poblar con datos reales, necesitaré un export con las métricas por país y tipo de programa.
      </div>
    </div>
  );
}
