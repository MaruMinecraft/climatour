"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/types/travel";

interface LeadFormProps {
  tourId: string;
  locale: Locale;
}

type SubmitState = "idle" | "sending" | "sent" | "error" | "invalid";

export function LeadForm({ tourId, locale }: LeadFormProps) {
  const dict = getDictionary(locale);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [consent, setConsent] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      tourId,
      locale,
      name: String(form.get("name") ?? "").trim(),
      phone: String(form.get("phone") ?? "").trim(),
      email: String(form.get("email") ?? "").trim()
    };

    if (!payload.name || !payload.phone || !payload.email || !consent) {
      setSubmitState("invalid");
      return;
    }

    setSubmitState("sending");

    const response = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    setSubmitState(response.ok ? "sent" : "error");
  }

  return (
    <form className="lead-form" onSubmit={onSubmit}>
      <div>
        <span className="eyebrow">{dict.leadTitle}</span>
        <p>{dict.leadText}</p>
      </div>
      <label>
        {dict.name}
        <input name="name" placeholder={dict.name} autoComplete="name" />
      </label>
      <label>
        {dict.phone}
        <input name="phone" placeholder="+7" autoComplete="tel" />
      </label>
      <label>
        {dict.email}
        <input name="email" placeholder="name@example.com" autoComplete="email" />
      </label>
      <label className="checkbox-row">
        <input checked={consent} onChange={(event) => setConsent(event.target.checked)} type="checkbox" />
        <span>{dict.consent}</span>
      </label>
      {submitState === "invalid" && <p className="form-message error">{dict.validationError}</p>}
      {submitState === "error" && <p className="form-message error">{dict.sendError}</p>}
      {submitState === "sent" && <p className="form-message success">{dict.sent}</p>}
      <button className="primary-button full-width" disabled={submitState === "sending"} type="submit">
        {submitState === "sending" ? dict.sending : dict.send}
      </button>
    </form>
  );
}
