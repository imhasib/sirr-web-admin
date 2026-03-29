'use client';

import { useRouter } from 'next/navigation';
import { AlertCircle, MessageSquareText, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/lib/constants';

export default function DashboardPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const isAdmin = user?.role === 'admin';

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'User'}!
        </p>
      </div>

      {!isAdmin && (
        <Alert variant="warning">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Limited Access</AlertTitle>
          <AlertDescription>
            You are logged in as a regular user. Some admin features may not be available to you.
            Contact your administrator if you need elevated permissions.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Welcome</CardTitle>
            <CardDescription>Get started with your admin panel</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is your admin dashboard. You can manage your application from here.
            </p>
          </CardContent>
        </Card>

        {isAdmin && (
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
        )}

        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest updates</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              Your recent activity will appear here.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
