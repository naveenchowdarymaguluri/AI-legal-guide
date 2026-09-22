---
name: Jurisprudence Precision
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0f0069'
  on-tertiary-container: '#7671ff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#e2dfff'
  tertiary-fixed-dim: '#c3c0ff'
  on-tertiary-fixed: '#0f0069'
  on-tertiary-fixed-variant: '#3323cc'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  display-lg:
    fontFamily: Geist
    fontSize: 2.25rem
    fontWeight: '600'
    lineHeight: 2.75rem
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Geist
    fontSize: 1.75rem
    fontWeight: '600'
    lineHeight: 2.25rem
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Geist
    fontSize: 1.5rem
    fontWeight: '600'
    lineHeight: 2rem
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Geist
    fontSize: 1.25rem
    fontWeight: '600'
    lineHeight: 1.75rem
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Geist
    fontSize: 1.125rem
    fontWeight: '500'
    lineHeight: 1.5rem
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: -0.005em
  body-md:
    fontFamily: Inter
    fontSize: 0.875rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em
  body-sm:
    fontFamily: Inter
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.375rem
    letterSpacing: 0.005em
  label-md:
    fontFamily: Geist
    fontSize: 0.8125rem
    fontWeight: '500'
    lineHeight: 1rem
    letterSpacing: 0.01em
  label-sm:
    fontFamily: Geist
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 0.875rem
    letterSpacing: 0.04em
  code-sm:
    fontFamily: JetBrains Mono
    fontSize: 0.75rem
    fontWeight: '400'
    lineHeight: 1rem
    letterSpacing: -0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-sm: 1rem
  margin: 2rem
  margin-sm: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
---

## Brand & Style

This design system establishes an authoritative, crystalline, and restrained aesthetic tailored for legal professionals, corporate counsels, and compliance directors. It fuses the analytical density of Linear with the typographic refinement of Stripe and Notion, rejecting visual noise in favor of epistemic clarity.

The emotional objective is to evoke immediate intellectual trust, calm certitude, and unyielding rigor. Legal discovery and document synthesis demand intense focus; the interface acts as an invisible, high-precision instrument.

Key architectural pillars:
- **Structural Integrity:** Crisp 1px structural outlines paired with restrained atmospheric elevation, ensuring every container represents an explicit tier of evidence or analysis.
- **Analytical Contrast:** Pure slate ink on surgical off-white substrates, generating maximum readability without harsh optic fatigue.
- **Epistemic Provenance:** Distinct visual vocabularies differentiating speculative generative intelligence from verified statutory citations.

## Colors

The palette grounds the application in deep judicial tones balanced by luminescent, clinical neutrals:

- **Primary Canvas & Surfaces:** Canvas background rests at `#F8FAFC`, stepping up to `#FFFFFF` for primary cards and analytical workspaces. Recessed surfaces, side panels, and utility drawers utilize `#F1F5F9`.
- **Primary Ink & Structure:** `#0F172A` (Midnight Slate) commands all core headings, authoritative values, and structural accents. Secondary text adopts `#334155`, while muted metadata and annotations use `#64748B`.
- **Accents:** `#2563EB` serves as the primary interactive and focal accent, used for active selections, focused states, and key navigational nodes. `#4F46E5` is dedicated specifically to synthesized intelligence actions and AI-driven insights.
- **Verification & Source Tiers:**
  - *Verified Authority / Statutory Citation:* Emerald (`#059669` fill, `#10B981` text, `#ECFDF5` background tint). Signifies confirmed primary-source doctrine.
  - *Advisory / Caveat Required:* Amber (`#D97706` fill, `#F59E0B` text, `#FFFBEB` background tint). Signals conditional provisions or jurisdictional nuance.
  - *Critical Risk / Material Discrepancy:* Ruby (`#DC2626` fill, `#EF4444` text, `#FEF2F2` background tint). Used strictly for conflicting precedents or critical contract liabilities.
- **Borders & Dividers:** Base dividing lines use `#E2E8F0`; focused containers and active inputs use `#CBD5E1`.

## Typography

The typographic hierarchy combines **Geist** for analytical UI scaffolding, headers, and precise numerical metadata, with **Inter** for sustained, highly legible body reading across lengthy contracts, briefs, and judicial opinions.

- **Authority through Weight:** Never use heavy black weights. Headings peak at `font-semibold` (600) to maintain high-end restraint. Body text sits primarily at `font-normal` (400), with clause references, party designations, and statutory tags elevated via `font-medium` (500).
- **Metric Tracking:** Headlines require tight negative letter-spacing (`-0.02em` to `-0.03em`) to mimic physical editorial prints. Micro-labels and statutory metadata adopt positive letter-spacing (`+0.04em`) with uppercase transformations for rapid visual scanning.
- **Reading Rhythm:** Paragraph body text operates at a generous `1.625rem` line-height on `1rem` font-size to prevent visual fatigue during deep discovery and multi-clause comparison.

## Layout & Spacing

The layout is built upon an uncompromising 8px baseline rhythm with 4px sub-increments for high-density components:

- **Grid Architecture:** Multi-pane analytical layout featuring a fixed persistent navigation rail (64px collapsed, 240px expanded), an optional contextual document tree (280px), a flexible primary canvas workspace (fluid up to 960px reading max-width), and an anchored right-hand inspector/copilot drawer (380px–440px).
- **Responsive Adaptations:**
  - *Desktop (>1280px):* Full 3-4 pane operational view; 24px margins, 24px gutters.
  - *Tablet (768px - 1279px):* Contextual document tree and copilot drawer compress into overlay sheets. Workspace takes 100% remaining width; 16px margins, 16px gutters.
  - *Mobile (<768px):* Single active view with stacked navigation; document synthesis reads sequentially; 16px margins, 12px gutters.
- **Spacing Application:**
  - `space-xs` (4px): Inline pill gaps, indicator dots, tight icon-to-label spacing.
  - `space-sm` (8px): Form input padding, button internal padding, table cell vertical padding.
  - `space-md` (16px): Card internal padding, document section stack gaps.
  - `space-lg` (24px): Primary card separation, analytical module padding.
  - `space-xl` (32px): Major structural section splits.

## Elevation & Depth

This design system achieves hierarchy through disciplined surface separation, razor-sharp borders, and calibrated multi-stop shadows, entirely avoiding heavy artificial drop shadows.

- **Baseline Stratum (0dp):** Substrate `#F8FAFC`. Unbordered and non-elevated.
- **Document & Card Stratum (1dp):** `#FFFFFF` surface container bound by a crisp 1px `#E2E8F0` border. Shadow formula:
  - `0 1px 2px 0 rgba(15, 23, 42, 0.04), 0 1px 3px 0 rgba(15, 23, 42, 0.02)`
- **Interactive Hover & Drawer Stratum (2dp):** Modest lift for active cards, contextual dropdowns, and flyout navigation.
  - `0 4px 6px -1px rgba(15, 23, 42, 0.06), 0 2px 4px -2px rgba(15, 23, 42, 0.03)` with 1px `#CBD5E1` border.
- **Modal & Critical Insight Stratum (3dp):** Command palette, comprehensive citation previews, and legal analysis overlays.
  - `0 12px 24px -4px rgba(15, 23, 42, 0.08), 0 4px 8px -2px rgba(15, 23, 42, 0.03)` with an edge highlight: `inset 0 1px 0 0 rgba(255, 255, 255, 0.8)`.
- **Synthesis Ambient Halo:** AI analysis blocks utilize a 1px border colored `#E0E7FF` (indigo-100) complemented by a subtle, ambient lateral gradient ring: `0 0 0 1px rgba(79, 70, 229, 0.08), 0 2px 8px rgba(79, 70, 229, 0.04)`.

## Shapes

The geometric framework balances contemporary software engineering with traditional legal austerity through intentional corner rounding:

- **Cards and Panels:** Standardized at `0.75rem` (12px) to `1rem` (16px). This eliminates harsh brutalism while retaining structural enterprise discipline.
- **Interactive Controls:** Standard buttons, text fields, search bars, and dropdown menus utilize `0.5rem` (8px).
- **Metadata Badges & Citation Tags:** Rendered with `0.25rem` (4px) to `0.375rem` (6px) rounded corners. Avoid circular pill shapes for citations; square-leaning forms denote regulatory weight and precision.
- **Avatar & Status Tokens:** Status indicators are strictly circular (9999px) miniature nodes nested inside geometric parents.

## Components

### Buttons
- **Primary:** Background `#0F172A`, text `#FFFFFF`, border 1px solid `#0F172A`. On hover, background shifts to `#1E293B` with subtle scale-free transition (150ms ease).
- **Secondary:** Background `#FFFFFF`, text `#0F172A`, border 1px solid `#E2E8F0`. Hover triggers background `#F8FAFC` and border `#CBD5E1`.
- **AI Synthesis Trigger:** Background `#4F46E5`, text `#FFFFFF`, border 1px solid `#4338CA`. Subtle inset glow: `inset 0 1px 0 0 rgba(255, 255, 255, 0.2)`.

### Form Inputs & Query Fields
- Height 36px (compact) to 40px (default). Background `#FFFFFF`, border 1px solid `#E2E8F0`, padding 8px 12px.
- Placeholder text `#94A3B8`.
- Focus state: border `#2563EB`, paired with a crisp outer glow: `0 0 0 2px rgba(37, 99, 235, 0.15)`.

### Cards & Analytical Containers
- Background `#FFFFFF`, border 1px solid `#E2E8F0`, border-radius 12px, padding 16px or 24px.
- Split-card headers feature a 1px solid bottom divider `#F1F5F9` with trailing metadata or action trigger slots.

### Citation Badges & Status Chips
- **Statutory Authority Pill:** Background `#ECFDF5`, border 1px solid `#A7F3D0`, text `#065F46`, font-size 12px, font-weight 500. Features a leading solid 6px dot `#10B981`.
- **Jurisdiction & Flag Pill:** Background `#F8FAFC`, border 1px solid `#E2E8F0`, text `#475569`, font-family Geist, uppercase tracking.

### The AI Synthesis vs. Primary Source Card
- **AI Synthesis Surface:** Background is shaded with a hairline linear tint: `linear-gradient(180deg, #FAFAFE 0%, #FFFFFF 100%)`. Border is 1px solid `#E0E7FF`. Contains a distinct label: 11px uppercase `AI SYNTHESIS • NON-BINDING PREVIEW` colored `#4F46E5`.
- **Primary Source Surface:** Background `#FFFFFF`, border 1px solid `#E2E8F0`. Border-left accent: 3px solid `#0F172A`. Typography switches to high-fidelity serif or exact mono tracking for verbatim statutory extracts.

### Data Tables & Clause Lists
- Alternating subtle rows avoided. Rows use `#FFFFFF` background with 1px border-bottom `#F1F5F9`.
- Row hover: `#F8FAFC`. Active selected row: `#EFF6FF` with `#2563EB` left-border accent.
- Table headers use uppercase `0.75rem`, tracking 0.04em, color `#64748B`, background `#F8FAFC`.