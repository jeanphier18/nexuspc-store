export const SITE_NAME = "NEXUS PC";

const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
    ? `https://${process.env.VERCEL_URL}`
    : undefined;

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ??
  vercelUrl ??
  "https://nexuspc-store.vercel.app"
).replace(/\/+$/, "");
