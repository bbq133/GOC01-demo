# GOC AI Dashboard Landing Page — Full Design Spec

## 1. Overview

### Product
GOC AI Dashboard (Global OneClick) — a cross-platform advertising attribution system for overseas DTC ecommerce brands.

### Goal
Build a bilingual (EN/CN) landing page that drives free trial sign-ups by leading with a problem-diagnosis narrative: advertisers cannot trust platform-reported attribution, and GOC provides one unified, platform-neutral standard.

### Key Decisions

| Dimension | Decision |
|---|---|
| Conversion goal | Self-serve free trial (link to product registration page) |
| Primary audience | DTC ecommerce brand growth/advertising teams |
| Language | Bilingual EN/CN displayed simultaneously |
| Hero message | Unified attribution standard (platform-neutral) |
| Visual style | Light, clean, modern (Stripe/Linear aesthetic) |
| Product screenshots | Placeholder mockups with simulated data, replace later |
| Customer proof | Real client logos permitted (Narwal, EcoFlow, Velotric, etc.) |
| CTA design | Single trial link button directing to product registration page |
| Trial flow | Not yet defined; landing page provides link entry point only |

### Narrative Structure (Problem-Diagnosis)

```
Pain → Cause → Solution → Product → Proof → Action
```

1. Hero: name the pain (platforms all claim credit)
2. Problem Diagnosis: why platform attribution cannot be trusted alone
3. GOC Method: how unified attribution works
4. Three Capability Pillars: what the product delivers
5. Dashboard Preview: make the product tangible
6. Before/After Comparison: old world vs new world
7. Customer Proof: logos + aggregated results
8. Final CTA: convert interest into trial

---

## 2. Visual System

### Color Palette

| Role | Value | Usage |
|---|---|---|
| Primary | `#1a56db` (deep blue) | CTA buttons, links, key accents |
| Primary hover | `#1642a8` | Button hover states |
| Dark text | `#111827` | Headlines, nav |
| Body text | `#4b5563` | Paragraphs, descriptions |
| Light text | `#9ca3af` | Captions, microcopy |
| Background | `#ffffff` | Page background |
| Surface | `#f9fafb` | Alternating section backgrounds |
| Border | `#e5e7eb` | Dividers, card borders |
| Success green | `#059669` | Positive metrics, "after" states |
| Warning red | `#dc2626` | Negative metrics, "before" states |

### Typography

- Headlines: Inter or system sans-serif, 700 weight
- Body: Inter or system sans-serif, 400 weight
- EN text size: Hero h1 48-56px, section h2 32-40px, body 16-18px
- CN text displayed below or beside EN at slightly smaller size (80-90%)
- Line height: 1.5 for body, 1.2 for headlines

### Layout

- Max content width: 1200px, centered
- Section vertical padding: 80-120px
- Mobile-first responsive: single column below 768px
- Generous whitespace between sections
- Cards and visual elements use subtle `border-radius: 12px` and light shadows

### Bilingual Display Rules

- EN is the primary display language
- CN appears directly below the EN text in each section, using a slightly smaller font size and lighter color (`#4b5563` for CN body vs `#111827` for EN headlines)
- CTA buttons show EN text; CN equivalent in smaller text below or as tooltip
- Navigation shows EN labels; CN appears on hover or in parentheses

---

## 3. Section-by-Section Design

### Section 0: Navigation Bar

**Layout:** Fixed top, visible on scroll. White background with 1px bottom border (`#e5e7eb`).

**Left:** GOC AI Dashboard logo (placeholder: text logo "GOC" in primary blue + "AI Dashboard" in dark text).

**Center links:**
- Product
- How It Works
- Customers
- Pricing (links to contact or anchor, if no pricing page yet)

**Right:**
- Language toggle: `EN / 中文`
- CTA button: `Start Free Trial` — primary blue background, white text, rounded corners

**Mobile:** Collapse center links into hamburger menu. Keep logo left, CTA right.

---

### Section 1: Hero

**Purpose:** In 5 seconds, explain what GOC does and why it matters. Drive trial intent.

**EN Headline:**
> Every Platform Claims Credit. Your Budget Needs One Standard.

**CN Headline:**
> 每个平台都在邀功，你的预算需要一个统一标准。

**EN Subheadline:**
> GOC rebuilds attribution across Meta, Google, TikTok and all your paid channels with one consistent, platform-neutral measurement framework — so you can finally compare apples to apples.

**CN Subheadline:**
> GOC 用统一的、不偏向任何平台的归因框架，重建 Meta、Google、TikTok 等全渠道广告归因——让你真正实现 Apple-to-Apple 的跨平台对比。

**CTA:**
- Primary button: `Start Free Trial`（开始免费试用）
- Microcopy below button: `Connect your ad accounts and see your first attribution view.`（接入广告账户，即可查看第一个归因报告。）

**Visual element (right side or below on mobile):**
- Conceptual diagram: three platform icons (Meta, Google, TikTok) each showing different attribution numbers for the same conversion, with arrows converging into a single GOC unified view
- Use placeholder/illustration style, not a real screenshot
- Color: platform icons in their brand colors, GOC view in primary blue

**Background:** White (`#ffffff`). Large whitespace above and below.

**Trust badge row** (below hero, above fold):
- Small text: `Trusted by growth teams at`
- Row of 4-6 grayscale client logos: Narwal, EcoFlow, Velotric, Phrozen, eufyMake, Speediance
- CN: `已获头部出海品牌信赖`

---

### Section 2: Problem Diagnosis

**Purpose:** Create pain recognition. Show why platform-reported attribution is broken.

**Section label:** `THE PROBLEM` / `核心问题`

**EN Headline:**
> Platform Attribution Is Broken. You Just Can't See It Yet.

**CN Headline:**
> 平台归因早已失真，只是你还没看到。

**Content — three problem cards in a row:**

**Card 1: Conflicting Credit**
- Icon: overlapping circles or Venn diagram
- EN: `Every platform claims the same conversion. Meta says it drove the sale. Google says it did. TikTok agrees with itself. The total adds up to 150% of your actual revenue.`
- CN: `每个平台都在抢同一个转化。Meta 说是它带来的，Google 说是自己的功劳，TikTok 也不甘示弱。加起来是实际收入的 150%。`

**Card 2: Short-Window Bias**
- Icon: hourglass or timer
- EN: `Most platforms use 7-day click attribution. Upper-funnel channels like YouTube, display, and content campaigns get zero credit — even when they started the customer journey.`
- CN: `大多数平台使用 7 天点击归因。YouTube、展示广告、内容营销等上中层渠道的贡献被完全忽略——即使用户旅程正是由它们开启。`

**Card 3: Blind Budget Decisions**
- Icon: pie chart with question mark
- EN: `Without a unified standard, growth teams over-invest in channels that look good on paper and starve the channels that actually drive pipeline.`
- CN: `没有统一标准，增长团队会过度投资那些"数据好看"的渠道，却饿死了真正驱动增长的渠道。`

**Background:** `#f9fafb` (light surface), cards on white with subtle shadow.

---

### Section 3: GOC Method

**Purpose:** Explain how GOC solves the problem without being too technical. Position GOC as a measurement framework, not just a dashboard.

**Section label:** `HOW IT WORKS` / `工作原理`

**EN Headline:**
> One Framework. Every Channel. The Full Picture.

**CN Headline:**
> 一套框架，覆盖全渠道，还原完整归因。

**Four-step horizontal flow (with connecting line/arrows):**

**Step 1: Collect**
- Icon: data streams flowing in
- EN: `Connect campaign data from Meta, Google, TikTok, DSP, and any paid channel. Pull conversion signals from GA4, Shopify, and your own systems.`
- CN: `接入 Meta、Google、TikTok、DSP 等全渠道广告数据，拉取 GA4、Shopify 及自有系统的转化信号。`

**Step 2: Normalize**
- Icon: filter/funnel
- EN: `Strip out platform bias. Normalize attribution windows, device signals, and conversion definitions into one consistent standard.`
- CN: `去除平台偏差，将归因窗口、设备信号、转化定义统一归一化为一致的衡量标准。`

**Step 3: Rebuild**
- Icon: network/graph nodes
- EN: `Rebuild attribution using data-driven logic across devices, touchpoints, and user conversion cycles — not just last click.`
- CN: `使用 Data-Driven 归因逻辑，跨设备、跨触点、跨用户转化周期重建归因——而不是只看 Last Click。`

**Step 4: Optimize**
- Icon: ascending chart
- EN: `Translate attribution into channel comparison, upper-funnel evaluation, and budget optimization guidance.`
- CN: `将归因结果转化为渠道对比分析、上中层效果评估和预算优化建议。`

**Background:** White (`#ffffff`).

---

### Section 4: Three Capability Pillars

**Purpose:** Translate product value into three clear capability groups that map to advertiser needs.

**Section label:** `CAPABILITIES` / `核心能力`

**EN Headline:**
> Three Problems. Three Answers.

**CN Headline:**
> 三个问题，三个解答。

**Pillar A: Decision-Grade Attribution / 决策级归因**

- EN question: `Which channels actually drive conversions?`
- CN question: `哪些渠道真正驱动了转化？`
- EN description: `Estimate channel contribution under one unified logic. Reduce self-reported platform bias. Compare Meta, Google, TikTok, and DSP under the same standard.`
- CN description: `在统一逻辑下估算渠道贡献，减少平台自报偏差。用同一个标准对比 Meta、Google、TikTok 和 DSP。`
- Visual: placeholder — channel comparison bar chart showing GOC-attributed revenue vs platform-reported

**Pillar B: Upper-Funnel Measurement / 上中层价值还原**

- EN question: `Is your brand spend actually working?`
- CN question: `品牌广告的钱花得值不值？`
- EN description: `Measure YouTube, display, content, and awareness campaigns with cross-device, long-window attribution. Connect early influence to later conversion using seeding rate and user value metrics.`
- CN description: `通过跨设备、长窗口归因衡量 YouTube、展示广告、内容营销的真实贡献。用种草率和用户价值指标，连接早期影响与后期转化。`
- Visual: placeholder — user journey timeline showing upper-funnel touchpoint credited

**Pillar C: Budget Optimization / 预算优化**

- EN question: `Where should your next dollar go?`
- CN question: `下一块钱该花在哪？`
- EN description: `Turn attribution insights into budget decisions. Identify under-credited channels. Model the revenue impact of shifting spend between upper-funnel and conversion campaigns.`
- CN description: `将归因洞察转化为预算决策。找到被低估的渠道。模拟上中层与转化广告之间的预算调整对收入的影响。`
- Visual: placeholder — before/after budget allocation pie chart with revenue change

**Layout:** Three columns on desktop (card style with icon, question, description, visual placeholder). Stack vertically on mobile.

**Background:** `#f9fafb`.

---

### Section 5: Dashboard Preview

**Purpose:** Make the product tangible. Show that the unified attribution logic becomes a usable operating dashboard.

**Section label:** `SEE IT IN ACTION` / `产品预览`

**EN Headline:**
> Your Attribution Command Center

**CN Headline:**
> 你的归因指挥中心

**Layout:** Large centered screenshot placeholder (16:9 aspect ratio) with annotation callouts.

**Placeholder content — a simulated dashboard showing:**
1. Channel contribution overview (bar chart: Meta, Google, TikTok, DSP with GOC-attributed revenue)
2. Seeding rate bubble chart (渠道分析 view — similar to your existing dashboard)
3. User conversion journey timeline
4. Budget optimization recommendation panel

**Callout annotations (3-4 floating labels):**
- `Unified ROI across all channels` / `全渠道统一 ROI`
- `Seeding rate by source` / `按来源的种草率`
- `Cross-device conversion path` / `跨设备转化路径`
- `Budget reallocation guidance` / `预算调整建议`

**Below screenshot — feature highlights row (3-4 small items):**
- `Real-time sync` / `实时同步`
- `Cross-device tracking` / `跨设备追踪`
- `365-day attribution window` / `365 天归因窗口`
- `Safari-friendly (bypass cookie limits)` / `兼容 Safari（突破 Cookie 限制）`

**Background:** White. Screenshot has a subtle drop shadow and rounded corners to look like a real product window.

---

### Section 6: Before/After Comparison

**Purpose:** Create a visceral "old way vs new way" contrast. Borrowed from Approach C to strengthen the narrative.

**Section label:** `THE SHIFT` / `改变`

**EN Headline:**
> Stop Guessing. Start Measuring.

**CN Headline:**
> 停止猜测，开始衡量。

**Two-column comparison table:**

| Dimension | Without GOC (Before) | With GOC (After) |
|---|---|---|
| Attribution model | Each platform uses its own rules | One unified data-driven standard |
| Upper-funnel credit | YouTube/display get zero credit | Full cross-device, long-window attribution |
| Budget decisions | Based on conflicting platform reports | Based on one consistent channel comparison |
| Data window | 7-day click (platform default) | Up to 365-day with first-party data |
| Cookie limitation | Safari blocks after 7 days | First-party data bypasses browser limits |
| Cost | GA360 ($150K+/yr) or CDP ($10K+/yr) | Fraction of the cost |

**CN version of the same table:**

| 维度 | 没有 GOC（之前） | 使用 GOC（之后） |
|---|---|---|
| 归因模型 | 每个平台各用各的规则 | 一套统一的 Data-Driven 标准 |
| 上中层归因 | YouTube/展示广告零归因 | 跨设备、长窗口完整归因 |
| 预算决策 | 基于互相矛盾的平台报告 | 基于统一的渠道对比 |
| 数据窗口 | 7 天点击（平台默认） | 最长 365 天一方数据归因 |
| Cookie 限制 | Safari 7 天后失效 | 一方数据突破浏览器限制 |
| 成本 | GA360（$15万+/年）或 CDP（$1万+/年） | 极低成本 |

**Visual treatment:**
- "Before" column: light red tint (`#fef2f2`), red accent marks
- "After" column: light green tint (`#f0fdf4`), green check marks
- Clean table with rounded corners, no heavy borders

**Background:** `#f9fafb`.

---

### Section 7: Customer Proof

**Purpose:** Build confidence with real usage evidence.

**Section label:** `TRUSTED BY LEADING DTC BRANDS` / `头部出海品牌的信赖之选`

**Layout option: Logo wall + metrics row**

**Logo row:** Narwal, EcoFlow, Velotric, Speediance, Phrozen, eufyMake, AWOL, Glazero
- Display as grayscale, color on hover
- 8 logos in a row on desktop, 2 rows of 4 on mobile

**Aggregate metrics row (3-4 large numbers):**
- `80-120%` — `Average ROI improvement after adopting GOC attribution` / `接入 GOC 归因后平均 ROI 提升幅度`
- `8+` — `Industries served` / `服务行业`
- `$XM+` — `Ad spend measured monthly` / `月度衡量广告花费` (placeholder — validate with real data before launch)
- `Google Partner` — `Official Google technology partner` / `Google 官方技术合作伙伴`

**Optional testimonial block (1-2 quotes):**
- Placeholder for client quote about attribution value
- Format: quote text, name, title, company logo

**Background:** White.

---

### Section 8: Google Partnership Badge

**Purpose:** Leverage the unique competitive advantage of being Google's only official technology partner for this capability.

**Layout:** Compact banner-style section.

**EN text:**
> The only attribution technology partner officially working with Google to bring decision-grade measurement to advertisers.

**CN text:**
> Google 官方唯一合作的归因技术方案商，为广告主提供决策级归因衡量能力。

**Visual:** Google Partner badge/logo (placeholder) + GOC logo side by side.

**Background:** `#f9fafb`. Subtle, not loud — this is a credibility reinforcement, not a sales pitch.

---

### Section 9: Final CTA

**Purpose:** Convert remaining interest into free trial action.

**EN Headline:**
> Start Measuring Your Ads With One Standard.

**CN Headline:**
> 用一个标准，重新衡量你的广告。

**EN Subtext:**
> Connect your ad accounts, see unified attribution across every channel, and make budget decisions you can trust.

**CN Subtext:**
> 接入广告账户，查看全渠道统一归因，做出你可以信赖的预算决策。

**CTA button:** `Start Free Trial`（开始免费试用）— large, centered, primary blue.

**Microcopy below:** Placeholder text. Options depending on trial flow:
- If no credit card required: `No credit card required.`（无需信用卡。）
- If guided setup: `Guided setup available. See your first report in minutes.`（提供引导式设置，几分钟即可看到第一份报告。）
- Update once trial flow is finalized.

**Background:** White, generous whitespace. This section should feel calm and confident, not desperate.

---

### Section 10: Footer

**Layout:** Dark background (`#111827`) with light text.

**Columns:**

**Column 1: Brand**
- GOC AI Dashboard logo (white version)
- One-line description: `Unified cross-platform ad attribution` / `统一跨平台广告归因`

**Column 2: Product**
- Features
- How It Works
- Pricing
- Documentation (placeholder link)

**Column 3: Company**
- About
- Blog (placeholder)
- Careers (placeholder)
- Contact

**Column 4: Legal**
- Privacy Policy
- Terms of Service
- Data Security

**Bottom bar:**
- `© 2026 Global OneClick. All rights reserved.`
- Social links (placeholder icons)

---

## 4. Responsive Behavior

### Desktop (≥1024px)
- Two-column hero layout (text left, visual right)
- Three-column capability pillars
- Side-by-side before/after comparison
- Logo row in single line

### Tablet (768-1023px)
- Hero stacks to single column (text above, visual below)
- Capability pillars: 2+1 layout or full stack
- Before/after becomes scrollable horizontal table

### Mobile (<768px)
- All sections single column
- Navigation collapses to hamburger + CTA button
- Logo row wraps to 2 rows
- Dashboard preview scales down with horizontal scroll hint
- Before/after becomes stacked cards (Before card, then After card)

---

## 5. Content Placeholders Summary

Items that need real content before launch:

| Item | Current State | Action Needed |
|---|---|---|
| Product name | "GOC AI Dashboard" (working name) | Confirm final English product name |
| Dashboard screenshots | Placeholder mockups | Replace with real product screenshots (masked data) |
| Client logos | Names confirmed | Collect logo files + get display permission |
| Aggregate metrics | Estimated from case data | Validate exact numbers for public use |
| Client testimonials | Not yet collected | Collect 1-2 quotes with attribution |
| Google Partner badge | Referenced in materials | Obtain official badge asset |
| Trial URL | Not yet defined | Provide registration page URL |
| Trial flow details | Not yet defined | Update CTA microcopy once trial flow is built |
| Pricing page | Does not exist yet | Create or remove nav link |
| Legal pages | Do not exist yet | Create privacy policy and terms of service |

---

## 6. Technical Notes

### Implementation Approach
- Single-page static site (HTML/CSS/JS)
- No framework dependency required for v1
- Consider Next.js or Astro if SEO and future pages are planned
- Bilingual content handled inline (not i18n framework) for v1 simplicity

### Performance Targets
- First Contentful Paint < 1.5s
- Total page weight < 500KB (excluding images)
- Lighthouse Performance score > 90

### SEO Considerations
- Page title: `GOC AI Dashboard — Unified Cross-Platform Ad Attribution`
- Meta description: `Rebuild attribution across Meta, Google, TikTok and all paid channels with one platform-neutral standard. Start free trial.`
- Open Graph tags for social sharing
- Structured data for SaaS product (Schema.org/SoftwareApplication)

---

## 7. Success Criteria

The landing page is successful if:

1. A visitor understands what GOC does within 5 seconds of landing
2. The attribution problem is immediately recognizable to the target audience
3. The page clearly communicates why unified attribution matters over platform-native reporting
4. Upper-funnel measurement value is understandable to non-technical growth team members
5. The free trial CTA is visible at all times (sticky nav) and repeated at page end
6. Client logos and Google partnership provide sufficient trust for trial conversion
7. The page loads fast and works well on both desktop and mobile
8. Bilingual display does not create visual clutter — CN text supports rather than competes with EN
