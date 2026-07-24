#!/usr/bin/env node
// Read-only Kit (ConvertKit) v4 API check for the Win With Dez funnel.
//
// It verifies — without creating or changing anything — that:
//   1. the KIT_API_KEY authenticates,
//   2. the account is the expected owner,
//   3. the landing-page form (9723242) exists,
//   4. lists sequences so you can confirm the nurture sequence was built.
//
// Why read-only: Kit's v4 API cannot create a sequence, author sequence
// emails, or build the form->sequence automation. Those are built once in the
// dashboard (see kit-automation-setup.md). This script confirms the result.
//
// Usage (locally you'd need the key exported; in CI it comes from the secret):
//   KIT_API_KEY=xxxxx node scripts/kit-verify.mjs
//
// Exit code 0 = all expected pieces found; non-zero = something is missing.

const API = "https://api.kit.com/v4";
const EXPECTED_FORM_ID = 9723242;

const key = process.env.KIT_API_KEY;
if (!key) {
  console.error("✗ KIT_API_KEY is not set. In CI this comes from the GitHub secret.");
  process.exit(2);
}

async function kit(path) {
  const res = await fetch(`${API}${path}`, {
    headers: { "Accept": "application/json", "X-Kit-Api-Key": key },
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(`GET ${path} -> ${res.status} ${JSON.stringify(body)}`);
  }
  return body;
}

// Kit paginates with ?after= cursors; walk them so we don't miss a form/sequence.
async function kitAll(path, collectionKey) {
  const items = [];
  let after = null;
  do {
    const sep = path.includes("?") ? "&" : "?";
    const page = await kit(`${path}${after ? `${sep}after=${encodeURIComponent(after)}` : ""}`);
    items.push(...(page[collectionKey] || []));
    after = page.pagination && page.pagination.has_next_page ? page.pagination.end_cursor : null;
  } while (after);
  return items;
}

let ok = true;

try {
  // 1 + 2: account / ownership
  const account = await kit("/account");
  const a = account.account || account;
  console.log("Account:");
  console.log(`  name:  ${a.name ?? "(unknown)"}`);
  console.log(`  email: ${a.primary_email_address ?? a.email ?? "(unknown)"}`);
  console.log("  → Confirm this is the wife's account (ownership), per the project brief.\n");

  // 3: the landing-page form
  const forms = await kitAll("/forms", "forms");
  const form = forms.find((f) => Number(f.id) === EXPECTED_FORM_ID);
  if (form) {
    console.log(`✓ Form ${EXPECTED_FORM_ID} found: "${form.name}" (${form.format ?? "form"})`);
  } else {
    ok = false;
    console.log(`✗ Form ${EXPECTED_FORM_ID} NOT found on this account.`);
    console.log(`  Forms visible: ${forms.map((f) => `${f.id}:${f.name}`).join(", ") || "(none)"}`);
  }

  // 4: sequences (can't verify emails/trigger via API — just list for a human check)
  const sequences = await kitAll("/sequences", "sequences");
  console.log(`\nSequences on account (${sequences.length}):`);
  if (sequences.length === 0) {
    console.log("  (none) — build 'Win With Dez — Nurture' in the dashboard.");
  }
  for (const s of sequences) {
    console.log(`  - ${s.id}: ${s.name}`);
  }
  const nurture = sequences.find((s) => /win with dez/i.test(s.name || ""));
  if (nurture) {
    console.log(`\n✓ Likely nurture sequence: ${nurture.id} "${nurture.name}"`);
    console.log("  (The API can't confirm its 6 emails, delays, or the form trigger —");
    console.log("   verify those in the dashboard per kit-automation-setup.md.)");
  } else {
    console.log("\n• No sequence name matching 'Win With Dez' yet — expected until you build it.");
  }
} catch (err) {
  ok = false;
  console.error(`\n✗ API error: ${err.message}`);
}

process.exit(ok ? 0 : 1);
