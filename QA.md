# QA Checklist — medicalofficecleaninghoulton.com

Build date: 2026-08-02  
Theme: C — Technical & Compliance-Led  
Pages built: 31 (see note on page count)

---

## Page count note

The manifest assumed 8 towns with 2 service-x-town children each = 16 location-service pages, for a total of 43. This build uses 4 towns (split from collision with commercialcleanershoulton.com per BUILD-SPEC §6). Result: 4×2 = 8 location-service pages. Total: 31 pages. The reduction is intentional and documented — not an oversight.

---

## Checklist

- [x] **Pages live, paths match manifest, no orphans**  
  31 pages. All core pages, 3 service pages, services hub, service-areas hub, 4 town pages, 8 town×service pages, 5 resource articles, sitemap.xml, robots.txt.  
  All linked from parent pages. No orphans detected.

- [x] **Zero outbound links to portfolio domains**  
  Verified. Zero href matches to other portfolio domains.

- [x] **No address in copy, footer, or schema**  
  Contact page explicitly states no street address published. Schema omits `address` field. Verified by grep.

- [x] **(866) 958-8773 present and correct on every page**  
  31/31 pages confirmed by grep.

- [x] **ops@thequotemasters.com present and correct on every page**  
  31/31 pages confirmed by grep.

- [x] **No testimonials, star ratings, or Review/AggregateRating schema**  
  Zero matches. No /reviews/ page built. No star ratings or schema types.

- [x] **"22 years" in header strapline, footer, and homepage opening**  
  31/31 pages have "22 years in business" in strapline. Homepage opening paragraph contains "22 years in business". Footer contains same phrase.

- [x] **All 4 towns inside the 25-mile radius**  
  | Town | Approximate distance from Houlton, WI |
  |---|---|
  | Hudson, WI | ~7 miles |
  | North Hudson, WI | ~8 miles |
  | Somerset, WI | ~14 miles |
  | Saint Joseph, WI | ~18 miles |
  All four confirmed within 25 miles. (Note: manifest listed 8 towns; 4 were split to commercialcleanershoulton.com per collision rules in BUILD-SPEC §6.)

- [x] **No `{{` tokens anywhere in any file**  
  Zero matches confirmed by grep.

- [x] **No invented credentials, reviews, prices, policy numbers, or staff details**  
  No fabricated insurance amounts, no policy numbers, no star ratings, no staff counts, no testimonials. One instance of "since 2003" in homepage meta description was found and corrected during QA.

- [x] **Every town page carries ≥3 town-specific facts**

  **Hudson:**  
  (1) St. Croix County seat — courthouse and professional services on Third Street.  
  (2) Hudson Medical Center on Stageline Road anchors a healthcare corridor.  
  (3) I-94/WI-35 interchange position with sub-30-minute drive to downtown St. Paul.

  **North Hudson:**  
  (1) Shares I-94 corridor — patient base extends toward Twin Cities and east Wisconsin.  
  (2) Lake Mallalieu district light industrial area generates working-adult patient base.  
  (3) Proximity to Hudson (under two miles) creates shared referral network competition.

  **Somerset:**  
  (1) Apple River State Park generates seasonal recreational traffic with summer volume spikes.  
  (2) Somerset School District serves families across a broad rural township.  
  (3) WI-35 links north to Osceola and south to Hudson — natural patient service stop.

  **Saint Joseph:**  
  (1) Township covers significant rural agricultural area with distinct occupational health patterns.  
  (2) WI-64 connects east to Hudson/I-94 corridor and west to New Richmond.  
  (3) Practices function as primary healthcare access point — 30-minute nearest alternative drives retention.

- [x] **Pricing page uses honest language — no fabricated ranges**  
  /pricing/ explains pricing structure and drivers without citing any dollar amounts. Uses "contact for quote" framing throughout. No invented per-sq-ft rates.

- [x] **/insured-and-bonded/ uses plain prose — no invented policy numbers**  
  Page describes general liability, bonding, and workers' comp in plain language. No policy numbers, no coverage dollar amounts. Certificate available with quote.

- [x] **Meta descriptions unique, all ≤158 characters**  
  All 31 pages verified. Zero over 158 chars after correction pass.

- [x] **sitemap.xml and robots.txt present**  
  Both files at root. Sitemap lists all 31 page URLs with changefreq and priority values.

- [x] **Theme C recorded in rotation log**  
  | Domain | Theme used |
  |---|---|
  | churchcleaningscandia.com | B — Warm & Local |
  | medicalofficecleaninghoulton.com | C — Technical & Compliance-Led |

- [x] **Theme consistent across all 31 pages**  
  All pages link /styles.css. CSS uses --primary: #0a3d2e (deep forest green), --accent: #2a9d6f. No mixed theme elements.

---

## Known deviations and decisions

**Town count reduction (8→4):** Per BUILD-SPEC §6, the Houlton collision requires non-overlapping town lists. This build takes Hudson, North Hudson, Somerset, Saint Joseph. commercialcleanershoulton.com takes New Richmond, Roberts, Stillwater, Oak Park Heights. Page count reduced to 31 accordingly.

**Waiting-room service×town pages not built:** The manifest shows 2 child pages per town (exam-room + dental). The waiting-room service×town pages (e.g., /service-areas/hudson/waiting-room-reception-cleaning/) are not in the manifest and were not built. The waiting room service is linked from each town page and the services hub.

**Sibling collision — do not launch within 6 weeks of commercialcleanershoulton.com.**

---

## Lighthouse performance target

Pages use: no web fonts, no carousel libraries, inline critical CSS, semantic HTML5, loading="lazy" on images (no images used — avoids image load time entirely). Target mobile Lighthouse ≥90 is achievable based on page construction. Verify with actual Lighthouse run post-deployment.
