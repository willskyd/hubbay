const PAYSTACK_BASE_URL = "https://api.paystack.co";

type InitializePayload = {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl?: string;
  metadata?: Record<string, unknown>;
};

async function paystackRequest<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const secret = process.env.PAYSTACK_SECRET_KEY;
  if (!secret) {
    throw new Error("PAYSTACK_SECRET_KEY is missing.");
  }

  const response = await fetch(`${PAYSTACK_BASE_URL}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const raw = await response.text();
  let data: { status?: boolean; message?: string } = {};
  try {
    data = raw ? JSON.parse(raw) : {};
  } catch {
    throw new Error(`Invalid response from Paystack (${response.status}).`);
  }

  if (!response.ok || data.status === false) {
    throw new Error(data.message || "Paystack request failed.");
  }

  return data as T;
}

export async function initializePaystackTransaction(payload: InitializePayload) {
  return paystackRequest<{
    status: boolean;
    message: string;
    data: {
      authorization_url: string;
      access_code: string;
      reference: string;
    };
  }>("/transaction/initialize", {
    method: "POST",
    body: JSON.stringify({
      email: payload.email,
      amount: payload.amountKobo,
      reference: payload.reference,
      callback_url: payload.callbackUrl,
      metadata: payload.metadata,
    }),
  });
}

export async function verifyPaystackTransaction(reference: string) {
  return paystackRequest<{
    status: boolean;
    message: string;
    data: {
      status: string;
      reference: string;
      amount: number;
      metadata?: Record<string, unknown>;
      gateway_response?: string;
      paid_at?: string;
      customer: { email: string };
    };
  }>(`/transaction/verify/${reference}`, {
    method: "GET",
  });
}
