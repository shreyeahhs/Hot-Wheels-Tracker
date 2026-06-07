# Hot Wheels Vault

Hot Wheels Vault is a side project I built as a personal collection tracker for Hot Wheels enthusiasts. It combines a React/Vite frontend with an Express API and a local JSON-backed data store so I can browse cars, inspect details, manage a wishlist, and keep a private vault of models in one place.

Live portfolio: [shreyeahhs.vercel.app](https://shreyeahhs.vercel.app)

## Project Overview

This app is designed around a simple idea: make it easy to see what is already in the collection before buying another model. The experience focuses on fast browsing, collection stats, a spotlight view for standout cars, recent additions, wishlist management, and an admin area for adding or updating data.

It started as a side project, but I treated it like a real product build. That meant shaping the user experience, creating an API layer, wiring validation, persisting runtime data, and adding enough polish to make it presentable in a portfolio.

## Key Features

- Collection browsing with search, filtering, and detailed car cards.
- Spotlight and recent-additions views to surface notable items quickly.
- Collection statistics such as total cars, series count, rarity breakdowns, and latest additions.
- Wishlist tracking for cars I want to add later.
- Contact/message submission flow for admin review.
- Admin authentication and protected actions for managing cars and wishlist entries.
- Showcase mode for presenting the collection in a more visual, full-screen style.
- Responsive UI with motion, transitions, and a strong visual theme.

## Tech Stack

- Frontend: React, Vite, TypeScript, Wouter, TanStack Query, Framer Motion
- UI and styling: Tailwind CSS, Radix UI primitives, Lucide icons, Sonner, class-variance-authority
- Backend: Node.js, Express, Pino logging, CORS, JSON Web Tokens, bcryptjs
- Data layer: Workspace-local persistent JSON storage with shared schema and validation helpers
- Tooling: pnpm workspaces, TypeScript project references, Vite, tsx, esbuild

## Architecture

The project is organized as a monorepo so the frontend, API server, and shared libraries can evolve together:

- `artifacts/hot-wheels-vault` contains the React application.
- `artifacts/api-server` exposes the REST API.
- `lib/db` stores the runtime collection data and shared record helpers.
- `lib/api-client-react` provides typed client hooks for the frontend.
- `lib/api-zod` contains request and response schemas.

The API reads and writes to a local runtime file at `data/runtime/hot-wheels-vault.json` by default, which makes the project easy to run locally without setting up an external database.

## Main Flows

### Public experience

- Home page with a hero section, stats bar, spotlight item, and recent additions.
- Collection page with instant search and a showcase mode.
- Car detail views for deeper model inspection.
- Wishlist browsing for items I plan to add.

### Admin experience

- Admin login with JWT-based authentication.
- Protected routes for adding, editing, and deleting cars.
- Message and wishlist management for keeping the collection organized.

## API Highlights

- `GET /api/cars` to list cars with search and filter support.
- `GET /api/cars/stats` for collection summary metrics.
- `GET /api/cars/recent` and `GET /api/cars/spotlight` for homepage content.
- `POST /api/auth/login` for admin authentication.
- `GET /api/wishlist` and protected create/delete routes for wishlist management.
- `POST /api/messages` for contact submissions.
- `GET /api/models/search` for model lookup suggestions.

## Getting Started

### Prerequisites

- Node.js 18+ recommended.
- pnpm installed globally.

### Install

```bash
pnpm install
```

### Development

Run both the API and frontend together:

```bash
pnpm dev
```

Run only the API server:

```bash
pnpm dev:api
```

Run only the web app:

```bash
pnpm dev:web
```

### Build

```bash
pnpm build
```

### Type Check

```bash
pnpm typecheck
```

## Environment Variables

The app works with local defaults, but the API supports a few environment overrides:

- `HWV_DATA_DIR` changes where runtime JSON data is stored.
- `HWV_ADMIN_USERNAME` sets the seeded admin username.
- `HWV_ADMIN_PASSWORD` sets the seeded admin password.
- `VITE_API_BASE_URL` points the frontend at a custom API URL.

## Why I Built It

This was mostly a portfolio-friendly side project that let me practice full-stack product thinking instead of isolated components. I wanted something visual, usable, and specific to a hobby I care about, while still showing real-world skills like state management, route protection, API design, validation, and local persistence.

## Future Improvements

- Replace the local JSON store with a production database.
- Add image upload support for collection entries.
- Expand analytics for rarities, themes, and acquisition history.
- Add per-user accounts instead of a single admin flow.
- Improve search and filtering with richer model metadata.

## Portfolio Note

If you are viewing this from my portfolio, the live presentation is here: [shreyeahhs.vercel.app](https://shreyeahhs.vercel.app).

## License

This project is released under the MIT License.
