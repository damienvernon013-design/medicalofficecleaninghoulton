# Handoff — medicalofficecleaninghoulton.com

## Status: **READY TO LAUNCH** (pending manual steps — see below)

## Session 2 — Blog section + CRM quote wizard + footer credit

- **25-post blog section added** (`/blog/` hub + `/blog/<slug>/` × 25), reframed for this site's medical/dental scope from a generic commercial-cleaning source content pack. Off-scope source posts (restaurants, gyms, schools) were rewritten as medical/dental-specific or general facility-hygiene guidance instead. Unverifiable citations from the source pack (named studies, stats, dollar figures) were softened or removed to match this site's existing no-fabrication policy. No forced local Houlton/Hudson claims were added — content stays generic by design. Pages use `LocalBusiness`-only JSON-LD, matching the rest of the site's content pages (no Article/BlogPosting schema, no byline, no date).
- **Old single-step lead form retired.** `/quote-form.js` and the old `/api/submit-lead.js` payload shape are gone. Replaced with:
  - `/assets/js/quote-wizard.js` — a full multi-step CRM-integrated quote wizard (facility-need questions, industry picker with the CRM's full 40+ item list, appointment slot booking, review step) wired into `/request-a-quote/`.
  - `/api/submit-lead.js` — rewritten to send the full wizard-shaped payload (`customer`, `industry`, `questions[]`, `appointments[]`, `num_of_quotes`, `utm_source`) to the CRM. `ZIP_DEFAULT` (`54082`) and `ADDRESS_DEFAULT` (`Houlton, WI`) were taken from values already in use sitewide, not invented. `SITE_SOURCE_TAG` tags every lead's CRM notes with this domain, since the CRM token is shared across the wider site portfolio and has no native site-id field.
  - Homepage and `/contact/` now use short teaser forms (name/phone/sqft, `GET` to `/request-a-quote/`) instead of a full form — the wizard's `prefillFromQuery()` picks up those query params and prefills step 1.
  - Wizard-specific CSS appended to `styles.css` using the site's existing design tokens.
- **Nav updated sitewide**: a `Blog` link was added to the shared nav on all 31 pre-existing pages (between FAQ and Get a Quote), via a scripted find-and-replace since the nav markup was byte-identical across pages.
- **`sitemap.xml` updated**: 26 new entries (blog hub + 25 posts, `changefreq weekly`), bringing the total to 57 URLs. Validated as well-formed XML.
- **Footer credit line added sitewide**: "Built and Maintained by Infin8Content" (linking to `https://infin8content.com/`) added to `.footer-bottom` on all 57 pages via scripted find-and-replace.
- **Stray placeholder fixed**: a literal `{PHONE}` token found in `/resources/medical-cleaning-cost/` during the QA sweep was corrected to the real phone number.
- **Verification performed this session**: `node --check` on both new/changed JS files; grep sweep for brand leakage, fabricated stats, dollar figures, and placeholder tokens across the new blog content (all clean); confirmed every internal blog link resolves to a real file; confirmed all 57 pages carry consistent phone/email/footer credit; served the site locally and confirmed the wizard's six `data-wizard-*` hooks are present on `/request-a-quote/` and that blog pages return 200.
- **Not done — flagging explicitly**: no real-browser click-through of the wizard and no live test submission to the CRM were performed this session. Do this on a preview deploy before relying on the wizard in production, per the playbook's own caveat.

## Session 1 — Initial launch build

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

## Known intentional gaps (Session 1 — superseded by Session 2)

- ~~The CRM `push_lead` payload spec includes `industry` and a `questions` array... these fields are omitted~~ — **resolved in Session 2**: the quote wizard now collects and sends `industry`, `questions[]`, and `appointments[]` in full.

## Verification performed (Session 1)

- All 25 pages return HTTP 200 on the live Vercel deployment.
- `/api/submit-lead` correctly rejects non-POST requests (405) and is reachable.
- `styles.css` and `quote-form.js` load correctly (200).
- No placeholder/lorem/TODO content found across HTML, CSS, sitemap, robots.txt.

Note: this verification predates Session 2's rebuild of `/api/submit-lead.js` and removal of `quote-form.js` — see Session 2 notes above for current verification status. A fresh production deploy check (all 57 pages, wizard hooks, blog pages) has not yet been run against the live Vercel URL as of Session 2.
