# Admin Authentication Refactoring Guide

## Overview

This guide shows how to refactor admin pages to use the new reusable authentication components, eliminating code duplication and improving maintainability.

## New Components

### 1. `<RequireAdmin>` Component
Wraps page content and handles:
- Authentication loading state
- Access denied for non-admin users
- Automatic display of PageHeader during loading/error states

**Location:** `components/auth/require-admin.tsx`

### 2. `<AdminAccessWarning>` Component
Shows a warning banner for non-admin users without blocking access.
Only displays after authentication has loaded to prevent flash.

**Location:** `components/auth/admin-access-warning.tsx`

### 3. `useRequireAdmin()` Hook
Returns admin authentication status for custom implementations.

**Location:** `components/auth/use-require-admin.tsx`

---

## Refactoring Examples

### Example 1: Dashboard Page (Warning Only)

**BEFORE (35 lines):**
```tsx
'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, MessageSquareText, ... } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isLoading } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      {/* 15 lines of repetitive warning check */}
      {!isAdmin && !isLoading && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited Access</AlertTitle>
          <AlertDescription>
            You are logged in as a regular user. Some admin features may not be available to you.
            Contact your administrator if you need elevated permissions.
          </AlertDescription>
        </Alert>
      )}

      {isAdmin && (
        {/* Content */}
      )}
    </div>
  );
}
```

**AFTER (20 lines - 43% reduction):**
```tsx
'use client';

import { useRouter } from 'next/navigation';
import { MessageSquareText, ... } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminAccessWarning } from '@/components/auth';
import { ROUTES } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <AdminAccessWarning />

      {isAdmin && (
        {/* Content */}
      )}
    </div>
  );
}
```

---

### Example 2: Admin List Page (Full Access Control)

**BEFORE (77 lines with repetitive auth checks):**
```tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLibraries, useDeleteLibrary } from '@/hooks/use-libraries';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function LibrariesPage() {
  const router = useRouter();
  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { data, isLoading, error } = useLibraries();
  const deleteLibrary = useDeleteLibrary();

  const isAdmin = user?.role === 'admin';

  // 35+ lines of repetitive auth checking code
  if (isAuthLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Library Management" description="Manage library resources" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Library Management" description="Manage library resources" />
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <PageHeader title="Library Management" description="Manage library resources" />
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load libraries. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Content */}
    </div>
  );
}
```

**AFTER (42 lines - 45% reduction):**
```tsx
'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useLibraries, useDeleteLibrary } from '@/hooks/use-libraries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RequireAdmin } from '@/components/auth';

export default function LibrariesPage() {
  const router = useRouter();
  const { data, isLoading, error } = useLibraries();
  const deleteLibrary = useDeleteLibrary();

  // Error handling outside RequireAdmin wrapper
  if (error) {
    return (
      <RequireAdmin
        pageTitle="Library Management"
        pageDescription="Manage library resources"
      >
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load libraries. Please try again later.
          </AlertDescription>
        </Alert>
      </RequireAdmin>
    );
  }

  return (
    <RequireAdmin
      pageTitle="Library Management"
      pageDescription="Manage library resources"
    >
      <div className="space-y-6">
        {/* Content */}
      </div>
    </RequireAdmin>
  );
}
```

---

### Example 3: Admin Edit/Detail Page (With Back Navigation)

**BEFORE (100+ lines with auth checks):**
```tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useOnboardingQuestion, useUpdateOnboardingQuestion } from '@/hooks/use-onboarding';
import { useAuthStore } from '@/stores/auth-store';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';

export default function EditOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { user, isLoading: isAuthLoading } = useAuthStore();
  const { data, isLoading, error } = useOnboardingQuestion(slug);
  const updateQuestion = useUpdateOnboardingQuestion();

  const isAdmin = user?.role === 'admin';

  // 40+ lines of repetitive checks
  if (isAuthLoading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Question" backHref="/admin/onboarding" />
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-[200px]" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-[400px]" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <PageHeader title="Edit Question" backHref="/admin/onboarding" />
        <Alert variant="destructive">
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (isLoading) {
    return (/* data loading skeleton */);
  }

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Question" ... />
      {/* Form content */}
    </div>
  );
}
```

**AFTER (60 lines - 40% reduction):**
```tsx
'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useOnboardingQuestion, useUpdateOnboardingQuestion } from '@/hooks/use-onboarding';
import { RequireAdmin } from '@/components/auth';

export default function EditOnboardingPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;

  const { data, isLoading, error } = useOnboardingQuestion(slug);
  const updateQuestion = useUpdateOnboardingQuestion();

  if (isLoading) {
    return (/* data loading skeleton */);
  }

  return (
    <RequireAdmin
      pageTitle="Edit Question"
      backHref="/admin/onboarding"
    >
      <div className="space-y-6">
        <PageHeader title="Edit Question" ... />
        {/* Form content */}
      </div>
    </RequireAdmin>
  );
}
```

---

## Migration Checklist

For each admin page, follow these steps:

### Step 1: Update Imports
```tsx
// REMOVE these imports:
- import { useAuthStore } from '@/stores/auth-store';
- import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
- import { Skeleton } from '@/components/ui/skeleton';
- import { Card, CardContent, CardHeader } from '@/components/ui/card'; // (if only used for loading state)

// ADD this import:
+ import { RequireAdmin } from '@/components/auth';
// OR for dashboard:
+ import { AdminAccessWarning } from '@/components/auth';
```

### Step 2: Remove Auth State Management
```tsx
// REMOVE:
- const { user, isLoading: isAuthLoading } = useAuthStore();
- const isAdmin = user?.role === 'admin';
```

### Step 3: Remove Auth Checks
```tsx
// REMOVE all these checks:
- if (isAuthLoading) { return <loading skeleton>; }
- if (!isAdmin) { return <access denied>; }
```

### Step 4: Wrap Content with RequireAdmin
```tsx
// WRAP your return statement:
return (
  <RequireAdmin
    pageTitle="Your Page Title"
    pageDescription="Optional description"
    backHref="/optional/back/link"  // For edit/detail pages
  >
    {/* Your existing content */}
  </RequireAdmin>
);
```

---

## Component Props Reference

### `<RequireAdmin>` Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `children` | `ReactNode` | Yes | - | Page content to render for authorized users |
| `pageTitle` | `string` | No | `"Admin Page"` | Title shown in PageHeader during loading/error |
| `pageDescription` | `string` | No | `undefined` | Description shown in PageHeader |
| `backHref` | `string` | No | `undefined` | Back button link in PageHeader |
| `loadingTitle` | `string` | No | Same as `pageTitle` | Custom title for loading state |
| `accessDeniedTitle` | `string` | No | `"Access Denied"` | Title for access denied alert |
| `accessDeniedMessage` | `string` | No | `"You do not have permission..."` | Message for access denied alert |

### `useRequireAdmin()` Hook Returns

```tsx
const { isAdmin, isLoading, isAuthenticated, user } = useRequireAdmin();
```

| Property | Type | Description |
|----------|------|-------------|
| `isAdmin` | `boolean` | Whether user is an admin |
| `isLoading` | `boolean` | Whether auth is still loading |
| `isAuthenticated` | `boolean` | Whether user is logged in |
| `user` | `User \| null` | Current user object |

---

## Pages to Refactor

### ✅ All Pages Refactored (16 total)

**Dashboard:**
- [x] `app/(dashboard)/dashboard/page.tsx` - Using `<AdminAccessWarning>`

**Admin Management Pages:**
- [x] `app/(dashboard)/admin/libraries/page.tsx`
- [x] `app/(dashboard)/admin/therapists/page.tsx`
- [x] `app/(dashboard)/admin/onboarding/page.tsx`
- [x] `app/(dashboard)/admin/ai-reflection-test/page.tsx`
- [x] `app/(dashboard)/settings/prompts/page.tsx`

**New/Create Pages:**
- [x] `app/(dashboard)/admin/libraries/new/page.tsx`
- [x] `app/(dashboard)/admin/therapists/new/page.tsx`
- [x] `app/(dashboard)/admin/onboarding/new/page.tsx`

**Edit Pages:**
- [x] `app/(dashboard)/admin/libraries/[id]/edit/page.tsx`
- [x] `app/(dashboard)/admin/therapists/[id]/edit/page.tsx`
- [x] `app/(dashboard)/admin/onboarding/[slug]/edit/page.tsx`

**Detail/View Pages:**
- [x] `app/(dashboard)/admin/libraries/[id]/page.tsx`
- [x] `app/(dashboard)/admin/therapists/[id]/page.tsx`
- [x] `app/(dashboard)/admin/onboarding/[slug]/page.tsx`

**Settings Pages:**
- [x] `app/(dashboard)/settings/page.tsx` - Already correctly implemented

---

## Benefits

✅ **40-45% code reduction** per page
✅ **Eliminates code duplication** across 16 pages
✅ **Centralized auth logic** - fixes apply everywhere
✅ **Consistent UX** - same loading/error states
✅ **Easier to maintain** - update one component
✅ **Better type safety** - props are typed
✅ **Flexible** - customize messages per page if needed

---

## Testing Checklist

After refactoring each page, test:

1. **✅ Loading State:** Page shows skeleton during auth check
2. **✅ Access Denied:** Non-admin users see appropriate message
3. **✅ Authorized Access:** Admin users can access content
4. **✅ No Flash:** Warning doesn't flash during initial load
5. **✅ Back Navigation:** Back button works on detail/edit pages
6. **✅ Error Handling:** Data loading errors display correctly

---

## Advanced Usage

### Custom Hook for Special Cases

If you need custom logic beyond the component:

```tsx
import { useRequireAdmin } from '@/components/auth';

export default function CustomAdminPage() {
  const { isAdmin, isLoading } = useRequireAdmin();

  // Custom conditional rendering
  if (isLoading) {
    return <CustomLoadingUI />;
  }

  if (!isAdmin) {
    return <CustomAccessDenied />;
  }

  return <YourContent />;
}
```

### Conditional Rendering Without Blocking

```tsx
import { useRequireAdmin } from '@/components/auth';

export default function MixedAccessPage() {
  const { isAdmin, isLoading } = useRequireAdmin();

  return (
    <div>
      {/* Content visible to all users */}
      <PublicContent />

      {/* Conditionally show admin features */}
      {!isLoading && isAdmin && (
        <AdminOnlyFeatures />
      )}
    </div>
  );
}
```

---

## Questions?

If you encounter issues during refactoring:
1. Check this guide for examples
2. Look at already-refactored pages for reference
3. Test in development before committing changes
