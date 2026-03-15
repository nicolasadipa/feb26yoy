import { BigQuery } from "@google-cloud/bigquery";
import type { ProgramMetrics } from "@/types";

const COUNTRY_MAP: Record<string, ProgramMetrics["country"]> = {
  Chile:    "Chile",
  Colombia: "Colombia",
  Mexico:   "México",
};

const PROGRAM_MAP: Record<string, ProgramMetrics["program"]> = {
  "Acreditacion":      "Acreditación Internacional",
  "Curso Asincronico": "Curso Asincrónico",
  "Curso Sincronico":  "Curso Sincrónico",
  "Diplomado":         "Diplomado",
  "Especializacion":   "Especialización",
  "Postitulo":         "Postítulo",
  "Sesion Magistral":  "Sesiones Magistrales",
};

const EXCLUDED = ["Seminario", "Gift Card", "No Categorizado", "Bateria Evalua", "Congreso"];

function getClient(): BigQuery {
  const raw = process.env.BQ_SERVICE_ACCOUNT;
  if (!raw) throw new Error("BQ_SERVICE_ACCOUNT env var is required");
  const credentials = JSON.parse(raw);
  return new BigQuery({
    projectId: process.env.BQ_PROJECT_ID || "adipa-cl-331013",
    credentials,
  });
}

// Query accepts a date range for the "current" period.
// The previous period is the same date range shifted back 1 year.
const QUERY = `
WITH all_ventas AS (
  SELECT Cust_id, Date_oc, Tipo_producto, Pais, Id_oc,
         CAST(Valor_pagado AS FLOAT64)   AS Valor_pagado,
         CAST(Num_items_sold AS FLOAT64) AS Num_items_sold
  FROM \`adipa-cl-331013.chile_ventas_produccion.ventas_producto_diario_resumen\`
  UNION ALL
  SELECT Cust_id, Date_oc, Tipo_producto, Pais, Id_oc,
         CAST(Valor_pagado AS FLOAT64),
         CAST(Num_items_sold AS FLOAT64)
  FROM \`adipa-cl-331013.colombia_ventas_produccion.ventas_producto_diario_resumen\`
  UNION ALL
  SELECT Cust_id, Date_oc, Tipo_producto, Pais, Id_oc,
         CAST(Valor_pagado AS FLOAT64),
         CAST(Num_items_sold AS FLOAT64)
  FROM \`adipa-cl-331013.mexico_ventas_produccion.ventas_producto_diario_resumen\`
),
first_purchase AS (
  SELECT Cust_id, MIN(Date_oc) AS primera_compra
  FROM all_ventas
  WHERE Cust_id IS NOT NULL
  GROUP BY Cust_id
),
ventas_period AS (
  SELECT
    v.Cust_id, v.Tipo_producto, v.Pais, v.Id_oc,
    v.Valor_pagado,
    COALESCE(v.Num_items_sold, 1) AS Num_items_sold,
    -- Label each row as current year or previous year
    CASE
      WHEN DATE(v.Date_oc) BETWEEN @date_from AND @date_to
      THEN EXTRACT(YEAR FROM @date_to)
      ELSE EXTRACT(YEAR FROM DATE_SUB(@date_to, INTERVAL 1 YEAR))
    END AS anio,
    -- New client = first purchase falls within the same period (current or prev)
    CASE
      WHEN DATE(v.Date_oc) BETWEEN @date_from AND @date_to
        AND DATE(fp.primera_compra) BETWEEN @date_from AND @date_to
      THEN TRUE
      WHEN DATE(v.Date_oc) BETWEEN DATE_SUB(@date_from, INTERVAL 1 YEAR)
                                AND DATE_SUB(@date_to, INTERVAL 1 YEAR)
        AND DATE(fp.primera_compra) BETWEEN DATE_SUB(@date_from, INTERVAL 1 YEAR)
                                        AND DATE_SUB(@date_to, INTERVAL 1 YEAR)
      THEN TRUE
      ELSE FALSE
    END AS es_nuevo
  FROM all_ventas v
  LEFT JOIN first_purchase fp ON v.Cust_id = fp.Cust_id
  WHERE (
    DATE(v.Date_oc) BETWEEN @date_from AND @date_to
    OR DATE(v.Date_oc) BETWEEN DATE_SUB(@date_from, INTERVAL 1 YEAR)
                           AND DATE_SUB(@date_to, INTERVAL 1 YEAR)
  )
  AND v.Tipo_producto NOT IN UNNEST(@excluded)
  AND v.Tipo_producto IS NOT NULL
)
SELECT
  Pais                                                       AS country,
  Tipo_producto                                              AS program,
  anio                                                       AS year,
  COUNT(DISTINCT Cust_id)                                    AS clientes_totales,
  COUNT(DISTINCT CASE WHEN es_nuevo     THEN Cust_id END)    AS clientes_nuevos,
  COUNT(DISTINCT CASE WHEN NOT es_nuevo THEN Cust_id END)    AS clientes_recurrentes,
  ROUND(SUM(Valor_pagado), 2)                                AS ventas_monto,
  COUNT(DISTINCT Id_oc)                                      AS ventas_pedidos,
  CAST(SUM(Num_items_sold) AS INT64)                         AS ventas_productos,
  CASE WHEN COUNT(DISTINCT Id_oc) > 0
       THEN ROUND(SUM(Valor_pagado) / COUNT(DISTINCT Id_oc), 2)
       ELSE 0 END                                            AS ticket_promedio
FROM ventas_period
GROUP BY country, program, year
ORDER BY country, program, year
`;

export async function fetchMetricsFromBQ(dateFrom: string, dateTo: string): Promise<ProgramMetrics[]> {
  const bq = getClient();
  const [rows] = await bq.query({
    query: QUERY,
    params: {
      date_from: dateFrom,
      date_to:   dateTo,
      excluded:  EXCLUDED,
    },
    types: {
      date_from: "DATE",
      date_to:   "DATE",
    },
  });

  return rows
    .filter((r: Record<string, unknown>) =>
      COUNTRY_MAP[r.country as string] && PROGRAM_MAP[r.program as string]
    )
    .map((r: Record<string, unknown>) => ({
      country:              COUNTRY_MAP[r.country as string],
      program:              PROGRAM_MAP[r.program as string],
      year:                 Number(r.year),
      clientes_totales:     Number(r.clientes_totales),
      clientes_nuevos:      Number(r.clientes_nuevos),
      clientes_recurrentes: Number(r.clientes_recurrentes),
      ventas_monto:         Number(r.ventas_monto),
      ventas_pedidos:       Number(r.ventas_pedidos),
      ventas_productos:     Number(r.ventas_productos),
      ticket_promedio:      Number(r.ticket_promedio),
    }));
}
