# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

OneLog is a Next.js 16 application built with React 19, featuring a social blogging platform where users can write articles with emotion levels, like and comment on posts. The project uses Supabase for authentication and PostgreSQL database with Drizzle ORM for data management.

## Tech Stack

- **Framework**: Next.js 16 (App Router)
- **UI**: React 19, TailwindCSS, Radix UI, shadcn/ui components
- **Database**: PostgreSQL (Supabase)
- **ORM**: Drizzle ORM
- **Authentication**: Supabase Auth
- **State Management**: Zustand, TanStack Query
- **Editor**: TipTap (rich text editor)
- **Forms**: React Hook Form + Zod
- **Package Manager**: Bun

## Development Commands

```bash
# Development
bun dev                 # Start development server on localhost:3000

# Build & Deploy
bun build              # Production build
bun start              # Start production server

# Code Quality
bun lint               # Run Biome linter
bun format             # Format code with Biome

# Database
bun db:generate        # Generate Drizzle migrations
bun db:migrate         # Run migrations
bun db:push            # Push schemas changes directly to DB
bun db:pull            # Pull schemas from DB
bun db:seed            # Seed database with initial data
```

## Architecture

This project follows **Feature-Sliced Design (FSD)** architecture with clear separation of concerns:

### Directory Structure

```
src/
├── app/              # Next.js App Router pages and layouts
│   ├── (home)/      # Main authenticated pages (articles, profile, write)
│   ├── (auth)/      # Authentication pages (sign in, sign up)
│   └── _providers/  # Global state providers
├── entities/        # Business entities (article, comment, user)
│   └── [entity]/
│       ├── api/     # Server actions and queries
│       ├── model/   # Types, constants, schemas
│       └── ui/      # Presentational components
├── features/        # Business features (auth, article actions, comments)
│   └── [feature]/
│       ├── api/     # Feature-specific server actions
│       ├── lib/     # Custom hooks (use-*)
│       ├── model/   # State, types, schemas
│       └── ui/      # Feature UI components
├── widgets/         # Composite UI blocks (card, form, footer)
├── shared/          # Shared utilities and components
│   ├── components/  # Reusable UI components
│   ├── hooks/       # Generic hooks
│   ├── lib/         # Utilities (supabase, tanstack)
│   ├── model/       # Shared types and constants
│   └── provider/    # Context providers
├── views/           # Page-level view components
└── db/              # Database schema and migrations
```

### Layer Responsibilities

- **app/**: Route definitions, server-side data prefetching with TanStack Query, layout composition
- **entities/**: Core domain models with CRUD operations. Each entity has its own API, model, and UI
- **features/**: User-facing features that compose entities. Contains business logic and user interactions
- **widgets/**: Complex UI compositions that combine multiple entities/features
- **views/**: Page-specific view logic, orchestrates features and widgets
- **shared/**: Framework-agnostic reusable code

### Data Flow Pattern

1. **Server Actions** (`entities/*/api/server.ts`): Database operations using Drizzle ORM
2. **Query Definitions** (`entities/*/api/queries.ts`): TanStack Query configuration
3. **Custom Hooks** (`features/*/lib/use-*.ts`): Business logic encapsulation
4. **View Components** (`views/*.tsx`): Composition and data orchestration
5. **Server Components** (`app/**/page.tsx`): Data prefetching with `prefetchInfiniteQuery`

## Database Schema

Located in `src/db/schema.ts`:

- **user_info**: User profiles (references Supabase auth.users)
- **articles**: Blog posts with content, emotion_level, access_type
- **article_likes**: Many-to-many relationship for article likes
- **comments**: Article comments with cascade delete

### Making Schema Changes

1. Edit `src/db/schema.ts`
2. Generate migration: `bun db:generate`
3. Apply migration: `bun db:migrate` (production) or `bun db:push` (development)

## Authentication Flow

- Supabase Auth integration via `src/shared/lib/supabase/`
- Server-side client: `createClient()` from `@/shared/lib/supabase/server`
- Browser client: `supabase` from `@/shared/lib/supabase/client`
- Auth state management: Zustand store at `src/features/auth/model/store.ts`
- Server actions: `src/features/auth/api/server.ts` (signIn, signUp, signOut, getCurrentUser)

## State Management

- **TanStack Query**: Server state (articles, comments, user data)
  - Query client setup: `src/shared/lib/tanstack/get-query-client.ts`
  - Prefetching in Server Components, consumption in Client Components
- **Zustand**: Client state (auth, modals, forms)
  - Auth store: `src/features/auth/model/store.ts`
  - Modal store: `src/app/_providers/modal-store.ts`

## Component Patterns

### Server Components (RSC)
- Pages in `app/**/page.tsx` for data prefetching
- Use `getCurrentUser()` for auth state
- Prefetch queries with `queryClient.prefetchInfiniteQuery()`
- Wrap with `<HydrationBoundary>` for client hydration

### Client Components
- Marked with `"use client"`
- Use `useSuspenseInfiniteQuery()` for infinite scroll
- Use custom hooks from `features/*/lib/use-*.ts`
- Access auth state via `useAuth()` hook

### Custom Hooks Pattern
Feature hooks in `features/*/lib/` follow naming convention:
- `use-like-article.ts`: Article like/unlike mutation
- `use-submit-article.ts`: Article submission
- `use-delete-comment.ts`: Comment deletion
- `use-auth-guard.ts`: Protected action wrapper

## Important Conventions

- **Server Actions**: Always mark with `"use server"` directive
- **File Naming**: kebab-case for all files
- **Component Exports**: Named exports for components
- **Type Imports**: Use `import type` for type-only imports
- **Error Handling**: Throw errors from server actions, catch in mutations
- **Optimistic Updates**: Implemented in TanStack Query mutations for likes/comments

## Environment Variables

Required in `.env.local`:
- `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anonymous key
- `DATABASE_URL`: PostgreSQL connection string (for Drizzle)

## Testing User Flow

Since this is a social platform, test these key flows:
1. Sign up → Create article with emotion level → Toggle access type
2. Browse feed → Like article → Unlike article
3. View article detail → Add comment → Delete own comment
4. Navigate to user profile → View their public articles
