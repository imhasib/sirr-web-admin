'use client';

import { useRouter } from 'next/navigation';
import { MessageSquareText, ChevronRight, BookOpen, Users, ClipboardList, Sparkles } from 'lucide-react';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuthStore } from '@/stores/auth-store';
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
        <>
          {/* AI Tools Section */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => router.push(ROUTES.PROMPT_SETTINGS)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <MessageSquareText className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle>Prompt Settings</CardTitle>
                <CardDescription>Manage AI prompts and output schemas</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => router.push(ROUTES.ADMIN_AI_REFLECTION_TEST)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle>AI Reflection Test</CardTitle>
                <CardDescription>Test AI reflection generation with prompts</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <Separator />

          {/* Content Management Section */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => router.push(ROUTES.ADMIN_LIBRARIES)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle>Library Management</CardTitle>
                <CardDescription>Manage library resources and content</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => router.push(ROUTES.ADMIN_THERAPISTS)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <Users className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle>Therapist Management</CardTitle>
                <CardDescription>Manage therapist profiles and information</CardDescription>
              </CardHeader>
            </Card>

            <Card
              className="hover:shadow-md transition-shadow cursor-pointer group"
              onClick={() => router.push(ROUTES.ADMIN_ONBOARDING)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                    <ClipboardList className="h-5 w-5" />
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                </div>
                <CardTitle>Onboarding Questions</CardTitle>
                <CardDescription>Manage user onboarding flow</CardDescription>
              </CardHeader>
            </Card>
          </div>
        </>
      )}
    </div>
  );
}
