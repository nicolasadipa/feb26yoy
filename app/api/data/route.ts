import { NextResponse } from "next/server";
import { fetchMetricsFromBQ } from "@/lib/bigquery";
import { getMockData } from "@/lib/mockData";
import type { ApiResponse } from "@/types";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const dateFrom = searchParams.get("from") || "2026-01-01";
  const dateTo   = searchParams.get("to")   || new Date().toISOString().slice(0, 10);

  const bqConfigured = !!process.env.BQ_SERVICE_ACCOUNT;

  if (bqConfigured) {
    try {
      const data = await fetchMetricsFromBQ(dateFrom, dateTo);
      return NextResponse.json<ApiResponse>({ data, source: "bigquery", dateFrom, dateTo });
    } catch (err) {
      const error = err instanceof Error ? err.message : "BigQuery error";
      console.error("[BQ Error]", error);
      return NextResponse.json<ApiResponse>({ data: getMockData(), source: "mock", error, dateFrom, dateTo });
    }
  }

  return NextResponse.json<ApiResponse>({ data: getMockData(), source: "mock", dateFrom, dateTo });
}
