# Technical Specification: Authentication Screen UI

## 1. Executive Summary

This document specifies the design and implementation details for the Authentication feature (Login and Sign Up) within the mobile application. The implementation will combine a dark-themed layout with curved design elements and pill-shaped input fields, closely following provided visual references. The core logic will be consolidated into a single screen, leveraging the existing architecture.

## 2. Requirements

- **Framework:** React Native using Expo, TypeScript.
- **Scope:** Implement the UI for the Authentication flow, supporting both "Login" and "Sign up" states on the same screen.
- **Constraints:** No real API calls yet; interface with existing placeholder hooks (`useAuth`).

## 3. UI/UX Design

### Theme & Palette
- **Background:** Solid Black (`#000000` or very dark gray like `#121212`).
- **Accent/Foreground:** White (`#FFFFFF`) for the top card, input outlines/backgrounds, and text.
- **Typography:** Modern sans-serif (system default or Inter if configured), utilizing white text on dark backgrounds and vice-versa.

### Layout Details (Reference 1 & 2 Synthesis)
- **Top Section (White Curved Card):**
  - A white view spanning the top edge, featuring rounded bottom corners (large border-radius).
  - Contains the application logo centered (sourced from `assets/image/icon.png` or similar).
- **Toggle Control:**
  - Placed below the top card.
  - Pill-shaped toggle with two segments: "Login" and "Sign up".
  - Active state has a distinct background (e.g., solid gray/white) and contrasting text color.
- **Form Fields (Pill-shaped with Icons):**
  - Text fields must be pill-shaped (fully rounded corners, e.g., `borderRadius: 50`).
  - Each field includes an icon on the left (e.g., `@expo/vector-icons`).
  - Colors: Transparent or dark background with a subtle border, white text.
- **Buttons (Pill-shaped):**
  - Primary action buttons ("Login" / "Sign up") must be pill-shaped.
  - Filled style (e.g., solid white with black text, or vice versa depending on contrast).
- **Social Login Options:**
  - A separator text placed below the primary action button, styled as: `------ Or login with ------` (lines extending to the sides).
  - Two pill-shaped, outlined buttons placed side-by-side below the separator.
  - **Google Button:** Left side, outlined pill shape, containing the Google icon and "Google" text.
  - **Apple Button:** Right side, outlined pill shape, containing the Apple icon and "Apple" text.

## 4. Architecture & Implementation

### Routing & Screens
- **`app/` (Routing & Navigation)**
  - `index.tsx`: Entry point of the app, MUST redirect the user to `/(auth)/login` immediately so the authentication screen is the first thing they see.
- **`app/(auth)/login.tsx` (Main Authentication Screen):**
  - Will house the core UI and logic for both Login and Registration.
  - Uses a local state (e.g., `const [isLogin, setIsLogin] = useState(true)`) to toggle between modes.
  - **Login Mode:** Renders Email and Password fields, plus a "Login" button, separator, and social login buttons.
  - **Sign up Mode:** Renders Username, Email, Password, and Confirm Password fields, plus a "Sign up" button, separator, and social login buttons.
- **`app/(auth)/register.tsx`:**
  - Will act as a redirect to `login.tsx` to prevent UI duplication while maintaining the existing routing structure. Can be implemented using Expo Router's `<Redirect />` or a `useEffect` push.

### Components
- **`components/(auth)/AuthInput.tsx`:**
  - A reusable pill-shaped input component accepting icon names, placeholder, secure text entry, and value/onChange props.
- **`components/(auth)/AuthToggle.tsx`:**
  - The pill-shaped toggle switch for "Login" / "Sign up".
- **`components/shared/PrimaryButton.tsx`:**
  - A reusable pill-shaped button component (filled style).
- **`components/shared/SocialButton.tsx`:**
  - A reusable pill-shaped outlined button component designed specifically for social logins (accepts an icon and title).

### State Management & API (Mock)
- **`hooks/useAuth.ts`:**
  - Provide a dummy `signIn` and `signUp` function.
- The UI components will connect to these hooks but will not perform real HTTP submissions.

## 5. Next Steps for Front-End Engineer

1. Build `AuthInput`, `AuthToggle`, and `PrimaryButton` components.
2. Implement `app/(auth)/login.tsx` adhering to the layout and toggle logic.
3. Update `app/(auth)/register.tsx` to redirect to `login.tsx`.
4. Ensure the UI closely matches the dark theme and pill-shaped aesthetic of the references.
