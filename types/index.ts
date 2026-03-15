export type Country = "Chile" | "México" | "Colombia";
export type CountryView = "Consolidado" | Country;

export type ProgramType =
  | "Curso Sincrónico"
  | "Curso Asincrónico"
  | "Acreditación Internacional"
  | "Sesiones Magistrales"
  | "Especialización"
  | "Diplomado"
  | "Postítulo";

export type Modalidad = "Sincrónico" | "Asincrónico";

export interface ProgramMetrics {
  program: ProgramType;
  country: Country;
  year: number;
  clientes_totales: number;
  clientes_nuevos: number;
  clientes_recurrentes: number;
  ventas_monto: number;
  ventas_pedidos: number;
  ventas_productos: number;
  ticket_promedio: number;
}

export interface AggregatedMetrics {
  clientes_totales: number;
  clientes_nuevos: number;
  clientes_recurrentes: number;
  ventas_monto: number;
  ventas_pedidos: number;
  ventas_productos: number;
  ticket_promedio: number;
}

export interface CountryData {
  country: CountryView;
  y2025: number;
  y2026: number;
}

export interface ApiResponse {
  data: ProgramMetrics[];
  source: "bigquery" | "mock";
  error?: string;
  dateFrom?: string;
  dateTo?: string;
}
