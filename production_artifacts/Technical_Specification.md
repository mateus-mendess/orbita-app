# Technical Specification: Home Screen UI

## 1. Executive Summary

This document specifies the design and implementation details for the main Home Screen (`app/(tabs)/index.tsx`) of the mobile application. The implementation establishes the primary dashboard the user will see after authenticating, featuring a top header grouped component, categorical task lists, and a custom pill-shaped bottom navigation bar.

## 2. Requirements

- **Framework:** React Native using Expo, TypeScript.
- **Scope:** Implement the UI for the Home Screen (`app/(tabs)/index.tsx`).
- **Data Constraints:** Render the page as a "Zero-State" (New User) experience. No hardcoded mock tasks should be displayed in the lists; instead, empty state messages will be shown for each section. Future logic will be wired to existing placeholder hooks (`hooks/useCategorias.ts`).

## 3. UI/UX Design

### Theme & Palette
- **Background:** Solid Black (`#000000` or `#121212`). The theme continues the dark palette established in the Authentication screens.
- **Accent/Foreground:** White (`#FFFFFF`) for text, icons, and components needing contrast against the dark background.
- **Components:** Elements maintain the pill-shaped (fully rounded corners) aesthetic defined globally.

### Layout Details

**Top Header**
- Placed at the top left of the screen.
- Contains a single, horizontally grouped component with:
  - **Date Badge:** Pill-shaped, dark background with subtle border, white text (e.g., "Sábado, 18").
  - **Indicator:** A circular colored or white dot positioned immediately next to the date badge.
  - **Calendar Icon:** Placed directly beside the indicator, completing the top-left group.
- *Note:* The "quick add" text input and right-aligned icons from the original reference have been explicitly excluded.

**Task Sections ("Manhã", "Hábitos", "Concluídas")**
- Each section contains a header with the Title and a Counter (e.g., "Manhã · 0").
- **Zero-State / Empty State:** Since the user has no data yet, each section will render a minimal empty state component with a message like "Nada por aqui ainda", rather than an empty list or fake data.
- **Task Item Structure (Future-proofing):** The structure for future tasks will consist of a circular checkbox, task name, category tag (icon + text), and time. (A `TaskItem` component may be scaffolded but left unused).

**Bottom Navigation Bar**
- A custom, floating pill-shaped tab bar at the bottom of the screen.
- **Icons:** 
  - Day (Active state, showing icon + "Dia" text).
  - Wallet.
  - Document.
  - Target.
  - More (`...`) inside a separate, circular button next to the pill.
- **Implementation:** Will be handled via a custom `tabBar` component inside `app/(tabs)/_layout.tsx`.

## 4. Architecture & Implementation

### Routing & Screens
- **`app/(tabs)/_layout.tsx`:**
  - Configures the Expo Router `<Tabs>` component to hide the default header and use the custom pill-shaped bottom navigation bar.
- **`app/(tabs)/index.tsx` (Main Home Screen):**
  - Renders the `ScrollView` containing the Top Header and the Task Sections.

### Components
- **`components/(tabs)/TopHeader.tsx`:**
  - The unified group for Date Badge, Indicator, and Calendar Icon.
- **`components/(tabs)/SectionHeader.tsx`:**
  - Reusable header for sections showing `title` and `count`.
- **`components/(tabs)/EmptyState.tsx`:**
  - A simple text/view component displaying "Nada por aqui ainda".
- **`components/(tabs)/CustomTabBar.tsx`:**
  - The custom pill-shaped bottom navigation layout.

## 5. Next Steps for Front-End Engineer

1. Create the custom layout `app/(tabs)/_layout.tsx` and attach `CustomTabBar`.
2. Build the structural UI components: `TopHeader`, `SectionHeader`, and `EmptyState`.
3. Construct the main assembly in `app/(tabs)/index.tsx` using the dark mode palette.
4. Integrate the placeholder lists ensuring counters read "0" and the empty states render appropriately.
