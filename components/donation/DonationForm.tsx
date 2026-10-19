"use client";

import { useState } from "react";
import type { CurrencyCode, RegionId } from "@/config/regions";
import AmountSelector from "./AmountSelector";
import FrequencySelector, { type DonationFrequency } from "./FrequencySelector";

type DonationFormProps = {
  regionId: RegionId;
  currency: CurrencyCode;
  presets: number[];
  className?: string;
};

export default function DonationForm({
  regionId,
  currency,
  presets,
  className = "",
}: DonationFormProps) {
  const [selectedPreset, setSelectedPreset] = useState<number | null>(presets[1] ?? presets[0] ?? null);
  const [customAmount, setCustomAmount] = useState("");
  const [frequency, setFrequency] = useState<DonationFrequency>("one_time");
  const [donorEmail, setDonorEmail] = useState("");
  const [donorName, setDonorName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const monthlyEnabled = process.env.NEXT_PUBLIC_ENABLE_MONTHLY_DONATIONS === "true";

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setLoading(true);

    const parsedCustom = customAmount ? Number(customAmount) : NaN;
    const amount = customAmount ? parsedCustom : selectedPreset;

    if (!amount || Number.isNaN(amount)) {
      setError("Please select or enter a valid amount.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount,
          currency,
          frequency,
          region: regionId,
          donorEmail: donorEmail || undefined,
          donorName: donorName || undefined,
        }),
      });

      const data = (await response.json()) as { checkoutUrl?: string; error?: string };

      if (!response.ok || !data.checkoutUrl) {
        throw new Error(data.error ?? "Unable to start checkout");
      }

      window.location.href = data.checkoutUrl;
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`card-programme space-y-6 p-6 md:p-8 ${className}`}
      aria-label="Donation form"
    >
      <AmountSelector
        presets={presets}
        currency={currency}
        selected={selectedPreset}
        onSelect={(amount) => {
          setSelectedPreset(amount);
          setCustomAmount("");
        }}
        customAmount={customAmount}
        onCustomChange={(value) => {
          setCustomAmount(value);
          setSelectedPreset(null);
        }}
      />

      <FrequencySelector
        value={frequency}
        onChange={setFrequency}
        monthlyEnabled={monthlyEnabled}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="donor-name" className="mb-1 block text-sm text-brand-muted">
            Name (optional)
          </label>
          <input
            id="donor-name"
            type="text"
            value={donorName}
            onChange={(event) => setDonorName(event.target.value)}
            className="form-input w-full"
            autoComplete="name"
          />
        </div>
        <div>
          <label htmlFor="donor-email" className="mb-1 block text-sm text-brand-muted">
            Email
          </label>
          <input
            id="donor-email"
            type="email"
            required
            value={donorEmail}
            onChange={(event) => setDonorEmail(event.target.value)}
            className="form-input w-full"
            autoComplete="email"
          />
        </div>
      </div>

      {error ? (
        <p className="text-sm text-red-700" role="alert">
          {error}
        </p>
      ) : null}

      <button type="submit" className="button-primary w-full" disabled={loading}>
        {loading ? "Redirecting to secure checkout…" : "Continue to secure payment"}
      </button>
      <p className="text-xs text-brand-muted">
        Payments are processed by Flutterwave. You will be redirected to a hosted checkout page.
      </p>
    </form>
  );
}
