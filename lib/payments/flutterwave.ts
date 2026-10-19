type CreatePaymentLinkInput = {
  amount: number;
  currency: string;
  email: string;
  name?: string;
  txRef: string;
  redirectUrl: string;
  title?: string;
  description?: string;
};

type FlutterwavePaymentLinkResponse = {
  status: string;
  message: string;
  data?: {
    link?: string;
  };
};

export async function createFlutterwavePaymentLink(
  input: CreatePaymentLinkInput
): Promise<string> {
  const secretKey = process.env.FLUTTERWAVE_SECRET_KEY;
  if (!secretKey) {
    throw new Error("FLUTTERWAVE_SECRET_KEY is not configured");
  }

  const response = await fetch("https://api.flutterwave.com/v3/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secretKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      tx_ref: input.txRef,
      amount: input.amount,
      currency: input.currency,
      redirect_url: input.redirectUrl,
      customer: {
        email: input.email,
        name: input.name ?? "Supporter",
      },
      customizations: {
        title: input.title ?? "Empowering the African Woman",
        description: input.description ?? "Charitable donation",
      },
    }),
  });

  const payload = (await response.json()) as FlutterwavePaymentLinkResponse;

  if (!response.ok || payload.status !== "success" || !payload.data?.link) {
    throw new Error(payload.message || "Failed to create Flutterwave payment link");
  }

  return payload.data.link;
}

export function verifyFlutterwaveWebhookSignature(
  signatureHeader: string | null,
  secret: string | undefined
): boolean {
  if (!secret || !signatureHeader) {
    return false;
  }
  return signatureHeader === secret;
}
