// Non-sensitive, non-httpOnly UX hint only. Carries no auth authority —
// see middleware.ts and src/app/dashboard/layout.tsx for why.
const HINT_COOKIE = "fixitnow_hint";

export function setSessionHint() {
  if (typeof document === "undefined") return;
  document.cookie = `${HINT_COOKIE}=1; path=/; max-age=2592000; samesite=lax`;
}

export function clearSessionHint() {
  if (typeof document === "undefined") return;
  document.cookie = `${HINT_COOKIE}=; path=/; max-age=0; samesite=lax`;
}