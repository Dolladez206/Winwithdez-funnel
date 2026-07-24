# Win With Dez — Funnel

A lead-generation and nurture funnel for [winwithdez.com](https://winwithdez.com),
an independent LiveGood affiliate business. The funnel collects emails from
people interested in wellness and remote income, nurtures them with a
compassionate (not high-pressure) email sequence, and offers two paths — join
as a LiveGood Member only, or add the one-time Affiliate option.

## Contents

| File | Purpose |
| --- | --- |
| `index.html` | The landing page. Branded "Win With Dez" only — deliberately does not name LiveGood or its product names, so a prospect can't research the affiliate link before opting in. |
| `email-sequence.md` | 6-email nurture sequence, Kit-ready. LiveGood is named starting in Email 2, after opt-in. |
| `CLAUDE.md` | Project brief and the roadmap of build steps. |

## Roadmap

The build steps are tracked in [`CLAUDE.md`](./CLAUDE.md):

1. **Set up a git repository** for this project. ✅ *(this repo)*
2. Connect the `index.html` form to a Kit (ConvertKit) account via their API.
3. Load the 6-email sequence into Kit as an automation, triggered by the form.
4. Build a weekly analytics script pulling Kit stats (opt-ins, open rate,
   click-through) emailed to the owners.
5. Before going live: insert the real LiveGood affiliate link and confirm the
   Kit account is registered under the owner's name/email.

## Ownership

This is the owner's (Donald's wife's) business. She should hold the LiveGood
affiliate account, the domain, and the Kit (email platform) account. Donald is
admin/backup access only.

## Compliance constraints — do not remove

- Every email or page section mentioning compensation must keep the earnings
  disclosure ("no income is guaranteed…").
- Every mention of products must keep the health disclosure ("not intended to
  diagnose, treat, cure…").
- No automated DMs, cold outreach bots, or scraping — traffic generation is
  organic content only.

## Local preview

Open `index.html` directly in a browser, or serve the folder:

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

The opt-in form currently runs in test mode; it will be wired to Kit in Step 2.
