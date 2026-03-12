export const isDatabaseConfigured = Boolean(process.env.DATABASE_URL?.trim());

export const defaultAuthSecret =
  process.env.NEXTAUTH_SECRET || "hubbay-local-dev-secret-change-in-production";

export const allowMockPayments =
  process.env.HUBBAY_ALLOW_MOCK_PAYMENTS === "true" || process.env.NODE_ENV !== "production";
