# Win With Dez — Kit Automation Setup

This document explains how the 6-email nurture sequence from
[`email-sequence.md`](./email-sequence.md) gets wired up in Kit (ConvertKit),
triggered by **form `9723242`** — the same form the landing page
(`index.html`) posts to.

---

## Why this can't be fully done through the API

The task was to build this via the Kit API using the `KIT_API_KEY` GitHub
secret. After checking the Kit **v4 API**, the parts that matter here are
**not exposed by the API** and must be built once in the dashboard:

| Thing we need | Kit API support |
|---|---|
| Create a **sequence** | ❌ No create endpoint — you can only *list* sequences and *add subscribers* to an existing one (`POST /v4/sequences/{id}/subscribers`). |
| Author the **emails inside a sequence** (subject/body/delays) | ❌ Not exposed at all. |
| Build a **visual automation / rule** (form → sequence trigger) | ❌ No create endpoint. |
| Add a subscriber to a **form** | ✅ `POST /v4/forms/{id}/subscribers` (this is what the landing page already does). |
| List forms / sequences / account | ✅ Read-only (used by our verification script below). |

So the sequence and its trigger are a **one-time manual build in the Kit
dashboard**. Everything you need to paste is in this file. Once it's built,
the read-only [verification script](#verifying-with-the-api) confirms it over
the API using the GitHub secret.

> Also note: `KIT_API_KEY` is a **GitHub Actions secret**. It is only readable
> from a workflow run, not from a laptop or a normal terminal. That's why the
> verification runs as a GitHub Action.

---

## Part A — Build the sequence (6 emails)

1. Log in to Kit **as the account owner** (per the project brief, this should
   be the wife's Kit account — confirm before going live).
2. Go to **Grow → Sequences** (older UI: **Sequences**) → **New Sequence**.
3. Name it: **`Win With Dez — Nurture`**.
4. Add **6 emails** in order, using the content in [Part C](#part-c--ready-to-paste-email-content).
   For each email set the subject line and paste the body.
5. Set the **delays** (Part B).
6. Set each email's status to **Published** (a Draft email is skipped).

### Part B — Sending schedule

The source sequence sends on **Day 0 / 2 / 4 / 6 / 8 / 10 from opt-in**. In a
Kit sequence, each email's delay is **relative to the previous email**, so:

| Email | Subject | Delay setting in Kit | Lands on |
|---|---|---|---|
| 1 | Here's what I promised you | **Immediately** (0 days) | Day 0 |
| 2 | The company behind this (and why I chose them) | **2 days** after previous | Day 2 |
| 3 | What's actually in the membership | **2 days** after previous | Day 4 |
| 4 | The part where I tell you about earning, honestly | **2 days** after previous | Day 6 |
| 5 | "Isn't this just an MLM?" | **2 days** after previous | Day 8 |
| 6 | Whenever you're ready — both doors are open | **2 days** after previous | Day 10 |

In the sequence's **Settings**, you can also restrict send days/times (e.g.
don't send at 3 a.m.). Leaving the defaults is fine; the day-count above is
what matters.

---

## Part C — Ready-to-paste email content

The source file writes the name merge field as `{first_name}`. **Kit does not
use that syntax** — it uses Liquid. Below, every `{first_name}` has already
been converted to:

```
{{ subscriber.first_name | default: "there" }}
```

The landing page form posts the name as `fields[first_name]`, which populates
this same `subscriber.first_name` field, so personalization will work. The
`default: "there"` gives a graceful fallback if someone opts in without a name.

> **Compliance — do not remove:** each email keeps its earnings disclosure
> (compensation) and/or health disclosure (products), exactly as written in
> `email-sequence.md`. Do not delete these when pasting.

### Email 1 — send immediately
**Subject:** `Here's what I promised you`

```
Hi {{ subscriber.first_name | default: "there" }},

Thank you for trusting me with your email — I know inboxes are full enough already.

Here's what I want you to know upfront: this isn't a sales pitch, and there's no clock counting down. You signed up because you already take your health seriously, and I want to respect that by just being straight with you.

Over the next week, I'll share:
- What the membership actually includes, and what it costs
- Why the pricing works the way it does
- An option to also earn by sharing it, if that's ever something you're interested in — with zero pressure if it's not

You can stop hearing from me anytime. No hard feelings.

Talk soon,
Dez

Win With Dez is compensated if you join the membership program described in these emails. No income or health outcome is guaranteed.
```

### Email 2 — 2 days later
**Subject:** `The company behind this (and why I chose them)`

```
Hi {{ subscriber.first_name | default: "there" }},

Time to be fully transparent: the company is called LiveGood.

I'm telling you now, plainly, because I'd rather you know exactly who you're considering before you decide anything. A few things drew me to them specifically:

- Members pay $9.95/month (or $99.95/year) for wholesale-style pricing on the products
- You can buy at member pricing without ever being asked to sell anything
- Their labels list ingredients and dosing plainly, so you can check them yourself

I'm not going to tell you they're the only good option out there — supplements are a personal choice, and I'd rather you make an informed one than a fast one.

More on the products tomorrow.

— Dez

Win With Dez is an independent representative of LiveGood and is compensated if you join. Supplements are not intended to diagnose, treat, cure, or prevent any disease. Consult a healthcare provider before starting any new supplement.
```

### Email 3 — 2 days later
**Subject:** `What's actually in the membership`

```
Hi {{ subscriber.first_name | default: "there" }},

Here's the practical breakdown:

$9.95/month or $99.95/year gets you member pricing on:
- Daily multivitamin, D3/K2, magnesium complex
- Organic greens and antioxidant blends
- Plant-based protein and essential aminos
- Clean-sourced coffee, topical comfort cream, skin care
- Bundled packs if you'd rather not build your own routine

There's no obligation to buy a certain amount each month, and no inventory to store — it ships to you directly.

If this is all you're looking for — a lower cost on quality supplements — that's genuinely enough. Some of the people I've helped join stopped right here, and that's completely fine.

If you're curious whether there's more to it, I'll share that next.

— Dez

Win With Dez is compensated if you join. Supplements are not intended to diagnose, treat, cure, or prevent any disease.
```

### Email 4 — 2 days later
**Subject:** `The part where I tell you about earning, honestly`

```
Hi {{ subscriber.first_name | default: "there" }},

Some members also choose to become affiliates for a one-time $40 fee (on top of the membership), which lets them earn if they introduce others to LiveGood.

I want to describe this accurately, not excitedly:

- You earn a commission when someone you refer joins as a member
- There's also a smaller structure where you can earn from people your referrals go on to introduce
- Like any income opportunity, results depend entirely on the effort you put in and the people you reach — most people who try any referral-based opportunity earn modestly or not at all, and a smaller number do well

I'd rather you go in with real expectations than a rosy pitch. If it's not for you, the membership on its own is still worthwhile. If you want to talk through whether it fits your situation, just reply — I read every response myself.

— Dez

No income is guaranteed. Individual results vary based on effort, skill, and market conditions. Win With Dez earns a commission on referrals it introduces to LiveGood.
```

### Email 5 — 2 days later
**Subject:** `"Isn't this just an MLM?"`

```
Hi {{ subscriber.first_name | default: "there" }},

I'd be surprised if this question hadn't crossed your mind, so let's address it directly instead of pretending it didn't.

LiveGood does pay affiliates partly through a multi-level structure — meaning you can earn not just from people you personally refer, but from people they go on to refer too. That's a fair thing to want clarity on before deciding anything.

Here's the distinction that actually matters: legitimate companies in this space make most of their money from real product sales to real customers who want the products for their own use — not from recruiting fees. I'd encourage you to ask that same question of anything you're ever offered, not just this. It's the right question.

If you decide the membership is worth it just for the products, that's a complete answer on its own.

— Dez

No income or health outcome is guaranteed. This email is general information, not financial or legal advice.
```

### Email 6 — 2 days later
**Subject:** `Whenever you're ready — both doors are open`

> ⚠️ **Before this goes live, replace the link placeholder below with the real
> LiveGood affiliate link.** See the pre-launch checklist.

```
Hi {{ subscriber.first_name | default: "there" }},

No new pitch today — just making it easy to act if you've decided either path is right for you:

→ Just the products: Join as a Member for $9.95/month or $99.95/year. Wholesale pricing, cancel anytime.
→ Products + the option to earn: Add the one-time $40 affiliate option when you join.

[Join Win With Dez →]   ← link this button/text to the real LiveGood affiliate URL

Whatever you decide, thank you for giving this an honest look. That's all I ever wanted.

— Dez

Win With Dez is compensated if you join. No income or health outcome is guaranteed. Membership has a monthly or annual cost.
```

---

## Part D — Wire the trigger: form `9723242` → sequence

You have two ways to connect the form to the sequence. **Option 1 (a Rule) is
the simplest** and is recommended.

### Option 1 — Automation Rule (recommended)

1. Go to **Automate → Rules** → **Add Rule** (older UI: **Automations → Rules**).
2. **Trigger** → **"Joins a form"** → select the **Win With Dez** form.
   - Confirm it's form ID **`9723242`** — that ID appears in the form's embed
     snippet / URL (`app.kit.com/forms/9723242/...`), which is the same URL the
     landing page posts to in `index.html`.
3. **Action** → **"Subscribe to a sequence"** → select **`Win With Dez — Nurture`**.
4. Save. The rule is live immediately.

### Option 2 — Visual Automation (equivalent, more visual)

1. Go to **Automate → Automations** → **New Automation** → **Start from scratch**.
2. **Entry / trigger:** **"Joins a form"** → select the **Win With Dez** form (`9723242`).
3. Click **+** → **Actions** → **Email Sequence** → select **`Win With Dez — Nurture`**.
4. Toggle the automation to **Live / Active** (top-right). A paused automation
   does nothing.

Either option produces the same result: anyone who submits the landing-page
form enters the 6-email sequence starting immediately.

---

## Pre-launch checklist

- [ ] All 6 sequence emails are **Published** (not Draft).
- [ ] Delays match Day 0 / 2 / 4 / 6 / 8 / 10.
- [ ] **Email 6's `[Join Win With Dez →]` is linked to the real LiveGood
      affiliate URL** (currently a placeholder).
- [ ] Earnings + health **disclosures are intact** in every email.
- [ ] The Rule/Automation connecting form `9723242` → sequence is **live**.
- [ ] The Kit account is registered under **the wife's name/email** (ownership);
      Donald is admin/backup only.
- [ ] Sent yourself a test opt-in through the landing page and confirmed
      Email 1 arrives and `{{ subscriber.first_name }}` renders your name.

---

## Verifying with the API

A read-only script, [`scripts/kit-verify.mjs`](./scripts/kit-verify.mjs),
confirms the account and that form `9723242` and the sequence exist. It runs in
GitHub Actions (where the `KIT_API_KEY` secret lives) via the
**"Kit — verify setup"** workflow (`.github/workflows/kit-verify.yml`).

Run it from the repo's **Actions** tab → **Kit — verify setup** → **Run
workflow**. It does **not** create or change anything — it only reads and
reports:

- the account name/owner (to confirm ownership),
- whether form **9723242** is present,
- the sequences on the account (so you can confirm `Win With Dez — Nurture`
  exists and grab its ID).
