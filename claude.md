# sirr-web-admin — Admin Portal

Next.js admin dashboard for the SIRR platform.

## Related Repos

- **Backend API**: `E:\org-karigor\sirr\sirr-repos\sirr-core`
- **Mobile app**: `E:\org-karigor\sirr\sirr-repos\sirr-app`
- **Deployment**: `E:\org-karigor\sirr\sirr-repos\sirr-deployment`

## Commands

```bash
npm run dev          # dev server with Turbopack
npm run build        # production build
npm run lint         # ESLint check
npm run lint:fix     # auto-fix lint issues
npm run format       # Prettier format
```

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI**: Tailwind CSS + shadcn/ui (Radix primitives) + lucide-react icons
- **State**: Zustand (global), React Query / TanStack Query (server state)
- **Forms**: React Hook Form + Zod validation
- **Tables**: TanStack Table
- **Charts**: Chart.js + react-chartjs-2
- **HTTP**: Axios
- **Dates**: date-fns

## Project Structure

```
app/
  (dashboard)/admin/   # All admin pages (route groups)
components/            # Reusable UI components
  metrics/             # Chart and metric card components
hooks/                 # React Query hooks (use-*.ts pattern)
services/              # API service modules (*.service.ts pattern)
stores/                # Zustand stores
types/                 # TypeScript types
lib/                   # Utilities and helpers
middleware.ts          # Auth middleware (route protection)
```

## Key Patterns

**Services** (`services/*.service.ts`): Each feature has a service file with typed API methods using Axios. Base URL: `/api/v1/admin`.

**Hooks** (`hooks/use-*.ts`): Wrap service calls in React Query hooks. Use 5-minute stale time for metrics data. Export query key factories for cache invalidation.

**Pages** (`app/(dashboard)/admin/<feature>/page.tsx`): Use hooks for data fetching. Handle loading and error states explicitly.

**Components**: Prefer shadcn/ui primitives. Use `cn()` from `lib/utils` for conditional class merging.

## Existing Admin Sections

- `/admin/metrics` — Soul Mirror AI performance metrics (latency P50/P95/P99, errors, trends)

## Metrics Components (`components/metrics/`)

- `MetricCard` — displays a single metric with trend indicator
- `LineChart` — time series visualization
- `PieChart` — distribution visualization
- `DateRangeFilter` — 7/30/90 days selector

## API Integration

All requests go to `sirr-core` via Nginx. Admin endpoints: `/api/v1/admin/*`.
Auth header: `Authorization: Bearer <accessToken>`.

Key admin API endpoints:
- `GET /api/v1/admin/metrics/ai-reflection/performance`
- `GET /api/v1/admin/metrics/ai-reflection/errors`

## Docker

Built as image `imhasib/sirr-web-admin:latest`. Runs on port `3031` in production (internal port 3000).
