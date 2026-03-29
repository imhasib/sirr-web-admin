'use client';

import { useRouter } from 'next/navigation';
import { Settings, MessageSquareText, AlertCircle, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useAuthStore } from '@/stores/auth-store';
import { ROUTES } from '@/lib/constants';

interface SettingCategory {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

const SETTING_CATEGORIES: SettingCategory[] = [
  {
    id: 'prompts',
    title: 'Prompt Settings',
    description: 'Manage system prompts and their output schemas for AI interactions',
    icon: <MessageSquareText className="h-6 w-6" />,
    href: ROUTES.PROMPT_SETTINGS,
  },
  // Future categories can be added here:
  // {
  //   id: 'general',
  //   title: 'General Settings',
  //   description: 'Configure general application settings',
  //   icon: <Cog className="h-6 w-6" />,
  //   href: ROUTES.GENERAL_SETTINGS,
  // },
];

export default function SettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();

  const isAdmin = user?.role === 'admin';

  // Show access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage system settings</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page. Only administrators can manage system settings.
          </AlertDescription>
        </Alert>

        <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD)}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="h-8 w-8 text-muted-foreground" />
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">Manage system configurations</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {SETTING_CATEGORIES.map((category) => (
          <Card
            key={category.id}
            className="hover:shadow-md transition-shadow cursor-pointer group"
            onClick={() => router.push(category.href)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-lg bg-muted text-muted-foreground">
                  {category.icon}
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </div>
              <CardTitle className="text-lg">{category.title}</CardTitle>
              <CardDescription>{category.description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      {SETTING_CATEGORIES.length === 0 && (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Settings className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No settings categories available</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
