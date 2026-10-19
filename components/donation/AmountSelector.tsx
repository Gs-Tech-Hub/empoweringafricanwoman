"use client";

type AmountSelectorProps = {
  presets: number[];
  currency: string;
  selected: number | null;
  onSelect: (amount: number) => void;
  customAmount: string;
  onCustomChange: (value: string) => void;
};

function formatAmount(amount: number, currency: string) {
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount}`;
  }
}

export default function AmountSelector({
  presets,
  currency,
  selected,
  onSelect,
  customAmount,
  onCustomChange,
}: AmountSelectorProps) {
  return (
    <div className="space-y-4">
      <p className="text-sm font-medium text-brand-charcoal">Select amount</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {presets.map((amount) => {
          const isActive = selected === amount;
          return (
            <button
              key={amount}
              type="button"
              onClick={() => onSelect(amount)}
              className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${
                isActive
                  ? "border-brand-secondary bg-brand-secondary/15 text-brand-charcoal"
                  : "border-brand-border bg-white text-brand-muted hover:border-brand-secondary"
              }`}
            >
              {formatAmount(amount, currency)}
            </button>
          );
        })}
      </div>
      <div>
        <label htmlFor="custom-amount" className="mb-1 block text-sm text-brand-muted">
          Or enter custom amount
        </label>
        <input
          id="custom-amount"
          type="number"
          min={1}
          step={1}
          value={customAmount}
          onChange={(event) => onCustomChange(event.target.value)}
          className="form-input w-full"
          placeholder="Custom amount"
        />
      </div>
    </div>
  );
}
