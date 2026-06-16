import { NextResponse } from "next/server";
import { sendLeadEmail } from "@/lib/email/sendLeadEmail";
import type { LeadPayload } from "@/types/travel";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isLeadPayload(value: unknown): value is LeadPayload {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Record<string, unknown>;
  return (
    typeof candidate.tourId === "string" &&
    typeof candidate.name === "string" &&
    typeof candidate.phone === "string" &&
    typeof candidate.email === "string" &&
    (candidate.locale === "ru" || candidate.locale === "en") &&
    candidate.name.trim().length >= 2 &&
    candidate.phone.trim().length >= 5 &&
    isEmail(candidate.email)
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isLeadPayload(body)) {
      return NextResponse.json({ ok: false, error: "Invalid lead payload" }, { status: 400 });
    }

    const result = await sendLeadEmail({
      ...body,
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email.trim()
    });

    return NextResponse.json({ ok: true, ...result });
  } catch (error) {
    console.error("[lead-api-error]", error);
    return NextResponse.json({ ok: false, error: "Lead request failed" }, { status: 500 });
  }
}
