# Technical Specification: Initial Mobile Project Architecture

## 1. Executive Summary

This document outlines the initial architectural setup for the mobile application. The goal of this phase is strictly to establish the foundational folder structure and boilerplate files required to support a scalable React Native application using Expo and TypeScript. No business logic or functional screens will be implemented in this phase; the focus is solely on organizing the project skeleton to facilitate seamless parallel development in subsequent phases.

## 2. Requirements

- **Framework:** React Native using Expo.
- **Language:** TypeScript.
- **Scope:** Create base folder structure and placeholder files within the `app/` directory.
- **Constraints:** No business logic, no full UI implementation. All created files should act as placeholders with comments explaining their intended purpose.

## 3. Architecture & Tech Stack

### Tech Stack
- React Native
- Expo (with Expo Router for navigation)
- TypeScript

### Folder Structure & File Manifest

The `app/` directory will be structured as follows:

- **`app/` (Routing & Navigation)**
  - `(auth)/`: Group for authentication flows (e.g., login, registration).
    - `login.tsx` (Placeholder)
    - `register.tsx` (Placeholder)
  - `(tabs)/`: Group for the main application interface (e.g., homepage, profile).
    - `index.tsx` (Placeholder)
    - `profile.tsx` (Placeholder)
  - `_layout.tsx` (Root layout placeholder)

- **`components/` (UI Components)**
  - `(auth)/`: Components specific to authentication screens.
  - `(tabs)/`: Components specific to tab screens.
  - `shared/`: Reusable components across multiple screens (e.g., buttons, inputs).

- **`api/` (Network Layer)**
  - `client.ts`: Base configuration for REST calls to the Spring Boot backend, including `baseURL` and JWT token interceptors.
  - `auth.ts` (Placeholder)
  - `categorias.ts` (Placeholder)
  - `progresso.ts` (Placeholder)

- **`hooks/` (Custom Hooks)**
  - `useAuth.ts` (Placeholder)
  - `useCategorias.ts` (Placeholder)

- **`providers/` (Context & Overlays)**
  - `AuthProvider.tsx`: Authentication context provider (Placeholder).
  - `OverlayProvider.tsx`: Loading and success overlay provider (Placeholder).

- **`types/` (TypeScript Types)**
  - `index.ts`: Shared types across all layers (Placeholder).

- **`utils/` (Helper Functions)**
  - `helpers.ts`: Utility functions for date formatting, currency, etc. (Placeholder).

## 4. State Management

- **Local State:** Handled via React's `useState` and `useReducer` where necessary.
- **Global Client State:** Minimal global state will be introduced. Core state (e.g., Authentication state) will be managed via Context API (`AuthProvider`).
- **Server State / API:** To be handled via custom hooks wrapping the API layer, potentially extending to libraries like React Query or SWR in the future, though the initial setup relies on basic custom hooks (`useAuth`, `useCategorias`) bridging the `api/` calls.
