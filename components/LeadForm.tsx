"use client";

import { useState } from "react";
import { getDictionary } from "@/lib/i18n/dictionaries";
import type { Locale } from "@/types/travel";

interface LeadFormProps {
  tourId: string;
  locale: Locale;
}

type SubmitState = "idle" | "sending" | "sent" | "error" | "invalid" | "invalidPhone";

// +7 или 8, затем ровно 10 цифр (пробелы/дефисы/скобки разрешены)
function isValidRuPhone(value: string): boolean {
  const digits = value.replace(/\D/g, "");
  if (digits.length !== 11) return false;
  return digits.startsWith("7") || digits.startsWith("8");
}

export function LeadForm({ tourId, locale }: LeadFormProps) {
  const dict = getDictionary(locale);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [consent, setConsent] = useState(false);
  const [phoneValue, setPhoneValue] = useState("");
  const [phoneTouched, setPhoneTouched] = useState(false);

  const phoneInvalid = phoneTouched && phoneValue.length > 0 && !isValidRuPhone(phoneValue);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const payload = {
      tourId,
      locale,
      name: String(form.get("name") ?? "").trim(),
      phone: phoneValue.trim(),
      email: String(form.get("email") ?? "").trim()
    };

    if (!payload.name || !payload.phone || !payload.email || !consent) {
      setSubmitState("invalid");
      return;
    }

    if (!isValidRuPhone(payload.phone)) {
      setSubmitState("invalidPhone");
      setPhoneTouched(true);
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
        <input
          autoComplete="tel"
          name="phone"
          placeholder="+7 (999) 123-45-67"
          style={phoneInvalid ? { borderColor: "var(--coral, #e05a3a)" } : undefined}
          type="tel"
          value={phoneValue}
          onBlur={() => setPhoneTouched(true)}
          onChange={(e) => {
            setPhoneValue(e.target.value);
            if (submitState === "invalidPhone") setSubmitState("idle");
          }}
        />
        {phoneInvalid && (
          <span style={{ color: "var(--coral, #e05a3a)", fontSize: "0.8rem", marginTop: "2px" }}>
            {dict.phoneError}
          </span>
        )}
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
      {submitState === "invalidPhone" && <p className="form-message error">{dict.phoneError}</p>}
      {submitState === "error" && <p className="form-message error">{dict.sendError}</p>}
      {submitState === "sent" && <p className="form-message success">{dict.sent}</p>}
      <button className="primary-button full-width" disabled={submitState === "sending"} type="submit">
        {submitState === "sending" ? dict.sending : dict.send}
      </button>
    </form>
  );
}
