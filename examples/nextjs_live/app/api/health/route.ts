import { NextResponse } from "next/server";
import { buildGreeting } from "@/lib/greeting";

export async function GET() {
  return NextResponse.json({
    ok: true,
    greeting: buildGreeting("api"),
  });
}
