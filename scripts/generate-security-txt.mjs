/**
 * Write public/.well-known/security.txt at build time so `Expires` stays
 * fresh (RFC 9116 wants it renewed; now + 365 days). Contact/Policy point at
 * the site's existing private reporting mechanism (GitHub private
 * vulnerability reporting via /security).
 *
 * Usage: node scripts/generate-security-txt.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const expires = new Date(Date.now() + 365 * 24 * 3600 * 1000)
  .toISOString()
  .replace(/\.\d+Z$/, "Z");

mkdirSync(join(root, "public", ".well-known"), { recursive: true });
writeFileSync(
  join(root, "public", ".well-known", "security.txt"),
  [
    "Contact: https://github.com/braydos-h/BreachPilot/security/advisories/new",
    "Policy: https://breachpilot.dev/security",
    "Canonical: https://breachpilot.dev/.well-known/security.txt",
    `Expires: ${expires}`,
    "Preferred-Languages: en",
    "",
  ].join("\n")
);
console.log(`generate-security-txt: Expires ${expires}`);
