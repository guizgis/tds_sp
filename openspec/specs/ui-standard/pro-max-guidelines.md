# UI/UX Pro Max Guidelines (V2)

## 1. Core Visual Style: Glassmorphic Professionalism
The platform transitions to a **Glassmorphic** aesthetic, blending high-end transparency with corporate stability. This style uses backdrop blurs, subtle borders, and layered depth to create a premium, modern feel.

### 1.1 Signature Elements
- **Glass Surfaces**: `backdrop-filter: blur(12px)`, `background: rgba(255, 255, 255, 0.7)`.
- **Soft Shadows**: Multiple layers of shadows to create tactile depth.
- **Deep Blue Accents**: Primary color is **Deep Ocean Blue (#0050B3)**.
- **Micro-animations**: All interactive elements (cards, buttons) must have a 200ms ease-in-out transition.

## 2. Component-Specific Standards

### 2.1 The "Pro Max" Card
Used for Data Products and Space stats.
- **CSS**:
  ```css
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  ```
- **Hover**: Scale `1.02`, increase shadow depth.

### 2.2 Tables & Lists
- **Grid Layout**: Use Bento-box inspired grid layouts for dashboards.
- **Table Row Hover**: Subtle blue tint (#F0F7FF) with immediate feedback.
- **Empty States**: Use custom SVG illustrations reflecting "Trust" and "Data".

### 2.3 Navigation & Layout
- **Sidebar**: Dark glass effect with a vibrant linear-gradient brand area.
- **Header**: Transparent glass with sticky behavior.
- **Breadcrumbs**: Explicitly show path for deep governance modules.

## 3. Interaction & Accessibility
- **Touch Targets**: Minimum 44x44px.
- **Contrast**: Maintain minimum 4.5:1 ratio for all body text.
- **Loading**: Skeleton screens are mandatory for data-heavy requests (Catalog, Identity).

## 4. Design System Tokens (Design 2.0 Extended)

| Category | Token | Value |
| :--- | :--- | :--- |
| **Color** | `colorPrimary` | `#0050B3` |
| | `colorBgLayout` | `#F8FAFC` |
| | `colorBgGlass` | `rgba(255, 255, 255, 0.7)` |
| **Blur** | `blurStandard` | `12px` |
| **Radius** | `radiusLarge` | `12px` |
| | `radiusMedium` | `8px` |
| **Shadow** | `shadowLow` | `0 2px 8px rgba(0,0,0,0.04)` |
| | `shadowHigh` | `0 8px 24px rgba(0,0,0,0.1)` |
