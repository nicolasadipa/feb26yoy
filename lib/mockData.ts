import type { ProgramMetrics, ProgramType, Country } from "@/types";

const COUNTRIES: Country[] = ["Chile", "México", "Colombia"];

const raw: Record<ProgramType, {
  clientes: { country: Country; t25: number; t26: number; n25: number; n26: number; r25: number; r26: number }[];
  ventas: { country: Country; m25: number; m26: number; ped25: number; ped26: number; prod25: number; prod26: number }[];
}> = {
  "Curso Sincrónico": {
    clientes: [
      { country: "Chile",    t25: 1200, t26: 1400, n25: 520,  n26: 650,  r25: 680,  r26: 750 },
      { country: "México",   t25: 320,  t26: 470,  n25: 200,  n26: 300,  r25: 120,  r26: 170 },
      { country: "Colombia", t25: 230,  t26: 330,  n25: 140,  n26: 210,  r25: 90,   r26: 120 },
    ],
    ventas: [
      { country: "Chile",    m25: 62000,  m26: 78000,  ped25: 1100, ped26: 1300, prod25: 1350, prod26: 1700 },
      { country: "México",   m25: 17000,  m26: 25000,  ped25: 290,  ped26: 420,  prod25: 340,  prod26: 510 },
      { country: "Colombia", m25: 11000,  m26: 16000,  ped25: 210,  ped26: 300,  prod25: 250,  prod26: 360 },
    ],
  },
  "Curso Asincrónico": {
    clientes: [
      { country: "Chile",    t25: 600,  t26: 750,  n25: 300, n26: 400, r25: 300, r26: 350 },
      { country: "México",   t25: 180,  t26: 280,  n25: 120, n26: 190, r25: 60,  r26: 90 },
      { country: "Colombia", t25: 130,  t26: 200,  n25: 80,  n26: 130, r25: 50,  r26: 70 },
    ],
    ventas: [
      { country: "Chile",    m25: 28000, m26: 38000, ped25: 550, ped26: 700, prod25: 650, prod26: 850 },
      { country: "México",   m25: 8000,  m26: 13000, ped25: 160, ped26: 250, prod25: 190, prod26: 300 },
      { country: "Colombia", m25: 5000,  m26: 8000,  ped25: 120, ped26: 180, prod25: 140, prod26: 220 },
    ],
  },
  "Acreditación Internacional": {
    clientes: [
      { country: "Chile",    t25: 250, t26: 380, n25: 180, n26: 280, r25: 70,  r26: 100 },
      { country: "México",   t25: 60,  t26: 110, n25: 45,  n26: 80,  r25: 15,  r26: 30 },
      { country: "Colombia", t25: 40,  t26: 75,  n25: 30,  n26: 55,  r25: 10,  r26: 20 },
    ],
    ventas: [
      { country: "Chile",    m25: 42000, m26: 65000, ped25: 240, ped26: 370, prod25: 250, prod26: 380 },
      { country: "México",   m25: 10000, m26: 18000, ped25: 55,  ped26: 100, prod25: 60,  prod26: 110 },
      { country: "Colombia", m25: 6500,  m26: 12000, ped25: 38,  ped26: 70,  prod25: 40,  prod26: 75 },
    ],
  },
  "Sesiones Magistrales": {
    clientes: [
      { country: "Chile",    t25: 350, t26: 420, n25: 200, n26: 250, r25: 150, r26: 170 },
      { country: "México",   t25: 90,  t26: 140, n25: 60,  n26: 95,  r25: 30,  r26: 45 },
      { country: "Colombia", t25: 65,  t26: 100, n25: 40,  n26: 65,  r25: 25,  r26: 35 },
    ],
    ventas: [
      { country: "Chile",    m25: 10500, m26: 14000, ped25: 330, ped26: 400, prod25: 350, prod26: 420 },
      { country: "México",   m25: 2700,  m26: 4500,  ped25: 85,  ped26: 130, prod25: 90,  prod26: 140 },
      { country: "Colombia", m25: 1800,  m26: 3000,  ped25: 60,  ped26: 95,  prod25: 65,  prod26: 100 },
    ],
  },
  "Especialización": {
    clientes: [
      { country: "Chile",    t25: 600, t26: 750,  n25: 250, n26: 350, r25: 350, r26: 400 },
      { country: "México",   t25: 150, t26: 230,  n25: 100, n26: 150, r25: 50,  r26: 80 },
      { country: "Colombia", t25: 110, t26: 150,  n25: 70,  n26: 100, r25: 40,  r26: 50 },
    ],
    ventas: [
      { country: "Chile",    m25: 35000, m26: 45000, ped25: 550, ped26: 680, prod25: 700, prod26: 900 },
      { country: "México",   m25: 10000, m26: 14000, ped25: 130, ped26: 190, prod25: 160, prod26: 250 },
      { country: "Colombia", m25: 6000,  m26: 9000,  ped25: 100, ped26: 140, prod25: 120, prod26: 180 },
    ],
  },
  "Diplomado": {
    clientes: [
      { country: "Chile",    t25: 1400, t26: 1800, n25: 600, n26: 850, r25: 800, r26: 950 },
      { country: "México",   t25: 350,  t26: 550,  n25: 220, n26: 360, r25: 130, r26: 190 },
      { country: "Colombia", t25: 260,  t26: 380,  n25: 170, n26: 250, r25: 90,  r26: 130 },
    ],
    ventas: [
      { country: "Chile",    m25: 180000, m26: 230000, ped25: 1300, ped26: 1700, prod25: 1400, prod26: 1900 },
      { country: "México",   m25: 45000,  m26: 68000,  ped25: 320,  ped26: 500,  prod25: 350,  prod26: 560 },
      { country: "Colombia", m25: 30000,  m26: 46000,  ped25: 240,  ped26: 350,  prod25: 270,  prod26: 400 },
    ],
  },
  "Postítulo": {
    clientes: [
      { country: "Chile",    t25: 300, t26: 420, n25: 150, n26: 220, r25: 150, r26: 200 },
      { country: "México",   t25: 70,  t26: 120, n25: 45,  n26: 80,  r25: 25,  r26: 40 },
      { country: "Colombia", t25: 50,  t26: 80,  n25: 30,  n26: 50,  r25: 20,  r26: 30 },
    ],
    ventas: [
      { country: "Chile",    m25: 48000, m26: 68000, ped25: 280, ped26: 400, prod25: 300, prod26: 420 },
      { country: "México",   m25: 11000, m26: 19000, ped25: 65,  ped26: 110, prod25: 70,  prod26: 120 },
      { country: "Colombia", m25: 7500,  m26: 12000, ped25: 45,  ped26: 75,  prod25: 50,  prod26: 80 },
    ],
  },
};

export function getMockData(): ProgramMetrics[] {
  const result: ProgramMetrics[] = [];
  const programs = Object.keys(raw) as ProgramType[];

  for (const program of programs) {
    for (const country of COUNTRIES) {
      const c = raw[program].clientes.find((x) => x.country === country)!;
      const v = raw[program].ventas.find((x) => x.country === country)!;
      result.push({
        program, country, year: 2025,
        clientes_totales: c.t25, clientes_nuevos: c.n25, clientes_recurrentes: c.r25,
        ventas_monto: v.m25, ventas_pedidos: v.ped25, ventas_productos: v.prod25,
        ticket_promedio: v.ped25 ? Math.round(v.m25 / v.ped25) : 0,
      });
      result.push({
        program, country, year: 2026,
        clientes_totales: c.t26, clientes_nuevos: c.n26, clientes_recurrentes: c.r26,
        ventas_monto: v.m26, ventas_pedidos: v.ped26, ventas_productos: v.prod26,
        ticket_promedio: v.ped26 ? Math.round(v.m26 / v.ped26) : 0,
      });
    }
  }
  return result;
}
