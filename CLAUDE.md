# medicalofficecleaninghoulton.com

Static HTML microsite for a medical office cleaning business serving Houlton, WI and nearby towns (Hudson, North Hudson, Somerset, Saint Joseph). No build step — plain HTML/CSS/vanilla JS, deployed to Vercel.

## Structure

- 25 static HTML pages (one `index.html` per route directory), shared `/styles.css`.
- `/api/submit-lead.js` — Vercel serverless function. Proxies quote-form submissions to the CRM-QM `push_lead` API. Holds the CRM bearer token server-side via the `CRM_API_TOKEN` env var — never expose this token in client-side code.
- `/quote-form.js` — client-side form handler shared by the homepage and `/request-a-quote/` quote forms. Captures UTM params from the URL into `sessionStorage` and attaches them to submissions as `utm_source`.
- `QA.md` — build-time QA checklist and known content decisions (town count reduction, sibling-domain collision rules, theme notes). Read this before making content changes to service-area pages.

## Conventions

- No frameworks, no bundler. Edit HTML files directly.
- Design tokens live in `styles.css` `:root` (Theme C: deep forest green `--primary`, teal `--accent`).
- Every page repeats the same header/nav/footer markup (no templating layer) — when changing shared chrome (nav links, footer, phone number, schema.org JSON-LD), update all 25 pages.
- Contact info is intentionally consistent across every page: phone `(866) 958-8773`, email `ops@thequotemasters.com`, "22 years in business." Don't drift these.
- No street address is published anywhere (mobile/dispatch business model) — do not add one.
- No testimonials, star ratings, or fabricated pricing/policy numbers — see `QA.md` for the full list of content rules established during the build.

## CRM API integration

- Docs: CRM-QM API (GetFaq, PushLead) — Bearer token auth, JSON payload with customer/zip/questions/appointments/utm_source.
- Current integration only sends core lead fields (customer info, zip, notes, utm_source) via `/api/submit-lead.js`. The `industry` code and `questions`/`answer_id` arrays from the CRM payload spec are **intentionally omitted** — the actual industry code and questionnaire IDs for this account were not available at build time. Do not guess these; get the real values from the CRM admin before adding them back in.
- `CRM_API_TOKEN` must be set as a Vercel environment variable (Production + Preview). It is not committed anywhere in this repo.

## Deployment

- Vercel project, static site + one serverless function (`/api/submit-lead`).
- `vercel.json` sets baseline security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy).
