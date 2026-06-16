---
name: Modern Logic
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
  on-surface-variant: '#434654'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0d54d6'
  primary: '#0451d3'
  on-primary: '#ffffff'
  primary-container: '#356ced'
  on-primary-container: '#fefcff'
  inverse-primary: '#b4c5ff'
  secondary: '#006c49'
  on-secondary: '#ffffff'
  secondary-container: '#6cf8bb'
  on-secondary-container: '#00714d'
  tertiary: '#825100'
  on-tertiary: '#ffffff'
  tertiary-container: '#a36700'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea7'
  secondary-fixed: '#6ffbbe'
  secondary-fixed-dim: '#4edea3'
  on-secondary-fixed: '#002113'
  on-secondary-fixed-variant: '#005236'
  tertiary-fixed: '#ffddb8'
  tertiary-fixed-dim: '#ffb95f'
  on-tertiary-fixed: '#2a1700'
  on-tertiary-fixed-variant: '#653e00'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  headline-xl:
    fontFamily: Geist
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Geist
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Geist
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  body-lg:
    fontFamily: Geist
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-md:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 16px
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 14px
  code:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  base: 4px
  sidebar-width: 260px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 32px
  container-max: 1440px
---

## Brand & Style
The design system is built on the pillars of **precision, clarity, and reliability**. As an inventory management tool, the UI must facilitate rapid data processing while maintaining a calm, professional atmosphere that reduces cognitive load during high-stakes logistics operations.

The visual style follows a **Corporate / Modern** aesthetic, utilizing a "Soft-Tech" approach. This combines the structured efficiency of enterprise software with the approachable warmth of modern SaaS. We prioritize high legibility, purposeful whitespace, and a subtle use of depth to distinguish between navigation, data entry, and analytical layers. The goal is to evoke a sense of organized control and modern efficiency.

## Colors
The palette is centered around **HuddleMate Blue**, a vibrant yet professional primary color that drives action and identifies interactive elements. 

- **Primary (#4a7dff):** Used for primary actions, active navigation states, and focus indicators.
- **Surface (#f8f9ff):** A cool, tinted white that reduces screen glare and provides a modern alternative to pure white backgrounds.
- **Semantic Palette:** We use a strict traffic-light system for inventory status:
    - **Success (#10b981):** "In Stock" and positive growth.
    - **Warning (#f59e0b):** "Low Stock" and pending actions.
    - **Error (#ef4444):** "Out of Stock" and critical system alerts.
- **Neutrals:** Grays are slightly blue-tinted to maintain harmony with the surface and primary colors, ensuring the interface feels cohesive rather than sterile.

## Typography
This design system utilizes **Geist**, a typeface designed for precision and technical excellence. Its monospaced-influenced glyphs provide the high readability required for numerical data and inventory SKUs.

- **Headlines:** Set with tighter letter spacing and higher weights to create a strong visual hierarchy.
- **Body Text:** Optimized for long-form reading in tables and descriptions.
- **Numerical Data:** Geist's clear character differentiation ensures that numbers (critical in inventory) are never misread. 
- **Mobile Scaling:** For mobile views, `headline-xl` should scale down to 28px to ensure content remains within the viewport without excessive wrapping.

## Layout & Spacing
The design system employs a **Fluid-Fixed Hybrid** layout model. 

- **Sidebar:** A persistent 260px left-hand navigation provides constant access to top-level categories. On mobile, this collapses into a bottom-sheet or "hamburger" drawer.
- **Main Canvas:** Content resides on a fluid grid that expands to a maximum width of 1440px. 
- **Grid System:** A 12-column grid is used for dashboard layouts. KPI cards typically span 3 columns (4 cards per row), while primary data tables span the full 12 columns.
- **Data Density:** We use a strict 4px base unit. For tables, we utilize "Compact Spacing" (8px vertical padding) to maximize information density without sacrificing legibility.

## Elevation & Depth
Depth in this design system is achieved through **Tonal Layering** supplemented by soft, functional shadows. 

- **Level 0 (Background):** The Surface color (#f8f9ff).
- **Level 1 (Cards/Sidebar):** Pure white (#ffffff) with a subtle 1px border (#e2e8f0).
- **Level 2 (Popovers/Dropdowns):** Pure white with a "Soft-Tech" shadow: `0px 4px 20px rgba(74, 125, 255, 0.08)`. The blue tint in the shadow maintains the brand connection even in the elevation.
- **Interactive Depth:** Buttons use a very slight inner shadow on click to simulate a physical press, reinforcing the tactile nature of the interface.

## Shapes
The shape language is defined by **Friendly Geometry**. By using a `roundedness` level of 2 (8px base), we soften the industrial nature of inventory management.

- **Standard Elements (8px):** Input fields, buttons, and small cards.
- **Large Elements (16px):** Main dashboard containers and primary KPI cards.
- **Full Round (Pill):** Used exclusively for status indicators (In Stock, Low Stock) and chips to distinguish them from actionable buttons.

## Components
Consistent component styling is vital for user efficiency.

- **KPI Cards:** Use a Level 1 elevation. Icons should be housed in a soft-tinted circle using the semantic color (e.g., a green icon on a 10% opacity green background).
- **Data Tables:** Use a transparent header with `label-md` typography. Rows should have a subtle hover state (#f1f5f9) and 1px bottom borders. Avoid zebra striping to keep the look clean.
- **Status Pills:** Small, high-contrast text on a low-contrast background (e.g., Dark Green text on Light Green background) to indicate inventory health at a glance.
- **Primary Buttons:** Solid HuddleMate Blue with white text. Hover states should darken the blue by 10%.
- **Input Fields:** Use a 1px border (#cbd5e1). On focus, the border transitions to HuddleMate Blue with a 3px soft glow.
- **Sidebar Items:** Clear vertical rhythm with 8px spacing. Active states use a "Power Bar" (a 4px vertical blue line on the left edge) and a light blue background tint.