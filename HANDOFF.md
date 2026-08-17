# Handoff — medicalofficecleaninghoulton.com

## Status: **READY TO LAUNCH** (pending one manual step — see below)

## What was done this session

- **Repo cleanup**: removed a stray directory literally named `{about,contact,...}` — a leftover from a broken shell brace-expansion command during the original build. It contained no files, just empty nested folders duplicating the real `service-areas/` structure.
- **Contact form API wired up**: added `/api/submit-lead.js`, a Vercel serverless function that proxies quote-form submissions to the CRM-QM `push_lead` endpoint (`https://thequotemasters.com/crm_api/api.php?action=push_lead`). The CRM bearer token is read from the `CRM_API_TOKEN` env var server-side — it is never sent to the browser or committed to the repo. Server-side validates name, phone, ZIP, and email before forwarding.
- **UTM tracking**: added `/quote-form.js`. On page load it captures `utm_source`/`utm_medium`/`utm_campaign`/`utm_term`/`utm_content` from the URL into `sessionStorage`, so tracking survives navigation between pages before the visitor submits the form. On submit, `utm_source` is sent to the CRM (falling back to referrer hostname, then `"direct"`, if no UTM params were present).
- **Form updates**: both quote forms (homepage + `/request-a-quote/`) now submit via `fetch` to `/api/submit-lead` instead of a plain HTML POST, added a required ZIP field (the CRM API requires `zip`), and added an inline success/error status message.
- **Placeholder/content sweep**: grepped all 25 pages for lorem ipsum, `{{ }}` tokens, TODO/TBD markers, and generic placeholder addresses/emails. None found — content was already clean per `QA.md`.
- **Vercel deployment**: linked and deployed to production. Live at:
  - **Production**: https://medicalofficecleaninghoulton.vercel.app
  - Custom domain `medicalofficecleaninghoulton.com` is not yet attached to this Vercel project — add it in the Vercel dashboard (Project → Settings → Domains) when ready to point DNS.
  - GitHub auto-deploy could **not** be linked automatically — Vercel reported insufficient write/admin access to the `damienvernon013-design/medicalofficecleaninghoulton` GitHub repo from this CLI session. Deploys were pushed manually via `vercel deploy --prod`. To enable auto-deploy on push, connect the repo from the Vercel dashboard (Project → Settings → Git) using an account with admin access to the repo.
- **Docs**: added `CLAUDE.md` (codebase orientation) and this file.

## Manual step required before the contact form works

The CRM bearer token was **intentionally not set** as a Vercel env var by the agent (per explicit instruction this session) — it needs to be added manually:

```
vercel env add CRM_API_TOKEN production
vercel env add CRM_API_TOKEN preview
```

Use the token from the CRM-QM API Documentation PDF. Until this is set, `/api/submit-lead` will return `500 Server misconfiguration` on any real submission. After adding the env var, redeploy (`vercel deploy --prod`) for it to take effect.

## Known intentional gaps (not blockers, but worth knowing)

- The CRM `push_lead` payload spec includes `industry` (a numeric code) and a `questions` array (question_id/answer_id pairs tied to this CRM account's questionnaire). Real values for this account were not available at build time, so **these fields are omitted** from the payload sent by `/api/submit-lead.js`. If leads need to route to a specific industry bucket or answer specific CRM questionnaire fields, get the real IDs from the CRM admin and update `api/submit-lead.js`.
- `appointments` (preferred time slots) from the CRM spec is also not collected by the current form — the form only asks for contact info, facility type, and square footage. Add an appointment picker if the business wants to collect preferred slots online.

## Verification performed

- All 25 pages return HTTP 200 on the live Vercel deployment.
- `/api/submit-lead` correctly rejects non-POST requests (405) and is reachable.
- `styles.css` and `quote-form.js` load correctly (200).
- No placeholder/lorem/TODO content found across HTML, CSS, sitemap, robots.txt.
