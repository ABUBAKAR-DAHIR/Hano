/* ------------------------------------------------------------------ */
/* One place for the details used across the legal pages.              */
/* Update these, and every page picks them up.                         */
/* ------------------------------------------------------------------ */
export const LEGAL = {
  company: "Hanowallet",
  // Your registered company name, if different (e.g. "Hanowallet Ltd").
  entity: "Hanowallet",
  address: "Garowe, Nugaal, Puntland, Somalia",
  jurisdiction: "Puntland, Somalia",
  email: "legal@hanowallet.com",
  privacyEmail: "privacy@hanowallet.com",
  updated: "November 9, 2026",
  minAge: 18,
};

export type LegalDocId = "privacy" | "terms" | "risk";

export const LEGAL_DOCS: { id: LegalDocId; href: string; title: string; body: string }[] = [
  { id: "privacy", href: "/privacy", title: "Privacy policy", body: "How we collect, use and protect your data" },
  { id: "terms", href: "/terms", title: "Terms of service", body: "The rules for using Hanowallet" },
  { id: "risk", href: "/risk", title: "Risk disclosure", body: "What to know before you start mining" },
];