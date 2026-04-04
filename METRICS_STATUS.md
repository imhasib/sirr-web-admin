# Metrics Dashboard - Soul Mirror Performance

**Last Updated:** 2026-04-04

---

## Overview

This dashboard provides real-time metrics for **Soul Mirror** generation performance and error tracking. The implementation follows clean code architecture with reusable components and type-safe API integration.

---

## ✅ Implemented Features

### Soul Mirror Performance Metrics
**Endpoint:** `GET /api/v1/admin/metrics/ai-reflection/performance`

**Available Metrics:**
- ✅ P50, P95, P99 latency percentiles
- ✅ Average, Min, Max latency
- ✅ Total generations count
- ✅ Slow generations count (>5s)

**Frontend Features:**
- ✅ Metric cards with trend indicators
- ✅ Date range filtering (7/30/90 days)
- ✅ Loading states with skeleton loaders
- ✅ Error handling with user-friendly messages
- ✅ Data caching (5 minutes) for performance

---

### Soul Mirror Error Metrics
**Endpoint:** `GET /api/v1/admin/metrics/ai-reflection/errors`

**Available Metrics:**
- ✅ Total attempts & failures
- ✅ Error rate percentage
- ✅ Error breakdown by type
- ✅ Error trends over time (daily)

**Frontend Features:**
- ✅ Error rate cards with color-coded alerts
- ✅ Pie chart for error type distribution
- ✅ Line chart for error rate trends
- ✅ Date range filtering

---

## 🏗️ Architecture

### Technology Stack
- **Chart.js** + **react-chartjs-2** - Data visualizations
- **date-fns** - Date handling and formatting
- **React Query** - Data fetching, caching, and state management
- **Shadcn UI** - Consistent UI components
- **TypeScript** - Full type safety

### Code Structure

```
sirr-web-admin/
├── app/(dashboard)/admin/metrics/
│   └── page.tsx                      # Soul Mirror metrics page
├── components/metrics/
│   ├── metric-card.tsx               # Reusable metric display card
│   ├── line-chart.tsx                # Line chart component
│   ├── pie-chart.tsx                 # Pie chart component
│   ├── date-range-filter.tsx         # Date range selector
│   └── index.ts                      # Component exports
├── hooks/
│   └── use-metrics.ts                # React Query hooks
├── services/
│   └── metrics.service.ts            # API client methods
└── types/
    └── metrics.ts                    # TypeScript interfaces
```

---

## 🚀 Usage

### Accessing the Dashboard

1. **Start backend:**
   ```bash
   cd E:\org-karigor\sirr\sirr-core
   npm run start:dev
   ```

2. **Start frontend:**
   ```bash
   cd E:\org-karigor\sirr\sirr-web-admin
   npm run dev
   ```

3. **Navigate to:** `http://localhost:3000/admin/metrics`
   - Requires admin authentication
   - JWT token automatically included in requests

### Date Range Filtering

The dashboard supports three predefined date ranges:
- **Last 7 days** (default)
- **Last 30 days**
- **Last 90 days**

Backend defaults to last 7 days if no date range is provided. Maximum supported range is 90 days.

---

## 📊 API Details

### Soul Mirror Performance
```typescript
GET /api/v1/admin/metrics/ai-reflection/performance?startDate=2026-03-28T00:00:00.000Z&endDate=2026-04-04T23:59:59.999Z

Response:
{
  "period": {
    "startDate": "2026-03-28T00:00:00.000Z",
    "endDate": "2026-04-04T23:59:59.999Z"
  },
  "latency": {
    "p50": 1200,
    "p95": 3500,
    "p99": 6000,
    "avg": 1800,
    "min": 500,
    "max": 12000
  },
  "totalGenerations": 5000,
  "slowGenerations": 150
}
```

### Soul Mirror Errors
```typescript
GET /api/v1/admin/metrics/ai-reflection/errors?startDate=2026-03-28T00:00:00.000Z&endDate=2026-04-04T23:59:59.999Z

Response:
{
  "period": {
    "startDate": "2026-03-28T00:00:00.000Z",
    "endDate": "2026-04-04T23:59:59.999Z"
  },
  "overall": {
    "totalAttempts": 5000,
    "failures": 100,
    "errorRate": 2.0
  },
  "byErrorType": [
    {
      "errorType": "LLM_TIMEOUT",
      "count": 50,
      "percentage": 50,
      "avgLatency": 30000
    }
  ],
  "errorTrend": [
    {
      "date": "2026-03-28",
      "errorRate": 1.5
    }
  ]
}
```

---

## 🔧 Backend Integration

### Event Tracking

The backend automatically tracks Soul Mirror events:

```typescript
// Successful generation
safeEmit('soul_mirror.generation_completed', {
  userId,
  journalId,
  duration,
  platform,
  appVersion
});

// Failed generation
safeEmit('soul_mirror.generation_failed', {
  userId,
  errorType: 'LLM_TIMEOUT',
  duration,
  platform
});
```

### Database

- **Database:** `sirr_metrics` (separate MongoDB instance)
- **Collection:** `metric_events`
- **TTL:** Auto-delete after 90 days
- **Indexes:** Optimized for queries by eventType, timestamp, platform

---

## 🐛 Troubleshooting

### Empty Data
1. Check if metrics events are being recorded:
   ```bash
   mongo sirr_metrics
   db.metric_events.find({ eventType: /soul_mirror/ }).limit(5)
   ```
2. Verify date range includes actual data
3. Check backend logs for errors
4. Ensure Soul Mirror generations are being triggered

### 404 Errors
- Verify backend is running on port 3003
- Check `NEXT_PUBLIC_API_URL` in `.env.local`
- Ensure metrics module is initialized in backend

### Backend Not Running
- Ensure MongoDB is running
- Check `MONGODB_URI` environment variable
- Verify port 3003 is available

---

## 📈 Performance Optimization

### Frontend Caching
- React Query caching: 5 minutes stale time
- Data persists across page navigations
- Automatic background refetch when data becomes stale

### Loading States
- Skeleton loaders for smooth UX
- Parallel data fetching for performance and errors
- Optimistic UI updates

---

## 🔐 Security

### Authentication
- All endpoints require admin JWT token
- Token automatically included via axios interceptor
- Automatic token refresh on expiry

### Authorization
- Admin role check via `RequireAdmin` component
- Non-admin users are redirected to dashboard
- Role verification happens on both frontend and backend

---

## 📝 Code Quality

### TypeScript
- ✅ Full type safety across all components
- ✅ Strict mode enabled
- ✅ No `any` types used
- ✅ Proper interface definitions

### Code Organization
- ✅ Separation of concerns (types, services, hooks, components)
- ✅ Reusable components with clean props interface
- ✅ Consistent naming conventions
- ✅ Single Responsibility Principle

### Testing
- Build verification: `npm run build`
- TypeScript compilation: No errors
- All routes properly registered

---

## 📚 Related Documentation

- **Backend Metrics Module:** `E:\org-karigor\sirr\sirr-core\src\modules\metrics\README.md`
- **Frontend Implementation:** `E:\org-karigor\sirr\sirr-web-admin\claude.md`
- **API Documentation:** Swagger at `/api/v1/api-docs` (backend)

---

**Maintained By:** Frontend Team
**Version:** 1.0.0
**Status:** Production Ready ✅
