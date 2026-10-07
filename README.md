# OwnerStamp high-fidelity website

18-page static frontend aligned to the approved Authority Imprint identity and OwnerStamp execution brief. Warm paper, oxblood, the approved framed wordmark, Newsreader display type, Inter interface type, bespoke product visuals, and selective operational dashboards.

## Run and edit

From this directory:

```sh
npm run build
npm run check
npm run serve
```

Open `http://localhost:8766/`. Node is needed only to regenerate/check the pages; Python runs the development-server command. No npm install is required. Generated HTML and local assets can be served by any static host. Keep nested `products/` and `demo/` paths intact.

Edit `build.mjs` and `templates/demo.inc`, then rebuild. Do not directly edit generated HTML. `styles.css` supplies the base; `visual.css` is the current high-fidelity design layer. `site.js` handles interactive UI; `motion.js` handles scrolling and entrances.

## Routes

- Home; Problem; Solution; Platform; Use cases
- Five proposed modules: Registry Desk, Review, Proof, Signal, Report
- Evaluation; Request inventory review; Request guided demo
- Synthetic workspace with Inventory, Graph, Attestations, Evidence
- Trust; Company; Contact; Sign in

All five modules appear on Home and have dedicated detail pages. There is no invented registration or unsupported integration route.

## Motion

GSAP 3.15.0, ScrollTrigger, and Lenis 1.3.26 are bundled locally. The homepage has a five-step pinned ownership/evidence narrative on desktop. Other sections use staggered reveals, bounded image movement, graph traces, and evidence-sheet transitions. Mobile uses native-flow storytelling, not pinned scrolling. Reduced-motion users receive visible content without Lenis or GSAP transforms. CTAs use the approved plate-press/trace interaction rather than arrow rotation.

## Backend boundary

Inquiry and sign-in forms use final styling and enabled controls. Backend integration is intentionally deferred. Valid forms emit the local `ownerstamp:form-ready` event; there is no network request, fabricated success, storage, or authentication. Do not add public preview/nonfunctional notices. See `HANDOFF.md` for integration details and launch responsibilities.

The synthetic demo is a different boundary: its fictional data stays visibly labeled, local-only, resettable, and incapable of real access actions. Proposed module labels and pricing hypotheses remain explicit. No customer, certification, security, or integration claims were invented.

See `ASSETS.md` for asset provenance and `THIRD-PARTY-NOTICES.md` for licenses. Deployment and custom-domain connection are not part of this local deliverable.
