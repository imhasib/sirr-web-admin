'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquareText, Pencil, AlertCircle, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { useSettings, usePromptSchemas } from '@/hooks/use-settings';
import { useAuthStore } from '@/stores/auth-store';
import { EditSettingDialog } from '@/components/settings';
import { Setting, getSettingLabel } from '@/types';
import { formatDateTime } from '@/lib/utils';
import { ROUTES } from '@/lib/constants';

export default function PromptSettingsPage() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { data: settings, isLoading: settingsLoading, error: settingsError } = useSettings();
  const { data: promptSchemas, isLoading: schemasLoading } = usePromptSchemas();
  const [editingSetting, setEditingSetting] = useState<Setting | null>(null);

  const isAdmin = user?.role === 'admin';
  const isLoading = settingsLoading || schemasLoading;

  // Filter only prompt-related settings
  const promptSettings = settings?.filter((s) => s.key.startsWith('SYSTEM_PROMPT_')) || [];

  // Get output schema for the currently editing setting
  const getOutputSchema = (key: string): string | undefined => {
    return promptSchemas?.schemas?.[key];
  };

  // Show access denied for non-admins
  if (!isAdmin) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Prompt Settings</h1>
          <p className="text-muted-foreground">Manage system prompts</p>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Access Denied</AlertTitle>
          <AlertDescription>
            You do not have permission to access this page. Only administrators can manage prompt settings.
          </AlertDescription>
        </Alert>

        <Button variant="outline" onClick={() => router.push(ROUTES.DASHBOARD)}>
          Go to Dashboard
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.SETTINGS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompt Settings</h1>
            <p className="text-muted-foreground">Manage system prompts and their output schemas</p>
          </div>
        </div>

        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-4 w-96" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (settingsError) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.SETTINGS)}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompt Settings</h1>
            <p className="text-muted-foreground">Manage system prompts and their output schemas</p>
          </div>
        </div>

        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load prompt settings. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.push(ROUTES.SETTINGS)}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-3">
          <MessageSquareText className="h-8 w-8 text-muted-foreground" />
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Prompt Settings</h1>
            <p className="text-muted-foreground">Manage system prompts and their output schemas</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {promptSettings.map((setting) => (
          <Card key={setting._id} className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1">
                <CardTitle className="text-lg flex items-center gap-2">
                  {getSettingLabel(setting.key)}
                  <Badge variant="outline" className="text-xs font-normal">
                    {setting.type}
                  </Badge>
                </CardTitle>
                <CardDescription className="max-w-2xl">
                  {setting.description || 'No description available'}
                </CardDescription>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setEditingSetting(setting)}
              >
                <Pencil className="h-4 w-4 mr-1" />
                Edit
              </Button>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <span>
                  <strong>Key:</strong> {setting.key}
                </span>
                <span>
                  <strong>Updated:</strong> {formatDateTime(setting.updatedAt)}
                </span>
                <span>
                  <strong>Length:</strong> {setting.value.length.toLocaleString()} chars
                </span>
              </div>
            </CardContent>
          </Card>
        ))}

        {promptSettings.length === 0 && (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <MessageSquareText className="h-12 w-12 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">No prompt settings found</p>
            </CardContent>
          </Card>
        )}
      </div>

      <EditSettingDialog
        setting={editingSetting}
        open={!!editingSetting}
        onOpenChange={(open) => !open && setEditingSetting(null)}
        outputSchema={editingSetting ? getOutputSchema(editingSetting.key) : undefined}
      />
    </div>
  );
}
