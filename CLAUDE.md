# medicalofficecleaninghoulton.com

Static HTML microsite for a medical office cleaning business serving Houlton, WI and nearby towns (Hudson, North Hudson, Somerset, Saint Joseph). No build step — plain HTML/CSS/vanilla JS, deployed to Vercel.

## Structure

- 57 static HTML pages (one `index.html` per route directory): 31 core/service/service-area/resource pages + a `/blog/` hub + 25 blog posts. Shared `/styles.css`.
- `/api/submit-lead.js` — Vercel serverless function. Proxies quote-wizard submissions to the CRM-QM `push_lead` API. Holds the CRM bearer token server-side via the `CRM_API_TOKEN` env var — never expose this token in client-side code.
- `/assets/js/quote-wizard.js` — the multi-step CRM-integrated quote wizard used on `/request-a-quote/`. Its question set, industry list (40+ items), time slots, and validation logic mirror the CRM's fixed `get_lead_faq` schema — do not hand-edit these without re-checking against that schema first.
- Homepage and `/contact/` use short teaser forms (name/phone/sqft, `GET` to `/request-a-quote/`) rather than the full wizard. The wizard's `prefillFromQuery()` reads `?name=&phone=&sqft=` and prefills step 1 automatically — this handoff is intentional, don't rebuild it differently.
- `QA.md` — build-time QA checklist and known content decisions (town count reduction, sibling-domain collision rules, theme notes). Read this before making content changes to service-area pages.
- `HANDOFF.md` — running log of what's been built and what's outstanding. Update it whenever you ship a meaningful change.

## Conventions

- No frameworks, no bundler. Edit HTML files directly.
- Design tokens live in `styles.css` `:root` (Theme C: deep forest green `--primary`, teal `--accent`).
- Every page repeats the same header/nav/footer markup (no templating layer) — when changing shared chrome (nav links, footer, phone number, schema.org JSON-LD), update all 57 pages. Sitewide chrome edits are done with a scripted find-and-replace (sed/python) across all `index.html` files rather than by hand, since the markup is byte-identical across pages.
- Contact info is intentionally consistent across every page: phone `(866) 958-8773`, email `ops@thequotemasters.com`, "22 years in business." Don't drift these.
- Footer credit line ("Built and Maintained by Infin8Content", linking to `https://infin8content.com/`) is present in `.footer-bottom` on every page — keep it in sync if the footer structure changes.
- No street address is published anywhere (mobile/dispatch business model) — do not add one.
- No testimonials, star ratings, or fabricated pricing/policy numbers — see `QA.md` for the full list of content rules established during the build. This rule also applies to blog content: no fabricated studies/statistics, no invented dollar figures, no forced local claims not already verified elsewhere on the site.
- Blog posts (`/blog/<slug>/`) use `LocalBusiness`-only JSON-LD — no `Article`/`BlogPosting` schema, no byline, no publish date — consistent with the rest of the site's content pages.

## CRM API integration

- Docs: CRM-QM API (GetFaq, PushLead) — Bearer token auth, JSON payload with customer/zip/industry/questions/appointments/utm_source.
- `/api/submit-lead.js` sends the full wizard-shaped payload: `customer`, `industry`, `questions[]`, `appointments[]`, `num_of_quotes`, and `utm_source`. Appointment dates must be Mon–Fri and at least 2 days out; `num_of_quotes` is derived server-side from `appointments.length`.
- `ZIP_DEFAULT` is `'54082'` and `ADDRESS_DEFAULT` is `'Houlton, WI'` — both taken from values already used consistently across the site's existing forms, not invented.
- CORS origin and the CRM's `notes` field both identify this site (`Site: medicalofficecleaninghoulton.com`) so leads pushed through the portfolio's shared CRM token can be traced back to this domain.
- `CRM_API_TOKEN` must be set as a Vercel environment variable (Production + Preview). It is not committed anywhere in this repo.

## Deployment

- Vercel project, static site + one serverless function (`/api/submit-lead`).
- `vercel.json` sets baseline security headers (HSTS, X-Frame-Options, nosniff, Referrer-Policy).
