# Claude Memory File

## Related Projects

The following project directories are relevant to this codebase:

1. **sirr-core**: `E:\org-karigor\sirr\sirr-core`
2. **sirr-app**: `E:\org-karigor\sirr\sirr-app`
3. **sirr-deployment**: `E:\org-karigor\sirr\sirr-deploymnet`

These projects are part of the SIRR organization ecosystem.

## Metrics Implementation - Soul Mirror Performance

### Implementation Date
2026-04-04

### Overview
Implemented Soul Mirror performance metrics dashboard with clean code architecture, reusable components, and type-safe API integration. Focused implementation on production-ready features only.

### Technology Stack
- **Chart.js** + **react-chartjs-2** - Data visualizations
- **date-fns** - Date handling
- **React Query** - Data fetching and caching (5-minute stale time)
- **Shadcn UI** - Consistent UI components
- **TypeScript** - Full type safety

### Architecture

#### 1. Types (`types/metrics.ts`)
- Soul Mirror latency and error response types
- Type-safe query parameters
- Platform and date range types
- Clean, minimal interface definitions

#### 2. Services (`services/metrics.service.ts`)
- Two API methods: getSoulMirrorLatency, getSoulMirrorErrors
- Follows existing service pattern
- Base URL: `/api/v1/admin/metrics`
- Endpoints: `/ai-reflection/performance` and `/ai-reflection/errors`

#### 3. Hooks (`hooks/use-metrics.ts`)
- React Query hooks: useSoulMirrorLatency, useSoulMirrorErrors
- Query key factory for cache management
- 5-minute stale time for metrics data

#### 4. Reusable Components (`components/metrics/`)
- **MetricCard**: Display metrics with trend indicators
- **LineChart**: Time series visualization
- **PieChart**: Distribution visualization
- **DateRangeFilter**: 7/30/90 days selector

#### 5. Page (`app/(dashboard)/admin/metrics/page.tsx`)
- Single consolidated metrics page
- Performance metrics (P50, P95, P99, avg, min, max)
- Error metrics with breakdown and trends
- Date range filtering
- Loading states and error handling

### Features

#### Soul Mirror Performance Metrics
- ✅ Latency percentiles (P50, P95, P99)
- ✅ Average, min, max latency
- ✅ Total generations count
- ✅ Slow generations tracking (>5s)
- ✅ Date range filtering (7/30/90 days)

#### Soul Mirror Error Metrics
- ✅ Error rate percentage
- ✅ Total attempts vs failures
- ✅ Error type breakdown (pie chart)
- ✅ Error trends over time (line chart)
- ✅ Date range filtering

### Routes
```typescript
ADMIN_METRICS: '/admin/metrics'  // Soul Mirror Performance
```

### Backend API
Endpoints (sirr-core):
- `GET /api/v1/admin/metrics/ai-reflection/performance`
- `GET /api/v1/admin/metrics/ai-reflection/errors`

### Code Quality
- ✅ TypeScript strict mode
- ✅ No unused code or components
- ✅ Clean architecture (separation of concerns)
- ✅ Reusable components
- ✅ Responsive design
- ✅ Loading & error states
- ✅ Build successful (zero errors)

### Removed/Cleaned Up
- ❌ Onboarding funnel pages and code
- ❌ Screen analytics pages and code
- ❌ Unused components (BarChart, PlatformFilter)
- ❌ Unused types and service methods
- ❌ Unused routes
- ❌ Metrics landing page (consolidated to single page)

### Documentation
See `METRICS_STATUS.md` for:
- Complete feature documentation
- API examples
- Troubleshooting guide
- Usage instructions
