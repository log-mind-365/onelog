# OneLog - Gemini Context

## Project Overview
OneLog is a social blogging platform built with **Next.js 16** (App Router) and **React 19**. It allows users to write articles with associated emotion levels, follow other users, and interact via likes and comments. The project leverages **Supabase** for authentication and database services, using **Drizzle ORM** for type-safe database interactions.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS, Radix UI, shadcn/ui, motion (Framer Motion)
- **Database:** PostgreSQL (via Supabase)
- **ORM:** Drizzle ORM
- **Authentication:** Supabase Auth
- **State Management:**
    - **Server State:** TanStack Query
    - **Client State:** Zustand
- **Forms:** React Hook Form + Zod
- **Editor:** TipTap
- **Package Manager:** Bun
- **Linter/Formatter:** Biome

## Architecture: Feature-Sliced Design (FSD)
The project adheres to the **Feature-Sliced Design** methodology, organizing code by scope and domain rather than technical role.

### Directory Structure (`src/`)
- **`app/`**: Next.js App Router setup (pages, layouts, providers).
    - `(home)/`: Authenticated routes (feed, profile, etc.).
    - `(auth)/`: Authentication routes (sign-in, sign-up).
- **`entities/`**: Business domain models (e.g., `article`, `comment`, `user`).
    - Contains `api` (server actions/queries), `model` (types/schemas), and `ui` (presentation).
- **`features/`**: User interactions and business logic (e.g., `auth`, `like-article`, `write-article`).
    - Connects entities with user actions.
- **`widgets/`**: Complex, independent UI blocks (e.g., `article-card`, `profile-card`).
- **`views/`**: Page-specific UI compositions.
- **`shared/`**: Reusable components, hooks, and utilities.
- **`db/`**: Drizzle ORM schema definitions and migrations.

## Development Workflow

### Key Commands
```bash
# Install dependencies
bun install

# Start development server (localhost:3000)
bun dev

# Build for production
bun build
bun start

# Code Quality
bun lint      # Run Biome check
bun format    # Format code with Biome

# Database Management
bun db:generate   # Generate SQL migrations from schema changes
bun db:migrate    # Apply migrations to the database
bun db:push       # Push schema changes directly (dev only)
bun db:seed       # Seed the database
```

### Database Schema
Schema definitions are located in `src/db/schemas/`.
- **`user_info`**: Extends Supabase auth users.
- **`articles`**: Blog posts with content and emotion levels.
- **`comments`**: Interactions on articles.
- **`article_likes`**: Like interactions.
- **`user_follows`**: Follow relationships.

### Component & Data Flow
1.  **Server Components (`app/`)**: Prefetch data using `queryClient.prefetchInfiniteQuery` or `prefetchQuery`.
2.  **Client Components**: Hydrate data using `useSuspenseInfiniteQuery` or `useQuery`.
3.  **Mutations**: Handled via custom hooks in `features/*/lib/` (e.g., `use-like-article.ts`), triggering Server Actions in `entities/*/api/`.
4.  **Optimistic Updates**: Implemented within TanStack Query mutations to ensure a responsive UI.

## Coding Conventions
- **File Naming:** `kebab-case` (e.g., `article-card.tsx`).
- **Exports:** Prefer named exports.
- **Type Imports:** Use `import type` for type-only imports.
- **Server Actions:** Explicitly mark with `"use server"`.
- **Styles:** Mobile-first TailwindCSS classes.
