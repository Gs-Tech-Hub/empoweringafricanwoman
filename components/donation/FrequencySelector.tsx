"use client";

export type DonationFrequency = "one_time" | "monthly";

type FrequencySelectorProps = {
  value: DonationFrequency;
  onChange: (value: DonationFrequency) => void;
  monthlyEnabled?: boolean;
};

export default function FrequencySelector({
  value,
  onChange,
  monthlyEnabled = false,
}: FrequencySelectorProps) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-brand-charcoal">Frequency</legend>
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onChange("one_time")}
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            value === "one_time"
              ? "bg-brand-primary text-brand-ivory"
              : "border border-brand-border bg-white text-brand-muted"
          }`}
        >
          One-time
        </button>
        <button
          type="button"
          onClick={() => monthlyEnabled && onChange("monthly")}
          disabled={!monthlyEnabled}
          title={
            monthlyEnabled
              ? "Monthly giving"
              : "Monthly giving will be enabled once supported by your Flutterwave account"
          }
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            value === "monthly"
              ? "bg-brand-primary text-brand-ivory"
              : "border border-brand-border bg-white text-brand-muted"
          } ${!monthlyEnabled ? "cursor-not-allowed opacity-50" : ""}`}
        >
          Monthly
        </button>
      </div>
    </fieldset>
  );
}
