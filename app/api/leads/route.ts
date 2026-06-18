import { NextResponse } from "next/server";
import { sendLeadEmail } from "@/lib/email/sendLeadEmail";
import { saveLead } from "@/lib/db/leads";
import type { LeadPayload } from "@/types/travel";

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isValidRuPhone(value: string) {
  const digits = value.replace(/\D/g, "");
  return digits.length === 11 && (digits.startsWith("7") || digits.startsWith("8"));
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
    isValidRuPhone(candidate.phone as string) &&
    isEmail(candidate.email)
  );
}

export async function POST(request: Request) {
  try {
    const body: unknown = await request.json();

    if (!isLeadPayload(body)) {
      return NextResponse.json({ ok: false, error: "Invalid lead payload" }, { status: 400 });
    }

    const cleanPayload: LeadPayload = {
      ...body,
      name: body.name.trim(),
      phone: body.phone.trim(),
      email: body.email.trim()
    };

    // 1. Save to SQLite (always, regardless of email config)
    const { id } = saveLead(cleanPayload);

    // 2. Try to send email notification (optional, non-blocking for the response)
    let emailResult = { sent: false, placeholder: true };
    try {
      emailResult = await sendLeadEmail(cleanPayload);
    } catch (emailError) {
      console.warn("[lead-email-warning] Email sending failed, lead already saved to DB:", emailError);
    }

    return NextResponse.json({ ok: true, leadId: id, ...emailResult });
  } catch (error) {
    console.error("[lead-api-error]", error);
    return NextResponse.json({ ok: false, error: "Lead request failed" }, { status: 500 });
  }
}

// Optional: GET endpoint to retrieve leads (add auth middleware in production!)
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get("limit") ?? "100", 10), 500);
    const { getLeads, getLeadsCount } = await import("@/lib/db/leads");
    const leads = getLeads(limit);
    const total = getLeadsCount();
    return NextResponse.json({ ok: true, total, leads });
  } catch (error) {
    console.error("[leads-get-error]", error);
    return NextResponse.json({ ok: false, error: "Failed to fetch leads" }, { status: 500 });
  }
}
