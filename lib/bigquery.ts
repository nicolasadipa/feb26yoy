import { BigQuery } from "@google-cloud/bigquery";
import type { ProgramMetrics } from "@/types";

// ─── Config ────────────────────────────────────────────────────────────────
// Set these in Vercel environment variables (or .env.local for dev):
//   BQ_PROJECT_ID       → adipa-cl-331013
//   BQ_DATASET          → your_dataset_name   (e.g. "ventas" or "adipa_data")
//   BQ_TABLE            → your_table_name     (e.g. "ordenes" or "ventas_detalle")
//   BQ_SERVICE_ACCOUNT  → full JSON string of the service account key
//
// Required BigQuery table columns (adapt query in queries.ts if names differ):
//   pais                STRING   → 'Chile' | 'México' | 'Colombia'
//   tipo_producto       STRING   → 'Curso Sincrónico' | 'Diplomado' | etc.
//   anio                INT64    → 2025 | 2026
//   clientes_totales    INT64
//   clientes_nuevos     INT64
//   clientes_recurrentes INT64
//   ventas_monto        FLOAT64
//   ventas_pedidos      INT64
//   ventas_productos    INT64
//   ticket_promedio     FLOAT64
// ─────────────────────────────────────────────────────────────────────────

function getClient(): BigQuery {
  const raw = process.env.BQ_SERVICE_ACCOUNT;
  if (raw) {
    const credentials = JSON.parse(raw);
    return new BigQuery({
      projectId: process.env.BQ_PROJECT_ID || credentials.project_id,
      credentials,
    });
  }
  // Fallback: use GOOGLE_APPLICATION_CREDENTIALS env var path
  return new BigQuery({ projectId: process.env.BQ_PROJECT_ID });
}

export async function fetchMetricsFromBQ(): Promise<ProgramMetrics[]> {
  const dataset = process.env.BQ_DATASET;
  const table   = process.env.BQ_TABLE;

  if (!dataset || !table) {
    throw new Error("BQ_DATASET and BQ_TABLE env vars are required");
  }

  const bq = getClient();

  const query = `
    SELECT
      pais                 AS country,
      tipo_producto        AS program,
      anio                 AS year,
      clientes_totales,
      clientes_nuevos,
      clientes_recurrentes,
      ventas_monto,
      ventas_pedidos,
      ventas_productos,
      ticket_promedio
    FROM \`${process.env.BQ_PROJECT_ID}.${dataset}.${table}\`
    WHERE anio IN (2025, 2026)
      AND tipo_producto NOT IN ('Seminario')
    ORDER BY pais, tipo_producto, anio
  `;

  const [rows] = await bq.query({ query });

  return rows.map((row: Record<string, unknown>) => ({
    country:              row.country as ProgramMetrics["country"],
    program:              row.program as ProgramMetrics["program"],
    year:                 Number(row.year),
    clientes_totales:     Number(row.clientes_totales),
    clientes_nuevos:      Number(row.clientes_nuevos),
    clientes_recurrentes: Number(row.clientes_recurrentes),
    ventas_monto:         Number(row.ventas_monto),
    ventas_pedidos:       Number(row.ventas_pedidos),
    ventas_productos:     Number(row.ventas_productos),
    ticket_promedio:      Number(row.ticket_promedio),
  }));
}
