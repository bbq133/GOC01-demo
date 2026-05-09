# GOC Landing Page — Session Handoff

## What Was Done

A brainstorming session produced a complete landing page design spec for GOC AI Dashboard's SaaS go-to-market page.

### Key Files

| File | Purpose |
|---|---|
| `docs/superpowers/specs/2026-05-03-goc-landing-page-full-spec.md` | **Complete design spec** — the authoritative document. Contains all section designs, copy (EN/CN), visual system, layout rules, responsive behavior, and content placeholders. |
| `docs/superpowers/specs/2026-05-03-goc-ai-dashboard-landing-page-design.md` | Earlier framework draft — superseded by the full spec above. Keep for reference but do not use as the implementation source. |
| `资料库/` | Product PDFs with detailed feature descriptions, client case studies, attribution methodology explanations. Key source material for any copy refinement. |
| `image/` | Dashboard screenshots and internal training materials. These are internal docs (with watermarks), not suitable for direct use on the landing page. Use as visual reference for creating placeholder mockups. |

### Design Decisions Made

1. **Narrative:** Problem-diagnosis approach (Pain → Cause → Solution → Product → Proof → Action)
2. **Conversion goal:** Self-serve free trial via external link to product registration
3. **Audience:** DTC ecommerce brand growth/advertising teams
4. **Language:** Bilingual EN/CN displayed simultaneously (EN primary, CN secondary below)
5. **Visual:** Light, clean, modern — white backgrounds, deep blue (#1a56db) primary accent, Inter font
6. **Hero message:** "Every Platform Claims Credit. Your Budget Needs One Standard."
7. **Page sections (10 total):** Nav → Hero → Problem Diagnosis → GOC Method → Three Pillars → Dashboard Preview → Before/After → Customer Proof → Google Partnership → Final CTA → Footer
8. **Product screenshots:** Placeholder mockups with simulated data (replace with real screenshots later)
9. **Client logos:** Real logos permitted (Narwal, EcoFlow, Velotric, Speediance, Phrozen, eufyMake, AWOL, Glazero)

## What Needs to Happen Next

### Immediate Next Step

Read the full spec at `docs/superpowers/specs/2026-05-03-goc-landing-page-full-spec.md`, then create an implementation plan that breaks the landing page into buildable tasks.

### Implementation Approach

Build as a single-page static site (HTML/CSS/JS). No framework needed for v1. Key priorities:

1. **Set up project structure** — HTML file, CSS file, asset directory
2. **Build visual system first** — colors, typography, spacing as CSS custom properties
3. **Implement sections top-to-bottom** — Nav → Hero → Problem → Method → Pillars → Dashboard → Before/After → Proof → Google Badge → CTA → Footer
4. **Create placeholder visuals** — SVG/CSS diagrams for the attribution convergence graphic, dashboard mockup, comparison table
5. **Responsive behavior** — mobile-first, test at 375px, 768px, 1024px, 1440px
6. **Bilingual layout** — EN text primary, CN text below in smaller/lighter style

### Content Gaps to Track

These items need real content before production launch (use placeholders for now):

- Final product name confirmation
- Real dashboard screenshots (masked data)
- Client logo image files
- Validated aggregate metrics (ROI improvement %, ad spend measured, etc.)
- 1-2 client testimonial quotes
- Google Partner badge asset
- Trial registration page URL
- Pricing page (or decision to omit from nav)
- Privacy policy and terms of service pages

### Quality Bar

- Lighthouse Performance > 90
- Page weight < 500KB (excluding images)
- Works cleanly on Chrome, Safari, Firefox, mobile Safari, mobile Chrome
- Bilingual text is readable without visual clutter
- All CTA buttons link to a consistent trial URL (placeholder `#trial` until real URL is available)

## Context From Source Materials

Key product facts extracted from `资料库/` that should inform copy refinement:

- GOC is Google's only official technology partner for this attribution capability
- Uses Data-Driven attribution (not Last Click), with machine learning to identify purchase intent
- Builds first-party data storage on Google Cloud at ~$50/month (vs CDP at $10K+/yr or GA360 at $150K+/yr)
- Provides 365-day Safari-friendly attribution (bypasses 7-day cookie limit)
- Core metrics: seeding rate (种草率), user value (用户价值), concentration (浓度), purchase impulsivity (购买冲动性)
- Proven results across 8+ client projects with ROI improvements ranging from 42% to 120%
- Supports Meta, Google, TikTok, DSP, Taboola, TTD, MNTN, and custom channels
