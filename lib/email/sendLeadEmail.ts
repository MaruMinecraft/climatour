import { mockTours } from "@/data/mockTours";
import type { LeadPayload } from "@/types/travel";

export interface SendLeadEmailResult {
  sent: boolean;
  placeholder: boolean;
}

function isPlaceholder(value: string | undefined) {
  return !value || value.trim() === "" || value.trim() === "changeme";
}

export async function sendLeadEmail(payload: LeadPayload): Promise<SendLeadEmailResult> {
  const user = process.env.GMAIL_USER ?? "changeme";
  const pass = process.env.GMAIL_APP_PASSWORD ?? "changeme";
  const to = process.env.LEADS_TO_EMAIL ?? "cookieshinobu380@gmail.com";
  const from = process.env.LEADS_FROM_EMAIL ?? user;
  const tour = mockTours.find((item) => item.id === payload.tourId);

  if (!tour) {
    throw new Error("Tour not found");
  }

  if (isPlaceholder(user) || isPlaceholder(pass) || isPlaceholder(from)) {
    console.info("[lead-email-placeholder]", {
      to,
      tourId: payload.tourId,
      name: payload.name,
      phone: payload.phone,
      email: payload.email
    });
    return { sent: false, placeholder: true };
  }

  const nodemailer = await import("nodemailer");
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user,
      pass
    }
  });

  await transporter.sendMail({
    from,
    to,
    subject: `Climatour lead: ${tour.title}`,
    text: [
      "New Climatour request",
      "",
      `Tour: ${tour.title}`,
      `Destination: ${tour.country}, ${tour.city}`,
      `Hotel: ${tour.hotelName}`,
      `Dates: ${tour.startDate} - ${tour.endDate}`,
      `Price: ${tour.price} RUB`,
      "",
      `Name: ${payload.name}`,
      `Phone: ${payload.phone}`,
      `Email: ${payload.email}`,
      `Locale: ${payload.locale}`
    ].join("\n")
  });

  return { sent: true, placeholder: false };
}
