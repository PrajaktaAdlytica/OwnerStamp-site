# OwnerStamp frontend handoff

Built 7 October 2026. This is the high-fidelity local frontend, not a deployed or authenticated service.

## Approved decisions retained

- Authority Imprint hero/editorial identity; operational dashboards only for product explanation, workflows, and evidence.
- Approved framed two-tone OwnerStamp wordmark and reduced mark/favicon, not the rejected seal/document symbols.
- Warm paper, oxblood, Newsreader editorial headings, Inter product UI. Distinctive plate-press/trace CTA motion, not a rotating diagonal arrow.
- Five proposed modules on Home plus five dedicated product pages. Separate Problem, Solution, inventory-review inquiry, and guided-demo inquiry pages.
- Primary CTA: “Request a redacted inventory review.” No public product-stage label.
- $4,000 fixed / 30-day pilot hypothesis; later post-interview hypothesis $1,500/month + $2/governed agent/month. No superseded tiers or checkout.
- Read-only, source-aware reconciliation overlay; no invented live connectors, automatic attribution, credential issuance, revocation execution, customer logos, certifications, or operational security commitments.
- Final enabled inquiry/auth UI. No public preview/nonfunctional/not-connected notices. A separate developer adds backend functionality.
- Synthetic product illustrations and the separate interactive workspace remain visibly labeled. Proposed module labels are intentional.

## Source map

| File | Responsibility |
|---|---|
| `build.mjs` | Shared page templates, content, all 18 routes, SVG product/CTA artwork |
| `templates/demo.inc` | Four-view synthetic workspace markup |
| `styles.css` | Base font definitions and legacy structural styles |
| `visual.css` | Base high-fidelity layout, typography, responsive details and interaction states |
| `editorial.css` | Reference-led image, glass, section, card, typography and footer treatments |
| `art-direction.mjs` | Source-authored relationship artwork, image chapter, footer signature and disabled social controls |
| `site.js` | Menus, form validation/hooks, password toggle, ledger tabs, synthetic state |
| `motion.js` | GSAP/ScrollTrigger + Lenis, page/section entrances and five-step narrative |
| `check.mjs` | Generated-site route/asset/anchor/content checks |
| `assets/` | Self-hosted fonts, approved logos, hero artwork, motion libraries/licenses |

Run `npm run build` after template/content edits. The committed/generated static HTML is hostable without a Node runtime. No build-time packages are required for regeneration.

## Form integration

The existing handler prevents native submission and validates fields. On valid input it emits a bubbling event on the form:

```js
document.addEventListener('ownerstamp:form-ready', event => {
  const { formName, form } = event.detail;
  // Implement the approved backend submission here.
  // FormData should only be read when a secure destination and handling are ready.
});
```

Form names: `inventory-review`, `guided-demo`, `sign-in`. Confirm these names in `data-form` when integrating. The current event contains a form reference, not copied field values. The current handler neither reads nor persists credentials. No fake success, route change, external request, or form reset occurs on valid submission.

The receiving developer must add server validation, secure transport, anti-abuse controls, pending/error/success states, privacy/consent language appropriate to the actual handling, and an operational owner. For sign-in, add secure authentication/session management and approved account-recovery flows. Do not store passwords in browser storage or analytics. Do not simply point a static form at an arbitrary third-party endpoint.

`ownerstamp:event` is a separate local event hook for page/CTA/demo events. No analytics vendor is connected. Do not attach personal data to it.

## Synthetic workspace

Eight fictional Northstar Components records; all changes are in-memory. Inventory filtering, record selection, sponsor confirmation, expiry illustration, and revocation-ticket drafting affect only this local workspace. Graph and Evidence follow the selected record. Reset/reload removes all changes. There is no external write, credential action, export, or customer record. Preserve the persistent synthetic label and the no-execution boundary when extending it.

## Motion implementation

Lenis uses the native window scroller and the GSAP ticker (`seconds * 1000`); its scroll event updates ScrollTrigger. No unnecessary scroller proxy or body-scroll replacement. Fonts, image loads, and disclosure changes refresh trigger measurements. Desktop pins only the bounded five-step record story. Mobile uses native-flow chapters and touch scrolling. Reduced-motion preferences bypass Lenis and GSAP entrances/pins. All content is present in the HTML before JavaScript runs.

Maintain semantic links, native controls, keyboard tabs, focus styles, Escape behavior, and modal focus return. Decorative icons are not separate clickable controls; their parent controls provide the action and state.

## Checks performed

- `npm run build`: all 18 routes generated.
- `npm run check`: JS syntax plus 1,081 local asset/link/anchor checks, one H1 per route, unique IDs, motion runtime inclusion, retired-content and public-form-label checks passed.
- Browser layout checks at 390 × 844 and 768 × 900 for all 18 routes: no horizontal document overflow, one H1, no broken images. Desktop compositions visually inspected, including Home, Platform, product proof, inquiry forms, and the synthetic workspace.
- Desktop product navigation opens and closes; Escape returns focus. Ledger tabs and record selection update owner, principal, scope, and evidence. Inquiry validation focuses the first invalid field. Sign-in password visibility switches correctly. FAQ disclosures open. The pinned story updates its highlighted field/caption and its skip link reaches product proof.
- Synthetic sponsor confirmation, ticket drafting, attestation expiry, and reset visibly verified in the browser.
- No console errors observed in the tested local pages.

Coverage limits: responsive layout was checked in same-origin frames because the available browser viewport override did not resize its rendered surface. Nested-frame input testing was unreliable, so this is not a full mobile interaction or real-device certification. Reduced-motion branches were inspected in source, not exercised through an OS preference change. Cross-browser, screen-reader, Lighthouse/performance, and deployed-environment testing remain launch tasks. Do not describe these checks as a complete accessibility or production certification.

## Before public launch

The reference-led visual update and image prompts are documented in `VISUAL-UPDATE.md`. LinkedIn, X, YouTube, and Instagram controls are intentionally disabled per the user, pending actual account URLs. Add destinations only when confirmed. Both new WebP assets and all social SVGs are included locally. GSAP now also assembles relationship tiles, stages module visuals, moves the cinematic artwork with scroll, settles dashboard panels, and reveals the oversized footer signature. Reduced motion bypasses these effects.

Backend integration is intentionally outside this build. Confirm real company/contact details, legal documents, security/data-processing commitments, product capability availability, and final pricing before publishing claims. Deploy to the selected account, connect the domain, and repeat deployment/browser checks after those choices are approved. No GitHub push, Vercel deployment, or DNS change has been made by this local build.
