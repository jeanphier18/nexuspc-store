export const SITE_NAME = "NEXUS PC";

export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://nexuspc.example.com"
).replace(/\/+$/, "");
