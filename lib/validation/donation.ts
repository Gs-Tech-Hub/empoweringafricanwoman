import { z } from "zod";
import type { CurrencyCode, RegionId } from "@/config/regions";
import { isRegionId } from "@/config/regions";

const currencySchema = z.enum(["NGN", "CAD", "USD"]);

export const donationRequestSchema = z.object({
  amount: z.number().positive().max(10_000_000),
  currency: currencySchema,
  frequency: z.enum(["one_time", "monthly"]),
  region: z
    .string()
    .optional()
    .refine((value) => !value || isRegionId(value), "Invalid region"),
  campaign: z.string().max(120).optional(),
  donorEmail: z.string().email().optional(),
  donorName: z.string().min(1).max(120).optional(),
});

export type DonationRequest = z.infer<typeof donationRequestSchema>;

export function validateDonationAmount(
  amount: number,
  currency: CurrencyCode,
  presets: number[],
  allowCustom = true
): boolean {
  if (presets.includes(amount)) {
    return true;
  }
  if (!allowCustom) {
    return false;
  }
  const minByCurrency: Record<CurrencyCode, number> = {
    NGN: 500,
    USD: 5,
    CAD: 5,
  };
  const maxByCurrency: Record<CurrencyCode, number> = {
    NGN: 5_000_000,
    USD: 50_000,
    CAD: 50_000,
  };
  return amount >= minByCurrency[currency] && amount <= maxByCurrency[currency];
}

export function parseRegionId(value: string | undefined): RegionId | undefined {
  if (!value || !isRegionId(value)) {
    return undefined;
  }
  return value;
}
