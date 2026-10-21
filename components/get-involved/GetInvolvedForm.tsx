"use client";

import { useState, type FormEvent } from "react";

type GetInvolvedFormProps = {
  contactEmail: string;
};

export default function GetInvolvedForm({ contactEmail }: GetInvolvedFormProps) {
  const [status, setStatus] = useState("");
  const canSubmit = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contactEmail.trim());

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) {
      setStatus("The organization’s contact email is not configured, so this form cannot prepare an email yet.");
      return;
    }

    const formData = new FormData(event.currentTarget);
    const interestType = String(formData.get("interestType") ?? "");
    const subject =
      interestType === "volunteer"
        ? "Volunteering enquiry"
        : "Fundraising and solicitation request";
    const body = [
      `Name: ${formData.get("name") ?? ""}`,
      `Email: ${formData.get("email") ?? ""}`,
      `Phone: ${formData.get("phone") || "Not provided"}`,
      `Location: ${formData.get("location") ?? ""}`,
      `Interest: ${interestType}`,
      "",
      "Availability or proposed activity details:",
      String(formData.get("details") ?? ""),
    ].join("\n");
    const mailto = `mailto:${contactEmail.trim()}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.location.href = mailto;
    setStatus("Your email application should open with the enquiry prepared. Review it and send it to complete your enquiry.");
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-2xl space-y-5 rounded-2xl border border-brand-border bg-brand-light p-6 shadow-soft md:p-8"
    >
      {!canSubmit ? (
        <p className="rounded-lg border border-brand-border bg-brand-ivory p-4 text-sm leading-relaxed text-brand-muted">
          The organization contact email has not been configured yet. Add it in the Site-wide
          content settings under Contact → Email to enable form submission.
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="involved-name" className="mb-1 block text-sm font-medium text-brand-charcoal">
            Full name <span aria-hidden="true">*</span>
          </label>
          <input
            id="involved-name"
            name="name"
            autoComplete="name"
            required
            className="form-input w-full"
          />
        </div>
        <div>
          <label htmlFor="involved-email" className="mb-1 block text-sm font-medium text-brand-charcoal">
            Email address <span aria-hidden="true">*</span>
          </label>
          <input
            id="involved-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            className="form-input w-full"
          />
        </div>
        <div>
          <label htmlFor="involved-phone" className="mb-1 block text-sm font-medium text-brand-charcoal">
            Phone number
          </label>
          <input
            id="involved-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            className="form-input w-full"
          />
        </div>
        <div>
          <label htmlFor="involved-location" className="mb-1 block text-sm font-medium text-brand-charcoal">
            Country or location <span aria-hidden="true">*</span>
          </label>
          <input
            id="involved-location"
            name="location"
            autoComplete="country-name"
            required
            className="form-input w-full"
          />
        </div>
      </div>

      <div>
        <label htmlFor="involved-type" className="mb-1 block text-sm font-medium text-brand-charcoal">
          I am interested in <span aria-hidden="true">*</span>
        </label>
        <select id="involved-type" name="interestType" required className="form-input w-full">
          <option value="volunteer">Volunteering</option>
          <option value="solicitation">Fundraising or solicitation approval</option>
        </select>
      </div>

      <div>
        <label htmlFor="involved-details" className="mb-1 block text-sm font-medium text-brand-charcoal">
          Availability or proposal details <span aria-hidden="true">*</span>
        </label>
        <textarea
          id="involved-details"
          name="details"
          rows={6}
          required
          maxLength={4000}
          aria-describedby="involved-details-hint"
          className="form-input w-full"
        />
        <p id="involved-details-hint" className="mt-2 text-xs leading-relaxed text-brand-muted">
          For volunteering, share your skills and availability. For a fundraising or solicitation
          request, include the purpose, dates, channels, and any funds involved.
        </p>
      </div>

      <button type="submit" disabled={!canSubmit} className="button-primary disabled:cursor-not-allowed disabled:opacity-50">
        Prepare email
      </button>
      <p aria-live="polite" className="text-sm text-brand-muted">
        {status}
      </p>
    </form>
  );
}
