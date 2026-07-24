# Win With Dez — Project Brief for Claude Code

## What this project is
A lead-generation and nurture funnel for winwithdez.com, an independent
LiveGood affiliate business (owned by Donald's wife). Goal: collect emails
from people interested in wellness/remote income, nurture them with a
compassionate (not high-pressure) email sequence, and offer two paths —
join as a LiveGood Member only, or add the one-time Affiliate option.

## Ownership
This is the wife's business. She should hold the LiveGood affiliate
account, the domain, and the email platform (Kit) account. Donald is
admin/backup access only, for cases she misses something.

## Files already built (attached in this project)
- `index.html` — the landing page. Branded "Win With Dez" only; deliberately
  does NOT name LiveGood or use LiveGood's specific product names, so a
  prospect can't search around the affiliate link before opting in.
- `email-sequence.md` — 6-email nurture sequence (Kit-ready). LiveGood is
  named starting in Email 2, once the person has already opted in.

## What Claude Code should do next
1. Set up a git repository for this project (recommend GitHub, under the
   wife's account for ownership).
2. Connect `index.html`'s form to a Kit (ConvertKit) account via their API
   — ask the user for their Kit API key before wiring this up; do not
   proceed with placeholder credentials.
3. Load the 6-email sequence from `email-sequence.md` into Kit as an
   automation, triggered by the landing page form.
4. Build a lightweight analytics script that pulls weekly stats from Kit's
   API (opt-ins, open rate, click-through to the affiliate link) and
   emails a summary to both Donald and his wife.
5. Before going live: insert the real LiveGood affiliate link (currently a
   placeholder in Email 6) and confirm the Kit account is registered under
   the wife's name/email.

## Compliance constraints — do not remove
- Every email or page section that mentions compensation must keep the
  earnings disclosure ("no income is guaranteed...").
- Every mention of products must keep the health disclosure ("not intended
  to diagnose, treat, cure...").
- No automated DMs, cold outreach bots, or scraping — traffic generation
  is organic content only.
